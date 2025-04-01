import * as Blockly from "blockly/core";

// Explicit block definitions with tooltips
// (If these blocks are not already defined elsewhere, they will be registered here.)
// Blockly.Blocks["controls_if"] = {
//   init() {
//     this.jsonInit({
//       message0: "if %1 then %2",
//       args0: [
//         { type: "input_value", name: "IF0", check: "Boolean" },
//         { type: "input_statement", name: "DO0" }
//       ],
//       previousStatement: null,
//       nextStatement: null,
//       colour: "%{BKY_LOGIC_HUE}",
//       tooltip: "If condition is true, then do statements.",
//       helpUrl: ""
//     });
//   }
// };

// Blockly.Blocks["logic_compare"] = {
//   init() {
//     this.jsonInit({
//       message0: "%1 %2 %3",
//       args0: [
//         { type: "input_value", name: "A" },
//         {
//           type: "field_dropdown",
//           name: "OP",
//           options: [
//             ["=", "EQ"],
//             ["\u2260", "NEQ"],
//             ["<", "LT"],
//             ["\u2264", "LTE"],
//             [">", "GT"],
//             ["\u2265", "GTE"]
//           ]
//         },
//         { type: "input_value", name: "B" }
//       ],
//       inputsInline: true,
//       output: "Boolean",
//       colour: "%{BKY_LOGIC_HUE}",
//       tooltip: "Compare two values.",
//       helpUrl: ""
//     });
//   }
// };

// Blockly.Blocks["logic_operation"] = {
//   init() {
//     this.jsonInit({
//       message0: "%1 %2 %3",
//       args0: [
//         { type: "input_value", name: "A", check: "Boolean" },
//         {
//           type: "field_dropdown",
//           name: "OP",
//           options: [
//             ["and", "AND"],
//             ["or", "OR"]
//           ]
//         },
//         { type: "input_value", name: "B", check: "Boolean" }
//       ],
//       inputsInline: true,
//       output: "Boolean",
//       colour: "%{BKY_LOGIC_HUE}",
//       tooltip: "Logical operation on two booleans.",
//       helpUrl: ""
//     });
//   }
// };

// Blockly.Blocks["logic_boolean"] = {
//   init() {
//     this.jsonInit({
//       message0: "%1",
//       args0: [
//         {
//           type: "field_dropdown",
//           name: "BOOL",
//           options: [
//             ["true", "TRUE"],
//             ["false", "FALSE"]
//           ]
//         }
//       ],
//       output: "Boolean",
//       colour: "%{BKY_LOGIC_HUE}",
//       tooltip: "Boolean value: true or false.",
//       helpUrl: ""
//     });
//   }
// };

// Blockly.Blocks["logic_negate"] = {
//   init() {
//     this.jsonInit({
//       message0: "not %1",
//       args0: [{ type: "input_value", name: "BOOL", check: "Boolean" }],
//       output: "Boolean",
//       colour: "%{BKY_LOGIC_HUE}",
//       tooltip: "Logical negation.",
//       helpUrl: ""
//     });
//   }
// };

// Additional blocks can be defined in a similar fashion.
// For brevity, only a few key blocks are explicitly defined here.
// It’s assumed that many of the core blocks (math_number, controls_repeat_ext, etc.)
// are already defined in your Blockly installation.

// Hybrid Toolbox Configuration
const toolbox = {
  kind: "categoryToolbox",
  contents: [
    {
      kind: "category",
      name: "Logic",
      colour: "%{BKY_LOGIC_HUE}",
      contents: [
        { kind: "block", type: "controls_if" },
        { kind: "block", type: "logic_compare" },
        { kind: "block", type: "logic_operation" },
        { kind: "block", type: "logic_boolean" },
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
        { kind: "block", type: "text_join" },
        { kind: "block", type: "text_length" },
        { kind: "block", type: "text_isEmpty" },
        { kind: "block", type: "text_indexOf" },
        { kind: "block", type: "text_charAt" },
        { kind: "block", type: "text_getSubstring" },
        { kind: "block", type: "text_changeCase" },
        { kind: "block", type: "text_trim" },
        { kind: "block", type: "text_prompt" }
      ]
    },
    {
      kind: "category",
      name: "Lists",
      colour: "%{BKY_LISTS_HUE}",
      contents: [
        { kind: "block", type: "lists_create_empty" },
        { kind: "block", type: "lists_create_with" },
        { kind: "block", type: "lists_repeat" },
        { kind: "block", type: "lists_length" },
        { kind: "block", type: "lists_isEmpty" },
        { kind: "block", type: "lists_indexOf" },
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
    }
  ]
};

// Dynamic fallback: any block not already in the static toolbox
const staticTypes = new Set();
toolbox.contents.forEach(cat => {
  if (cat.contents) {
    cat.contents.forEach(block => staticTypes.add(block.type));
  }
});

const extras = [];
Object.keys(Blockly.Blocks).forEach(type => {
  if (!staticTypes.has(type)) {
    // Only include blocks that follow known naming conventions
    if (
      type.startsWith("logic_") ||
      type.startsWith("controls_") ||
      type.startsWith("math_") ||
      type.startsWith("text_") ||
      type.startsWith("lists_")
    ) {
      extras.push({ kind: "block", type });
    }
  }
});
if (extras.length) {
  toolbox.contents.push({
    kind: "category",
    name: "Extras",
    colour: "#999999",
    contents: extras
  });
}

export default toolbox;
