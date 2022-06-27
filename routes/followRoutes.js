const express = require('express')
const router = express.Router()
const followController = require('../controllers/followController')

//#region Action
router.post('/user', followController.followOrUnfollowUser)
router.get('/list/:userId', followController.followerList)
//#endregion

module.exports = router