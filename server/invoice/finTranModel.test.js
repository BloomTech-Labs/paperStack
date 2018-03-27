const mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/test');
const FinTran = require('./finTranModel');

const FinTranSchema = {
    usersId: 1,
    invId: 1001,
    transDate: '2018-03-26',
    transSubtotal: 5000,
    transDisc: .15,
    transTax: .08,
    transShipping: 200,
    transAmountPaid: 5200,
    transComment: 'To be paid by April 15th',
    createdAt: '2018-03-26',
};

describe('user Id', () => {
    test(1, () => {
        expect(FinTranSchema.usersId).toBe(1);
    });
});

describe('invoice number', () => {
    test(1001, () => {
        expect(FinTranSchema.invId).toBe(1001);
    });
});

describe('transaction date', () => {
    test('is 2018-03-26', () => {
        expect(FinTranSchema.transDate).toBe('2018-03-26');
    });
});

describe('transaction subtotal', () => {
    test(5000, () => {
        expect(FinTranSchema.transSubtotal).toBe(5000);
    });
});

describe('transaction discount', () => {
    test(.15, () => {
        expect(FinTranSchema.transDisc).toBe(.15);
    });
});

describe('transaction tax', () => {
    test(.08, () => {
        expect(FinTranSchema.transTax).toBe(.08);
    });
});

describe('transaction shipping', () => {
    test(200, () => {
        expect(FinTranSchema.transShipping).toBe(200);
    });
});

describe('transaction amount paid', () => {
    test(5200, () => {
        expect(FinTranSchema.transAmountPaid).toBe(5200);
    });
});

describe('transaction comments', () => {
    test('To be paid by April 15th', () => {
        expect(FinTranSchema.transComment).toBe('To be paid by April 15th');
    });
});

describe('2018-03-26', () => {
    test('is 2018-03-26', () => {
        expect(FinTranSchema.createdAt).toBe('2018-03-26');
    });
});

const getRecord = () => ({ _id: 1, usersId: 1, invId: 1001, transDate: '2018-03-26', transSubtotal: 5000, transDisc: .15, transTax: .08, transShipping: 200, transAmountPaid: 5200, transComment: 'To be paid by April 15th', createdAt: '2018-03-26'});
test('records have a _id, usersId, invId, transDate, transSubtotal, transDisc, transTax, transShipping, transAmountPaid, transComment and createdAt', () => {
    let record = getRecord(1);
    expect(record).toHaveProperty('_id');
    expect(record).toHaveProperty('usersId');
    expect(record).toHaveProperty('invId');
    expect(record).toHaveProperty('transDate');
    expect(record).toHaveProperty('transSubtotal');
    expect(record).toHaveProperty('transDisc');
    expect(record).toHaveProperty('transTax');
    expect(record).toHaveProperty('transShipping');
    expect(record).toHaveProperty('transAmountPaid');
    expect(record).toHaveProperty('transComment');
    expect(record).toHaveProperty('createdAt');
});


