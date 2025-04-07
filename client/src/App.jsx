// src/App.jsx
import React, { useRef, useState, useCallback, useEffect } from "react";
import Header from "./components/Header";
import MainLayout from "./layouts/MainLayout";
import * as Blockly from "blockly";
import JSInterpreterRunner from "./components/JSInterpreterRunner";
import { saveWorkspace } from "./components/SaveWorkspace";
import { loadWorkspace } from "./components/LoadWorkspace";
import TerminalPane from "./components/TerminalPane";
import ConsolePane from "./components/ConsolePane"; 
import ChatWidget from "./components/ChatWidget";
import "./App.css";

function App() {
  const [generatedCode, setGeneratedCode] = useState("");
  const [terminalOutput, setTerminalOutput] = useState("");
  const [dockInfo, setDockInfo] = useState({ docked: false, edge: null, dockSize: {} });
  const [pendingInputCallback, setPendingInputCallback] = useState(null);
  const [mascotHandler, setMascotHandler] = useState(null);

  const interpreterRef = useRef(null);
  const terminalPaneRef = useRef(null);
  const workspaceRef = useRef(null);

  useEffect(() => {
    const workspace = Blockly.inject("blocklyDiv", {
      toolbox: document.getElementById("toolbox"),
    });
    workspaceRef.current = workspace;
    console.log("Blockly workspace initialized!");
    return () => workspace.dispose();
  }, []);

  const clearTerminal = () => {
    setTerminalOutput("");
  };

  const handleRun = () => {
    console.log("Run button clicked");
    clearTerminal();
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
    if (mascotHandler) {
      mascotHandler({ action: "stop" });
    }
  };

  const handleUserInput = (input) => {
    console.log("User input:", input);
    if (input.trim().toLowerCase() === "clear") {
      clearTerminal();
      return;
    }
    setTerminalOutput(prev => prev + "\r\nUser input: " + input);
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
    if (dockInfo.edge === "left") workspaceStyle.marginLeft = dockInfo.dockSize.width;
    else if (dockInfo.edge === "right") workspaceStyle.marginRight = dockInfo.dockSize.width;
    else if (dockInfo.edge === "top") workspaceStyle.marginTop = dockInfo.dockSize.height;
    else if (dockInfo.edge === "bottom") workspaceStyle.marginBottom = dockInfo.dockSize.height;
  }

  const handleCommandFromConsole = useCallback((handleCommand) => {
    console.log("Setting mascot handler:", handleCommand);
    setMascotHandler(() => handleCommand);
  }, []);

  return (
    <div className="app-container">
      <Header 
        onRun={handleRun} 
        onStop={handleStop} 
        onSave={handleSave} 
        onLoad={handleLoad} 
      />
      <div className="main-content">
        <div className="left-panel">
          <div className="stage-panel">
            <ConsolePane onCommand={handleCommandFromConsole} />
          </div>
  
          <div className="terminal-panel">
            <div className="terminal-container">
              <div className="terminal-header">Output Terminal</div>
              <TerminalPane
                ref={terminalPaneRef}
                terminalOutput={terminalOutput}
                onUserInput={handleUserInput}
                pendingInputCallback={pendingInputCallback}
                clearPendingInputCallback={() => setPendingInputCallback(null)}
              />
              <JSInterpreterRunner
                ref={interpreterRef}
                code={generatedCode}
                setTerminalOutput={setTerminalOutput}
              />
            </div>
          </div>
        </div>
  
        <div className="workspace-panel" style={workspaceStyle}>
          <MainLayout
            setGeneratedCode={setGeneratedCode}
            onWorkspaceChange={undefined}
            onMascotCommand={mascotHandler}
          />
        </div>
      </div>
      <ChatWidget />
    </div>
  );
  
}

export default App;
