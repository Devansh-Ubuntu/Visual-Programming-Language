import React, { useRef, useState, useEffect } from "react";
import Header from "./components/Header";
import MainLayout from "./layouts/MainLayout";
import * as Blockly from "blockly"; 

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
    // Inject Blockly into the workspace
    const workspace = Blockly.inject("blocklyDiv", {
        toolbox: document.getElementById("toolbox"), // Ensure you have a toolbox
    });

    workspaceRef.current = workspace; //  Store workspace reference

    console.log(" Blockly workspace initialized!");

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
    console.log(" handleSave clicked!");

    //  Ensure workspaceRef is valid
    const workspace = Blockly.getMainWorkspace(); // Use this to always get the active workspace

    if (!workspace) {
        console.error(" Error: Blockly workspace is not initialized.");
        return;
    }

    //  Check the number of blocks in the workspace
    const allBlocks = workspace.getAllBlocks();
    console.log(` Total Blocks in Workspace: ${allBlocks.length}`);

    if (allBlocks.length === 0) {
        console.warn(" Warning: No blocks in the workspace to save.");
        return;
    }

    try {
        // Convert the workspace to XML format
        const xmlDom = Blockly.Xml.workspaceToDom(workspace);
        const xmlText = Blockly.Xml.domToText(xmlDom);

        console.log(" Workspace XML:", xmlText);
        
        // Save workspace using the function
        saveWorkspace(xmlText, "my_workspace.xml");

    } catch (error) {
        console.error(" Error saving workspace:", error);
    }
};




  // Load workspace state from local file.
  const handleLoad = () => {
    loadWorkspace((xmlText) => {
        if (!xmlText) {
            console.warn(" No workspace data loaded.");
            return;
        }

        try {
            const workspace = Blockly.getMainWorkspace();
            if (!workspace) {
                throw new Error("Blockly workspace not initialized.");
            }

            // FIX: Ensure Blockly.Xml exists before using it
            if (!Blockly.Xml) {
                throw new Error("Blockly.Xml is not available. Ensure Blockly is correctly imported.");
            }

            //  FIX: Correctly parse XML
            const parser = new DOMParser();
            const xmlDom = parser.parseFromString(xmlText, "text/xml");

            //  Clear the workspace before loading
            workspace.clear();

            //  FIX: Load the blocks into the workspace
            Blockly.Xml.domToWorkspace(xmlDom.documentElement, workspace);

            console.log(" Workspace loaded successfully!");

        } catch (err) {
            console.error(" Error loading workspace:", err);
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
