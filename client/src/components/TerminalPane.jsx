import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import { Terminal as XTerminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";  // <-- Import FitAddon
import "xterm/css/xterm.css";

const TerminalPane = forwardRef(({ terminalOutput, onUserInput }, ref) => {
  const terminalRef = useRef(null);
  const termInstance = useRef(null);
  const fitAddon = useRef(null);  // store fitAddon in a ref
  const [inputBuffer, setInputBuffer] = useState("");
  const prevTerminalOutput = useRef("");

  // Expose a method to the parent that forces a refit
  useImperativeHandle(ref, () => ({
    resizeTerminal: () => {
      if (fitAddon.current) {
        fitAddon.current.fit();
      }
    },
  }));

  useEffect(() => {
    // Initialize xterm.js
    termInstance.current = new XTerminal({
      cursorBlink: true,
      convertEol: true,
      // wordWrap: true, // optional if you want line-wrapping
      // scrollback: 1000, // default is 1000, can be changed
    });

    // Load the FitAddon
    fitAddon.current = new FitAddon();
    termInstance.current.loadAddon(fitAddon.current);

    // Open the terminal in the div
    termInstance.current.open(terminalRef.current);

    // Perform initial fit
    fitAddon.current.fit();

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
      termInstance.current?.dispose();
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
        paddingBottom: "20px",
        background: "transparent",
        color: "#0f0",
        boxSizing: "border-box",
      }}
    />
  );
});

export default TerminalPane;
