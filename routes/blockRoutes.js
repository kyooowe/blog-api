const express = require('express')
const router = express.Router()
const blockController = require('../controllers/blockController')

//#region Action
router.post('/user', blockController.blockUser)
//#endregion

//#region Get
router.get('/list', blockController.blockList)
//#endregion

module.exports = router