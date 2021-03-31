const mongoose = require('mongoose');
require('dotenv').config()

mongoose.connect(process.env.DB_URI, { 
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    }, (err) => {
        if(err){
            console.log("DB Not Connected")
            console.log(err.message)
        } else {
            console.log("DB Connected")
        }   
    }
);