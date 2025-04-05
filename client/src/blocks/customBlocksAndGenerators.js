// src/blocks/customBlocksAndGenerators.js
import * as Blockly from "blockly/core";
import { javascriptGenerator } from "blockly/javascript";

// --- Input, Delay, Safe‑Get Blocks (unchanged) ---

// Input Block
Blockly.Blocks["input_block"] = {
  init: function () {
    this.appendDummyInput().appendField("Enter input");
    this.setOutput(true, "String");
    this.setColour(150);
    this.setTooltip("Asks user for input from a prompt or terminal.");
    this.setHelpUrl("https://developer.mozilla.org/en-US/docs/Web/API/Window/prompt");
  },
};
javascriptGenerator.forBlock["input_block"] = function (block) {
  return ["getInput()", javascriptGenerator.ORDER_FUNCTION_CALL];
};

// Delay Block
Blockly.Blocks["delay_block"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("Delay for")
      .appendField(new Blockly.FieldNumber(1, 0, Infinity, 0.1), "DELAY_TIME")
      .appendField("seconds");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(120);
    this.setTooltip("Pauses execution for a given time.");
    this.setHelpUrl("https://developer.mozilla.org/en-US/docs/Web/API/setTimeout");
  },
};
javascriptGenerator.forBlock["delay_block"] = function (block) {
  const secs = block.getFieldValue("DELAY_TIME") || 1;
  return `delay(${secs * 1000});\n`;
};

// Safe‑Get List Element Block
Blockly.Blocks["get_list_element_safely"] = {
  init: function () {
    this.appendValueInput("LIST")
      .setCheck("Array")
      .appendField("Get element from list");
    this.appendValueInput("INDEX")
      .setCheck("Number")
      .appendField("at index");
    this.setOutput(true);
    this.setColour(240);
    this.setTooltip("Gets an element from a list safely.");
    this.setHelpUrl("https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array");
  },
};
javascriptGenerator.forBlock["get_list_element_safely"] = function (block) {
  const list = javascriptGenerator.valueToCode(block, "LIST", javascriptGenerator.ORDER_ATOMIC) || "[]";
  const index = javascriptGenerator.valueToCode(block, "INDEX", javascriptGenerator.ORDER_ATOMIC) || "1";
  const code = `
(function() {
  if (${index} <= 0 || ${index} > ${list}.length) {
    throw new Error("Invalid index");
  }
  return ${list}[${index} - 1];
})()
`;
  return [code, javascriptGenerator.ORDER_FUNCTION_CALL];
};

// --- Mascot Blocks & Generators ---

Blockly.defineBlocksWithJsonArray([
  {
    type: "mascot_walk",
    message0: "walk %1 steps",
    args0: [{ type: "input_value", name: "STEPS", check: "Number" }],
    previousStatement: null,
    nextStatement: null,
    colour: 230,
    tooltip: "Make the mascot walk the specified number of steps",
  },
  {
    type: "mascot_flip",
    message0: "do a flip",
    previousStatement: null,
    nextStatement: null,
    colour: 230,
    tooltip: "Make the mascot do a 360° flip",
  },
  {
    type: "mascot_rotate",
    message0: "rotate by %1 degrees",
    args0: [{ type: "input_value", name: "DEGREES", check: "Number" }],
    previousStatement: null,
    nextStatement: null,
    colour: 230,
    tooltip: "Rotate the mascot by specified degrees",
  },
  {
    type: "mascot_speak",
    message0: "say %1 for %2 seconds",
    args0: [
      { type: "input_value", name: "MESSAGE", check: "String" },
      { type: "input_value", name: "DURATION", check: "Number" },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 230,
    tooltip: "Make the mascot say something for a given number of seconds",
  },
  {
    type: "mascot_reset",
    message0: "reset position",
    previousStatement: null,
    nextStatement: null,
    colour: 230,
    tooltip: "Reset the mascot to its starting position",
  },
]);

javascriptGenerator.forBlock["mascot_walk"] = function (block) {
  const steps = javascriptGenerator.valueToCode(block, "STEPS", javascriptGenerator.ORDER_ATOMIC) || "0";
  return `mascotCommand({ action: 'walk', value: ${steps} });\n`;
};

javascriptGenerator.forBlock["mascot_flip"] = function () {
  return `mascotCommand({ action: 'flip' });\n`;
};

javascriptGenerator.forBlock["mascot_rotate"] = function (block) {
  const deg = javascriptGenerator.valueToCode(block, "DEGREES", javascriptGenerator.ORDER_ATOMIC) || "90";
  return `mascotCommand({ action: 'rotate', value: ${deg} });\n`;
};

javascriptGenerator.forBlock["mascot_speak"] = function (block) {
  const msg = javascriptGenerator.valueToCode(block, "MESSAGE", javascriptGenerator.ORDER_ATOMIC) || "''";
  const dur = javascriptGenerator.valueToCode(block, "DURATION", javascriptGenerator.ORDER_ATOMIC) || "1";
  return `mascotCommand({ action: 'speak', message: ${msg}, duration: ${dur} });\n`;
};

javascriptGenerator.forBlock["mascot_reset"] = function () {
  return `mascotCommand({ action: 'reset' });\n`;
};

// No need to export anything special—just import this file once for side effects.
