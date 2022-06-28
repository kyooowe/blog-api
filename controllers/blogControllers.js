const express = require('express')
const multer = require('multer')
const BlogPostModel = require('../models/blogPostModel')
const BlockModel = require('../models/blockUserModel')

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
        const currentUserId = req.headers.userid

        let absoluteBlogList = []
        const blogs = await BlogPostModel.find({ isActive: true })
        const blockListByCurrentUser = await BlockModel.find({ blockById: currentUserId }) // The user I blocked
        const blockListOfOtherUserWithUrId = await BlockModel.find({ blockId: currentUserId }) // Other users that blocked me

        for await (const blog of blogs) {

            const removeUserBlogsIBlockList = blockListByCurrentUser.filter((x) => x.blockId === blog.createdBy) // Remove all user blogs that I blocked
            const removeUserBlogsThatBlockMeList = blockListOfOtherUserWithUrId.filter((x) => x.blockById === blog.createdBy)

            if(removeUserBlogsIBlockList.length === 0 && removeUserBlogsThatBlockMeList.length === 0)
                absoluteBlogList.push(blog)
        }

        res.status(200).json(response(false, absoluteBlogList, 'array', 'Success!'))
    } catch (error) {
        res.status(400).json(response(true, null, error))
    }
}

const getUserBlog = async (req, res) => {
    try {
        const blogs = await BlogPostModel.find({ createdBy: req.params.id, isActive: true })
        res.status(200).json(response(false, blogs, 'array', 'Success!'))
    } catch (error) {
        res.status(400).json(response(true, null, error))
    }
}

const getUserBlogRaw = async (req) => {
    try {
        const currentUserId = req.headers.userid

        let absoluteBlogList = []
        const blogs = await BlogPostModel.find({ isActive: true })
        const blockList = await BlockModel.find({ blockById: currentUserId })

        for await (const blog of blogs) {
            const checkIfContainsBlockUserBlog = blockList.filter((x) => x.blockId === blog.createdBy)

            if (checkIfContainsBlockUserBlog.length === 0)
                absoluteBlogList.push(blog)
        }

        return absoluteBlogList
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
        res.status(200).json(response(false, await getUserBlogRaw(req), 'array', 'Blog Creation Success!'))
    } catch (error) {
        res.status(400).json(response(true, null, error))
    }
}

const createBlogWithImg = async (req, res) => {

    const blog = new BlogPostModel({
        content: req.body.content,
        imagePath: req.file.filename,
        createdBy: req.body.createdBy,
        createdByFullName: req.body.createdByFullName
    })

    try {
        await blog.save()
        res.status(200).json(response(false, await getUserBlogRaw(req), 'array', 'Blog Creation Success!'))
    } catch (error) {
        console.log(error)
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
        res.status(200).json(response(false, await getUserBlogRaw(req), 'array', 'Blog Update Success!'))
    } catch (error) {
        res.status(400).json(response(true, null, error))
    }
}

const updateBlogWithImage = async (req, res) => {
    const id = req.body._id
    const update = { content: req.body.content, imagePath: req.file.filename }

    try {
        const updatedBlog = await BlogPostModel.findByIdAndUpdate(id, update, {
            new: true
        })
        res.status(200).json(response(false, await getUserBlogRaw(req), 'array', 'Blog Update Success!'))
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
        res.status(200).json(response(false, await getUserBlogRaw(req), 'array', 'Blog Delete Success!'))
    } catch (error) {
        res.status(400).json(response(true, null, error))
    }
}
//#endregion

module.exports = {
    getBlogs,
    getUserBlog,
    createBlog,
    createBlogWithImg,
    updateBlog,
    updateBlogWithImage,
    deleteBlog
}