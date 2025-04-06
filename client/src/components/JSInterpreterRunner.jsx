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
          setTerminalOutput("");
          stopRequested = false;

          try {
            // Create an instance of js-interpreter with your code
            const interpreter = new Interpreter(code, (interpreter, scope) => {
              // console.log
              const logFn = interpreter.createNativeFunction((text) => {
                setTerminalOutput((prev) => prev + String(text) + "\r\n");
              });
              const consoleObj = interpreter.createObject(null);
              interpreter.setProperty(scope, "console", consoleObj);
              interpreter.setProperty(consoleObj, "log", logFn);

              // alert
              const alertFn = interpreter.createNativeFunction((text) => {
                setTerminalOutput((prev) => prev + String(text) + "\r\n");
              });
              interpreter.setProperty(scope, "alert", alertFn);

              // delay
              const delayFn = interpreter.createAsyncFunction((ms, callback) => {
                setTimeout(callback, ms);
              });
              interpreter.setProperty(scope, "delay", delayFn);

              // prompt
              const promptFn = interpreter.createAsyncFunction((promptMsg, callback) => {
                const userInput = window.prompt(promptMsg || "Enter input:");
                callback(userInput);
              });
              interpreter.setProperty(scope, "prompt", promptFn);

              // override window.alert and window.prompt
              const windowObj = interpreter.getProperty(scope, "window");
              interpreter.setProperty(windowObj, "alert", alertFn);
              interpreter.setProperty(windowObj, "prompt", promptFn);
              interpreter.setProperty(scope, "alert", alertFn);
              interpreter.setProperty(scope, "prompt", promptFn);

              // ---- Asynchronous mascotCommand ----
              // This ensures the interpreter waits for each command to finish.
              const mascotCommandNative = interpreter.createAsyncFunction((command, doneCallback) => {
                if (stopRequested) {
                  // If we already requested stop, just return
                  doneCallback();
                  return;
                }
                const nativeCommand = interpreter.pseudoToNative(command);
                if (nativeCommand && nativeCommand.action) {
                  if (window.handleMascotCommand) {
                    // Pass the doneCallback so the mascot can call it when done.
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
