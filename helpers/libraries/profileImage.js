const multer = require("multer")
const path = require("path")
const CustomError = require("../error/CustomError")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const basePath = path.dirname(require.main.filename)
        const selectePath = path.join(basePath,"/public/uploads")
        cb(null, selectePath)
    },
    filename: function (req, file, cb) {
        const extension = file.mimetype.split('/')[1]
        const fileName = "images_" + req.user.id + "." + extension;
        req.user.profileImage = fileName
        cb(null, fileName)
    }
})

const fileFilter = (req,file,cb) => {
    let mimeTypesARR = ["image/jpg","image/jpeg","image/png","image/gif"]
    if(!mimeTypesARR.includes(file.mimetype)){
        return cb(new CustomError("Not acceptable type",400),false)
    }
    
    cb(null,true)
}

const profileImageUpload = multer({
    storage:storage,
    fileFilter:fileFilter
})

module.exports = {
    profileImageUpload
}