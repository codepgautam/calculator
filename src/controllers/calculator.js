const { Calculator } = require('../models/calculator')

const calculatorInstances = {}; 

const initCalculator = async (req, res) => {
    let { operator, num1, num2 } = req.body;
    
    num1 = parseFloat(num1);
    num2 = parseFloat(num2);

    if (isNaN(num1) || isNaN(num2)) {
        res.status(400).json({ error: 'Invalid num1 or num2 value' });
    } else {
        const calculator = new Calculator();
        calculator.performOperation(operator, num1, num2);
        const id = new Date().valueOf();
        calculatorInstances[id] = calculator;
        res.json({
            result: calculator.currentResult,
            totalOps: calculator.totalOps,
            Id: id,
        });
    }
};

const performOperation = async (req, res) => {
    let { operator, num, id } = req.body;

    num = parseFloat(num);

    if (isNaN(num)) {
        res.status(400).json({ error: 'Invalid num value' });
        return;
    }

    const calculator = calculatorInstances[id];
    if (!calculator) {
        res.status(404).json({ error: 'Calculator not found' });
    } else {
        calculator.performOperation(operator, calculator.currentResult, num);
        res.json({
            result: calculator.currentResult,
            totalOps: calculator.totalOps,
            Id: id,
        });
    }
};

const undoOperation = async (req, res) => {
    const { id } = req.body;
    const calculator = calculatorInstances[id];
    if (!calculator) {
        res.status(404).json({ error: 'Calculator not found' });
    } else {
        calculator.undo();
        res.json({
            result: calculator.currentResult,
            totalOps: calculator.totalOps,
        });
    }
};

const resetCalculator = async (req, res) => {
    const { id } = req.query;
    const calculator = calculatorInstances[id];
    if (!calculator) {
        res.status(404).json({ error: 'Calculator not found' });
    } else {
        calculator.reset();
        res.json({
            success: true,
            message: `Calculator ${id} is now reset`,
        });
    }
};

module.exports = {
    initCalculator,
    performOperation,
    undoOperation,
    resetCalculator
}
