import React, { useRef, useState, useEffect } from "react";
import Header from "./components/Header";
import MainLayout from "./layouts/MainLayout";
import * as Blockly from "blockly"; // ✅ Fix: Import everything as Blockly

import JSInterpreterRunner from "./components/JSInterpreterRunner";
import { saveWorkspace } from "./components/SaveWorkspace";
import { loadWorkspace } from "./components/LoadWorkspace";
import "./App.css";

function App() {
  const [generatedCode, setGeneratedCode] = useState("");
  const [terminalOutput, setTerminalOutput] = useState("");
  const [terminalWidth, setTerminalWidth] = useState(300);
  const [workspaceState, setWorkspaceState] = useState(null);
  const interpreterRef = useRef(null);
  const workspaceRef = useRef(null);

  useEffect(() => {
    // ✅ Inject Blockly into the workspace
    const workspace = Blockly.inject("blocklyDiv", {
        toolbox: document.getElementById("toolbox"), // Ensure you have a toolbox
    });

    workspaceRef.current = workspace; // ✅ Store workspace reference

    console.log("✅ Blockly workspace initialized!");

    return () => workspace.dispose(); // Cleanup on unmount
}, []);
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
    if (interpreterRef.current) {
      interpreterRef.current.stopCode();
    }
  };

  const handleUserInput = (input) => {
    console.log("User input:", input);
    setTerminalOutput((prev) => prev + "\r\nUser input: " + input);
  };

  const handleResize = (event) => {
    setTerminalWidth(event.target.value);
  };

  // Save workspace state to local file.
  const handleSave = () => {
    if (!workspaceRef.current) {
        console.error("❌ Error: workspaceRef is null or not initialized.");
        return;
    }

    try {
        const xmlDom = Blockly.Xml.workspaceToDom(workspaceRef.current);
        const xmlText = Blockly.Xml.domToText(xmlDom);
        
        console.log("✅ XML Data:", xmlText); // Debugging: Check if XML data is valid

        saveWorkspace(xmlText);
    } catch (error) {
        console.error("❌ Error saving workspace:", error);
    }
};


  // Load workspace state from local file.
  const handleLoad = () => {
    loadWorkspace((loadedState) => {
      if (loadedState) {
        setWorkspaceState(loadedState);
        // Restore the workspace as needed (e.g., Blockly.Xml.domToWorkspace(loadedState, workspaceRef.current))
      }
    });
  };

  return (
    <div className="app-container" style={{ display: "flex", height: "100vh" }}>
      <div className="workspace" style={{ flex: 1, transition: "width 0.3s ease" }}>
        <Header onRun={handleRun} onStop={handleStop} onSave={handleSave} onLoad={handleLoad} />
        <MainLayout
          setGeneratedCode={setGeneratedCode}
          terminalOutput={terminalOutput}
          onUserInput={handleUserInput}
        />
      </div>
      <div className="terminal-container" style={{ width: `${terminalWidth}px`, transition: "width 0.3s ease" }}>
        <JSInterpreterRunner
          ref={interpreterRef}
          code={generatedCode}
          setTerminalOutput={setTerminalOutput}
        />
        <input
          type="range"
          min="200"
          max="800"
          value={terminalWidth}
          onChange={handleResize}
          style={{ width: "100%" }}
        />
      </div>
    </div>
  );
}

export default App;
