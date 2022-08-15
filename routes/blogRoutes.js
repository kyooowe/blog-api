const express = require('express')
const router = express.Router()
const blogController = require('../controllers/blogControllers')
const multer = require('multer')

//#region Img Helpers
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
})

const upload = multer({ storage })
//#endregion

//#region Get
router.get('/get/all', blogController.getBlogs)
router.get('/get/all/:id', blogController.getUserBlog)
//#endregion

//#region Action
router.post('/create', blogController.createBlog)
router.post('/create/image', upload.single('img'), blogController.createBlogWithImg)
router.put('/update', blogController.updateBlog)
router.put('/update/image', upload.single('img'), blogController.updateBlogWithImage)
router.delete('/delete/:id/:userId', blogController.deleteBlog)
//#endregion

module.exports = router