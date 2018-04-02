const mongoose = require("mongoose");
const { Schema } = mongoose

const FinTranSchema = new Schema({
    usersId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    invId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Invoices',
        required: true
    },
    transDate: {
        type: Date,
        required: false
    },
    transSubtotal: {
        type: Number,
        required: false
    },
    transDisc: {
        type: Number,
        required: false
    },
    transTax: {
        type: Number,
        required: false
    },
    transShipping: {
        type: Number,
        required: false
    },
    transAmountPaid: {
        type: Number,
        required: false
    },
    transComment: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const FinTran = mongoose.model("FinTran", FinTranSchema);

module.exports = FinTran;
