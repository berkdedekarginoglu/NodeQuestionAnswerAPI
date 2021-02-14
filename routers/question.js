const express = require("express")
const questionRouter = express.Router();
const {addNewQuestion,getAllQuestions,getSingleQuestion,editQuestion,removeQuestion,likeQuestion,unlikeQuestion} = require("../controllers/question")
const {checkifQuestionExist,isOwnerQuestion} = require("../middlewares/questions/question")
const answerRouter = require("./answer")
questionRouter.post("/new",addNewQuestion)
questionRouter.get("/",getAllQuestions)
questionRouter.get("/:id",checkifQuestionExist,getSingleQuestion)
questionRouter.post("/edit/:id",[checkifQuestionExist,isOwnerQuestion],editQuestion)
questionRouter.delete("/remove/:id",[checkifQuestionExist,isOwnerQuestion],removeQuestion)
questionRouter.get("/like/:id",checkifQuestionExist,likeQuestion)
questionRouter.get("/unlike/:id",checkifQuestionExist,unlikeQuestion)
questionRouter.use("/:id/answers",checkifQuestionExist,answerRouter)
module.exports = questionRouter