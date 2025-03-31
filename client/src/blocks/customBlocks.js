//src/blocks/customBlocks.js
import * as Blockly from 'blockly';

Blockly.Blocks['event_trigger'] = {
  init: function () {
    this.appendDummyInput().appendField('When triggered');
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

Blockly.Blocks['print_hello'] = {
  init: function () {
    this.appendDummyInput().appendField('Print Hello');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(160);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};
