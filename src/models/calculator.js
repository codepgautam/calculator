class Calculator {
    constructor() {
        this.currentResult = 0;
        this.totalOps = 0;
        this.operationHistory = [];
        this.undoHistory = [];
    }

    performOperation(operator, num1, num2) {

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
        if (this.operationHistory.length === 0) {
            return res.send('Cannot undo further');
        }
        
        const lastOperation = this.operationHistory.pop();
        const { operator, num1, num2 } = lastOperation;
    
        switch (operator) {
            case 'add':
                this.currentResult -= num2;
                break;
            case 'subtract':
                this.currentResult += num2;
                break;
            case 'multiply':
                if (num2 === 0) {
                    throw new Error("Division by zero is not allowed");
                }
                this.currentResult /= num2;
                break;
            case 'divide':
                this.currentResult *= num2;
                break;
            default:
                throw new Error("Invalid operator");
        }
        this.totalOps--;
    }

    reset() {
        this.currentResult = 0;
        this.totalOps = 0;
        this.operationHistory = [];
        this.undoHistory = [];
    }

}

module.exports = { 
    Calculator 
}