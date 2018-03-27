const mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/test');
const InvLine = require('./InvLineItemsModel');

const InvLineSchema = {
    invId: 1001,
    itemName: 'Painting',
    itemQuantity: 1,
    itemRate: 2000,
    invNotes: 'Bedroom to be painted',
    createdAt: '2018-03-26',
};

describe('invoice', () => {
    test('is 1001', () => {
        expect(InvLineSchema.invId).toBe(1001);
    });
});

describe('item name', () => {
    test('is painting', () => {
        expect(InvLineSchema.itemName).toBe('Painting');
    });
});

describe('item quantity', () => {
    test(1, () => {
        expect(InvLineSchema.itemQuantity).toBe(1);
    });
});

describe('item rate', () => {
    test(2000, () => {
        expect(InvLineSchema.itemRate).toBe(2000);
    });
});

describe('invoice notes', () => {
    test('Bedroom to be painted', () => {
        expect(InvLineSchema.invNotes).toBe('Bedroom to be painted');
    });
});

describe('2018-03-26', () => {
    test('is 2018-03-26', () => {
        expect(InvLineSchema.createdAt).toBe('2018-03-26');
    });
});

const getRecord = () => ({ _id: 1, invId: 1001, itemName: 'Painting', itemQuantity: 1, itemRate: 2000, invNotes: 'Bedroom to be painted', createdAt: '2018-03-26'});
test('records have a _id, invId, itemName, itemQuantity, itemRate, invNotes, and createdAt', () => {
    let record = getRecord(1);
    expect(record).toHaveProperty('_id');
    expect(record).toHaveProperty('invId');
    expect(record).toHaveProperty('itemName');
    expect(record).toHaveProperty('itemQuantity');
    expect(record).toHaveProperty('itemRate');
    expect(record).toHaveProperty('invNotes');
    expect(record).toHaveProperty('createdAt');
});


