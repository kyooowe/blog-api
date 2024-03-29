const express = require('express')
const AuthModel = require('../models/authModel')

//#region Response
const response = (isError, data, msg) => {

    return {
        success: isError === true ? false : true,
        data: data,
        msg: msg
    }
}
//#endregion

//#region Action
const register = async (req, res) => {
    const auth = new AuthModel({
        fullName: req.body.fullName,
        email: req.body.email,
        userName: req.body.username,
        password: req.body.password,
    })

    try {
        const newAccount = await auth.save()
        res.status(200).json(response(false, newAccount, 'Account Creation Success!'))
    } catch (error) {
        res.status(400).json(response(true, null, error))
    }
}

const login = async (req, res) => {
    try {
        const username = req.body.username
        const password = req.body.password

        const account = await AuthModel.findOne({ userName: username, password: password })

        if (account)
            res.status(200).json(response(false, account, 'Success'))
        else
            res.status(400).json(response(true, account, 'Invalid Credentials, Please try again!'))


    } catch (error) {
        res.status(400).json(response(true, null, error))
    }
}

const changedPassword = async (req, res) => {
    const update = { password: req.body.password }
    const currentUserId = req.headers.userid

    try {
        await AuthModel.findByIdAndUpdate(currentUserId, update, {
            new: true
        })
        res.status(200).json(response(false, null, 'Change Password Success'))
    } catch (error) {
        res.status(200).json(response(true, null, 'Something error occured, please try again!'))
    }
}
//#endregion

module.exports = {
    register,
    login,
    changedPassword
}