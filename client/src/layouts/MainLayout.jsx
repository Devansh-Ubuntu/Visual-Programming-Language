// src/layouts/MainLayout.jsx
import React from "react";
import WorkspacePane from "../components/WorkspacePane";

export default function MainLayout({ setGeneratedCode }) {
  return (
    <div style={{ width: "100%", height: "calc(100vh - 40px)" }}>
      <WorkspacePane setGeneratedCode={setGeneratedCode} />
    </div>
  );
}
