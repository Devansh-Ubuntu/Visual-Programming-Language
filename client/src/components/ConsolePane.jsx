import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Import sprite sheets
import idleSprite from '../assets/idle.png';
import walkSprite from '../assets/walk.png';

const ANIMATION_TYPES = {
  IDLE: 'idle',
  WALK: 'walk',
  FLIP: 'flip',
  ROTATE: 'rotate',
  SPEAK: 'speak'
};

// Sprite sheet configurations
const SPRITE_CONFIG = {
  idle: {
    img: idleSprite,
    frameCount: 2,
    width: 300,
    height: 200,
    loop: true,
    frameDuration: 150
  },
  walk: {
    img: walkSprite,
    frameCount: 4,
    width: 2400,
    height: 620,
    loop: true,
    frameDuration: 100
  },
  speak: {
    img: idleSprite, // Reusing idle sprite for speaking
    frameCount: 4,
    width: 300,
    height: 200,
    loop: true,
    frameDuration: 120
  }
};

const ConsolePane = ({ onCommand }) => {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [animation, setAnimation] = useState({
    type: ANIMATION_TYPES.IDLE,
    frameIndex: 0,
    steps: 0,
    degrees: 0,
    message: '',
    rotation: 0,
    isFlipping: false
  });
  const [isSpeaking, setIsSpeaking] = useState(false);
  const mascotRef = useRef(null);
  const isDragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const animationRef = useRef(null);
  const initialPosition = useRef({ x: 50, y: 50 });
  const flipAnimationRef = useRef(null);
  const rotateAnimationRef = useRef(null);

  // Get current sprite config
  const currentSprite = SPRITE_CONFIG[animation.type] || SPRITE_CONFIG.idle;
  const frameWidth = currentSprite.width / currentSprite.frameCount;
  const frameHeight = currentSprite.height;

  // Handle animation frames
  useEffect(() => {
    let stepsCompleted = 0;
    
    const animate = () => {
      setAnimation(prev => {
        // Handle walk animation steps
        if (prev.type === ANIMATION_TYPES.WALK && prev.steps > 0) {
          const newX = position.x + (5 * (prev.steps > 0 ? 1 : -1));
          setPosition(p => ({ ...p, x: newX }));
          
          if (prev.frameIndex === currentSprite.frameCount - 1) {
            stepsCompleted++;
            if (stepsCompleted >= Math.abs(prev.steps)) {
              return { ...prev, type: ANIMATION_TYPES.IDLE, frameIndex: 0, steps: 0 };
            }
          }
        }
        
        // Handle speak animation
        if (prev.type === ANIMATION_TYPES.SPEAK) {
          if (!currentSprite.loop && prev.frameIndex === currentSprite.frameCount - 1) {
            setIsSpeaking(false);
            return { ...prev, type: ANIMATION_TYPES.IDLE, frameIndex: 0, message: '' };
          }
        }
        
        // Advance frame
        const nextIndex = (prev.frameIndex + 1) % currentSprite.frameCount;
        return { ...prev, frameIndex: nextIndex };
      });
    };
    
    animationRef.current = setInterval(animate, currentSprite.frameDuration);
    
    return () => {
      if (animationRef.current) clearInterval(animationRef.current);
    };
  }, [animation.type, position.x, currentSprite.frameCount, currentSprite.frameDuration, currentSprite.loop]);

  // Handle flip animation (360 degrees rotation)
  useEffect(() => {
    if (animation.isFlipping) {
      let rotation = 0;
      const flipSpeed = 20; // degrees per frame
      
      const flip = () => {
        rotation += flipSpeed;
        if (rotation >= 360) {
          setAnimation(prev => ({ ...prev, isFlipping: false, rotation: 0 }));
          clearInterval(flipAnimationRef.current);
        } else {
          setAnimation(prev => ({ ...prev, rotation }));
        }
      };
      
      flipAnimationRef.current = setInterval(flip, 16); // ~60fps
    }
    
    return () => {
      if (flipAnimationRef.current) clearInterval(flipAnimationRef.current);
    };
  }, [animation.isFlipping]);

  // Handle rotate animation (specific degrees)
  useEffect(() => {
    if (animation.degrees !== 0) {
      const targetDegrees = animation.degrees;
      const rotateSpeed = targetDegrees > 0 ? 5 : -5; // degrees per frame
      let rotated = 0;
      
      const rotate = () => {
        rotated += rotateSpeed;
        if (Math.abs(rotated) >= Math.abs(targetDegrees)) {
          setAnimation(prev => ({ ...prev, degrees: 0, rotation: prev.rotation + targetDegrees }));
          clearInterval(rotateAnimationRef.current);
        } else {
          setAnimation(prev => ({ ...prev, rotation: prev.rotation + rotateSpeed }));
        }
      };
      
      rotateAnimationRef.current = setInterval(rotate, 16); // ~60fps
    }
    
    return () => {
      if (rotateAnimationRef.current) clearInterval(rotateAnimationRef.current);
    };
  }, [animation.degrees]);

  // Handle commands from blocks
  useEffect(() => {
    if (onCommand) {
      const handleCommand = (command) => {
        switch (command.action) {
          case 'walk':
            setAnimation({
              ...animation,
              type: ANIMATION_TYPES.WALK,
              frameIndex: 0,
              steps: command.value,
              message: ''
            });
            break;
          case 'flip':
            setAnimation({
              ...animation,
              isFlipping: true,
              type: ANIMATION_TYPES.IDLE // Use idle sprite for flip
            });
            break;
          case 'rotate':
            setAnimation({
              ...animation,
              degrees: command.value,
              type: ANIMATION_TYPES.IDLE // Use idle sprite for rotate
            });
            break;
          case 'speak':
            setAnimation({
              ...animation,
              type: ANIMATION_TYPES.SPEAK,
              frameIndex: 0,
              message: command.value
            });
            setIsSpeaking(true);
            break;
          case 'reset':
            setPosition(initialPosition.current);
            setAnimation({
              type: ANIMATION_TYPES.IDLE,
              frameIndex: 0,
              steps: 0,
              degrees: 0,
              rotation: 0,
              isFlipping: false,
              message: ''
            });
            setIsSpeaking(false);
            break;
          default:
            setAnimation({
              ...animation,
              type: ANIMATION_TYPES.IDLE,
              frameIndex: 0,
              steps: 0,
              degrees: 0,
              message: ''
            });
        }
      };
      
      onCommand(handleCommand);
    }
  }, [onCommand, animation]);

  const handleMouseDown = (e) => {
    isDragging.current = true;
    offset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    setPosition({
      x: e.clientX - offset.current.x,
      y: e.clientY - offset.current.y,
    });
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  return (
    <div className="console-pane" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
      <div className="console-pane-header">
      </div>
      <div className="mascot-container">
        {isSpeaking && animation.message && (
          <div className="speech-bubble">
            {animation.message}
          </div>
        )}
        <div
          ref={mascotRef}
          onMouseDown={handleMouseDown}
          style={{
            position: 'absolute',
            left: `${position.x}px`,
            top: `${position.y}px`,
            width: `${frameWidth}px`,
            height: `${frameHeight}px`,
            backgroundImage: `url(${currentSprite.img})`,
            backgroundPosition: `-${animation.frameIndex * frameWidth}px 0`,
            backgroundSize: `${currentSprite.width}px ${currentSprite.height}px`,
            cursor: 'grab',
            transform: `
              scaleX(${animation.steps < 0 ? -1 : 1})
              rotate(${animation.rotation}deg)
            `,
            transformOrigin: 'center center',
            transition: animation.isFlipping || animation.degrees ? 'none' : 'transform 0.1s ease'
          }}
        />
      </div>
    </div>
  );
};

ConsolePane.propTypes = {
  onCommand: PropTypes.func
};

export default ConsolePane;