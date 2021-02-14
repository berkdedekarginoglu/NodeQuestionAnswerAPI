const asyncHandler = require("express-async-handler")
const User = require("../model/user")
const CustomError = require("../helpers/error/CustomError")
const getAllProfiles = asyncHandler(async (req, res, next) => {

    const allUsers = await User.find();
    console.log(allUsers)
    res
        .status(200)
        .json({
            success: true,
            data: allUsers
        })
})

const blockUser = asyncHandler(async (req, res, next) => {

    const email = req.body.email
    const user = await User.findOne({ email })

    if (!user) {
        return next(new CustomError(`There is no user with this email ${email}`, 400))
    }

    if (user.isBlocked) {
        return next(new CustomError(`${user.id} already blocked`, 400))
    }

    user.isBlocked = true;

    await user.save();

    res
        .status(200)
        .json({
            success: true,
            message: `${user.id} blocked`
        })



})

const removeUser = asyncHandler(async (req, res, next) => {

    const user = await User.findByIdAndDelete(req.body.id, (err) => {
        if (err) {
            next(new CustomError("There is a problem while user removing",400))
        }
    })

    res
    .status(200)
    .json({
        success:true,
        message:`${req.body.id} deleted`
    })
});


module.exports = {
    getAllProfiles,
    blockUser,
    removeUser
}