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
  const isInitialMount = useRef(true);

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
      theme: {
        background: "#f9f9f9",
        foreground: "#3a3a3a",
        cursor: "#4C97FF", 
        cursorAccent: "#ffffff",
        selection: "rgba(76, 151, 255, 0.3)",
        black: '#000000',
        red: '#e83030',
        green: '#3ce157',
        yellow: '#f5d922',
        blue: '#4C97FF',
        magenta: '#9966FF',
        cyan: '#39b3c7',
        white: '#cfcfcf',
        brightBlack: '#686868',
        brightRed: '#ff6666',
        brightGreen: '#73ff73',
        brightYellow: '#ffff73',
        brightBlue: '#83B3F3',
        brightMagenta: '#c07eec',
        brightCyan: '#95d8de',
        brightWhite: '#ffffff'
      },
      fontFamily: "'Helvetica Neue', Arial, sans-serif",
      fontSize: 14,
      rendererType: 'canvas',
      rows: 10,
    });
    fitAddon.current = new FitAddon();
    termInstance.current.loadAddon(fitAddon.current);
    termInstance.current.open(terminalRef.current);
    fitAddon.current.fit();

    // Show minimal prompt
    termInstance.current.write("> ");
    prevTerminalOutput.current = "";
    isInitialMount.current = false;

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
  }, [onUserInput]);

  // Update terminal output when it changes
  useEffect(() => {
    if (!termInstance.current || isInitialMount.current) return;
    
    // Only display new content that's been added
    if (terminalOutput && terminalOutput !== prevTerminalOutput.current) {
      const newContent = terminalOutput.replace(prevTerminalOutput.current, "");
      if (newContent) {
        // Write the new content
        termInstance.current.write(newContent);
        
        // Add a prompt on a new line if the content doesn't end with a newline
        if (!newContent.endsWith("\r\n")) {
          termInstance.current.write("\r\n");
        }
        termInstance.current.write("> ");
      }
      prevTerminalOutput.current = terminalOutput;
    }
  }, [terminalOutput]);

  return (
    <div className="terminal-container">
      <div
        ref={terminalRef}
        style={{
          width: "100%",
          height: "100%",
          background: "#f9f9f9",
          padding: "8px",
          boxSizing: "border-box",
          borderTop: "1px solid #ddd",
        }}
      />
    </div>
  );
});

export default TerminalPane;
