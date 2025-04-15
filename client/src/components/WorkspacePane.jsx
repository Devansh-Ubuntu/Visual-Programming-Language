// src/components/WorkspacePane.jsx
import React, { useEffect, useRef, useCallback } from "react";
import * as Blockly from "blockly/core";
import * as libraryBlocks from "blockly/blocks";
import { javascriptGenerator } from "blockly/javascript";
import * as En from "blockly/msg/en";
import toolbox from "./Toolbox";
import "../blocks/customBlocksAndGenerators.js";

Blockly.setLocale(En);

function textToDomPolyfill(xmlText) {
  const parser = new DOMParser();
  return parser.parseFromString(xmlText, "text/xml").documentElement;
}

export default function WorkspacePane({ setGeneratedCode, onWorkspaceChange, onMascotCommand }) {
  const blocklyDiv = useRef(null);
  const workspaceRef = useRef(null);
  const lastXmlRef = useRef("");

  const updateCode = useCallback(() => {
    if (workspaceRef.current && javascriptGenerator.workspaceToCode) {
      const code = javascriptGenerator.workspaceToCode(workspaceRef.current);
      console.log("WorkspacePane: Generated Code:", code);
      setGeneratedCode(code);
    } else {
      console.error("Code generation is not available.");
    }

    if (onWorkspaceChange && workspaceRef.current) {
      const xmlDom = Blockly.Xml.workspaceToDom(workspaceRef.current);
      const xmlText = Blockly.Xml.domToText(xmlDom);
      if (xmlText !== lastXmlRef.current) {
        lastXmlRef.current = xmlText;
        onWorkspaceChange(xmlText);
      }
    }
  }, [setGeneratedCode, onWorkspaceChange]);

  useEffect(() => {
    if (onMascotCommand) {
      window.handleMascotCommand = onMascotCommand;

      window.mascotTurnAround = function() {
        if (window.handleMascotCommand) {
          window.handleMascotCommand({ action: "turnAround" });
        }
      };
  
      window.mascotCrossRoad = function() {
        if (window.handleMascotCommand) {
          window.handleMascotCommand({ action: "crossRoad" });
        }
      };
      
      window.mascotSetPosition = function(x, y) {
        if (window.handleMascotCommand) {
          window.handleMascotCommand({ action: "setPosition", x, y });
        }
      };

      console.log("Global mascot handler and functions set:", onMascotCommand);
    }
    return () => {
      delete window.handleMascotCommand;
      delete window.mascotTurnAround;
      delete window.mascotCrossRoad;
    };
  }, [onMascotCommand]);
  

  useEffect(() => {
    if (blocklyDiv.current) {
      workspaceRef.current = Blockly.inject(blocklyDiv.current, {
        toolbox: toolbox,
        trashcan: true,
        zoom: {
          controls: true,
          wheel: true,
          startScale: 1.0,
          maxScale: 3,
          minScale: 0.3,
          scaleSpeed: 1.2,
          pinch: true
        },
        scrollbars: true,
        grid: {
          spacing: 20,
          length: 2,
          colour: "#8FBC8F",
          snap: true
        }
      });

      window.blocklyWorkspace = workspaceRef.current;

      window.updateBlockField = (blockId, fieldName, value) => {
        const block = window.blocklyWorkspace.getBlockById(blockId);
        if (block) {
          block.setFieldValue(value, fieldName);
          updateCode();
        }
      };

      if (onMascotCommand) {
        window.handleMascotCommand = onMascotCommand;
        console.log("Backup mascot handler set inside Blockly useEffect");
      }
  
      const combinedListener = function(event) {
        if (event.type === Blockly.Events.CHANGE && event.element === 'field') {
          Blockly.hideChaff(true);
          if (Blockly.WidgetDiv && Blockly.WidgetDiv.isVisible()) {
            Blockly.WidgetDiv.hide();
          }
        }
        updateCode();
      };
  
      workspaceRef.current.addChangeListener(combinedListener);
  
      if (workspaceRef.current.getAllBlocks().length === 0) {
        const defaultXML = `
        <xml>
          <block type="mascot_cross_road" x="10" y="10"></block>
        </xml>
      `;      
      
      
        const xmlDom = Blockly.Xml.textToDom ? Blockly.Xml.textToDom(defaultXML) : textToDomPolyfill(defaultXML);
        Blockly.Xml.domToWorkspace(xmlDom, workspaceRef.current);
      }
  
      const timer = setTimeout(() => {
        updateCode();
      }, 200);
  
      return () => {
        clearTimeout(timer);
        workspaceRef.current.removeChangeListener(combinedListener);
        workspaceRef.current.dispose();
      };
    }
  }, [updateCode, setGeneratedCode]);
  
  return (
    <div id="blocklyDiv" className="blockly-workspace" ref={blocklyDiv} />
  );
}
