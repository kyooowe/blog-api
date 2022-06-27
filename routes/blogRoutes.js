const express = require('express')
const router = express.Router()
const blogController = require('../controllers/blogControllers')

//#region Get
router.get('/get/all', blogController.getBlogs)
router.get('/get/all/:id', blogController.getUserBlog)
//#endregion

//#region Action
router.post('/create', blogController.createBlog)
router.put('/update', blogController.updateBlog)
router.delete('/delete/:id/:userId', blogController.deleteBlog)
//#endregion

module.exports = router