// src/components/TerminalPane.jsx
import React from "react";

function TerminalPane({ generatedCode, output }) {
  return (
    <div
      style={{
        backgroundColor: "#000",
        color: "#0f0",
        padding: "10px",
        height: "200px",
        overflow: "auto",
      }}
    >
      <div style={{ marginBottom: "10px", fontWeight: "bold" }}>
        Terminal
      </div>
      <pre style={{ whiteSpace: "pre-wrap" }}>{output}</pre>
      <div style={{ marginTop: "10px", borderTop: "1px solid #0f0", paddingTop: "10px" }}>
        <h4>Generated Code:</h4>
        <pre style={{ whiteSpace: "pre-wrap", color: "#fff" }}>{generatedCode}</pre>
      </div>
    </div>
  );
}

export default TerminalPane;
