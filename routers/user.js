const express = require("express")
const userRouter = express.Router();
const {getAccesToRouter} = require("../middlewares/authentication/auth")
const { profileImageUpload } = require("../helpers/libraries/profileImage")
const { upload,getProfile,updateProfile,removeUser } = require("../controllers/user")

userRouter.post("/upload",profileImageUpload.single('profile_image'),upload)
userRouter.get("/profile",getAccesToRouter,getProfile)
userRouter.put("/updateprofile",getAccesToRouter,updateProfile)
userRouter.delete("/delete",getAccesToRouter,removeUser)

module.exports = userRouter