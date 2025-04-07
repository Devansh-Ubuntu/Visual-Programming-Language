// src/components/TerminalPane.jsx
import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import { Terminal as XTerminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";

const TerminalPane = forwardRef(
  ({ terminalOutput, onUserInput, pendingInputCallback, clearPendingInputCallback }, ref) => {
    const terminalRef = useRef(null);
    const termInstance = useRef(null);
    const fitAddon = useRef(null);
    const [inputBuffer, setInputBuffer] = useState("");
    const prevTerminalOutput = useRef("");
    const isInitialMount = useRef(true);

    useImperativeHandle(ref, () => ({
      resizeTerminal: () => {
        if (fitAddon.current) fitAddon.current.fit();
      },
    }));

    useEffect(() => {
      termInstance.current = new XTerminal({
        cursorBlink: true,
        convertEol: true,
        theme: {
          background: "#f9f9f9",
          foreground: "#3a3a3a",
        },
      });
      fitAddon.current = new FitAddon();
      termInstance.current.loadAddon(fitAddon.current);
      termInstance.current.open(terminalRef.current);
      fitAddon.current.fit();

      termInstance.current.write("> ");
      prevTerminalOutput.current = "";
      isInitialMount.current = false;

      const disposeData = termInstance.current.onData((data) => {
        if (data === "\r") {
          termInstance.current.write("\r\n");

          if (pendingInputCallback) {
            pendingInputCallback(inputBuffer);
            clearPendingInputCallback();
          } else if (onUserInput) {
            onUserInput(inputBuffer);
          }

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
    }, [onUserInput, pendingInputCallback, clearPendingInputCallback]);

    useEffect(() => {
      if (!termInstance.current || isInitialMount.current) return;
      if (terminalOutput && terminalOutput !== prevTerminalOutput.current) {
        const newContent = terminalOutput.replace(prevTerminalOutput.current, "");
        if (newContent) {
          termInstance.current.write("\r\n" + newContent);
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
  }
);

export default TerminalPane;
