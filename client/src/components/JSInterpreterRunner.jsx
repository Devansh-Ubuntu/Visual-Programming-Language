import React, { useImperativeHandle, forwardRef } from "react";
import Interpreter from "js-interpreter";

const JSInterpreterRunner = forwardRef(({ code, setTerminalOutput }, ref) => {
  useImperativeHandle(
    ref,
    () => {
      let stopRequested = false;

      return {
        runCode() {
          if (!code || !code.trim()) {
            setTerminalOutput("No code provided!\n");
            return;
          }
          stopRequested = false;

          try {
            const interpreter = new Interpreter(code, (interpreter, scope) => {
              const logFn = interpreter.createNativeFunction((text) => {
                setTerminalOutput((prev) => prev + String(text) + "\r\n");
              });
              const consoleObj = interpreter.createObject(null);
              interpreter.setProperty(scope, "console", consoleObj);
              interpreter.setProperty(consoleObj, "log", logFn);

              const alertFn = interpreter.createNativeFunction((text) => {
                setTerminalOutput((prev) => prev + String(text) + "\r\n");
              });
              interpreter.setProperty(scope, "alert", alertFn);

              const delayFn = interpreter.createAsyncFunction((ms, callback) => {
                setTimeout(callback, ms);
              });
              interpreter.setProperty(scope, "delay", delayFn);

              const promptFn = interpreter.createAsyncFunction((promptMsg, callback) => {
                const userInput = window.prompt(promptMsg || "Enter input:");
                callback(userInput);
              });
              interpreter.setProperty(scope, "prompt", promptFn);

              const windowObj = interpreter.getProperty(scope, "window");
              interpreter.setProperty(windowObj, "alert", alertFn);
              interpreter.setProperty(windowObj, "prompt", promptFn);
              interpreter.setProperty(scope, "alert", alertFn);
              interpreter.setProperty(scope, "prompt", promptFn);

              const mascotCommandNative = interpreter.createAsyncFunction((command, doneCallback) => {
                if (stopRequested) {
                  doneCallback();
                  return;
                }
                const nativeCommand = interpreter.pseudoToNative(command);
                if (nativeCommand && nativeCommand.action) {
                  if (window.handleMascotCommand) {
                    window.handleMascotCommand(nativeCommand, () => {
                      doneCallback();
                    });
                  } else {
                    doneCallback();
                  }
                } else {
                  doneCallback();
                }
              });
              interpreter.setProperty(scope, "mascotCommand", mascotCommandNative);
            });

            // function step() {
            //   if (stopRequested) return;
            //   try {
            //     if (interpreter.step()) {
            //       setTimeout(step, 1);
            //     }
            //   } catch (err) {
            //     setTerminalOutput((prev) => prev + "Interpreter error: " + err + "\r\n");
            //     console.error("Interpreter error:", err);
            //   }
            // }

            function step() {
              try {
                let steps = 0;
                const maxStepsPerBatch = 1000;
            
                while (steps < maxStepsPerBatch && interpreter.step() && !stopRequested) {
                  steps++;
                }
            
                if (!stopRequested && interpreter.step()) {
                  setTimeout(step, 0);
                }
              } catch (err) {
                setTerminalOutput((prev) => prev + "Interpreter error: " + err + "\r\n");
                console.error("Interpreter error:", err);
              }
            }
            
            step();
          } catch (error) {
            setTerminalOutput("Error initializing interpreter: " + error + "\r\n");
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
