const mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/test');
const Users = require('./userModel');

const UsersSchema = {
    dateAccountOpened: '2018-03-26',
    userName: 'MichaelJordan',
    email: 'mjordan@gmail.com',
    hashPassword: '1234kjdf1234',
    createdAt: '2018-03-26',
};

describe('2018-03-26', () => {
    test('is 2018-03-26', () => {
        expect(UsersSchema.dateAccountOpened).toBe('2018-03-26');
    });
});

describe('user', () => {
    test('is MichaelJordan', () => {
        expect(UsersSchema.userName).toBe('MichaelJordan');
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

const getRecord = () => ({ _id: 1, dateAccountOpened: '2018-03-26', userName: 'MichaelJordan', email: 'mjordan@gmail.com', hashPassword: '1234kjdf1234', createdAt: '2018-03-26'});
test('records have a _id, dateAccountOpened, userName, email, hashPassword and createdAt', () => {
    let record = getRecord(1);
    expect(record).toHaveProperty('_id');
    expect(record).toHaveProperty('dateAccountOpened');
    expect(record).toHaveProperty('userName');
    expect(record).toHaveProperty('email');
    expect(record).toHaveProperty('hashPassword');
    expect(record).toHaveProperty('createdAt');
});


