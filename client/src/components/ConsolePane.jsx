// src/components/ConsolePane.jsx
import React, { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";

// Import sprite sheets and assets
import idleSprite from "../assets/idle.png";
import walkSprite from "../assets/walk.png";

const ANIMATION_TYPES = {
  IDLE: "idle",
  WALK: "walk",
  FLIP: "flip",
  ROTATE: "rotate",
  SPEAK: "speak"
};

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
    img: idleSprite,
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
    message: "",
    rotation: 0,
    isFlipping: false,
    turned: false // Added property to track horizontal flip.
  });
  const [isSpeaking, setIsSpeaking] = useState(false);

  const mascotRef = useRef(null);
  const isDragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const animationRef = useRef(null);
  const flipAnimationRef = useRef(null);
  const rotateAnimationRef = useRef(null);
  const speakTimeoutRef = useRef(null);
  const initialPosition = useRef({ x: 50, y: 50 });

  const currentSprite = SPRITE_CONFIG[animation.type] || SPRITE_CONFIG.idle;
  const frameWidth = currentSprite.width / currentSprite.frameCount;
  const frameHeight = currentSprite.height;

  // Animation loop for frame updates.
  useEffect(() => {
    let stepsCompleted = 0;
    const animate = () => {
      setAnimation(prev => {
        if (prev.type === ANIMATION_TYPES.WALK && prev.steps !== 0) {
          const direction = Number(prev.steps) > 0 ? 1 : -1;
          setPosition(pos => ({ x: pos.x + 5 * direction, y: pos.y }));
          if (prev.frameIndex === currentSprite.frameCount - 1) {
            stepsCompleted++;
            if (stepsCompleted >= Math.abs(Number(prev.steps))) {
              return { ...prev, type: ANIMATION_TYPES.IDLE, frameIndex: 0, steps: 0 };
            }
          }
        }
        if (prev.type === ANIMATION_TYPES.SPEAK && !currentSprite.loop && prev.frameIndex === currentSprite.frameCount - 1) {
          setIsSpeaking(false);
          return { ...prev, type: ANIMATION_TYPES.IDLE, frameIndex: 0, message: "" };
        }
        const nextIndex = (prev.frameIndex + 1) % currentSprite.frameCount;
        return { ...prev, frameIndex: nextIndex };
      });
    };
    animationRef.current = setInterval(animate, currentSprite.frameDuration);
    return () => clearInterval(animationRef.current);
  }, [animation.type, currentSprite.frameCount, currentSprite.frameDuration, currentSprite.loop]);

  // Flip animation effect.
  useEffect(() => {
    if (!animation.isFlipping) return;
    let rot = 0;
    const flipSpeed = 20;
    const flipStep = () => {
      rot += flipSpeed;
      if (rot >= 360) {
        setAnimation(prev => ({ ...prev, isFlipping: false, rotation: 0 }));
        clearInterval(flipAnimationRef.current);
      } else {
        setAnimation(prev => ({ ...prev, rotation: rot }));
      }
    };
    flipAnimationRef.current = setInterval(flipStep, 16);
    return () => clearInterval(flipAnimationRef.current);
  }, [animation.isFlipping]);

  // Rotate animation effect.
  useEffect(() => {
    if (animation.degrees === 0) return;
    const target = Number(animation.degrees);
    const speed = target > 0 ? 5 : -5;
    let rotated = 0;
    const rotateStep = () => {
      rotated += speed;
      if (Math.abs(rotated) >= Math.abs(target)) {
        setAnimation(prev => ({
          ...prev,
          degrees: 0,
          rotation: prev.rotation + target
        }));
        clearInterval(rotateAnimationRef.current);
      } else {
        setAnimation(prev => ({
          ...prev,
          rotation: prev.rotation + speed
        }));
      }
    };
    rotateAnimationRef.current = setInterval(rotateStep, 16);
    return () => clearInterval(rotateAnimationRef.current);
  }, [animation.degrees]);

  // IMPORTANT: Expose the mascot command handler upward.
  useEffect(() => {
    if (!onCommand) return;
    const handleCommand = (command) => {
      console.log("ConsolePane received command:", command);
      switch (command.action) {
        case "walk": {
          const steps = Number(command.value) || 0;
          setAnimation(prev => ({
            ...prev,
            type: ANIMATION_TYPES.WALK,
            frameIndex: 0,
            steps: steps
          }));
          break;
        }
        case "flip":
          setAnimation(prev => ({
            ...prev,
            type: ANIMATION_TYPES.IDLE,
            isFlipping: true
          }));
          break;
        case "rotate":
          setAnimation(prev => ({
            ...prev,
            type: ANIMATION_TYPES.IDLE,
            degrees: Number(command.value) || 0
          }));
          break;
        case "speak":
          clearTimeout(speakTimeoutRef.current);
          setAnimation(prev => ({
            ...prev,
            type: ANIMATION_TYPES.SPEAK,
            frameIndex: 0,
            message: command.message
          }));
          setIsSpeaking(true);
          speakTimeoutRef.current = setTimeout(() => {
            setIsSpeaking(false);
            setAnimation(prev => ({
              ...prev,
              type: ANIMATION_TYPES.IDLE,
              frameIndex: 0,
              message: ""
            }));
          }, (command.duration || 1) * 1000);
          break;
        case "reset":
          setPosition(initialPosition.current);
          setAnimation({
            type: ANIMATION_TYPES.IDLE,
            frameIndex: 0,
            steps: 0,
            degrees: 0,
            message: "",
            rotation: 0,
            isFlipping: false,
            turned: false
          });
          setIsSpeaking(false);
          break;
        case "turnAround":
          // Toggle horizontal flip.
          setAnimation(prev => ({
            ...prev,
            turned: !prev.turned
          }));
          break;
        case "crossRoad":
          // Sequence: reset position, rotate -15°, walk 10 steps, then rotate back to normal.
          setPosition(initialPosition.current);
          setAnimation(prev => ({
            ...prev,
            rotation: -15
          }));
          // After a short delay, initiate walk.
          setTimeout(() => {
            setAnimation(prev => ({
              ...prev,
              type: ANIMATION_TYPES.WALK,
              frameIndex: 0,
              steps: 10
            }));
            // After the walk, rotate back to normal.
            setTimeout(() => {
              setAnimation(prev => ({
                ...prev,
                rotation: 0,
                type: ANIMATION_TYPES.IDLE
              }));
            }, 10 * currentSprite.frameDuration + 200);
          }, 500);
          break;
        default:
          setAnimation(prev => ({
            ...prev,
            type: ANIMATION_TYPES.IDLE,
            frameIndex: 0,
            steps: 0,
            degrees: 0,
            message: ""
          }));
      }
    };

    // Pass our command handler upward.
    onCommand(handleCommand);
    return () => clearTimeout(speakTimeoutRef.current);
  }, [onCommand, currentSprite.frameDuration]);

  // Drag handlers for repositioning the mascot.
  const handleMouseDown = (e) => {
    isDragging.current = true;
    offset.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    setPosition({ x: e.clientX - offset.current.x, y: e.clientY - offset.current.y });
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  return (
    <div className="console-pane" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
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
            position: "absolute",
            left: position.x,
            top: position.y,
            width: frameWidth,
            height: frameHeight,
            backgroundImage: `url(${currentSprite.img})`,
            backgroundPosition: `-${animation.frameIndex * frameWidth}px 0`,
            backgroundSize: `${currentSprite.width}px ${currentSprite.height}px`,
            cursor: "grab",
            transform: `scaleX(${animation.turned ? -1 : 1}) rotate(${animation.rotation}deg)`,
            transformOrigin: "center center",
            transition: animation.isFlipping || animation.degrees ? "none" : "transform 0.1s ease"
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
