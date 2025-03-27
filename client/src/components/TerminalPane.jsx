import React, { useEffect, useRef, useState } from "react";
import { Terminal as XTerminal } from "xterm";
import "xterm/css/xterm.css";

const TerminalPane = ({ terminalOutput, onUserInput }) => {
  const terminalRef = useRef(null);
  const termInstance = useRef(null);
  const [inputBuffer, setInputBuffer] = useState("");
  const prevTerminalOutput = useRef("");

  useEffect(() => {
    // Initialize xterm.js
    termInstance.current = new XTerminal({
      cursorBlink: true,
      convertEol: true,
    });
    termInstance.current.open(terminalRef.current);
    // Write initial external output
    termInstance.current.write(terminalOutput + "\r\n> ");
    prevTerminalOutput.current = terminalOutput;

    // Listen for keystrokes
    const disposeData = termInstance.current.onData((data) => {
      if (data === "\r") {
        // Enter key
        termInstance.current.write("\r\n");
        if (onUserInput) onUserInput(inputBuffer);
        setInputBuffer("");
        termInstance.current.write("> ");
      } else if (data === "\u007F") {
        // Backspace
        if (inputBuffer.length > 0) {
          setInputBuffer((prev) => prev.slice(0, -1));
          termInstance.current.write("\b \b");
        }
      } else {
        // Normal character
        setInputBuffer((prev) => prev + data);
        termInstance.current.write(data);
      }
    });

    return () => {
      disposeData.dispose();
      termInstance.current.dispose();
    };
  }, [onUserInput, terminalOutput]);

  // Whenever external output changes, append only new content
  useEffect(() => {
    if (!termInstance.current) return;
    const newContent = terminalOutput.slice(prevTerminalOutput.current.length);
    if (newContent) {
      termInstance.current.write("\r\n" + newContent + "\r\n> " + inputBuffer);
    }
    prevTerminalOutput.current = terminalOutput;
  }, [terminalOutput, inputBuffer]);

  return (
    <div
      ref={terminalRef}
      style={{
        width: "100%",
        height: "100%",
        // background is transparent so it matches the parent
        background: "transparent",
        color: "#0f0",
        boxSizing: "border-box",
      }}
    />
  );
};

export default TerminalPane;
