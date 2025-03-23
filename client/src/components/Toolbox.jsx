// src/components/Toolbox.jsx
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
        { kind: "block", type: "controls_whileUntil" }
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
        { kind: "block", type: "math_trig" }
      ]
    },
    {
      kind: "category",
      name: "Text",
      colour: "%{BKY_TEXTS_HUE}",
      contents: [
        { kind: "block", type: "text" },
        { kind: "block", type: "text_print" }
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

export default toolbox;
