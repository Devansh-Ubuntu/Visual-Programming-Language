// src/blocks/customBlocksAndGenerators.js
import * as Blockly from "blockly/core";
import { javascriptGenerator } from "blockly/javascript";

// --- Block Definitions ---

// Input Block
Blockly.Blocks["input_block"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("Enter input");
    this.setOutput(true, "String");
    this.setColour(150);
    this.setTooltip("Asks user for input from a prompt or terminal.");
    // Link to MDN documentation for window.prompt.
    this.setHelpUrl("https://developer.mozilla.org/en-US/docs/Web/API/Window/prompt");
  },
};

// Delay Block
Blockly.Blocks["delay_block"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("Delay for")
      // Field name is "DELAY_TIME"
      .appendField(new Blockly.FieldNumber(1, 0, Infinity, 0.1), "DELAY_TIME")
      .appendField("seconds");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(120);
    this.setTooltip("Pauses execution for a given time.");
    // Link to MDN documentation on setTimeout.
    this.setHelpUrl("https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout");
  },
};

// Get List Element Safely Block
Blockly.Blocks["get_list_element_safely"] = {
  init: function () {
    this.appendValueInput("LIST")
      .setCheck("Array")
      .appendField("Get element from list");
    
    this.appendValueInput("INDEX")
      .setCheck("Number")
      .appendField("at index");

    this.setOutput(true, null);
    this.setColour(240);
    // Updated tooltip for clarity.
    this.setTooltip("Gets an element from a list safely. Throws an error for invalid (negative or zero) index values.");
    // Link to MDN documentation on JavaScript Arrays.
    this.setHelpUrl("https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array");
  }
};

// --- Code Generators ---
// For Blockly 11.2.1, custom generators should be registered on javascriptGenerator.forBlock.

// Generator for Input Block
javascriptGenerator.forBlock["input_block"] = function(block) {
  // Generate code that calls getInput(), no 'await' keyword.
  const code = "getInput()";
  // Return it as a value block.
  return [code, javascriptGenerator.ORDER_FUNCTION_CALL];
};

// Generator for Delay Block
javascriptGenerator.forBlock['delay_block'] = function(block) {
  // IMPORTANT: Must match "DELAY_TIME" from the block definition.
  const delayTime = block.getFieldValue('DELAY_TIME') || 1;
  // Multiply by 1000 to convert seconds to ms.
  const code = `delay(${delayTime * 1000});\n`;
  return code;
};

// Generator for Get List Element Safely Block
javascriptGenerator.forBlock["get_list_element_safely"] = function(block) {
  const list = javascriptGenerator.valueToCode(block, "LIST", javascriptGenerator.ORDER_ATOMIC) || "[]";
  const index = javascriptGenerator.valueToCode(block, "INDEX", javascriptGenerator.ORDER_ATOMIC) || "1";
  const code = `
    (function() {
      if (${index} <= 0 || ${index} > ${list}.length) {
          throw new Error("Invalid index: Must be between 1 and " + ${list}.length);
      }
      return ${list}[${index} - 1];
    })()
  `;
  return [code, javascriptGenerator.ORDER_FUNCTION_CALL];
};

export { Blockly };
