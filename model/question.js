const mongoose = require("mongoose")
const { Schema } = mongoose;
const { slugy } = require("../helpers/libraries/questions")
const QuestionSchema = new Schema({
    title: {
        type: String,
        required: [true, "Please set a title"],
        minlength: 10,
        unique: true
    },

    content: {
        type: String,
        required: [true, "Please set a content"],
        minlength: 10
    },
    slug: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "User"
    },
    answers:[
        {
        type:mongoose.Schema.ObjectId,
        ref:"Answers"
        }
    ],
    likes: [
        {
            type: mongoose.Schema.ObjectId,
            ref:"User"
        }
    ]
})

QuestionSchema.pre("save", async function (next) {
    if (!this.isModified("title")) {
        next();
    }
    this.slug = await slugy(this.title)
    next();
})

module.exports = mongoose.model("Question", QuestionSchema);