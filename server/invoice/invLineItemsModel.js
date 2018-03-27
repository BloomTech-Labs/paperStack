const mongoose = require("mongoose");
const { Schema } = mongoose;

const InvLineSchema = new Schema({
    invId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Invoices',
        required: true
    },
    itemName: {
        type: String,
        required: true
    },
    itemQuantity: {
        type: Number,
        required: true
    },
    itemRate: {
        type: Number,
        required: true
    },
    invNotes: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


const InvLine = mongoose.model("InvLine", InvLineSchema);

module.exports = InvLine;
