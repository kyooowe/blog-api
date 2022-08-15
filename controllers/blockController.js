const express = require('express')
const BlockModel = require('../models/blockUserModel')
const AuthModel = require('../models/authModel')

//#region Response
const response = (isError, data, msg) => {

    return {
        success: isError === true ? false : true,
        blocks: data,
        msg: msg,
        count: data === null ? 0 : data.length
    }
}
//#endregion

//#region Get
const blockList = async (req, res) => {
    try {
        let absoluteBlockList = []
        const currentUserId = req.headers.userid
        const blocks = await BlockModel.find({ blockById: currentUserId })

        for await (const block of blocks) {
            const account = await AuthModel.findById(block.blockId)
            absoluteBlockList.push({ id: account._id, name: account.fullName })
        }

        res.status(200).json(response(false, absoluteBlockList, 'Block User Success'))

    } catch (error) {
        res.status(200).json(response(true, null, error))
    }
}

const blockListRaw = async (req) => {
    let absoluteBlockList = []
    const currentUserId = req.headers.userid
    const blocks = await BlockModel.find({ blockById: currentUserId })

    for await (const block of blocks) {
        const account = await AuthModel.findById(block.blockId)
        absoluteBlockList.push({ id: account._id, name: account.fullName })
    }

    return absoluteBlockList
}
//#endregion

//#region Action
const blockUser = async (req, res) => {
    try {
        const block = new BlockModel({
            blockId: req.body.blockId,
            blockById: req.body.blockById
        })

        await block.save()
        res.status(200).json(response(false, null, 'Block User Success'))
    } catch (error) {
        res.status(200).json(response(true, error))
    }
}

const unBlockUser = async (req, res) => {
    try {
        await BlockModel.find({ blockId: req.body.blockId, blockById: req.body.blockById }).remove().exec()
        res.status(200).json(response(false, await blockListRaw(req), 'Unblock User Success'))
    } catch (error) {
        res.status(200).json(response(true, error))
    }
}
//#endregion

module.exports = {
    blockUser,
    blockList,
    unBlockUser
}