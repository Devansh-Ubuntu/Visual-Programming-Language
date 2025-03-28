import React, { useEffect, useRef, useCallback } from "react";
import * as Blockly from "blockly/core";
import * as libraryBlocks from "blockly/blocks";
import { javascriptGenerator } from "blockly/javascript";
import * as En from "blockly/msg/en";
import toolbox from "./Toolbox.jsx";

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
      // Only update if the XML has changed
      if (xmlText !== lastXmlRef.current) {
        lastXmlRef.current = xmlText;
        onWorkspaceChange(xmlText);
      }
    }
  }, [setGeneratedCode, onWorkspaceChange]);

  useEffect(() => {
    if (blocklyDiv.current) {
      workspaceRef.current = Blockly.inject(blocklyDiv.current, {
        toolbox: toolbox,
        trashcan: true,
        scrollbars: true,
      });

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
        const xmlDom = Blockly.Xml.textToDom
          ? Blockly.Xml.textToDom(defaultXML)
          : textToDomPolyfill(defaultXML);
        Blockly.Xml.domToWorkspace(xmlDom, workspaceRef.current);
      }

      workspaceRef.current.addChangeListener(updateCode);
      updateCode();

      return () => {
        workspaceRef.current.removeChangeListener(updateCode);
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
