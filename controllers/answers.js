const asyncHandler = require("express-async-handler")
const Answers = require("../model/answer")
const CustomError = require("../helpers/error/CustomError");
const mongoose = require("mongoose");
const answer = require("../model/answer");
const { json } = require("express");

const addNewAnswer = asyncHandler(async (req, res) => {

    const content = req.body.content

    const answer = await Answers.create({
        content: content,
        user: req.user.id,
        question: req.params.id
    })

    await answer.save();

    res
        .status(200)
        .json({
            success: true,
            message: `${content} added to ${req.params.id}`
        })

})
const getAllAnswers = asyncHandler(async (req, res) => {

    const answers = await Answers.find({ question: req.question.id })

    if (answers.length < 1) {
        res
            .status(200)
            .json({
                success: true,
                message: "There is no answer on this question yet"
            })

    }
    else {
        res
            .status(200)
            .json({
                success: true,
                data: answers
            })
    }
})
const getSingleAnswer = asyncHandler(async (req, res) => {
    res
        .status(200)
        .json({
            success: true,
            data: req.answer
        })
})
const updateAnswer = asyncHandler(async (req, res) => {

    const answer = req.answer;

    answer.content = req.body.content;

    await answer.save();

    res
        .status(200)
        .json({
            success: true,
            data: answer
        })
})
const deleteAnswer = asyncHandler(async (req, res) => {

    const answer = req.answer;

    await answer.remove();

    res
        .status(200)
        .json({
            success: true,
            message: `${answer.id} deleted`
        })

})
const likeAnswer = asyncHandler(async (req, res, next) => {

    const answer = req.answer;

    if (answer.likes.includes(req.user.id)) {
        return next(new CustomError("You are already liked this question", 400))
    }

    answer.likes.push(req.user.id)

    await answer.save();

    res
    .status(200)

    .json({
        success:true,
        message:`${answer.id} liked`
    })

})

const unlikeAnswer = asyncHandler(async (req, res, next) => {

    const answer = req.answer;

    if (!answer.likes.includes(req.user.id)) {
        return next(new CustomError("You are not liked this question", 400))
    }

    answer.likes.splice(req.user.id,1)

    await answer.save();

    res
    .status(200)

    .json({
        success:true,
        message:`${answer.id} unliked`
    })

})

module.exports = {
    addNewAnswer,
    getAllAnswers,
    getSingleAnswer,
    updateAnswer,
    deleteAnswer,
    likeAnswer,
    unlikeAnswer
}