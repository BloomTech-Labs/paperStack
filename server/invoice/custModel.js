const mongoose = require("mongoose");
const { Schema } = mongoose

const CustomersSchema = new Schema({
    _id: mongoose.Types.ObjectId,
    custName: {
        type: String,
        required: true
    },
    custPhoneNbr: {
        type: String,
        required: true
    },
    custEmail: {
        type: String,
        required: true
    },
    custStreetAddress: {
        type: String,
        required: true
    },
    custCity: {
        type: String,
        required: true
    },
    custState: {
        type: String,
        required: true
    },
    custCountry: {
        type: String,
        required: true
    },
    custZipCode: {
        type: String,
        required: true
    },
    custTerms: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Customers = mongoose.model("Customers", CustomersSchema);

module.exports = Customers;

