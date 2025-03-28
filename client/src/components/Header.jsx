// src/components/Header.jsx
import React from "react";

function Header({ onRun, onStop, onSave, onLoad }) {
  return (
    <header style={{ height: "40px", backgroundColor: "#222", color: "#fff", display: "flex", alignItems: "center", padding: "0 10px", gap: "10px", justifyContent: "space-between" }}>
      <div>
        <button onClick={onRun}>Run</button>
        <button onClick={onStop}>Stop</button>
      </div>
      <div>
        <button onClick={onSave}>Save</button>
        <button onClick={onLoad}>Load</button>
      </div>
    </header>
  );
}

export default Header;
