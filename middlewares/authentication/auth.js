const { isTokenIncluded, parseToken } = require("../../helpers/authentication/auth")
const CustomError = require("../../helpers/error/CustomError")
const User = require("../../model/user")
const jwt = require("jsonwebtoken")

const getAccesToRouter = async (req, res, next) => {

    if (!await isTokenIncluded(req)) {
        return next(new CustomError("Token is undefinied", 401))
    }

    const token = await parseToken(req.headers.accesstoken);


    const { JWT_SECRET_KEY } = process.env

    await jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {

        if (err) {
            return next(new CustomError("Token is expired", 401))
        }

        req.user = decoded
        
        next();
    })

}

const getAdminAccess = async (req,res,next) => {

    const user = await User.findById(req.user.id);

    if(!user){
        return next(new CustomError("There is no user with this token",401))
    }

    if(user.role !== "admin")
    {
        return next(new CustomError("You are not authorized this router",401))
    }

    next();
}

module.exports = {
    getAccesToRouter,
    getAdminAccess
}