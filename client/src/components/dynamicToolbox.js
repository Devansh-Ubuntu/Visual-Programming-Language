import * as Blockly from "blockly/core";

// Dynamically categorizes registered Blockly blocks into toolbox categories.
function generateDynamicToolbox() {
  const categories = {
    Logic: { colour: "%{BKY_LOGIC_HUE}", blocks: [] },
    Loops: { colour: "%{BKY_LOOPS_HUE}", blocks: [] },
    Math: { colour: "%{BKY_MATH_HUE}", blocks: [] },
    Text: { colour: "%{BKY_TEXTS_HUE}", blocks: [] },
    Lists: { colour: "%{BKY_LISTS_HUE}", blocks: [] },
    // Variables and Functions use Blockly's custom category handling.
    Variables: { colour: "%{BKY_VARIABLES_HUE}", custom: "VARIABLE" },
    Functions: { colour: "%{BKY_PROCEDURES_HUE}", custom: "PROCEDURE" }
  };

  // Iterate over the registered block types in Blockly.Blocks.
  Object.keys(Blockly.Blocks).forEach((blockType) => {
    if (blockType.startsWith("logic_")) {
      categories.Logic.blocks.push({ kind: "block", type: blockType });
    } else if (blockType.startsWith("controls_")) {
      categories.Loops.blocks.push({ kind: "block", type: blockType });
    } else if (blockType.startsWith("math_")) {
      categories.Math.blocks.push({ kind: "block", type: blockType });
    } else if (blockType.startsWith("text_")) {
      categories.Text.blocks.push({ kind: "block", type: blockType });
    } else if (blockType.startsWith("lists_")) {
      categories.Lists.blocks.push({ kind: "block", type: blockType });
    }
  });

  const toolboxConfig = {
    kind: "categoryToolbox",
    contents: Object.keys(categories).map((catName) => {
      const category = categories[catName];
      return category.custom
        ? { kind: "category", name: catName, colour: category.colour, custom: category.custom }
        : { kind: "category", name: catName, colour: category.colour, contents: category.blocks };
    })
  };

  return toolboxConfig;
}

const toolbox = generateDynamicToolbox();
export default toolbox;
