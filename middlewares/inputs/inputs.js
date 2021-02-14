const CustomError = require("../../helpers/error/CustomError")

const checkLoginInputs = (req, res, next) => {

    const { email, password } = req.body;

    if (email === undefined || password === undefined) {
        return next(new CustomError("Email and password has to be set", 400))
    }

    next();
}

module.exports = {
    checkLoginInputs
}