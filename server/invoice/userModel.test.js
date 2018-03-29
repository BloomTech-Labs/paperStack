const mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/test');
const Users = require('./userModel');

const UsersSchema = {
    dateAccountOpened: '2018-03-26',
    email: 'mjordan@gmail.com',
    hashPassword: '1234kjdf1234',
    createdAt: '2018-03-26',
};

describe('2018-03-26', () => {
    test('is 2018-03-26', () => {
        expect(UsersSchema.dateAccountOpened).toBe('2018-03-26');
    });
});

describe('email', () => {
    test('is mjordan@gmail.com', () => {
        expect(UsersSchema.email).toBe('mjordan@gmail.com');
    });
});

describe('hashPassword', () => {
    test('is 1234kjdf1234', () => {
        expect(UsersSchema.hashPassword).toBe('1234kjdf1234');
    });
});

describe('2018-03-26', () => {
    test('is 2018-03-26', () => {
        expect(UsersSchema.createdAt).toBe('2018-03-26');
    });
});

const getRecord = () => ({ _id: 1, dateAccountOpened: '2018-03-26', email: 'mjordan@gmail.com', hashPassword: '1234kjdf1234', createdAt: '2018-03-26'});
test('records have a _id, dateAccountOpened, email, hashPassword and createdAt', () => {
    let record = getRecord(1);
    expect(record).toHaveProperty('_id');
    expect(record).toHaveProperty('dateAccountOpened');
    expect(record).toHaveProperty('email');
    expect(record).toHaveProperty('hashPassword');
    expect(record).toHaveProperty('createdAt');
});


