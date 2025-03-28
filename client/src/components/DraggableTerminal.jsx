import React, { useState } from "react";
import { Rnd } from "react-rnd";
import TerminalPane from "./TerminalPane";

export default function DraggableTerminal({ terminalOutput, onUserInput, onDockChange }) {
  // Default floating state (customize as desired)
  const defaultFloating = { x: 200, y: 200, width: 500, height: 300 };

  // Save last floating (undocked) state.
  const [floatingPosition, setFloatingPosition] = useState({ x: defaultFloating.x, y: defaultFloating.y });
  const [floatingSize, setFloatingSize] = useState({ width: defaultFloating.width, height: defaultFloating.height });

  // Current state used by Rnd.
  const [position, setPosition] = useState({ x: defaultFloating.x, y: defaultFloating.y });
  const [size, setSize] = useState({ width: defaultFloating.width, height: defaultFloating.height });

  // Whether the terminal is currently docked.
  const [isDocked, setIsDocked] = useState(false);
  // For visual docking preview.
  const [isDockingPreview, setIsDockingPreview] = useState(false);

  // How close (in pixels) to an edge triggers docking.
  const snapThreshold = 40;
  // Minimum movement (in pixels) from the docked position needed to undock.
  const undockMovementThreshold = 50;

  // While dragging, show a docking preview if near an edge.
  const handleDrag = (e, d) => {
    const newX = d.x;
    const newY = d.y;
    const winWidth = window.innerWidth;
    const winHeight = window.innerHeight;
    const distToLeft = newX;
    const distToTop = newY;
    const distToRight = winWidth - (newX + size.width);
    const distToBottom = winHeight - (newY + size.height);
    const minDist = Math.min(distToLeft, distToTop, distToRight, distToBottom);
    setIsDockingPreview(minDist <= snapThreshold);
  };

  // On drag stop, decide whether to dock or undock.
  const handleDragStop = (e, d) => {
    setIsDockingPreview(false);
    const newX = d.x;
    const newY = d.y;
    const winWidth = window.innerWidth;
    const winHeight = window.innerHeight;
    const distToLeft = newX;
    const distToTop = newY;
    const distToRight = winWidth - (newX + size.width);
    const distToBottom = winHeight - (newY + size.height);
    const minDist = Math.min(distToLeft, distToTop, distToRight, distToBottom);

    // If already docked and moved sufficiently away, undock.
    if (isDocked) {
      const dx = Math.abs(newX - position.x);
      const dy = Math.abs(newY - position.y);
      if (dx > undockMovementThreshold || dy > undockMovementThreshold) {
        // Restore saved floating state.
        setPosition(floatingPosition);
        setSize(floatingSize);
        setIsDocked(false);
        onDockChange && onDockChange({ docked: false });
        return;
      }
      // Otherwise remain docked.
      setPosition(position);
      return;
    }

    // If not near any edge, update floating state.
    if (minDist > snapThreshold) {
      setPosition({ x: newX, y: newY });
      setFloatingPosition({ x: newX, y: newY });
      onDockChange && onDockChange({ docked: false });
      return;
    }

    // Otherwise, we're near an edge: dock.
    // Save current floating state before docking.
    setFloatingPosition({ x: newX, y: newY });
    setFloatingSize({ width: size.width, height: size.height });

    if (minDist === distToLeft) {
      // Dock to left.
      setPosition({ x: 0, y: 0 });
      setSize({ width: 350, height: winHeight });
      onDockChange && onDockChange({ docked: true, edge: "left", dockSize: { width: 350 } });
    } else if (minDist === distToRight) {
      // Dock to right.
      setPosition({ x: winWidth - 350, y: 0 });
      setSize({ width: 350, height: winHeight });
      onDockChange && onDockChange({ docked: true, edge: "right", dockSize: { width: 350 } });
    } else if (minDist === distToTop) {
      // Dock to top.
      setPosition({ x: 0, y: 0 });
      setSize({ width: winWidth, height: 300 });
      onDockChange && onDockChange({ docked: true, edge: "top", dockSize: { height: 300 } });
    } else if (minDist === distToBottom) {
      // Dock to bottom.
      setPosition({ x: 0, y: winHeight - 300 });
      setSize({ width: winWidth, height: 300 });
      onDockChange && onDockChange({ docked: true, edge: "bottom", dockSize: { height: 300 } });
    }
    setIsDocked(true);
  };

  // Update floating state on resize (if not docked).
  const handleResizeStop = (e, direction, ref, delta, pos) => {
    const newWidth = parseFloat(ref.style.width);
    const newHeight = parseFloat(ref.style.height);
    setSize({ width: newWidth, height: newHeight });
    setPosition({ x: pos.x, y: pos.y });
    if (!isDocked) {
      setFloatingSize({ width: newWidth, height: newHeight });
      setFloatingPosition({ x: pos.x, y: pos.y });
    }
  };

  // Visual cue for docking preview.
  const boxShadowStyle = isDockingPreview ? "0 0 15px 5px rgba(0,255,0,0.7)" : "none";

  return (
    <Rnd
      size={{ width: size.width, height: size.height }}
      position={{ x: position.x, y: position.y }}
      onDrag={handleDrag}
      onDragStop={handleDragStop}
      onResizeStop={handleResizeStop}
      bounds="window"
      minWidth={300}
      minHeight={200}
      style={{
        display: "flex",
        flexDirection: "column",
        background: "#000",
        border: "2px solid #0f0",
        borderRadius: "5px",
        overflow: "hidden",
        zIndex: 9999,
        boxShadow: boxShadowStyle,
      }}
    >
      <TerminalPane terminalOutput={terminalOutput} onUserInput={onUserInput} />
    </Rnd>
  );
}
