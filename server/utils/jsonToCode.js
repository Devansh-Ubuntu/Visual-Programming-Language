// server/utils/jsonToCode.js
const Blockly = require("blockly");

try {
  require("blockly/javascript_compressed.js");
} catch (e) {
  console.error("Error loading javascript_compressed.js:", e);
}

function jsonToCode(jsonData) {
  if (!jsonData || !jsonData.blocks) {
    throw new Error("Invalid workspace JSON");
  }
  const workspace = new Blockly.Workspace();
  Blockly.serialization.workspaces.load(jsonData, workspace);
  const code = Blockly.JavaScript.workspaceToCode(workspace);
  return code;
}

module.exports = { jsonToCode };
