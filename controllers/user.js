const User = require("../model/user");
const asyncHandler = require("express-async-handler");
const CustomError = require("../helpers/error/CustomError")
const upload = asyncHandler(async (req, res) => {

    const user = await User.findByIdAndUpdate(req.user.id, {
        "profile_picture": req.user.profileImage
    }, {
        new: true,
        runValidators: true
    })

    res
        .status(200)
        .json({
            success: true
        })

})

const getProfile = asyncHandler(async (req, res) => {

    const user = await User.findById(req.user.id)

    res
        .status(200)
        .json({
            success: true,
            data: user
        })

})

const updateProfile = asyncHandler(async (req, res, next) => {

    const id = req.user.id
    const data = req.body;

    if (data.role != undefined) {
        return next(new CustomError("You are not authorized this process", 401))
    }

    const user = await User.findByIdAndUpdate(id, {
        ...data
    }, {
        new: true,
        runValidators: true
    })

    await user.save();

    res
        .status(200)
        .json({
            success: true,
            data: user
        })
})

const removeUser = asyncHandler(async (req, res, next) => {

    await User.findByIdAndDelete(req.user.id, (err) => {
        if (err) {
            return next(new CustomError("There is a problem while user removing", 400))
        }
    })

res
.status(200)
.json({
    success:true,
    message:"User removed"
})


})

module.exports = {
    upload,
    getProfile,
    updateProfile,
    removeUser
}