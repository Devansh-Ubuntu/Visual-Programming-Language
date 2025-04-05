// src/components/Header.jsx
import React from "react";

function Header({ onRun, onStop, onSave, onLoad }) {
  return (
    <header className="app-header">
      <div className="app-logo"> WDCCR - Why Did the Chicken Cross the Road? </div>
      <div className="header-buttons">
        <button className="run-button" onClick={onRun}>
          ▶ Run
        </button>
        <button className="stop-button" onClick={onStop}>
          ■ Stop
        </button>
      </div>
      <div className="file-buttons">
        <button onClick={onSave}>
          Save
        </button>
        <button onClick={onLoad}>
          Load
        </button>
      </div>
    </header>
  );
}

export default Header;
