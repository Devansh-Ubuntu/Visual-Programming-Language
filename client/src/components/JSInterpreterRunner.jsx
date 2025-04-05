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

              // Create a native function for delay
              const delayFn = interpreter.createAsyncFunction((ms, callback) => {
                setTimeout(callback, ms);
              });
              interpreter.setProperty(scope, "delay", delayFn);

              // Create a native function for getInput
              const getInputFn = interpreter.createAsyncFunction((callback) => {
                const userInput = window.prompt("Enter input:");
                callback(userInput);
              });
              interpreter.setProperty(scope, "getInput", getInputFn);
            });
            
            function step() {
              if (stopRequested) {
                return;
              }
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
