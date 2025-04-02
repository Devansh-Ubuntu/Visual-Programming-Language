import React, { useRef, useState, useEffect } from "react";
import Header from "./components/Header";
import MainLayout from "./layouts/MainLayout";
import * as Blockly from "blockly";
import JSInterpreterRunner from "./components/JSInterpreterRunner";
import { saveWorkspace } from "./components/SaveWorkspace";
import { loadWorkspace } from "./components/LoadWorkspace";
import DraggableTerminal from "./components/DraggableTerminal";
import "./App.css";

function App() {
  const [generatedCode, setGeneratedCode] = useState("");
  const [terminalOutput, setTerminalOutput] = useState("");
  const [workspaceState, setWorkspaceState] = useState(null);
  // State for docking info: when the terminal docks, we store the edge and its size.
  const [dockInfo, setDockInfo] = useState({ docked: false, edge: null, dockSize: {} });

  const interpreterRef = useRef(null);
  const workspaceRef = useRef(null);

  useEffect(() => {
    // Inject Blockly into the workspace.
    const workspace = Blockly.inject("blocklyDiv", {
      toolbox: document.getElementById("toolbox"), // Ensure you have a toolbox
    });
    workspaceRef.current = workspace;
    console.log("✅ Blockly workspace initialized!");
    return () => workspace.dispose();
  }, []);

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

  const handleSave = () => {
    if (!workspaceRef.current) {
      console.error("❌ Error: workspaceRef is null or not initialized.");
      return;
    }
    try {
      const xmlDom = Blockly.Xml.workspaceToDom(workspaceRef.current);
      const xmlText = Blockly.Xml.domToText(xmlDom);
      console.log("✅ XML Data:", xmlText);
      saveWorkspace(xmlText);
    } catch (error) {
      console.error("❌ Error saving workspace:", error);
    }
  };

  const handleLoad = () => {
    loadWorkspace((loadedState) => {
      if (loadedState) {
        setWorkspaceState(loadedState);
        // Optionally restore the workspace using: Blockly.Xml.domToWorkspace(loadedState, workspaceRef.current)
      }
    });
  };

  // Dynamically adjust the workspace style based on docking.
  const workspaceStyle = {
    flex: 1,
    transition: "all 0.3s ease",
  };

  if (dockInfo.docked) {
    if (dockInfo.edge === "left") {
      workspaceStyle.marginLeft = dockInfo.dockSize.width;
    } else if (dockInfo.edge === "right") {
      workspaceStyle.marginRight = dockInfo.dockSize.width;
    } else if (dockInfo.edge === "top") {
      workspaceStyle.marginTop = dockInfo.dockSize.height;
    } else if (dockInfo.edge === "bottom") {
      workspaceStyle.marginBottom = dockInfo.dockSize.height;
    }
  }

  return (
    <div className="app-container" style={{ display: "flex", height: "100vh", width: "100vw" }}>
      <div className="workspace" style={workspaceStyle}>
        <Header onRun={handleRun} onStop={handleStop} onSave={handleSave} onLoad={handleLoad} />
        <MainLayout
          setGeneratedCode={setGeneratedCode}
          terminalOutput={terminalOutput}
          onUserInput={handleUserInput}
        />
      </div>

      {/* The dockable terminal */}
      <DraggableTerminal
        terminalOutput={terminalOutput}
        onUserInput={handleUserInput}
        onDockChange={(info) => setDockInfo(info)}
      >
        <JSInterpreterRunner
          ref={interpreterRef}
          code={generatedCode}
          setTerminalOutput={setTerminalOutput}
        />
      </DraggableTerminal>
    </div>
  );
}

export default App;
