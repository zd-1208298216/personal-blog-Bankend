const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    phone: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    nickname: {
        type: String,
        default: ''
    },
    avatarUrl: {
        type: String,
        default: ''
    }
})
 
module.exports = mongoose.model('User', userSchema);