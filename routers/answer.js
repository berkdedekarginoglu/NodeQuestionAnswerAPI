const express = require("express")
const answerRouter = express.Router({mergeParams:true});
const {addNewAnswer,getAllAnswers,getSingleAnswer,updateAnswer,deleteAnswer,likeAnswer,unlikeAnswer} = require("../controllers/answers")
const {isAnswerExist,isOwnerAnswers} = require("../middlewares/answers/answers")
answerRouter.post("/",addNewAnswer)
answerRouter.get("/",getAllAnswers)
answerRouter.get("/:answer_id",isAnswerExist,getSingleAnswer)
answerRouter.put("/:answer_id",[isAnswerExist,isOwnerAnswers],updateAnswer)
answerRouter.delete("/:answer_id",[isAnswerExist,isOwnerAnswers],deleteAnswer)
answerRouter.get("/like/:answer_id",isAnswerExist,likeAnswer)
answerRouter.get("/unlike/:answer_id",isAnswerExist,unlikeAnswer)
module.exports = answerRouter