const mongoose = require('mongoose')
mongoose.set('debug', true)

const authSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    dateCreated: {
        type: Date,
        required: true,
        default: Date.now
    }
})

var auth = mongoose.model('authModel', authSchema)
module.exports = auth