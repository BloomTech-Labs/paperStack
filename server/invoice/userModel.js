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
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    hashPassword: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Users = mongoose.model("Users", UsersSchema);

module.exports = Users;