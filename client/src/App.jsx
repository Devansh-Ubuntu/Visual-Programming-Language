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
import ConsolePane from "./components/ConsolePane";
import "./App.css";

function App() {
  const [generatedCode, setGeneratedCode] = useState("");
  const [terminalOutput, setTerminalOutput] = useState("");
  const [workspaceState, setWorkspaceState] = useState(null);
  const [dockInfo, setDockInfo] = useState({ docked: false, edge: null, dockSize: {} });

  const interpreterRef = useRef(null);
  const terminalPaneRef = useRef(null);
  const workspaceRef = useRef(null);
  const mascotCommandHandler = useRef(null);

  useEffect(() => {
    // Inject Blockly into the workspace.
    const workspace = Blockly.inject("blocklyDiv", {
      toolbox: document.getElementById("toolbox"),
    });
    workspaceRef.current = workspace;
    console.log("✅ Blockly workspace initialized!");
    
    // Set up the mascot command handler
    window.handleMascotCommand = (command) => {
      if (mascotCommandHandler.current) {
        mascotCommandHandler.current(command);
      }
    };
    
    return () => {
      workspace.dispose();
      delete window.handleMascotCommand;
    };
  }, []);

  const handleRun = () => {
    console.log("Run button clicked. Generated code:", generatedCode);
    
    // Wrap the generated code with mascot command handler
    const wrappedCode = `
      function mascotCommand(command) {
        if (window.handleMascotCommand) {
          window.handleMascotCommand(command);
        }
      }
      
      ${generatedCode}
    `;
    
    setTimeout(() => {
      if (interpreterRef.current) {
        interpreterRef.current.setCode(wrappedCode);
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
    console.log("handleSave clicked!");
    const workspace = Blockly.getMainWorkspace();
    if (!workspace) {
      console.error("Error: Blockly workspace is not initialized.");
      return;
    }

    const allBlocks = workspace.getAllBlocks();
    console.log(`Total Blocks in Workspace: ${allBlocks.length}`);
    if (allBlocks.length === 0) {
      console.warn("Warning: No blocks in the workspace to save.");
      return;
    }

    try {
      const xmlDom = Blockly.Xml.workspaceToDom(workspace);
      const xmlText = Blockly.Xml.domToText(xmlDom);
      console.log("Workspace XML:", xmlText);
      saveWorkspace(xmlText, "my_workspace.xml");
    } catch (error) {
      console.error("Error saving workspace:", error);
    }
  };

  const handleLoad = () => {
    loadWorkspace((xmlText) => {
      if (!xmlText) {
        console.warn("No workspace data loaded.");
        return;
      }

      try {
        const workspace = Blockly.getMainWorkspace();
        if (!workspace) {
          throw new Error("Blockly workspace not initialized.");
        }

        if (!Blockly.Xml) {
          throw new Error("Blockly.Xml is not available. Ensure Blockly is correctly imported.");
        }

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
        <ConsolePane 
          onCommand={(handler) => {
            mascotCommandHandler.current = handler;
          }} 
        />
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