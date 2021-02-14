const asyncHandler = require("express-async-handler")
const User = require("../model/user");
const CustomError = require("../helpers/error/CustomError")
const { sendTokenToClient, comparePassword } = require("../helpers/authentication/auth")
const sendTokenToMail = require("../helpers/libraries/sendMail")
const register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body

    const user = await User.create(
        {
            name: name,
            email: email,
            password: password
        })

    res
        .status(201)
        .json({
            success: true,
            data: user
        });

})

const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body

    const user = await User.findOne({ email }).select("+password");

    if (!user) { // Eğer kullanıcı eşleşmedi ise
        return next(new CustomError(`There is no users match with this email ${email}`, 400))
    }

    if(user.isBlocked){
        return next(new CustomError("This account is blocked",401))
    }

    if (await comparePassword(password, user.password) == false) { // Eğer parola eşleşmedi ise
        return next(new CustomError("Wrong password", 400))
    }

    const token = await sendTokenToClient(user);

    const { CK_EXPIRE, NODE_ENV } = process.env

    res
        .status(200)
        .cookie("accesstoken", token, {
            httpOnly: true,
            secure: NODE_ENV == "development" ? false : true,
            expire: CK_EXPIRE + Date.now()
        })
        .json({
            success: true,
            token: token
        })

})

const logout = asyncHandler(async (req, res) => {

    res
        .status(200)
        .clearCookie('accesstoken')
        .json({
            success: true,
            message: "Successfully logout"
        })

})

const forgotPassword = asyncHandler(async (req, res, next) => {
    const { email } = req.body;

    const user = await User.findOne({ email })

    if (!user) {
        return next(new CustomError("There is no user for this mail", 400))
    }

    const token = await user.generateResetPasswordToken()

    const resetTokenUrl = `http://localhost:5500/api/auth/resetpassword?resetPasswordToken=${token}`;

    await user.save()

    try {
        await sendTokenToMail({
            from: process.env.SMTP_USER, // sender address
            to: email, // list of receivers
            subject: "Hello ✔", // Subject line
            title: "Hello",
            html: `<a href=${resetTokenUrl}>Link</a>`, // html body
        })
    }
    catch (err) {
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined
        await user.save();

        next(new CustomError("There is a problem while sending email", 500))
    }

    res
        .status(200)
        .json({
            success: true,
            token: token,
            message: `Reset link has sent to ${email}`
        })


})

const resetPassword = asyncHandler(async (req, res, next) => {

    const { resetPasswordToken } = req.query

    const user = await User.findOne(
        {
            resetPasswordToken: resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        })

    if (!user) {
        return next(new CustomError("Token expired or wrong", 401))
    }

    user.password = req.body.password;

    await user.save(async (err) => {
        if (err) {
            return next(new CustomError(err.message, 400))
        }
        else {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

           await user.save();

            res
                .status(200)
                .json({
                    success: true,
                    message: "Password changed successfully"
                })
        }
    });



})



module.exports = {
    register,
    login,
    logout,
    resetPassword,
    forgotPassword
}