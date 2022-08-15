const express = require('express')
const router = express.Router()
const blockController = require('../controllers/blockController')

//#region Action
router.post('/user', blockController.blockUser)
router.post('/user/unblock', blockController.unBlockUser)

//#endregion

//#region Get
router.get('/list', blockController.blockList)
//#endregion

module.exports = router