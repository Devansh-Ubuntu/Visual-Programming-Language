// src/components/JSInterpreterRunner.jsx
import React, { useImperativeHandle, forwardRef } from "react";

const JSInterpreterRunner = forwardRef(({ code, setTerminalOutput }, ref) => {
  useImperativeHandle(
    ref,
    () => ({
      runCode() {
        if (!code || !code.trim()) {
          console.error("No code to run!");
          setTerminalOutput("No code provided!\n");
          return;
        }
        // Clear previous output
        setTerminalOutput("");
        console.log("Executing Code:", code);

        try {
          // Run code in a sandbox using JS-Interpreter (assumed to be loaded on window)
          const interpreter = new window.Interpreter(code, (interpreter, scope) => {
            console.log("JS-Interpreter Initialized");
            // Override console.log
            const logFn = interpreter.createNativeFunction(function (text) {
              const logText = text.toString();
              console.log("Interpreter log:", logText);
              setTerminalOutput((prev) => prev + logText + "\n");
            });
            const consoleObj = { log: logFn };
            interpreter.setProperty(scope, "console", consoleObj);

            // Replace alert with terminal output
            const alertFn = interpreter.createNativeFunction(function (text) {
              const alertText = "ALERT: " + text.toString();
              setTerminalOutput((prev) => prev + alertText + "\n");
            });
            interpreter.setProperty(scope, "alert", alertFn);

            // Optionally, you can define a custom prompt function to support input.
            // For example:
            // const promptFn = interpreter.createNativeFunction(function(text) {
            //   // Implement a mechanism to fetch input from your TerminalPane,
            //   // perhaps via a callback or a Promise.
            // });
            // interpreter.setProperty(scope, "prompt", promptFn);
          });

          // Step through the interpreter to simulate real-time terminal output.
          function step() {
            try {
              if (interpreter.step()) {
                console.log("Step executed");
                setTimeout(step, 50);
              } else {
                console.log("Execution finished.");
                setTerminalOutput((prev) => prev + "Execution finished.\n");
              }
            } catch (err) {
              console.error("Interpreter error during step:", err);
              setTerminalOutput((prev) => prev + "Interpreter error: " + err + "\n");
            }
          }
          step();
        } catch (error) {
          console.error("Error initializing interpreter:", error);
          setTerminalOutput("Error initializing interpreter: " + error);
        }
      }
    }),
    [code, setTerminalOutput]
  );

  // No UI rendered here—the terminal output is now managed in TerminalPane.
  return null;
});

export default JSInterpreterRunner;
