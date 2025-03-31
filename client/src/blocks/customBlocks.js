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
// Stack Implementation
Blockly.Blocks['stack_push'] = {
  init: function () {
    this.appendValueInput("VALUE").setCheck(null).appendField("Push to Stack");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(120);
    this.setTooltip("Push an element onto the stack.");
  }
};

Blockly.Blocks['stack_pop'] = {
  init: function () {
    this.appendDummyInput().appendField("Pop from Stack");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(120);
    this.setTooltip("Remove the top element from the stack.");
  }
};

// Queue Implementation
Blockly.Blocks['queue_enqueue'] = {
  init: function () {
    this.appendValueInput("VALUE").setCheck(null).appendField("Enqueue to Queue");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(180);
    this.setTooltip("Add an element to the back of the queue.");
  }
};

Blockly.Blocks['queue_dequeue'] = {
  init: function () {
    this.appendDummyInput().appendField("Dequeue from Queue");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(180);
    this.setTooltip("Remove the front element from the queue.");
  }
};

// Linked List Implementation
Blockly.Blocks['linkedlist_insert'] = {
  init: function () {
    this.appendValueInput("VALUE").setCheck(null).appendField("Insert in Linked List");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(220);
    this.setTooltip("Insert an element into the linked list.");
  }
};

Blockly.Blocks['linkedlist_delete'] = {
  init: function () {
    this.appendValueInput("VALUE").setCheck(null).appendField("Delete from Linked List");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(220);
    this.setTooltip("Delete an element from the linked list.");
  }
};

// Doubly Linked List Implementation
Blockly.Blocks['doublylist_insert'] = {
  init: function () {
    this.appendValueInput("VALUE").setCheck(null).appendField("Insert in Doubly Linked List");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(260);
    this.setTooltip("Insert an element into the doubly linked list.");
  }
};

Blockly.Blocks['doublylist_delete'] = {
  init: function () {
    this.appendValueInput("VALUE").setCheck(null).appendField("Delete from Doubly Linked List");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(260);
    this.setTooltip("Delete an element from the doubly linked list.");
  }
};
