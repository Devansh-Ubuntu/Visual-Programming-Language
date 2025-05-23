// src/components/Toolbox.jsx
import * as Blockly from "blockly/core";

const toolbox = {
  kind: "categoryToolbox",
  contents: [
    {
      kind: "category",
      name: "Action",
      colour: "#a66e5b",
      contents: [
        { kind: "block", type: "mascot_walk" },
        { kind: "block", type: "mascot_turn_around" },
        { kind: "block", type: "mascot_cross_road" },
        //{ kind: "block", type: "mascot_flip" },
        { kind: "block", type: "mascot_rotate" },
        { kind: "block", type: "mascot_speak" },
        { kind: "block", type: "mascot_reset" },
        { kind: "block", type: "mascot_set_position" }
      ]
    },
    {
      kind: "category",
      name: "Logic",
      colour: "%{BKY_LOGIC_HUE}",
      contents: [
        { kind: "block", type: "controls_if" },
        { kind: "block", type: "logic_compare" },
        { kind: "block", type: "logic_operation" },
        { kind: "block", type: "logic_boolean" },
        { kind: "block", type: "logic_null" },
        { kind: "block", type: "logic_negate" }
      ]
    },
    {
      kind: "category",
      name: "Loops",
      colour: "%{BKY_LOOPS_HUE}",
      contents: [
        { kind: "block", type: "controls_repeat_ext" },
        { kind: "block", type: "controls_whileUntil" },
        { kind: "block", type: "controls_for" },
        { kind: "block", type: "controls_forEach" },
        { kind: "block", type: "delay_block" },
        { kind: "block", type: "controls_flow_statements" }
      ]
    },
    {
      kind: "category",
      name: "Math",
      colour: "%{BKY_MATH_HUE}",
      contents: [
        { kind: "block", type: "math_number" },
        { kind: "block", type: "math_arithmetic" },
        { kind: "block", type: "math_single" },
        { kind: "block", type: "math_trig" },
        { kind: "block", type: "math_round" },
        { kind: "block", type: "math_modulo" },
        { kind: "block", type: "math_random_int" },
        { kind: "block", type: "math_random_float" },
        { kind: "block", type: "math_constrain" }
      ]
    },
    {
      kind: "category",
      name: "String",
      colour: "%{BKY_TEXTS_HUE}",
      contents: [
        { kind: "block", type: "text" },
        { kind: "block", type: "text_print" },
        { kind: "block", type: "text_prompt" },
        { kind: "block", type: "text_join" },
        { kind: "block", type: "text_length" },
        { kind: "block", type: "text_isEmpty" },
        { kind: "block", type: "text_replace" },
        { kind: "block", type: "text_count" },
        { kind: "block", type: "text_reverse" },
        { kind: "block", type: "text_indexOf" },
        { kind: "block", type: "text_charAt" },
        { kind: "block", type: "text_getSubstring" },
        { kind: "block", type: "text_changeCase" },
        { kind: "block", type: "text_trim" }
      ]
    },
    {
      kind: "category",
      name: "Lists",
      colour: "%{BKY_LISTS_HUE}",
      contents: [
        { kind: "block", type: "lists_create_empty" },
        { kind: "block", type: "lists_create_with" },
        { kind: "block", type: "lists_length" },
        { kind: "block", type: "lists_isEmpty" },
        { kind: "block", type: "lists_indexOf" },
        { kind: "block", type: "get_list_element_safely" },
        { kind: "block", type: "lists_getIndex" },
        { kind: "block", type: "lists_setIndex" },
        { kind: "block", type: "lists_getSublist" },
        { kind: "block", type: "lists_sort" },
        { kind: "block", type: "lists_split" },
        { kind: "block", type: "lists_reverse" }
      ]
    },
    {
      kind: "category",
      name: "Variables",
      colour: "%{BKY_VARIABLES_HUE}",
      custom: "VARIABLE"
    },
    {
      kind: "category",
      name: "Procedures",
      colour: "%{BKY_PROCEDURES_HUE}",
      custom: "PROCEDURE"
    },
  ]
};

export default toolbox;
