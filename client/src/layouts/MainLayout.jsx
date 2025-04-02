import React from "react";
import WorkspacePane from "../components/WorkspacePane";

export default function MainLayout({ setGeneratedCode, onWorkspaceChange }) {
  return (
    <div style={{ width: "100%", height: "calc(100vh - 40px)", position: "relative" }}>
      <WorkspacePane setGeneratedCode={setGeneratedCode} onWorkspaceChange={onWorkspaceChange} />
    </div>
  );
}
