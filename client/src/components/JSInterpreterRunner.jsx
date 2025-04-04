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
