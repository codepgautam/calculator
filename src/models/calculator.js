class Calculator {
    constructor() {
        this.currentResult = 0;
        this.totalOps = 0;
        this.operationHistory = [];
        this.undoHistory = [];
    }

    operation(operator, num1, num2, res) {
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
                    return { status: false, message: 'Division by zero is not allowed'}
                }
                this.currentResult = num1 / num2;
                break;
            default:
                return { status: false, message: 'Invalid operator'}
        }
        this.totalOps++;
        this.operationHistory.push({ operator, num1, num2, result: this.currentResult });
        return { status: true, message: ''}
    }

    undo() {
        if (this.operationHistory.length === 0) {
            return { status: false, message: 'Cannot undo further' }
        }
        const lastOperation = this.operationHistory.pop();
        const { operator, num1, num2, result } = lastOperation;
        this.undoHistory.push({ operator, num1, num2, result })
        this.currentResult = num1
        this.totalOps--;
        return { status: true, message: '' }
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