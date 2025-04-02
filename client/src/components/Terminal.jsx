import React, { useEffect, useRef } from "react";
import { Terminal as XTerminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";

const Terminal = ({ output }) => {
  const terminalRef = useRef(null);
  const termInstance = useRef(null);
  const fitAddon = useRef(null);

  useEffect(() => {
    // Initialize the xterm.js terminal and load the Fit Addon.
    termInstance.current = new XTerminal({
      cursorBlink: true,
      convertEol: true,
    });
    fitAddon.current = new FitAddon();
    termInstance.current.loadAddon(fitAddon.current);

    // Open the terminal and fit it to the container.
    termInstance.current.open(terminalRef.current);
    fitAddon.current.fit();

    // Write initial output.
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