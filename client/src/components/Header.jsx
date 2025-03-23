// src/components/Header.jsx
import React from "react";

function Header({ onRun, onStop }) {
  return (
    <header
      style={{
        height: "40px",
        backgroundColor: "#222",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        padding: "0 10px",
        gap: "10px",
      }}
    >
      <button onClick={onRun}>Run</button>
      <button onClick={onStop}>Stop</button>
    </header>
  );
}

export default Header;
