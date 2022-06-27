const express = require('express')
const FollowModel = require('../models/followUserModel')
const mongoose = require('mongoose')
const AuthModel = require('../models/authModel')

//#region Response
const response = (isError, followers, msg) => {

    return {
        success: isError === true ? false : true,
        followers: followers,
        count: followers === null ? 0 : followers.length,
        msg: msg
    }
}
//#endregion

//#region Get
const followerList = async (req, res) => {
    try {

        let absoluteFollowerList = []
        const followerList = await FollowModel.find({ followId: req.params.userId })
        const uniques = [...new Set(followerList.map(x => x.followById))]

        for await (const id of uniques) {
            const user = await AuthModel.findById(id)
            absoluteFollowerList.push(user.email)
        }

        res.status(200).json(response(false, absoluteFollowerList, 'Follow User Success'))
    } catch (error) {
        res.status(200).json(response(true, null, error))
    }
}

const followerListRaw = async (id) => {
    let absoluteFollowerList = []
    const followerList = await FollowModel.find({ followId: id })
    const uniques = [...new Set(followerList.map(x => x.followById))]

    for await (const id of uniques) {
        const user = await AuthModel.findById(id)
        absoluteFollowerList.push(user.email)
    }

    return absoluteFollowerList
}
//#endregion

//#region Action
const followOrUnfollowUser = async (req, res) => {
    try {

        if (req.body.type === 'follow') {
            const follow = new FollowModel({
                followId: req.body.followId,
                followById: req.body.followById
            })

            await follow.save()
            res.status(200).json(response(false, await followerListRaw(req.body.followId), 'Following User Success'))
        }
        else {
            await FollowModel.find({ followId: req.body.followId, followById: req.body.followById }).remove().exec()
            res.status(200).json(response(false, await followerListRaw(req.body.followId), 'Unfollowing User Success'))
        }

    } catch (error) {
        res.status(200).json(response(true, null, 'Something error occured, please try again!'))
    }
}


//#endregion

module.exports = {
    followOrUnfollowUser,
    followerList
}