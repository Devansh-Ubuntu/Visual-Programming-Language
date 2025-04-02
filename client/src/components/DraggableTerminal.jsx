import React, { useState, useRef } from "react";
import { Rnd } from "react-rnd";

export default function DraggableTerminal({ terminalOutput, onUserInput, onDockChange, children }) {
  const defaultFloating = { x: 200, y: 200, width: 500, height: 300 };
  const [floatingPosition, setFloatingPosition] = useState({ x: defaultFloating.x, y: defaultFloating.y });
  const [floatingSize, setFloatingSize] = useState({ width: defaultFloating.width, height: defaultFloating.height });
  const [position, setPosition] = useState({ x: defaultFloating.x, y: defaultFloating.y });
  const [size, setSize] = useState({ width: defaultFloating.width, height: defaultFloating.height });
  const [isDocked, setIsDocked] = useState(false);
  const terminalPaneRef = useRef(null);

  const snapThreshold = 40;
  const undockMovementThreshold = 50;

  const handleDragStop = (e, d) => {
    const newX = d.x;
    const newY = d.y;
    const winWidth = window.innerWidth;
    const winHeight = window.innerHeight;
    const distToLeft = newX;
    const distToTop = newY;
    const distToRight = winWidth - (newX + size.width);
    const distToBottom = winHeight - (newY + size.height);
    const minDist = Math.min(distToLeft, distToTop, distToRight, distToBottom);

    if (isDocked) {
      const dx = Math.abs(newX - position.x);
      const dy = Math.abs(newY - position.y);
      if (dx > undockMovementThreshold || dy > undockMovementThreshold) {
        // Undock: restore floating state.
        setPosition(floatingPosition);
        setSize(floatingSize);
        setIsDocked(false);
        onDockChange && onDockChange({ docked: false });
        return;
      }
      return;
    }

    if (minDist > snapThreshold) {
      setPosition({ x: newX, y: newY });
      setFloatingPosition({ x: newX, y: newY });
      onDockChange && onDockChange({ docked: false });
      return;
    }

    // Docking
    setFloatingPosition({ x: newX, y: newY });
    setFloatingSize({ width: size.width, height: size.height });
    if (minDist === distToLeft) {
      setPosition({ x: 0, y: 0 });
      setSize({ width: 350, height: winHeight });
      onDockChange && onDockChange({ docked: true, edge: "left", dockSize: { width: 350 } });
    } else if (minDist === distToRight) {
      setPosition({ x: winWidth - 350, y: 0 });
      setSize({ width: 350, height: winHeight });
      onDockChange && onDockChange({ docked: true, edge: "right", dockSize: { width: 350 } });
    } else if (minDist === distToTop) {
      setPosition({ x: 0, y: 0 });
      setSize({ width: winWidth, height: 300 });
      onDockChange && onDockChange({ docked: true, edge: "top", dockSize: { height: 300 } });
    } else if (minDist === distToBottom) {
      setPosition({ x: 0, y: winHeight - 300 });
      setSize({ width: winWidth, height: 300 });
      onDockChange && onDockChange({ docked: true, edge: "bottom", dockSize: { height: 300 } });
    }
    setIsDocked(true);
  };

  const handleResizeStop = (e, direction, ref, delta, pos) => {
    const newWidth = parseFloat(ref.style.width);
    const newHeight = parseFloat(ref.style.height);
    setSize({ width: newWidth, height: newHeight });
    setPosition({ x: pos.x, y: pos.y });
    if (!isDocked) {
      setFloatingSize({ width: newWidth, height: newHeight });
      setFloatingPosition({ x: pos.x, y: pos.y });
    }
    setTimeout(() => {
      terminalPaneRef.current?.resizeTerminal();
    }, 0);
  };

  return (
    <Rnd
      size={{ width: size.width, height: size.height }}
      position={{ x: position.x, y: position.y }}
      onDragStop={handleDragStop}
      onResizeStop={handleResizeStop}
      bounds="window"
      minWidth={300}
      minHeight={200}
      dragHandleClassName="draggable-header"
      style={{
        display: "flex",
        flexDirection: "column",
        background: "#000",
        border: "2px solid #0f0",
        borderRadius: "5px",
        overflow: "hidden",
        zIndex: 9999,
      }}
    >
      <div
        className="draggable-header"
        style={{
          background: "#333",
          color: "#fff",
          padding: "5px 10px",
          cursor: "move",
          userSelect: "none",
        }}
      >
        Terminal
      </div>
      {/* Always render children; remove fallback TerminalPane */}
      {children}
    </Rnd>
  );
}