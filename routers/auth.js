const express = require("express")
const authRouter = express.Router();
const { register,login,logout,forgotPassword,resetPassword } = require("../controllers/auth")
const {checkLoginInputs } = require("../middlewares/inputs/inputs")
const {getAccesToRouter} = require("../middlewares/authentication/auth")
authRouter.post("/register", register)
authRouter.post("/login",checkLoginInputs,login)
authRouter.get("/logout",getAccesToRouter,logout)
authRouter.post("/forgotpassword",forgotPassword)
authRouter.put("/resetpassword",resetPassword)

module.exports = authRouter