//src/blocks/custom_generator.js
import { javascriptGenerator } from "blockly/javascript";

javascriptGenerator['input_block'] = function(block) {
  var textInput = block.getFieldValue('INPUT_NAME');
  var code = '"' + textInput + '"';
  return [code, javascriptGenerator.ORDER_ATOMIC];
};

javascriptGenerator['delay_block'] = function(block) {
  var delayTime = block.getFieldValue('DELAY_TIME');
  var code = `delay(${delayTime});\n`;
  return code;
};
javascriptGenerator['get_list_element_safely'] = function(block) {
  var list = javascriptGenerator.valueToCode(block, 'LIST', javascriptGenerator.ORDER_ATOMIC) || '[]';
  var index = javascriptGenerator.valueToCode(block, 'INDEX', javascriptGenerator.ORDER_ATOMIC) || '1';
  var code = `
    (function() {
      if (${index} <= 0 || ${index} > ${list}.length) {
          throw new Error("Invalid index: Must be between 1 and " + ${list}.length);
      }
      return ${list}[${index} - 1];
    })()
  `;
  return [code, javascriptGenerator.ORDER_FUNCTION_CALL];
};