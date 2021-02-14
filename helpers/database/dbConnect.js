const mongoose = require("mongoose");


const dbConnect = (connectionString) => {
    mongoose.connect(connectionString, 
        {
            useNewUrlParser:true,
            useCreateIndex: true,
            useFindAndModify:false,
            useUnifiedTopology:true
        });
        console.log("Database connected")
} 

module.exports = dbConnect