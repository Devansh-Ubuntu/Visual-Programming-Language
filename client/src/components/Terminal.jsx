// src/components/Terminal.jsx
import React, { useEffect, useRef } from "react";
import { Terminal as XTerminal } from "xterm";
import "xterm/css/xterm.css";

const Terminal = ({ output }) => {
  const terminalRef = useRef(null);
  const termInstance = useRef(null);

  useEffect(() => {
    // Initialize the xterm.js terminal
    termInstance.current = new XTerminal({
      cursorBlink: true,
      convertEol: true,
    });
    termInstance.current.open(terminalRef.current);
    // Write initial output if any
    termInstance.current.write(output);
    return () => {
      termInstance.current.dispose();
    };
  }, []);

  useEffect(() => {
    if (termInstance.current) {
      termInstance.current.clear();
      termInstance.current.write(output);
    }
  }, [output]);

  return (
    <div
      ref={terminalRef}
      style={{
        width: "100%",
        height: "200px",
        background: "#000",
        padding: "10px",
        boxSizing: "border-box",
      }}
    />
  );
};

export default Terminal;
