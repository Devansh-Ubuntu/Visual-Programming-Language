// src/components/JSInterpreterRunner.jsx
import React, { useState, useImperativeHandle, forwardRef } from "react";

const JSInterpreterRunner = forwardRef(({ code }, ref) => {
  const [output, setOutput] = useState("");

  useImperativeHandle(
    ref,
    () => ({
      runCode() {
        if (!code || !code.trim()) {
          console.error("No code to run!");
          setOutput("No code provided!");
          return;
        }
        setOutput("");
        console.log("Executing Code:", code);

        try {
          const interpreter = new window.Interpreter(code, (interpreter, scope) => {
            console.log("JS-Interpreter Initialized");
            const logFn = interpreter.createNativeFunction(function (text) {
              const logText = text.toString();
              console.log("Interpreter log:", logText);
              setOutput((prev) => prev + logText + "\n");
            });
            const consoleObj = { log: logFn };
            interpreter.setProperty(scope, "console", consoleObj);

            const alertFn = interpreter.createNativeFunction(function (text) {
              alert(text);
            });
            interpreter.setProperty(scope, "alert", alertFn);
          });

          function step() {
            try {
              if (interpreter.step()) {
                console.log("Step executed");
                setTimeout(step, 50);
              } else {
                console.log("Execution finished.");
                setOutput((prev) => prev + "Execution finished.\n");
              }
            } catch (err) {
              console.error("Interpreter error during step:", err);
              setOutput((prev) => prev + "Interpreter error: " + err + "\n");
            }
          }
          step();
        } catch (error) {
          console.error("Error initializing interpreter:", error);
          setOutput("Error initializing interpreter: " + error);
        }
      }
    }),
    [code]
  );

  return (
    <div>
      <h3>Interpreter Output:</h3>
      <pre style={{ background: "#222", color: "#0f0", padding: "10px" }}>
        {output}
      </pre>
    </div>
  );
});

export default JSInterpreterRunner;
