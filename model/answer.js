const mongoose = require("mongoose")
const { Schema } = mongoose;
const Question = require("./question")
const AnswerSchema = new Schema({
    content: {
        type: String,
        required: [true, "Please set a content"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    question: {
        type: mongoose.Schema.ObjectId,
        ref: "Question",
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    likes: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "User"
        }
    ]
})

AnswerSchema.pre("save", async function (next) {
    if(!this.isModified("user")) return next();
    const question =await Question.findById(this.question)
    question.answers.push(this._id)
    await question.save();
    next();
})

module.exports = mongoose.model("Answers", AnswerSchema)