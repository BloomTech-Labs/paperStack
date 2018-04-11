const mongoose = require("mongoose");
const { Schema } = mongoose

const InvoicesSchema = new Schema({
    // customerId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Customers',
    //     required: true
    // },
    // usersId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Users',
    //     required: true
    // },
    invCustomerAddress: {
        type: String,
        required: false
    },
    invNumber: {
        type: String,
        autoIncrement: false,
        required: false
    },
    invDate: {
        type: Date,
        required: false
    },
    invDueDate: {
        type: Date,
        required: false
    },
    invBillableItems: {
        type: String,
        required: false
    },
    invDiscount: {
        type: Number,
        required: false
    },
    invTax: {
        type: Number,
        required: false
    },
    invDeposit: {
        type: Number,
        required: false
    },
    invShipping: {
        type: Number,
        required: false
    },
        //Ronald and Jason decided that comment text box is necessary related to invoice
    invComment: {  
        type: String,
        required: false
    },
    invTerms: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Invoices = mongoose.model("Invoices", InvoicesSchema);

module.exports = Invoices;
