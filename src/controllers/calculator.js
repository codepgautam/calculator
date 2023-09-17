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
    }

    performOperation(operator, num) {
        switch (operator) {
            case 'add':
                this.currentResult += num;
                break;
            case 'subtract':
                this.currentResult -= num;
                break;
            case 'multiply':
                this.currentResult *= num;
                break;
            case 'divide':
                if (num === 0) {
                    throw new Error("Division by zero is not allowed");
                }
                this.currentResult /= num;
                break;
            default:
                throw new Error("Invalid operator");
        }
        this.totalOps++;
        this.operationHistory.push({ operator, num });
    }

    undo() {
        if (this.operationHistory.length > 0) {
            const lastOperation = this.operationHistory.pop();
            const { operator, num } = lastOperation;
            switch (operator) {
                case 'add':
                    this.currentResult -= num;
                    break;
                case 'subtract':
                    this.currentResult += num;
                    break;
                case 'multiply':
                    this.currentResult /= num;
                    break;
                case 'divide':
                    this.currentResult *= num;
                    break;
            }
            this.totalOps--;
        }
    }

    reset() {
        this.currentResult = 0;
        this.totalOps = 0;
        this.operationHistory = [];
    }
}


const initCalculator = async (req, res) => {
    const { operator, num1, num2 } = req.body;
    const calculator = new Calculator();
    calculator.performOperation(operator, num1);
    calculator.performOperation(operator, num2);
    const id = Math.random().toString(36).substr(2, 9);
    calculator.totalOps--;
    calculatorInstances[id] = calculator;
    res.json({
        result: calculator.currentResult,
        totalOps: calculator.totalOps,
        Id: id,
    });
};

const performOperation = async (req, res) => {
    console.log('instances', calculatorInstances)
    const { operator, num, id } = req.body;
    const calculator = calculatorInstances[id];

    if (!calculator) {
        res.status(404).json({ error: 'Calculator not found' });
    } else {
        calculator.performOperation(operator, num);
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
