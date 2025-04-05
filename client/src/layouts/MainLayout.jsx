import React from "react";
import WorkspacePane from "../components/WorkspacePane";

export default function MainLayout({ setGeneratedCode, onWorkspaceChange }) {
  return (
    <div className="blockly-workspace">
      <WorkspacePane 
        setGeneratedCode={setGeneratedCode} 
        onWorkspaceChange={onWorkspaceChange}
      />
    </div>
  );
}
