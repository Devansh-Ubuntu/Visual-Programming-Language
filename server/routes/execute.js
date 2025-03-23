const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
    res.json({ message: "Execute API working!" });
});

module.exports = router;
