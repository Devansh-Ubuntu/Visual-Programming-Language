// src/components/WorkspacePane.jsx
import React, { useEffect, useRef, useCallback } from "react";
import * as Blockly from "blockly/core";
import * as libraryBlocks from "blockly/blocks";
import { javascriptGenerator } from "blockly/javascript";
import * as En from "blockly/msg/en";
import toolbox from "./Toolbox";

Blockly.setLocale(En);

function textToDomPolyfill(xmlText) {
  const parser = new DOMParser();
  return parser.parseFromString(xmlText, "text/xml").documentElement;
}

export default function WorkspacePane({ setGeneratedCode, onWorkspaceChange }) {
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
    if (blocklyDiv.current) {
      // Inject Blockly workspace
      workspaceRef.current = Blockly.inject(blocklyDiv.current, {
        toolbox: toolbox,
        trashcan: true,
        scrollbars: true,
      });

      // Combined change listener: update code and hide stray widgets
      const combinedListener = function(event) {
        // If a field (like dropdown) changes, hide any stray widget
        if (event.type === Blockly.Events.CHANGE && event.element === 'field') {
          Blockly.hideChaff(true);
          if (Blockly.WidgetDiv && Blockly.WidgetDiv.isVisible()) {
            Blockly.WidgetDiv.hide();
          }
        }
        // Always update the code after any event.
        updateCode();
      };

      workspaceRef.current.addChangeListener(combinedListener);

      // Load default block if workspace is empty
      if (workspaceRef.current.getAllBlocks().length === 0) {
        const defaultXML = `
          <xml>
            <block type="text_print" x="10" y="10">
              <value name="TEXT">
                <shadow type="text">
                  <field name="TEXT">Hello World</field>
                </shadow>
              </value>
            </block>
          </xml>
        `;
        const xmlDom = Blockly.Xml.textToDom ? Blockly.Xml.textToDom(defaultXML) : textToDomPolyfill(defaultXML);
        Blockly.Xml.domToWorkspace(xmlDom, workspaceRef.current);
      }

      // Initial code update
      updateCode();

      // Cleanup on unmount
      return () => {
        workspaceRef.current.removeChangeListener(combinedListener);
        workspaceRef.current.dispose();
      };
    }
  }, [updateCode, setGeneratedCode]);

  return (
    <div
      id="blocklyDiv"
      style={{ width: "100%", height: "calc(100vh - 40px)" }}
      ref={blocklyDiv}
    />
  );
}
