import React, { useImperativeHandle, forwardRef } from "react";
import Interpreter from "js-interpreter";

const JSInterpreterRunner = forwardRef(({ code, setTerminalOutput }, ref) => {
  useImperativeHandle(
    ref,
    () => {
      let stopRequested = false; // flag

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
