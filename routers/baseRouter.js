const express = require("express");
const { base } = require("../model/user");
const baseRouter = express.Router();
const {getAccesToRouter,getAdminAccess} = require("../middlewares/authentication/auth")
const authRouter = require("./auth")
const userRouter = require("./user")
const adminRouter = require("./admin")
const questionRouter = require("./question")

baseRouter.use("/auth",authRouter)
baseRouter.use("/user",getAccesToRouter,userRouter)
baseRouter.use("/admin",[getAccesToRouter,getAdminAccess],adminRouter)
baseRouter.use("/questions",getAccesToRouter,questionRouter)

module.exports = baseRouter