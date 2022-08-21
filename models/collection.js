const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true
    },
    blogID: {
        type: String,
        required: true
    }
})
 
module.exports = mongoose.model('Collection', collectionSchema);