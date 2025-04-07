// src/blocks/customBlocksAndGenerators.js
import * as Blockly from "blockly/core";
import { javascriptGenerator } from "blockly/javascript";

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

Blockly.Blocks["get_list_element_safely"] = {
  init: function () {
    this.appendValueInput("LIST")
      .setCheck("Array")
      .appendField("Get element from list");
    this.appendValueInput("INDEX")
      .setCheck("Number")
      .appendField("at index");
    this.setOutput(true);
    this.setColour(265);
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


Blockly.defineBlocksWithJsonArray([
  {
    "type": "mascot_walk",
    "message0": "walk %1 steps",
    "args0": [
      {
        "type": "field_number",
        "name": "STEPS",
        "value": 10
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 15,
    "tooltip": "Make the mascot walk the specified number of steps"
  },
  {
    "type": "mascot_flip",
    "message0": "do a flip",
    "previousStatement": null,
    "nextStatement": null,
    "colour": 15,
    "tooltip": "Make the mascot do a 360° flip"
  },
  {
    "type": "mascot_rotate",
    "message0": "rotate by %1 degrees",
    "args0": [
      {
        "type": "field_number",
        "name": "DEGREES",
        "value": 90
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 15,
    "tooltip": "Rotate the mascot by specified degrees"
  },
  {
    "type": "mascot_speak",
    "message0": "say %1 for %2 seconds",
    "args0": [
      {
        "type": "input_value",
        "name": "MESSAGE",
      },
      {
        "type": "field_number",
        "name": "DURATION",
        "value": 1,
        "min": 0
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 15,
    "tooltip": "Make the mascot say something for a given number of seconds"
  },  
  {
    "type": "mascot_reset",
    "message0": "reset position",
    "previousStatement": null,
    "nextStatement": null,
    "colour": 15,
    "tooltip": "Reset the mascot to its starting position"
  },
  {
    "type": "mascot_turn_around",
    "message0": "turn around",
    "previousStatement": null,
    "nextStatement": null,
    "colour": 15,
    "tooltip": "Flip the spirit horizontally"
  },
  {
    "type": "mascot_cross_road",
    "message0": "cross the road",
    "previousStatement": null,
    "nextStatement": null,
    "colour": 15,
    "tooltip": "Make the mascot cross the road"
  },
  {
    "type": "mascot_set_position",
    "message0": "set position to x: %1 y: %2",
    "args0": [
      {
        "type": "field_number",
        "name": "X",
        "value": 50
      },
      {
        "type": "field_number",
        "name": "Y",
        "value": 50
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 15,
    "tooltip": "Set the mascot's position to the given x and y coordinates"
  }
  
]);

javascriptGenerator.forBlock["mascot_walk"] = function (block) {
  const steps = block.getFieldValue("STEPS") || "0";
  return `mascotCommand({ action: 'walk', value: ${steps} });\n`;
};

javascriptGenerator.forBlock["mascot_flip"] = function () {
  return `mascotCommand({ action: 'flip' });\n`;
};

javascriptGenerator.forBlock["mascot_rotate"] = function (block) {
  const deg = block.getFieldValue("DEGREES") || "90";
  return `mascotCommand({ action: 'rotate', value: ${deg} });\n`;
};

javascriptGenerator.forBlock["mascot_speak"] = function (block) {
  const msg = javascriptGenerator.valueToCode(block, "MESSAGE", javascriptGenerator.ORDER_ATOMIC) || "''";
  const dur = block.getFieldValue("DURATION") || "1";
  return `mascotCommand({ action: 'speak', message: ${msg}, duration: ${dur} });\n`;
};

javascriptGenerator.forBlock["mascot_reset"] = function () {
  return `mascotCommand({ action: 'reset' });\n`;
};

javascriptGenerator.forBlock["mascot_turn_around"] = function () {
  return `mascotCommand({ action: 'turnAround' });\n`;
};

javascriptGenerator.forBlock["mascot_cross_road"] = function () {
  return `mascotCommand({ action: 'crossRoad' });\n`;
};

javascriptGenerator.forBlock["mascot_set_position"] = function(block) {
  const x = block.getFieldValue("X") || "0";
  const y = block.getFieldValue("Y") || "0";
  return `mascotCommand({ action: 'setPosition', x: ${x}, y: ${y} });\n`;
};