// src/components/JSInterpreterRunner.jsx
import React, { useImperativeHandle, forwardRef } from "react";
import Interpreter from "js-interpreter";

const JSInterpreterRunner = forwardRef(({ code, setTerminalOutput, onPendingInput }, ref) => {
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
          // Don't clear the terminal output
          // setTerminalOutput("");
          stopRequested = false;

          try {
            // Create an instance of js-interpreter with your code
            const interpreter = new Interpreter(code, (interpreter, scope) => {
              // Create a native function for console.log.
              const logFn = interpreter.createNativeFunction((text) => {
                setTerminalOutput((prev) => prev + String(text) + "\r\n");
              });
              const consoleObj = interpreter.createObject(null);
              interpreter.setProperty(scope, "console", consoleObj);
              interpreter.setProperty(consoleObj, "log", logFn);

              // Create a native function for alert.
              const alertFn = interpreter.createNativeFunction((text) => {
                setTerminalOutput((prev) => prev + String(text) + "\r\n");
              });
              interpreter.setProperty(scope, "alert", alertFn);

              // Create a native function for delay.
              const delayFn = interpreter.createAsyncFunction((ms, callback) => {
                setTimeout(callback, ms);
              });
              interpreter.setProperty(scope, "delay", delayFn);

              // Create a native function for prompt that uses the browser popup.
              const promptFn = interpreter.createAsyncFunction((promptMsg, callback) => {
                const userInput = window.prompt(promptMsg || "Enter input:");
                callback(userInput);
              });
              interpreter.setProperty(scope, "prompt", promptFn);

              // Override window.alert and window.prompt on the global window object.
              const windowObj = interpreter.getProperty(scope, "window");
              interpreter.setProperty(windowObj, "alert", alertFn);
              interpreter.setProperty(windowObj, "prompt", promptFn);

              // Also override global alert/prompt.
              interpreter.setProperty(scope, "alert", alertFn);
              interpreter.setProperty(scope, "prompt", promptFn);

              // ---- NEW: Inject mascotCommand native function ----
              // This function will convert the interpreter object to a native object
              // and then call the corresponding global function.
              const mascotCommandNative = interpreter.createNativeFunction((command) => {
                // Convert the interpreter's object to a native JS object.
                const nativeCommand = interpreter.pseudoToNative(command);
                if (nativeCommand && nativeCommand.action) {
                  switch (nativeCommand.action) {
                    case "walk":
                      if (window.mascotWalk) {
                        window.mascotWalk(nativeCommand.value);
                      }
                      break;
                    case "flip":
                      if (window.mascotFlip) {
                        window.mascotFlip();
                      }
                      break;
                    case "rotate":
                      if (window.mascotRotate) {
                        window.mascotRotate(nativeCommand.value);
                      }
                      break;
                    case "speak":
                      if (window.mascotSpeak) {
                        window.mascotSpeak(nativeCommand.message, nativeCommand.duration);
                      }
                      break;
                    case "reset":
                      if (window.mascotReset) {
                        window.mascotReset();
                      }
                      break;
                    case "turnAround":
                    if (window.mascotTurnAround) {
                      window.mascotTurnAround();
                    }
                    break;
                    case "crossRoad":
                    if (window.mascotCrossRoad) {
                      window.mascotCrossRoad();
                    }
                    break;
                    case "setPosition":
                      if (window.mascotSetPosition) {
                        window.mascotSetPosition(nativeCommand.x, nativeCommand.y);
                      }
                      break;
                    default:
                      console.error("Unknown mascot command", nativeCommand);
                  }
                }
              });
              interpreter.setProperty(scope, "mascotCommand", mascotCommandNative);
            });

            function step() {
              if (stopRequested) return;
              try {
                if (interpreter.step()) {
                  setTimeout(step, 1);
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
