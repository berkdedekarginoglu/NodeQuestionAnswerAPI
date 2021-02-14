const asyncHandler = require("express-async-handler")
const Question = require("../model/question")
const CustomError = require("../helpers/error/CustomError");

const addNewQuestion = asyncHandler(async (req, res) => {

    const information = req.body;


    const question = await Question.create({
        ...information,
        user: req.user.id
    })

    await question.save();

    res
        .status(201)
        .json({
            success: true,
            data: question
        })

})

const getAllQuestions = asyncHandler(async (req, res, next) => {

    const popualate = true;
    const populateObject = {
        path : "user",
        select:"name profile_picture"
    }
    
    let query = Question.find();

    if(req.query.search){
        const titleFilter = {}
        const regex = RegExp(req.query.search,"i")
        titleFilter["title"] = regex
        query = query.where(titleFilter)

    }

    if(popualate){
        query = query.populate(populateObject)
    }

    const allQuestions = await query;

    res
    .status(200)
    .json({
        success: true,
        data: allQuestions
    })

 
})

const getSingleQuestion = asyncHandler(async (req, res) => {

    res
        .status(200)
        .json({
            success: true,
            data: req.question
        })
})

const editQuestion = asyncHandler(async (req, res) => {

    const edit = req.body;

    const question = await Question.findByIdAndUpdate(req.question.id, {
        ...edit
    }, { new: true, runValidators: true })

    await question.save();

    if (!question) {
        return next(new CustomError("There is a problem while editing question", 400))
    }


    res
        .status(200)
        .json({
            success: true,
            data: question
        })



})

const removeQuestion = asyncHandler(async (req, res, next) => {

    await Question.findByIdAndDelete(req.question.id, (err) => {
        if (err) {
            return next(new CustomError("There is a problem while removing question", 500))
        }

        res
            .status(200)
            .json({
                success: true
            })

    })
    // Question.findByIdAndDelete()
})

const likeQuestion = asyncHandler(async (req, res,next) => {

    const question = await Question.findById(req.params.id)

    if (!question) {
        return next(new CustomError(`There is no questin with this id ${req.params.id}`, 400))
    }

    if(question.likes.includes(req.user.id)){
        return next(new CustomError("You are already liked this question",400))
    }

    question.likes.push(req.user.id)

    await question.save();

    res
    .status(200)
    .json({
        success:true,
        message:`${question.id} liked`
    })

})

const unlikeQuestion = asyncHandler(async (req, res,next) => {

    const question = await Question.findById(req.params.id)

    if (!question) {
        return next(new CustomError(`There is no questin with this id ${req.params.id}`, 400))
    }

    if(!question.likes.includes(req.user.id)){
        return next(new CustomError("You are not liked this question",400))
    }

    question.likes.splice(req.user.id,1)

    await question.save();

    res
    .status(200)
    .json({
        success:true,
        message:`${question.id} unliked`
    })

})

module.exports = {
    addNewQuestion,
    getAllQuestions,
    getSingleQuestion,
    editQuestion,
    removeQuestion,
    likeQuestion,
    unlikeQuestion
}