const mongoose = require('mongoose')
mongoose.set('debug', true)

const followUserSchema = new mongoose.Schema({
    followId: {
        type: String,
        required: true,
    },
    followById: {
        type: String,
        required: true
    }
})

var followU = mongoose.model('followUserModel', followUserSchema)
module.exports = followU