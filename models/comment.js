const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    nickname: {
        type: String,
        default: '路人'
    },
    email: String,
    content: String,
    createTime: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Comment', commentSchema);