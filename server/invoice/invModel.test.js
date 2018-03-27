const mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/test');
const Invoices = require('./invModel');

const InvoicesSchema = {
    customerId: 1,
    usersId: 1,
    //invNumber: 1001,
    invDate: '2018-03-26',
    invDueDate: '2018-04-25',
    invComments: 'Thank you for your business',
    createdAt: '2018-03-26',
};

describe('customer Id', () => {
    test('is 1', () => {
        expect(InvoicesSchema.customerId).toBe(1);
    });
});

describe('user Id', () => {
    test('is 1', () => {
        expect(InvoicesSchema.usersId).toBe(1);
    });
});

// describe('invoice number', () => {
//     test('is 1001', () => {
//         expect(InvoicesSchema.invNumber).toBe(1001);
//     });
// });

describe('invoice date', () => {
    test('2018-03-26', () => {
        expect(InvoicesSchema.invDate).toBe('2018-03-26');
    });
});

describe('invoice due date', () => {
    test('is 2018-04-25', () => {
        expect(InvoicesSchema.invDueDate).toBe('2018-04-25');
    });
});

describe('invoice comments', () => {
    test('is Thank you for your business', () => {
        expect(InvoicesSchema.invComments).toBe('Thank you for your business');
    });
});

describe('2018-03-26', () => {
    test('is 2018-03-26', () => {
        expect(InvoicesSchema.createdAt).toBe('2018-03-26');
    });
});

/**
 * Upon review, we decided to comment out invNumber due to auto-increment
 * Front end testing would be recommended.
 */


const getRecord = () => ({ _id: 1, customerId: 1, usersId: 1, invNumber: 1001, invDate: '2018-03-26', invDueDate: '2018-04-25', invComments: 'Thank you for your business', createdAt: '2018-03-26'});
test('records have a _id, customerId, usersId, invNumber, invDate, invDueDate, invComments and createdAt', () => {
    let record = getRecord(1);
    expect(record).toHaveProperty('_id');
    expect(record).toHaveProperty('customerId');
    expect(record).toHaveProperty('usersId');
    // expect(record).toHaveProperty('invNumber');
    expect(record).toHaveProperty('invDate');
    expect(record).toHaveProperty('invDueDate');
    expect(record).toHaveProperty('invComments');
    expect(record).toHaveProperty('createdAt');
});


