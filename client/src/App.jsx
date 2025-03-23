// src/App.jsx
import React, { useRef, useState, useEffect } from "react";
import Header from "./components/Header";
import MainLayout from "./layouts/MainLayout";
import JSInterpreterRunner from "./components/JSInterpreterRunner";
import "./App.css";

function App() {
  const [generatedCode, setGeneratedCode] = useState("");
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

  return (
    <div className="app-container">
      <Header onRun={handleRun} onStop={() => alert("Stop clicked!")} />
      <MainLayout setGeneratedCode={setGeneratedCode} />
      <div style={{ marginTop: "20px" }}>
        <h3>Interpreter</h3>
        <JSInterpreterRunner ref={interpreterRef} code={generatedCode} />
      </div>
      <div>
        <h4>Generated Code:</h4>
        <pre>{generatedCode}</pre>
      </div>
    </div>
  );
}

export default App;
