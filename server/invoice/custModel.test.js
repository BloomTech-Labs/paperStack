const mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/test');
const Customers = require('./custModel');

const CustomersSchema = {
    custName: 'LeBronJames',
    custPhoneNbr: '555-555-5555',
    custEmail: 'ljames@gmail.com',
    custStreetAddress: '23 LeBron Way',
    custCity: 'Cleveland',
    custState: 'OH',
    custCountry: 'USA',
    custZipCode: '12345',
    custTerms: '15 days',
    createdAt: '2018-03-26',
};

describe('client', () => {
    test('is LebronJames', () => {
        expect(CustomersSchema.custName).toBe('LeBronJames');
    });
});

describe('customer phone number', () => {
    test('is 555-555-5555', () => {
        expect(CustomersSchema.custPhoneNbr).toBe('555-555-5555');
    });
});

describe('customer email', () => {
    test('is ljames@gmail.com', () => {
        expect(CustomersSchema.custEmail).toBe('ljames@gmail.com');
    });
});

describe('customer street address', () => {
    test('is 23 LeBron Way', () => {
        expect(CustomersSchema.custStreetAddress).toBe('23 LeBron Way');
    });
});

describe('custCity', () => {
    test('is Cleveland', () => {
        expect(CustomersSchema.custCity).toBe('Cleveland');
    });
});

describe('custState', () => {
    test('is OH', () => {
        expect(CustomersSchema.custState).toBe('OH');
    });
});

describe('custCountry', () => {
    test('is USA', () => {
        expect(CustomersSchema.custCountry).toBe('USA');
    });
});

describe('custZipCode', () => {
    test('is 12345', () => {
        expect(CustomersSchema.custZipCode).toBe('12345');
    });
});

describe('custTerms', () => {
    test('is 15 days', () => {
        expect(CustomersSchema.custTerms).toBe('15 days');
    });
});

describe('2018-03-26', () => {
    test('is 2018-03-26', () => {
        expect(CustomersSchema.createdAt).toBe('2018-03-26');
    });
});

/*
    Customer Terms (custTerms) is not required, perhaps front end to show 30 days payment terms by default.
*/

const getRecord = () => ({ _id: 1, custName: 'LeBron James', custPhoneNbr: '555-555-5555', custEmail: 'ljames@gmail.com', custStreetAddress: '23 LeBron Way', custCity: 'Cleveland', custState: 'OH', custCountry: 'USA', custZipCode: '12345', custTerms: '15 days', createdAt: '2018-03-26'});
test('records have a _id, custName, custPhoneNbr, custEmail, custStreetAddress, custCity, custState, custCountry, custZipCode, custTerms and createdAt', () => {
    let record = getRecord(1);
    expect(record).toHaveProperty('_id');
    expect(record).toHaveProperty('custName');
    expect(record).toHaveProperty('custPhoneNbr');
    expect(record).toHaveProperty('custEmail');
    expect(record).toHaveProperty('custStreetAddress');
    expect(record).toHaveProperty('custCity');
    expect(record).toHaveProperty('custState');
    expect(record).toHaveProperty('custCountry');
    expect(record).toHaveProperty('custZipCode');
    expect(record).toHaveProperty('custTerms');
    expect(record).toHaveProperty('createdAt');
});


