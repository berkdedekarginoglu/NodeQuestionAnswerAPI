const express = require("express");
const app = express();
const dotenv = require("dotenv");
const customErrorHandler = require("./middlewares/error/customErrorHandling")
const dbConnect = require("./helpers/database/dbConnect");
dotenv.config({
    path:"./config/config.env"
})
const {NODE_ENV,PORT,DB_CONNECT} = process.env
dbConnect(DB_CONNECT);
const baseRouter = require("./routers/baseRouter")

app.listen(PORT,()=>{
    console.log(`Server running on ${PORT} with ${NODE_ENV} mode`)
})
app.use(express.json())
app.use("/api",baseRouter)
app.use(customErrorHandler)
