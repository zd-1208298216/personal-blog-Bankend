const mongoose = require('mongoose');
const { LABELS, KINDS } = require('../consts/const');

const blogSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    kind: {
        type: String,
        enum: KINDS
    },
    labels: { 
        type: Array,
        validate: arr => {
            arr.forEach(item => {
                if(!LABELS.includes(item)) {
                    return false;
                }
            });
            return true;
        }
    }
}, {
    timestamps: {
        createdAt: 'created',
        updatedAt: 'updated'
    }
});

module.exports = mongoose.model('Blog', blogSchema);