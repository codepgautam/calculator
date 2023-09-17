const CalculatorHistory = require("../models/calculator");

const initCalculator = async (req, res) => {
    res.send('init')
};

const performOperation = async (req, res) => {
};

const undoOperation = async (req, res) => {
};

const resetCalculator = async (req, res) => {
};

module.exports = {
  initCalculator,
  performOperation,
  undoOperation,
  resetCalculator,
};
