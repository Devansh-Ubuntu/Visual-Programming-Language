import React, { useImperativeHandle, forwardRef, useRef } from "react";
import Interpreter from "js-interpreter";

const JSInterpreterRunner = forwardRef(({ code, setTerminalOutput }, ref) => {
  useImperativeHandle(ref, () => ({
    runCode() {
      if (!code || !code.trim()) {
        setTerminalOutput("No code provided!\n");
        return;
      }
      setTerminalOutput("");

<<<<<<< HEAD
      return {
        runCode() {
          if (!code || !code.trim()) {
            return;
          }
          stopRequested = false;
          try {
            const interpreter = new Interpreter(code, (interpreter, scope) => {
              // Create a native function for console.log
              const logFn = interpreter.createNativeFunction((text) => {
                setTerminalOutput((prev) => prev + String(text) + "\r\n");
              });
              interpreter.setProperty(scope, "console", interpreter.createObject(null));
              interpreter.setProperty(scope.properties.console, "log", logFn);
              
              // Create a native function for alert
              const alertFn = interpreter.createNativeFunction((text) => {
                setTerminalOutput((prev) => prev + String(text) + "\r\n");
              });
              interpreter.setProperty(scope, "alert", alertFn);
            });
            
            function step() {
              if (stopRequested) {
                return;
              }
              try {
                if (interpreter.step()) {
                  setTimeout(step, 1);
                } else {
                }
              } catch (err) {
                console.error("Interpreter error:", err);
              }
            }
            step();
          } catch (error) {
            console.error("Error initializing interpreter:", error);
=======
      try {
        const interpreter = new Interpreter(code, (interpreter, scope) => {
          // 1) console.log
          const logFn = interpreter.createNativeFunction((text) => {
            setTerminalOutput((prev) => prev + String(text) + "\n");
          });
          interpreter.setProperty(scope, "console", { log: logFn });

          // 2) alert
          const alertFn = interpreter.createNativeFunction((text) => {
            setTerminalOutput((prev) => prev + String(text) + "\n");
          });
          interpreter.setProperty(scope, "alert", alertFn);

          // 3) delay (optional)
          const delayFn = interpreter.createAsyncFunction((ms, callback) => {
            setTimeout(callback, ms);
          });
          interpreter.setProperty(scope, "delay", delayFn);

          // 4) getInput -> calls window.prompt for input
          const getInputFn = interpreter.createAsyncFunction((callback) => {
            // You can replace window.prompt with your custom terminal logic
            const userInput = window.prompt("Enter input:");
            // Return the user input
            callback(userInput);
          });
          interpreter.setProperty(scope, "getInput", getInputFn);
        });

        // Step the interpreter
        function step() {
          try {
            if (interpreter.step()) {
              setTimeout(step, 1);
            }
          } catch (err) {
            setTerminalOutput((prev) => prev + "Interpreter error: " + err + "\n");
>>>>>>> ea0347fc2ba36603b32e0408d98cf1b7a0e5d7b1
          }
        }
        step();
      } catch (error) {
        setTerminalOutput("Error initializing interpreter: " + error);
      }
    },

    stopCode() {
      // If needed, implement logic to stop stepping the interpreter
    },
  }));

  return null;
});

export default JSInterpreterRunner;
