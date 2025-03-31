import React, { useState } from "react";
import WorkspacePane from "../components/WorkspacePane";
import DraggableTerminal from "../components/DraggableTerminal";

export default function MainLayout({ setGeneratedCode, terminalOutput, onUserInput, onWorkspaceChange }) {
  // State to hold docking info: when docked, we store the edge and dock size.
  const [dockInfo, setDockInfo] = useState({ docked: false });

  // Compute workspace container style based on docking.
  // For example, if docked left/right, we leave that many pixels on the left/right.
  // If docked top/bottom, we leave that many pixels on the top/bottom.
  const workspaceStyle = {
    position: "absolute",
    top: dockInfo.docked && dockInfo.edge === "top" ? dockInfo.dockSize.height : 0,
    bottom: dockInfo.docked && dockInfo.edge === "bottom" ? dockInfo.dockSize.height : 0,
    left: dockInfo.docked && dockInfo.edge === "left" ? dockInfo.dockSize.width : 0,
    right: dockInfo.docked && dockInfo.edge === "right" ? dockInfo.dockSize.width : 0,
    overflow: "auto",
  };

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
    <div style={{ width: "100%", height: "calc(100vh - 40px)" }}>
      <WorkspacePane setGeneratedCode={setGeneratedCode} onWorkspaceChange={onWorkspaceChange} />
    </div>
      {/* Draggable terminal overlay */}
      <DraggableTerminal 
        terminalOutput={terminalOutput} 
        onUserInput={onUserInput} 
        onDockChange={setDockInfo}
      />
    </div>
  );
}
