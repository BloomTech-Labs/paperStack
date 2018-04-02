const mongoose = require("mongoose");
const { Schema } = mongoose

const InvoicesSchema = new Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customers',
        required: true
    },
    usersId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
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
    
    //Ronald and Jason decided that comment text box is necessary related to invoice
    
    invComments: {  
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
