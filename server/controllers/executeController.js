// server/controllers/executeController.js
const { executeCode } = require("../utils/executeCode");

exports.executeCodeController = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code || !code.trim()) {
      return res.status(400).json({ error: "No code provided" });
    }
    console.log("Backend received code:", code);
    const output = await executeCode(code);
    res.json({ output });
  } catch (error) {
    console.error("Error in executeCodeController:", error);
    res.status(500).json({ error: error.message });
  }
};
