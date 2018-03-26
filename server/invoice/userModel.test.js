const mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/test');
const Users = require('./userModel');

// const chai = require('chai');
// const { expect } = chai;
// const sinon = require('sinon');

const UsersSchema = {
    //_id: string,
    dateAccountOpened: Date.now(),
    userName: true
};

jest.fn(function() {
    return this;
});
const now = Date.now()
console.log(now);
//Date.now = jest.genMockFunction().mockReturnValue(now)

const mock = jest.fn();
//mock.mockReturnValue(now);

describe('date', () => {
    test('is Today date', () => {
        expect(UsersSchema.dataAccountOpened).mock.mockReturnValue(42);
    })
})


describe('user', () => {
    test('is MichaelJordan', () => {
        expect(UsersSchema.userName).toBeTruthy();
    });
});