const mongoose = require('mongoose');
require('dotenv').config()
const user_db = mongoose.createConnection(process.env.DB_URI, { 
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    }, (err) => {
        if(err){
            // console.log("DB Not Connected")
            throw new Error('DB Not Connected')
        } else {
            console.log("DB Connected")
        }   
    }
);

module.exports = {user_db}