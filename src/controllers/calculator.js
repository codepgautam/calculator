const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const calculatorInstances = {}; 

class Calculator {
    constructor() {
        this.currentResult = 0;
        this.totalOps = 0;
        this.operationHistory = [];
        this.undoHistory = [];
    }

    performOperation(operator, num1, num2) {

        // Clear redo history when a new operation is performed
        this.undoHistory = [];

        switch (operator) {
            case 'add':
                this.currentResult = num1 + num2;
                break;
            case 'subtract':
                this.currentResult = num1 - num2;
                break;
            case 'multiply':
                this.currentResult = num1 * num2;
                break;
            case 'divide':
                if (num2 === 0) {
                    throw new Error("Division by zero is not allowed");
                }
                this.currentResult = num1 / num2;
                break;
            default:
                throw new Error("Invalid operator");
        }
        this.totalOps++;
        this.operationHistory.push({ operator, num1, num2 });
    }

    undo() {
        if (this.operationHistory.length > 0) {
            const lastOperation = this.operationHistory.pop();
            const { operator, num1, num2 } = lastOperation;
            this.undoHistory.push({ operator, num1, num2 });
            this.performOperation(this.invertOperator(operator), num1, num2);
            this.totalOps--;
        }
    }

    reset() {
        this.currentResult = 0;
        this.totalOps = 0;
        this.operationHistory = [];
    }

    invertOperator(operator) {
        switch (operator) {
            case 'add':
                return 'subtract';
            case 'subtract':
                return 'add';
            case 'multiply':
                return 'divide';
            case 'divide':
                return 'multiply';
            default:
                throw new Error("Invalid operator");
        }
    }
}


const initCalculator = async (req, res) => {
    let { operator, num1, num2 } = req.body;
    
    // Convert num1 and num2 to floating-point numbers
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
    console.log('calculator', calculator)
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
