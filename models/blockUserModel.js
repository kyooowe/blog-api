const mongoose = require('mongoose')
mongoose.set('debug', true)

const blockUserSchema = new mongoose.Schema({
    blockId: {
        type: String,
        required: true,
    },
    blockById: {
        type: String,
        required: true
    }
})

var blockU = mongoose.model('blockUserModel', blockUserSchema)
module.exports = blockU