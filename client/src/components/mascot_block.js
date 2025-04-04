// src/components/mascot_blocks.js
import * as Blockly from "blockly/core";

export const initMascotBlocks = () => {
  Blockly.defineBlocksWithJsonArray([
    {
      "type": "mascot_walk",
      "message0": "walk %1 steps",
      "args0": [{
        "type": "input_value",
        "name": "STEPS",
        "check": "Number"
      }],
      "previousStatement": null,
      "nextStatement": null,
      "colour": 230,
      "tooltip": "Make the mascot walk the specified number of steps"
    },
    {
      "type": "mascot_flip",
      "message0": "do a flip",
      "previousStatement": null,
      "nextStatement": null,
      "colour": 230,
      "tooltip": "Make the mascot do a 360 degree flip"
    },
    {
      "type": "mascot_rotate",
      "message0": "rotate by %1 degrees",
      "args0": [{
        "type": "input_value",
        "name": "DEGREES",
        "check": "Number"
      }],
      "previousStatement": null,
      "nextStatement": null,
      "colour": 230,
      "tooltip": "Rotate the mascot by specified degrees"
    },
    {
      "type": "mascot_speak",
      "message0": "say %1",
      "args0": [{
        "type": "input_value",
        "name": "MESSAGE",
        "check": "String"
      }],
      "previousStatement": null,
      "nextStatement": null,
      "colour": 230,
      "tooltip": "Make the mascot say something"
    },
    {
      "type": "mascot_reset",
      "message0": "reset position",
      "previousStatement": null,
      "nextStatement": null,
      "colour": 230,
      "tooltip": "Reset the mascot to its starting position"
    }
  ]);

  if (Blockly.JavaScript?.forBlock) {
    Blockly.JavaScript.forBlock['mascot_walk'] = function(block) {
      const steps = Blockly.JavaScript.valueToCode(block, 'STEPS', 
        Blockly.JavaScript.ORDER_ATOMIC) || '0';
      return `mascotCommand({action: 'walk', value: ${steps}});\n`;
    };

    Blockly.JavaScript.forBlock['mascot_flip'] = function() {
      return `mascotCommand({action: 'flip'});\n`;
    };

    Blockly.JavaScript.forBlock['mascot_rotate'] = function(block) {
      const degrees = Blockly.JavaScript.valueToCode(block, 'DEGREES', 
        Blockly.JavaScript.ORDER_ATOMIC) || '90';
      return `mascotCommand({action: 'rotate', value: ${degrees}});\n`;
    };

    Blockly.JavaScript.forBlock['mascot_speak'] = function(block) {
      const message = Blockly.JavaScript.valueToCode(block, 'MESSAGE', 
        Blockly.JavaScript.ORDER_ATOMIC) || "''";
      return `mascotCommand({action: 'speak', value: ${message}});\n`;
    };

    Blockly.JavaScript.forBlock['mascot_reset'] = function() {
      return `mascotCommand({action: 'reset'});\n`;
    };
  } else {
    console.error('Blockly JavaScript generator not available');
  }
};