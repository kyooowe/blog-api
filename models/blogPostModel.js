const mongoose = require('mongoose')
mongoose.set('debug', true)

const blogPostSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    imagePath: {
        type: String,
    },
    createdBy: {
        type: String,
        required: true
    },
    createdByFullName: {
        type: String,
        required: true
    },
    dateCreated: {
        type: Date,
        required: true,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true
    }
})

var blogP = mongoose.model('blogPostModel', blogPostSchema)
module.exports = blogP