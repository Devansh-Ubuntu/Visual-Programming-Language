// src/components/ConsolePane.jsx
import React, { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";

// Import sprite sheets and assets
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
  const [position, setPosition] = useState({ x: 50, y: 150 });
  const [animation, setAnimation] = useState({
    type: ANIMATION_TYPES.IDLE,
    frameIndex: 0,
    steps: 0,
    degrees: 0,
    message: "",
    rotation: 0,
    isFlipping: false,
    turned: false,
    onComplete: null // Added to support asynchronous completion.
  });
  const [isSpeaking, setIsSpeaking] = useState(false);

  const mascotRef = useRef(null);
  const isDragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const animationRef = useRef(null);
  const flipAnimationRef = useRef(null);
  const rotateAnimationRef = useRef(null);
  const speakTimeoutRef = useRef(null);
  const initialPosition = useRef({ x: 50, y: 150 });

  const currentSprite = SPRITE_CONFIG[animation.type] || SPRITE_CONFIG.idle;
  const frameWidth = currentSprite.width / currentSprite.frameCount;
  const frameHeight = currentSprite.height;
  
  // Use preserved dimensions for speak animation if available
  const spriteWidth = animation.type === ANIMATION_TYPES.SPEAK && animation.spriteWidth 
    ? animation.spriteWidth 
    : currentSprite.width;
  
  const spriteHeight = animation.type === ANIMATION_TYPES.SPEAK && animation.spriteHeight 
    ? animation.spriteHeight 
    : currentSprite.height;
  
  // Animation loop for frame updates.
  useEffect(() => {
    let stepsCompleted = 0;
    const animate = () => {
      setAnimation(prev => {
        // Create a new animation state object to avoid mutation
        let newState = { ...prev };
        
        // Handle different animation types
        if (prev.type === ANIMATION_TYPES.WALK && prev.steps !== 0) {
          const direction = Number(prev.steps) > 0 ? 1 : -1;
          
          // Calculate movement based on rotation angle and turned state
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
              // Invoke completion callback if provided
              if (prev.onComplete) {
                prev.onComplete();
              }
              return { ...prev, type: ANIMATION_TYPES.IDLE, frameIndex: 0, steps: 0, onComplete: null };
            }
          }
        }
        if (prev.type === ANIMATION_TYPES.SPEAK && !currentSprite.loop && prev.frameIndex === currentSprite.frameCount - 1) {
          setIsSpeaking(false);
          // Invoke completion callback if provided
          if (prev.onComplete) {
            prev.onComplete();
          }
          return { ...prev, type: ANIMATION_TYPES.IDLE, frameIndex: 0, message: "", onComplete: null };
        }
        const nextIndex = (prev.frameIndex + 1) % currentSprite.frameCount;
        return { ...prev, frameIndex: nextIndex };
      });
    };
    
    // Clear any existing animation interval
    if (animationRef.current) {
      clearInterval(animationRef.current);
    }
    
    // Set up a new animation interval
    animationRef.current = setInterval(animate, currentSprite.frameDuration);
    
    // Clean up on unmount or when dependencies change
    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, [animation.type, currentSprite.frameCount, currentSprite.frameDuration, currentSprite.loop]);

  // Flip animation effect.
  useEffect(() => {
    if (!animation.isFlipping) return;
    let rot = 0;
    const flipSpeed = 5;
    
    // Move up 10px at the start of the flip
    setPosition(pos => ({ x: pos.x, y: pos.y - 10 }));
    
    const flipStep = () => {
      rot += flipSpeed;
      if (rot >= 360) {
        setAnimation(prev => ({ ...prev, isFlipping: false, rotation: 0 }));
        // Move back down 10px after the flip is complete
        setPosition(pos => ({ x: pos.x, y: pos.y + 10 }));
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
      // Ensure we move back down if the component unmounts during a flip
      if (animation.isFlipping) {
        setPosition(pos => ({ x: pos.x, y: pos.y + 10 }));
      }
    };
  }, [animation.isFlipping, animation.onComplete]);

  // Rotate animation effect.
  useEffect(() => {
    if (animation.degrees === 0) return;
    const target = Number(animation.degrees);
    
    // Store the initial rotation value
    const initialRotation = animation.rotation;
    
    // Calculate the number of steps based on the target angle
    // Use more steps for larger angles to ensure smooth animation
    const totalSteps = Math.max(10, Math.abs(target) / 5);
    const speed = target / totalSteps;
    
    let rotated = 0;
    const rotateStep = () => {
      rotated += speed;
      
      // Check if we've reached or exceeded the target rotation
      if (Math.abs(rotated) >= Math.abs(target)) {
        // Set the final rotation value exactly to the target
        setAnimation(prev => ({
          ...prev,
          degrees: 0,
          rotation: initialRotation + target // Use initial rotation + target for exact positioning
        }));
        clearInterval(rotateAnimationRef.current);
        if (animation.onComplete) {
          animation.onComplete();
        }
      } else {
        // Apply the incremental rotation
        setAnimation(prev => ({
          ...prev,
          rotation: initialRotation + rotated // Use initial rotation + current rotated amount
        }));
      }
    };
    
    // Adjust interval timing based on the total steps
    // Faster for smaller angles, slower for larger angles
    const intervalTime = Math.max(10, 200 / totalSteps);
    rotateAnimationRef.current = setInterval(rotateStep, intervalTime);
    
    return () => clearInterval(rotateAnimationRef.current);
  }, [animation.degrees, animation.onComplete]);

  // Expose the mascot command handler upward.
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
          // Toggle horizontal flip
          setAnimation(prev => ({
            ...prev,
            turned: !prev.turned,
            onComplete: doneCallback
          }));
          // Assume immediate completion:
          if (doneCallback) doneCallback();
          break;
        case "crossRoad":
          // Sequence: reset position, rotate -15°, walk 10 steps, then rotate back to normal.
          setPosition(initialPosition.current);
          setAnimation(prev => ({
            ...prev,
            rotation: -15,
            onComplete: null // Wait until walk completes before rotating back.
          }));
          setTimeout(() => {
            setAnimation(prev => ({
              ...prev,
              type: ANIMATION_TYPES.WALK,
              frameIndex: 0,
              steps: 10,
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
          // Set the mascot's position directly.
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
            transformOrigin: "center center",
            transition: animation.isFlipping || animation.degrees ? "none" : "transform 0.1s ease",
            // Force consistent dimensions for speak animation
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
