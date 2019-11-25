const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: Ture
    },
    email: {
        type: String,
        required: Ture
    },
    password: {
        type: String,
        required: Ture
    },
    date: {
        type: Date,
        default: Date.now()
    },
});
const User = mongoose.model('User', UserSchema);
module.exports = User;
