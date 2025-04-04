//src/blocks/customBlocks.js
import * as Blockly from "blockly/core";

// Input Block
Blockly.Blocks["input_block"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("Enter input:")
      .appendField(new Blockly.FieldTextInput(""), "INPUT_NAME");
    this.setOutput(true, "String");
    this.setColour(230);
    this.setTooltip("Gets user input as a string.");
    this.setHelpUrl("");
  },
};

// Delay Block
Blockly.Blocks["delay_block"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("Delay for")
      .appendField(new Blockly.FieldNumber(1, 0, Infinity, 0.1), "DELAY_TIME")
      .appendField("seconds");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(120);
    this.setTooltip("Pauses execution for a given time.");
    this.setHelpUrl("");
  },
};

Blockly.Blocks['get_list_element_safely'] = {
  init: function() {
      this.appendValueInput("LIST")
          .setCheck("Array")
          .appendField("Get element from list");
      
      this.appendValueInput("INDEX")
          .setCheck("Number")
          .appendField("at index");

      this.setOutput(true, null);
      this.setColour(230);
      this.setTooltip("Gets an element from a list, but throws an error for negative or zero index.");
      this.setHelpUrl("");
  }
};


// Export the blocks so they can be imported in other files
export { Blockly };
