const Question = require("../../model/question")
const CustomError = require("../../helpers/error/CustomError")
const asyncHandler = require("express-async-handler")
const checkifQuestionExist = asyncHandler(async (req, res, next) => {

    const id = req.params.id

    const question = await Question.findById(id)

    if (!question) {
        return next(new CustomError("There is no question with this id", 400))
    }

    req.question = question;

    next();
})
const isOwnerQuestion = asyncHandler(async (req,res,next) => {
   if(req.question.user != req.user.id){
       return next(new CustomError("Question just editable with its owner",403))
   }
   next();
})

module.exports = {
    checkifQuestionExist,
    isOwnerQuestion }