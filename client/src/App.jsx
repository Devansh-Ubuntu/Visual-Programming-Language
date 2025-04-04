// src/App.jsx
import React, { useRef, useState, useEffect } from "react";
import Header from "./components/Header";
import MainLayout from "./layouts/MainLayout";
import * as Blockly from "blockly";
import JSInterpreterRunner from "./components/JSInterpreterRunner";
import { saveWorkspace } from "./components/SaveWorkspace";
import { loadWorkspace } from "./components/LoadWorkspace";
import DraggableTerminal from "./components/DraggableTerminal";
import TerminalPane from "./components/TerminalPane";
import "./App.css";

function App() {
  const [generatedCode, setGeneratedCode] = useState("");
  const [terminalOutput, setTerminalOutput] = useState("");
  const [dockInfo, setDockInfo] = useState({ docked: false, edge: null, dockSize: {} });

  const interpreterRef = useRef(null);
  const terminalPaneRef = useRef(null);
  const workspaceRef = useRef(null);

  // Inject Blockly workspace on mount.
  useEffect(() => {
    const workspace = Blockly.inject("blocklyDiv", {
      toolbox: document.getElementById("toolbox"),
    });
    workspaceRef.current = workspace;
    return () => workspace.dispose();
  }, []);

  // Run button handler: call the interpreter's runCode method.
  const handleRun = () => {
    console.log("Run button clicked. Generated code:", generatedCode);
    setTimeout(() => {
      if (interpreterRef.current) {
        interpreterRef.current.runCode();
      } else {
        console.error("Interpreter not available!");
      }
    }, 100);
  };

  // Stop button handler.
  const handleStop = () => {
    console.log("Stop clicked");
    if (interpreterRef.current) {
      interpreterRef.current.stopCode();
    }
  };

  // User input coming from the TerminalPane.
  const handleUserInput = (input) => {
    console.log("User input:", input);
    setTerminalOutput((prev) => prev + "\r\nUser input: " + input);
    // Forward input to interpreter if available.
    if (interpreterRef.current && interpreterRef.current.handleUserInput) {
      interpreterRef.current.handleUserInput(input);
    }
  };

  // Save workspace state to file.
  const handleSave = () => {
    const workspace = Blockly.getMainWorkspace();
    if (!workspace) {
      console.error("Error: Blockly workspace is not initialized.");
      return;
    }
    const allBlocks = workspace.getAllBlocks();
    if (allBlocks.length === 0) {
      console.warn("Warning: No blocks in the workspace to save.");
      return;
    }
    try {
      const xmlDom = Blockly.Xml.workspaceToDom(workspace);
      const xmlText = Blockly.Xml.domToText(xmlDom);
      saveWorkspace(xmlText, "my_workspace.xml");
    } catch (error) {
      console.error("Error saving workspace:", error);
    }
  };

  // Load workspace state from file.
  const handleLoad = () => {
    loadWorkspace((xmlText) => {
      if (!xmlText) return;
      try {
        const workspace = Blockly.getMainWorkspace();
        if (!workspace) throw new Error("Blockly workspace not initialized.");
        const parser = new DOMParser();
        const xmlDom = parser.parseFromString(xmlText, "text/xml");
        workspace.clear();
        Blockly.Xml.domToWorkspace(xmlDom.documentElement, workspace);
        console.log("Workspace loaded successfully!");
      } catch (err) {
        console.error("Error loading workspace:", err);
      }
    });
  };

  // Adjust workspace layout based on docking.
  const workspaceStyle = { flex: 1, transition: "all 0.3s ease" };
  if (dockInfo.docked) {
    if (dockInfo.edge === "left") workspaceStyle.marginLeft = dockInfo.dockSize.width;
    else if (dockInfo.edge === "right") workspaceStyle.marginRight = dockInfo.dockSize.width;
    else if (dockInfo.edge === "top") workspaceStyle.marginTop = dockInfo.dockSize.height;
    else if (dockInfo.edge === "bottom") workspaceStyle.marginBottom = dockInfo.dockSize.height;
  }

  return (
    <div className="app-container" style={{ display: "flex", height: "100vh", width: "100vw" }}>
      <div className="workspace" style={workspaceStyle}>
        <Header onRun={handleRun} onStop={handleStop} onSave={handleSave} onLoad={handleLoad} />
        <MainLayout setGeneratedCode={setGeneratedCode} terminalOutput={terminalOutput} />
      </div>

      {/* Dockable terminal component */}
      <DraggableTerminal
        terminalOutput={terminalOutput}
        onUserInput={handleUserInput}
        onDockChange={(info) => setDockInfo(info)}
        terminalPaneRef={terminalPaneRef}
      >
        <>
          <TerminalPane
            ref={terminalPaneRef}
            terminalOutput={terminalOutput}
            onUserInput={handleUserInput}
          />
          <JSInterpreterRunner
            ref={interpreterRef}
            code={generatedCode}
            setTerminalOutput={setTerminalOutput}
          />
        </>
      </DraggableTerminal>
    </div>
  );
}

export default App;
