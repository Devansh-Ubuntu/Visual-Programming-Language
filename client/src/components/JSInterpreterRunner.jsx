// src/components/JSInterpreterRunner.jsx
import React, { useImperativeHandle, forwardRef } from "react";

const JSInterpreterRunner = forwardRef(({ code, setTerminalOutput }, ref) => {
  useImperativeHandle(
    ref,
    () => {
      let stopRequested = false; // flag

      return {
        runCode() {
          if (!code || !code.trim()) {
            setTerminalOutput("No code provided!\n");
            return;
          }
          setTerminalOutput("");
          stopRequested = false;
          try {
            const interpreter = new window.Interpreter(code, (interpreter, scope) => {
              const logFn = interpreter.createNativeFunction((text) => {
                setTerminalOutput((prev) => prev + text.toString() + "\n");
              });
              interpreter.setProperty(scope, "console", { log: logFn });
              const alertFn = interpreter.createNativeFunction((text) => {
                setTerminalOutput((prev) => prev + text.toString() + "\n");
              });
              interpreter.setProperty(scope, "alert", alertFn);
            });
            function step() {
              if (stopRequested) return;
              try {
                if (interpreter.step()) {
                  setTimeout(step, 1);
                }
              } catch (err) {
                setTerminalOutput((prev) => prev + "Interpreter error: " + err + "\n");
              }
            }
            step();
          } catch (error) {
            setTerminalOutput("Error initializing interpreter: " + error);
          }
        },
        stopCode() {
          stopRequested = true;
        }
      };
    },
    [code, setTerminalOutput]
  );

  return null;
});

export default JSInterpreterRunner;
