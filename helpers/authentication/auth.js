const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const asyncHandler = require("express-async-handler")
const crypto = require("crypto")
const sendTokenToClient = async (user) => {

    const { JWT_SECRET_KEY, JWT_EXPIRE } = process.env

    const payload = {
        id: user.id,
        email: user.email
    }
    const token = await jwt.sign(payload, JWT_SECRET_KEY, {
        expiresIn: JWT_EXPIRE
    })

    return token
} // Token oluştur ve clienta gönder

const comparePassword = async (password, hash) => {
    return await bcrypt.compareSync(password, hash)
} // Kullanıcı passwordünü decrypt et ve karşılaştır

const isTokenIncluded = (req) => {
    return req.headers.accesstoken && req.headers.accesstoken.startsWith("Bearer") ? true : false
} // Header token içeriyor mu

const parseToken = asyncHandler((token) => {
    return token.split(' ')[1]
})// Token , bearer ayrımı


module.exports = {
    comparePassword,
    sendTokenToClient,
    isTokenIncluded,
    parseToken
}

