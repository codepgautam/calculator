
const { describe, expect, test } = require('@jest/globals');
const calculatorController = require('../../src/controllers/calculator');
const { Calculator } = require('../../src/models/calculator');
const calculatorInstances = {};
const mockRequest = (body) => ({ body });
const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('initCalculator', () => {

    test("it should return an error for invalid num1 or num2 value", async () => {

        const req = mockRequest({ operator: 'add', num1: 'abc', num2: '4' })
        const res = mockResponse();

        await calculatorController.initCalculator(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Invalid num1 or num2 value' });

    });

    test("it should return an error for invalid operator", async () => {

        const req = mockRequest({ operator: 'operator', num1: '5', num2: '4' })
        const res = mockResponse();

        await calculatorController.initCalculator(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Invalid operator' });
    });

    test("it should return an error for division operator when num2 is zero", async () => {

        const req = mockRequest({ operator: 'divide', num1: '5', num2: '0' })
        const res = mockResponse();

        await calculatorController.initCalculator(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Division by zero is not allowed' });
    });

    test('it should create a new calculator instance', async () => {
        const req = mockRequest({ operator: 'add', num1: '5', num2: '10' });
        const res = mockResponse();

        await calculatorController.initCalculator(req, res);

        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ result: 15, totalOps: 1, Id: expect.any(Number) }));
    });

});

describe('performOperation', () => {

    beforeAll(() => {
        calculatorController.calculatorInstances['123'] = new Calculator();
    });

    test("it should return an error for invalid num value", async () => {

        const req = mockRequest({ operator: 'add', num: 'abc', id: '4' })
        const res = mockResponse();

        await calculatorController.performOperation(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Invalid num value' });

    });

    test("it should return an error when calculator instance not found", async () => {

        const req = mockRequest({ operator: 'operator', num: '5', id: 'invalidId' })
        const res = mockResponse();

        await calculatorController.performOperation(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Calculator not found' });
    });

    test('it should perform the operation', async () => {

        const req = mockRequest({ operator: 'add', num: '5', id: '123' });
        const res = mockResponse();

        await calculatorController.performOperation(req, res);

        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ result: 5, totalOps: 1, Id: '123' }));
    });

})

describe('undoOperation', () => {

    let calculator;

    beforeAll(() => {
        calculator = new Calculator();
        calculatorController.calculatorInstances['123'] = calculator;
    });

    test("it should return an error when calculator instance not found", async () => {

        const req = mockRequest({ id: 'invalidId' })
        const res = mockResponse();

        await calculatorController.undoOperation(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Calculator not found' });
    });

    test("it should handle undo when no history is available", async () => {

        calculatorController.operationHistory = []

        const req = mockRequest({ id: '123' })
        const res = mockResponse();

        await calculatorController.undoOperation(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Cannot undo further' });
    });

    test('it should perform the operation', async () => {

        const req = mockRequest({ id: '123' });
        const res = mockResponse();

        await calculatorController.performOperation( mockRequest({ operator: 'add', num: 15, id: '123' }), mockResponse() );
        await calculatorController.performOperation( mockRequest({ operator: 'subtract', num: 5, id: '123' }), mockResponse() );

        await calculatorController.undoOperation(req, res);

        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ result: 15, totalOps: 1 }));
    });

})

describe('resetCalculator', () => {

    let calculator;

    beforeAll(() => {
        calculator = new Calculator();
        calculatorController.calculatorInstances['123'] = calculator;
    });

    test("it should return an error when calculator instance not found", async () => {

        const req = { query: { id: 'invalidId' }}
        const res = mockResponse();

        await calculatorController.resetCalculator(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Calculator not found' });
    });

    test('it should perform the operation', async () => {

        const req = { query: { id: '123' }};
        const res = mockResponse();

        await calculatorController.performOperation( mockRequest({ operator: 'add', num: 15, id: '123' }), mockResponse() );

        await calculatorController.resetCalculator(req, res);

        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true, message: 'Calculator 123 is now reset' }));
        expect(calculator.currentResult).toBe(0);
        expect(calculator.totalOps).toBe(0);
        expect(calculator.operationHistory.length).toBe(0);
        expect(calculator.undoHistory.length).toBe(0);
    });

})