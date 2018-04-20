const mongoose = require("mongoose");
const { Schema } = mongoose;

const UsersSchema = new Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customers',
        required: false
    },
    dateAccountOpened: {
        type: Date,
        default: Date.now
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    hashPassword: {
        type: String,
        required: true
    },
    logo: { 
        binaryData: {
            data: Buffer,
            type: String,            
            required: false 
        },
        contentType: {
            type: String,
            required: false
        }
    },
    companyName: {
        type: String,
        required: false,
        default: null
    },
    companyAddress: {
        type: String,
        required: false,
        default: null
    },
    currentInvoiceNumber: {
        type: Number,
        required: false,
        default: 0
    },
    subscription: {
        type: Boolean,
        default: false,
        required: true
    },
    oneTimePaid: {
        type: Boolean,
        default: false,
        required: true
    },
    subscription: {
        type: Boolean,
        default: false,
        required: true
    },
    paidInvoice: {
        type: Boolean,
        default: false,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Users = mongoose.model("Users", UsersSchema);

module.exports = Users;