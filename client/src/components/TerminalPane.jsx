// src/components/TerminalPane.jsx
import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import { Terminal as XTerminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";

const TerminalPane = forwardRef(({ terminalOutput, onUserInput }, ref) => {
  const terminalRef = useRef(null);
  const termInstance = useRef(null);
  const fitAddon = useRef(null);
  const [inputBuffer, setInputBuffer] = useState("");
  const prevTerminalOutput = useRef("");

  // Expose a method to force terminal refitting.
  useImperativeHandle(ref, () => ({
    resizeTerminal: () => {
      if (fitAddon.current) {
        fitAddon.current.fit();
      }
    },
  }));

  useEffect(() => {
    // Initialize the xterm.js terminal.
    termInstance.current = new XTerminal({
      cursorBlink: true,
      convertEol: true,
      fontFamily: "monospace",
      fontSize: 14,
    });
    fitAddon.current = new FitAddon();
    termInstance.current.loadAddon(fitAddon.current);
    termInstance.current.open(terminalRef.current);
    fitAddon.current.fit();

    // Write the initial output and prompt.
    termInstance.current.write(terminalOutput + "\r\n> ");
    prevTerminalOutput.current = terminalOutput;

    // Listen for keystrokes.
    const disposeData = termInstance.current.onData((data) => {
      if (data === "\r") {
        // On Enter: send input and clear buffer.
        termInstance.current.write("\r\n");
        if (onUserInput) onUserInput(inputBuffer);
        setInputBuffer("");
        termInstance.current.write("> ");
      } else if (data === "\u007F") {
        // Handle Backspace.
        if (inputBuffer.length > 0) {
          setInputBuffer((prev) => prev.slice(0, -1));
          termInstance.current.write("\b \b");
        }
      } else {
        // Regular character input.
        setInputBuffer((prev) => prev + data);
        termInstance.current.write(data);
      }
    });

    const handleResize = () => {
      if (fitAddon.current) fitAddon.current.fit();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      disposeData.dispose();
      termInstance.current.dispose();
    };
  }, [onUserInput, terminalOutput]);

  // Append any new external output.
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
        background: "black",
        color: "#0f0",
        padding: "8px",
        boxSizing: "border-box",
      }}
    />
  );
});

export default TerminalPane;
