// src/App.jsx
import React, { useRef, useState, useEffect } from "react";
import Header from "./components/Header";
import MainLayout from "./layouts/MainLayout";
import JSInterpreterRunner from "./components/JSInterpreterRunner";
import "./App.css";

function App() {
  const [generatedCode, setGeneratedCode] = useState("");
  const [terminalOutput, setTerminalOutput] = useState("");
  const interpreterRef = useRef(null);

  useEffect(() => {
    console.log("Generated code updated:", generatedCode);
  }, [generatedCode]);

  const handleRun = () => {
    console.log("At Run button, generated code:", generatedCode);
    setTimeout(() => {
      if (interpreterRef.current) {
        interpreterRef.current.runCode();
      } else {
        console.error("Interpreter not available!");
      }
    }, 100);
  };

  const handleStop = () => {
    console.log("Stop clicked");
    // Implement stop functionality as needed.
  };

  // Handle user input from the terminal
  const handleUserInput = (input) => {
    console.log("User input:", input);
    // For demonstration, we just append it to terminal output.
    setTerminalOutput((prev) => prev + "\r\nUser input: " + input);
  };

  return (
    <div className="app-container">
      <Header onRun={handleRun} onStop={handleStop} />
      <MainLayout
        setGeneratedCode={setGeneratedCode}
        terminalOutput={terminalOutput}
        onUserInput={handleUserInput}
      />
      <div style={{ marginTop: "20px" }}>
        <h3>Interpreter</h3>
        <JSInterpreterRunner
          ref={interpreterRef}
          code={generatedCode}
          setTerminalOutput={setTerminalOutput}
        />
      </div>
      <div>
        <h4>Generated Code:</h4>
        <pre>{generatedCode}</pre>
      </div>
    </div>
  );
}

export default App;
