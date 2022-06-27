const express = require('express')
const BlogPostModel = require('../models/blogPostModel')

//#region Response
const response = (isError, data, type, msg,) => {

    return {
        success: isError === true ? false : true,
        data: data,
        msg: msg,
        count: type === 'array' ? data.length : null
    }
}
//#endregion

//#region Get
const getBlogs = async (req, res) => {
    try {
        const blogs = await BlogPostModel.find({ isActive: true })
        res.status(200).json(response(false, blogs, 'array', 'Success!'))
    } catch (error) {
        res.status(400).json(response(true, null, error))
    }
}

const getUserBlog = async (req, res) => {
    try {
        const blogs = await BlogPostModel.find({ createdBy: req.params.id, isActive: true })
        res.status(200).json(response(false, blogs, 'array', 'Success!'))
    } catch (error) {
        res.status(400).json(response(true, null,  error))
    }
}

const getUserBlogRaw = async (userId) => {
    try {
        const blogs = await BlogPostModel.find({ createdBy: `${userId}`, isActive: true })

        console.log(blogs)
        return blogs
    } catch (error) {
        return []
    }
}
//#endregion

//#region Action
const createBlog = async (req, res) => {
    const blog = new BlogPostModel({
        content: req.body.content,
        imagePath: req.body.image === null ? '' : req.body.image.fileName,
        createdBy: req.body.userId,
        createdByFullName: req.body.createdByFullName
    })

    try {

        await blog.save()
        res.status(200).json(response(false, await getUserBlogRaw(req.body.userId), 'array', 'Blog Creation Success!'))
    } catch (error) {
        res.status(400).json(response(true, null, error))
    }
}

const updateBlog = async (req, res) => {
    const id = req.body._id
    const update = { content: req.body.content }

    try {
        const updatedBlog = await BlogPostModel.findByIdAndUpdate(id, update, {
            new: true
        })
        res.status(200).json(response(false, await getUserBlogRaw(req.body.userId), 'array', 'Blog Update Success!'))
    } catch (error) {
        res.status(400).json(response(true, null, error))
    }
}

const deleteBlog = async (req, res) => {
    const id = req.params.id
    const userId = req.params.userId
    const update = { isActive: false }

    try {
        await BlogPostModel.findByIdAndUpdate(id, update, {
            new: true
        })
        res.status(200).json(response(false, await getUserBlogRaw(userId), 'array', 'Blog Delete Success!'))
    } catch (error) {
        res.status(400).json(response(true, null, error))
    }
}
//#endregion

module.exports = {
    getBlogs,
    getUserBlog,
    createBlog,
    updateBlog,
    deleteBlog
}