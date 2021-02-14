const mongoose = require("mongoose")
const { Schema } = mongoose;
const bcrypt = require("bcryptjs")
const crypto = require("crypto")
const { RETOKEN_EXPIRE } = process.env;
const Question = require("./question")
const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/]
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        select: false
    },
    place: {
        type: String
    },
    profile_picture: {
        type: String,
        default: "default.jpg"
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpire: {
        type: Date
    }
})

UserSchema.methods.generateResetPasswordToken = async function () {
    const hextString = crypto.randomBytes(15).toString("hex");
    const hash = await crypto.createHash('SHA256').update(hextString).digest("hex");
    this.resetPasswordToken = hash;
    this.resetPasswordExpire = Date.now() + parseInt(RETOKEN_EXPIRE)
    return hash;
}

UserSchema.pre("save", function (next) {
    if (!this.isModified("password")) {
        next();
    }
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(this.password, salt, (err, hash) => {
            this.password = hash
            return next();
        });
    });
})

UserSchema.post("remove", async function () {
    await Question.deleteMany({
        user: this._id
    });
})

module.exports = mongoose.model("User", UserSchema)