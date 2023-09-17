const CalculatorHistory = require("../models/calculator");
const { CalculatorInstances, CalculatorOperation } = require('../models/calculator');

function validateInitRequest(req, res) {
    const { operator, num1, num2 } = req.body;

    if (!operator || !num1 || !num2) {
        return res.status(400).json({ error: 'Missing required fields: operator, num1, or num2' });
    } 

    const validOperators = ['add', 'subtract', 'multiply', 'divide'];
    if (!validOperators.includes(operator)) {
        return res.status(400).json({ error: 'Invalid operator' });
    }

    return req.body;
}

const initCalculator = async (req, res) => {
    const { operator, num1, num2 } = validateInitRequest(req, res)

    const calculatorInstance = await CalculatorInstances.create({
        result: num1,
        totalOps: 1,
    })

    await CalculatorOperation.create({
        calculatorId: calculatorInstance.id,
        operator: operator.toUpperCase(),
        num: num2
    })

    let result;
    switch (operator) {
      case 'add':
        result = num1 + num2;
        break;
      case 'subtract':
        result = num1 - num2;
        break;
      case 'multiply':
        result = num1 * num2;
        break;
      case 'divide':
        result = num1 / num2;
        break;
      default:
        return res.status(400).json({ error: 'Invalid operator' });
    }

    return res.status(200).json({
        result: result,
        totalOps: operation.totalOps,
        Id: operation.id,
      });
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
