import React from "react";
import WorkspacePane from "../components/WorkspacePane";

export default function MainLayout({ setGeneratedCode, onWorkspaceChange, onMascotCommand }) {
  return (
    <div className="blockly-workspace">
      <WorkspacePane 
        setGeneratedCode={setGeneratedCode} 
        onWorkspaceChange={onWorkspaceChange}
        onMascotCommand={onMascotCommand}
      />
    </div>
  );
}
