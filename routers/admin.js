const express = require("express")
const {getAllProfiles,blockUser,removeUser} = require("../controllers/admin")
const adminRouter = express.Router();

adminRouter.get("/allprofiles",getAllProfiles)
adminRouter.post("/blockUser",blockUser)
adminRouter.delete("/removeUser",removeUser)
module.exports = adminRouter