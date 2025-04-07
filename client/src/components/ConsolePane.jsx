// src/components/ConsolePane.jsx
import React, { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";

import idleSprite from "../assets/idle.png";
import walkSprite from "../assets/walk.png";
import backgroundImage from "../assets/download.jpg";

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
    width: 150,
    height: 100,
    loop: true,
    frameDuration: 150
  },
  walk: {
    img: walkSprite,
    frameCount: 4,
    width: 300,
    height: 100,
    loop: true,
    frameDuration: 150
  },
  speak: {
    img: idleSprite,
    frameCount: 4,
    width: 150,
    height: 100,
    loop: true,
    frameDuration: 120
  }
};

const ConsolePane = ({ onCommand }) => {
  const [position, setPosition] = useState({ x: 20, y: 175 });
  const [animation, setAnimation] = useState({
    type: ANIMATION_TYPES.IDLE,
    frameIndex: 0,
    steps: 0,
    degrees: 0,
    message: "",
    rotation: 0,
    isFlipping: false,
    turned: false,
    onComplete: null
  });
  const [isSpeaking, setIsSpeaking] = useState(false);

  const mascotRef = useRef(null);
  const isDragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const animationRef = useRef(null);
  const flipAnimationRef = useRef(null);
  const rotateAnimationRef = useRef(null);
  const speakTimeoutRef = useRef(null);
  const initialPosition = useRef({ x: 20, y: 175 });

  const currentSprite = SPRITE_CONFIG[animation.type] || SPRITE_CONFIG.idle;
  const frameWidth = currentSprite.width / currentSprite.frameCount;
  const frameHeight = currentSprite.height;

  const spriteWidth = animation.type === ANIMATION_TYPES.SPEAK && animation.spriteWidth 
    ? animation.spriteWidth 
    : currentSprite.width;
  
  const spriteHeight = animation.type === ANIMATION_TYPES.SPEAK && animation.spriteHeight 
    ? animation.spriteHeight 
    : currentSprite.height;

  useEffect(() => {
    let stepsCompleted = 0;
    const animate = () => {
      setAnimation(prev => {
        let newState = { ...prev };

        if (prev.type === ANIMATION_TYPES.WALK && prev.steps !== 0) {
          const direction = Number(prev.steps) > 0 ? 1 : -1;

          let effectiveRotation = prev.rotation;
          if (prev.turned) {
            effectiveRotation = (effectiveRotation + 180) % 360;
          }
          const angleInRadians = (effectiveRotation * Math.PI) / 180;
          const moveX = 2 * direction * Math.cos(angleInRadians);
          const moveY = 2 * direction * Math.sin(angleInRadians);
          
          setPosition(pos => ({ 
            x: pos.x + moveX, 
            y: pos.y + moveY 
          }));
          
          if (prev.frameIndex === currentSprite.frameCount - 1) {
            stepsCompleted++;
            if (stepsCompleted >= Math.abs(Number(prev.steps))) {

              if (prev.onComplete) {
                prev.onComplete();
              }
              return { ...prev, type: ANIMATION_TYPES.IDLE, frameIndex: 0, steps: 0, onComplete: null };
            }
          }
        }
        if (prev.type === ANIMATION_TYPES.SPEAK && !currentSprite.loop && prev.frameIndex === currentSprite.frameCount - 1) {
          setIsSpeaking(false);

          if (prev.onComplete) {
            prev.onComplete();
          }
          return { ...prev, type: ANIMATION_TYPES.IDLE, frameIndex: 0, message: "", onComplete: null };
        }
        const nextIndex = (prev.frameIndex + 1) % currentSprite.frameCount;
        return { ...prev, frameIndex: nextIndex };
      });
    };

    if (animationRef.current) {
      clearInterval(animationRef.current);
    }

    animationRef.current = setInterval(animate, currentSprite.frameDuration);

    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, [animation.type, currentSprite.frameCount, currentSprite.frameDuration, currentSprite.loop]);

  useEffect(() => {
    if (!animation.isFlipping) return;
    let rot = 0;
    const flipSpeed = 5;

    setPosition(pos => ({ x: pos.x, y: pos.y - 5 }));
    
    const flipStep = () => {
      rot += flipSpeed;
      if (rot >= 360) {
        setAnimation(prev => ({ ...prev, isFlipping: false, rotation: 0 }));
        setPosition(pos => ({ x: pos.x, y: pos.y + 5 }));
        clearInterval(flipAnimationRef.current);
        if (animation.onComplete) {
          animation.onComplete();
        }
      } else {
        setAnimation(prev => ({ ...prev, rotation: rot }));
      }
    };
    flipAnimationRef.current = setInterval(flipStep, 20);
    return () => {
      clearInterval(flipAnimationRef.current);
      if (animation.isFlipping) {
        setPosition(pos => ({ x: pos.x, y: pos.y + 5 }));
      }
    };
  }, [animation.isFlipping, animation.onComplete]);

  useEffect(() => {
    if (animation.degrees === 0) return;
    const target = Number(animation.degrees);

    const initialRotation = animation.rotation;

    const totalSteps = Math.max(10, Math.abs(target) / 5);
    const speed = target / totalSteps;

    setPosition(pos => ({ x: pos.x, y: pos.y - 5 }));
    
    let rotated = 0;
    const rotateStep = () => {
      rotated += speed;

      if (Math.abs(rotated) >= Math.abs(target)) {
        setAnimation(prev => ({
          ...prev,
          degrees: 0,
          rotation: initialRotation + target
        }));
        setPosition(pos => ({ x: pos.x, y: pos.y + 5 }));
        clearInterval(rotateAnimationRef.current);
        if (animation.onComplete) {
          animation.onComplete();
        }
      } else {
        setAnimation(prev => ({
          ...prev,
          rotation: initialRotation + rotated
        }));
      }
    };

    const intervalTime = Math.max(10, 200 / totalSteps);
    rotateAnimationRef.current = setInterval(rotateStep, intervalTime);
    
    return () => {
      clearInterval(rotateAnimationRef.current);
      if (animation.degrees !== 0) {
        setPosition(pos => ({ x: pos.x, y: pos.y + 5 }));
      }
    };
  }, [animation.degrees, animation.onComplete]);

  useEffect(() => {
    if (!onCommand) return;
    const handleCommand = (command, doneCallback) => {
      console.log("ConsolePane received command:", command);
      
      switch (command.action) {
        case "walk": {
          const steps = Number(command.value) || 0;
          setAnimation(prev => ({
            ...prev,
            type: ANIMATION_TYPES.WALK,
            frameIndex: 0,
            steps: steps,
            onComplete: doneCallback
          }));
          break;
        }
        case "flip":
          setAnimation(prev => ({
            ...prev,
            type: ANIMATION_TYPES.IDLE,
            isFlipping: true,
            onComplete: doneCallback
          }));
          break;
        case "rotate":
          setAnimation(prev => ({
            ...prev,
            type: ANIMATION_TYPES.IDLE,
            degrees: Number(command.value) || 0,
            onComplete: doneCallback
          }));
          break;
        case "speak":
          clearTimeout(speakTimeoutRef.current);
          setAnimation(prev => ({
            ...prev,
            type: ANIMATION_TYPES.IDLE,
            frameIndex: 0,
            message: command.message,
            onComplete: doneCallback
          }));
          setIsSpeaking(true);
          speakTimeoutRef.current = setTimeout(() => {
            setIsSpeaking(false);
            setAnimation(prev => ({
              ...prev,
              message: "",
              onComplete: null
            }));
            if (doneCallback) doneCallback();
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
            turned: false,
            onComplete: null
          });
          setIsSpeaking(false);
          if (doneCallback) doneCallback();
          break;
        case "turnAround":
          setAnimation(prev => ({
            ...prev,
            turned: !prev.turned,
            onComplete: doneCallback
          }));
          if (doneCallback) doneCallback();
          break;
        case "crossRoad":
          setPosition(initialPosition.current);
          setAnimation(prev => ({
            ...prev,
            rotation: 2,
            onComplete: null
          }));
          setTimeout(() => {
            setAnimation(prev => ({
              ...prev,
              type: ANIMATION_TYPES.WALK,
              frameIndex: 0,
              steps: 30,
              onComplete: () => {
                setAnimation(prev => ({
                  ...prev,
                  rotation: 0,
                  type: ANIMATION_TYPES.IDLE,
                  onComplete: doneCallback
                }));
              }
            }));
          }, 500);
          break;
        case "stop":
          clearInterval(flipAnimationRef.current);
          clearInterval(rotateAnimationRef.current);
          clearTimeout(speakTimeoutRef.current);
          setPosition(initialPosition.current);
          setAnimation({
            type: ANIMATION_TYPES.IDLE,
            frameIndex: 0,
            steps: 0,
            degrees: 0,
            message: "",
            rotation: 0,
            isFlipping: false,
            turned: false,
            onComplete: null
          });
          setIsSpeaking(false);
          if (doneCallback) doneCallback();
          break;
        case "setPosition":
          setPosition({ x: Number(command.x), y: Number(command.y) });
          if (doneCallback) doneCallback();
          break;
        default:
          setAnimation(prev => ({
            ...prev,
            type: ANIMATION_TYPES.IDLE,
            frameIndex: 0,
            steps: 0,
            degrees: 0,
            message: "",
            onComplete: null
          }));
          if (doneCallback) doneCallback();
      }
    };

    onCommand(handleCommand);
    return () => clearTimeout(speakTimeoutRef.current);
  }, [onCommand, currentSprite.frameDuration]);

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
      <div className="mascot-container" style={{
        position: "relative",
        width: "100%",
        height: "100%",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}>
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
            transformOrigin: "center 75%",
            transition: animation.isFlipping || animation.degrees ? "none" : "transform 0.1s ease",
            ...(animation.type === ANIMATION_TYPES.SPEAK ? {
              width: SPRITE_CONFIG.idle.width / SPRITE_CONFIG.idle.frameCount,
              height: SPRITE_CONFIG.idle.height,
              backgroundSize: `${SPRITE_CONFIG.idle.width}px ${SPRITE_CONFIG.idle.height}px`
            } : {})
          }}
        />
        {isSpeaking && animation.message && (
          <div 
            className="speech-bubble"
            style={{
              position: "absolute",
              left: position.x + frameWidth / 2,
              top: position.y - 40,
              transform: "translateX(-50%)",
              zIndex: 1000
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
