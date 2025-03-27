// src/layouts/MainLayout.jsx
import React from "react";
import WorkspacePane from "../components/WorkspacePane";
import DraggableTerminal from "../components/DraggableTerminal";

export default function MainLayout({ setGeneratedCode, terminalOutput, onUserInput }) {
  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      <div style={{ width: "100%", height: "calc(100vh - 40px)", overflow: "auto" }}>
        <WorkspacePane setGeneratedCode={setGeneratedCode} />
      </div>
      {/* Draggable terminal overlay */}
      <DraggableTerminal terminalOutput={terminalOutput} onUserInput={onUserInput} />
    </div>
  );
}
