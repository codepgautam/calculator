const express = require("express");
const router = express.Router();
const calculatorController = require("../controllers/calculator");

router.post("/init", calculatorController.initCalculator);
router.post("/operation", calculatorController.performOperation);
router.put("/undo", calculatorController.undoOperation);
router.get("/reset", calculatorController.resetCalculator);

module.exports = router;
