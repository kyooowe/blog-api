const express = require('express')
const router  = express.Router()
const BlogPostModel = require('../models/blogPostModel')

//#region Response
const response = (isError, data, msg) => {

    return {
        success: isError === true ? false : true,
        data: data,
        msg: msg,
        count: data.length
    }
}
//#endregion

//#region Action
router.post('/create', async (req, res) => {

    const blog = new BlogPostModel({
        content: req.body.content,
        imagePath: req.body.image === null ? '' : req.body.image.fileName,
        createdBy: req.body.userId,
        createdByFullName: req.body.createdByFullName
    })

    try {
        const newBlog = await blog.save()
        res.status(200).json(response(false, newBlog, 'Blog Creation Success!'))
    } catch (error) {
        res.status(400).json(response(true, null, error))
    }
})

router.get('/get/all/:id', async (req, res) => {
    try {
        console.log(req.params.id)
        const blogs = await BlogPostModel.find({ createdBy: req.params.id })
        res.status(200).json(response(false, blogs, 'Success!'))
    } catch (error) {
        res.status(400).json(response(true, null, error))
    }    
})
//#endregion

module.exports = router