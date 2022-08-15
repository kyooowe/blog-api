const express = require('express')
const router = express.Router()
const authController = require('../controllers/authControllers') 


//#region Action
router.post('/register', authController.register)
router.post('/login', authController.login)
router.post('/change/password', authController.changedPassword)
//#endregion

module.exports = router