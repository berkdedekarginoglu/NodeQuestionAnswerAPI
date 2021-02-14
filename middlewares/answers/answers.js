const Question = require("../../model/question")
const Answer = require("../../model/answer")
const CustomError = require("../../helpers/error/CustomError")
const mongoose = require("mongoose")
const isAnswerExist = async (req, res, next) => {

    const question = await Question.findById(req.question.id);

    if(!question.answers.includes(mongoose.Types.ObjectId(req.params.answer_id))){
        return next(new CustomError("There is no answer on this question with this id"))
    }

    const answer = await Answer.findById(req.params.answer_id)
    if (!answer) {
        return next(new CustomError("There is no answer with this id", 400))
    }

    req.answer = answer;
    next();
}

const isOwnerAnswers = async (req,res,next) => {
    
    if(req.answer.user != req.user.id){
        return next(new CustomError("You can not modify this answer",403))
    }
    next();
}

module.exports = {
    isAnswerExist,
    isOwnerAnswers
}