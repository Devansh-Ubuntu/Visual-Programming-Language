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
      // Wrap the generated code with the mascotCommand helper.
      const wrappedCode = `
        function mascotCommand(command) {
          if (window.handleMascotCommand) {
            window.handleMascotCommand(command);
          } else {
            console.log("Mascot handler not set");
          }
        }
        ${code}
      `;
      console.log("WorkspacePane: Generated Code:", wrappedCode);
      setGeneratedCode(wrappedCode);
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

  // NEW: Set the global mascot command handler.
  useEffect(() => {
    if (onMascotCommand) {
      window.handleMascotCommand = onMascotCommand;
      console.log("Global mascot handler set:", onMascotCommand);
    }
    return () => {
      delete window.handleMascotCommand;
    };
  }, [onMascotCommand]);

  useEffect(() => {
    if (blocklyDiv.current) {
      workspaceRef.current = Blockly.inject(blocklyDiv.current, {
        toolbox: toolbox,
        trashcan: true,
        scrollbars: true,
      });
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

      // Default block on first load.
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

      // --- Delay calling updateCode by 200ms ---
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
