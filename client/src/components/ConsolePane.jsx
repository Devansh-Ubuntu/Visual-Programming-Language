// src/components/ConsolePane.jsx
import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Import all sprite sheets
import idleSprite from '../assets/idle.png';
import walkSprite from '../assets/mascot.png';
import flipSprite from '../assets/mascot.png';
import rotateSprite from '../assets/mascot.png';
import speakSprite from '../assets/mascot.png';

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
    frameCount: 4,
    width: 150,
    height: 100,
    loop: true,
    frameDuration: 150
  },
  walk: {
    img: walkSprite,
    frameCount: 8,
    width: 1200,
    height: 310,
    loop: true,
    frameDuration: 100
  },
  flip: {
    img: flipSprite,
    frameCount: 12,
    width: 1500,
    height: 310,
    loop: false,
    frameDuration: 80
  },
  rotate: {
    img: rotateSprite,
    frameCount: 16,
    width: 2000,
    height: 310,
    loop: false,
    frameDuration: 60
  },
  speak: {
    img: speakSprite,
    frameCount: 6,
    width: 805,
    height: 310,
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
    message: ''
  });
  const [isSpeaking, setIsSpeaking] = useState(false);
  const mascotRef = useRef(null);
  const isDragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const animationRef = useRef(null);
  const initialPosition = useRef({ x: 50, y: 50 });

  // Get current sprite config
  const currentSprite = SPRITE_CONFIG[animation.type];
  const frameWidth = currentSprite.width / currentSprite.frameCount;
  const frameHeight = currentSprite.height;

  // Handle animation frames
  useEffect(() => {
    let stepsCompleted = 0;
    let degreesCompleted = 0;
    
    const animate = () => {
      setAnimation(prev => {
        // Handle walk animation steps
        if (prev.type === ANIMATION_TYPES.WALK && prev.steps > 0) {
          const newX = prev.type === ANIMATION_TYPES.WALK ? 
            position.x + (5 * (prev.steps > 0 ? 1 : -1)) : position.x;
          
          setPosition(p => ({ ...p, x: newX }));
          
          if (prev.frameIndex === currentSprite.frameCount - 1) {
            stepsCompleted++;
            if (stepsCompleted >= Math.abs(prev.steps)) {
              return { ...prev, type: ANIMATION_TYPES.IDLE, frameIndex: 0, steps: 0 };
            }
          }
        }
        
        // Handle flip animation (360 degrees)
        if (prev.type === ANIMATION_TYPES.FLIP && !currentSprite.loop) {
          if (prev.frameIndex === currentSprite.frameCount - 1) {
            return { ...prev, type: ANIMATION_TYPES.IDLE, frameIndex: 0 };
          }
        }
        
        // Handle rotate animation (specific degrees)
        if (prev.type === ANIMATION_TYPES.ROTATE && prev.degrees > 0) {
          degreesCompleted += (360 / currentSprite.frameCount);
          if (degreesCompleted >= prev.degrees) {
            return { ...prev, type: ANIMATION_TYPES.IDLE, frameIndex: 0, degrees: 0 };
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

  // Handle commands from blocks
  useEffect(() => {
    if (onCommand) {
      const handleCommand = (command) => {
        switch (command.action) {
          case 'walk':
            setAnimation({
              type: ANIMATION_TYPES.WALK,
              frameIndex: 0,
              steps: command.value,
              degrees: 0,
              message: ''
            });
            break;
          case 'flip':
            setAnimation({
              type: ANIMATION_TYPES.FLIP,
              frameIndex: 0,
              steps: 0,
              degrees: 0,
              message: ''
            });
            break;
          case 'rotate':
            setAnimation({
              type: ANIMATION_TYPES.ROTATE,
              frameIndex: 0,
              steps: 0,
              degrees: command.value,
              message: ''
            });
            break;
          case 'speak':
            setAnimation({
              type: ANIMATION_TYPES.SPEAK,
              frameIndex: 0,
              steps: 0,
              degrees: 0,
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
              message: ''
            });
            setIsSpeaking(false);
            break;
          default:
            setAnimation({
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
  }, [onCommand]);

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
      <h3>Mascot</h3>
      <div className="mascot-container">
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
            transform: animation.steps < 0 ? 'scaleX(-1)' : 'scaleX(1)'
          }}
        />
        {isSpeaking && (
          <div 
            className="speech-bubble"
            style={{
              position: 'absolute',
              left: `${position.x + frameWidth}px`,
              top: `${position.y - 50}px`,
              backgroundColor: 'white',
              padding: '10px',
              borderRadius: '10px',
              border: '2px solid #333',
              maxWidth: '200px',
              wordWrap: 'break-word'
            }}
          >
            {animation.message}
          </div>
        )}
      </div>
    </div>
  );
};

ConsolePane.propTypes = {
  onCommand: PropTypes.func
};

export default ConsolePane;