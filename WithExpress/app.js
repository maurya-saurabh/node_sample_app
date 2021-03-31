const express = require('express')
const {user_db} = require('./db/mongoose');
require('dotenv').config()
const userRoute = require('./routes/user')
const ticketRoute = require('./routes/ticket')

const app = express()

app.use(express.json())

app.use('/api',userRoute)
app.use('/api',ticketRoute)


app.listen(process.env.PORT, async () => {
    try {
        await user_db
        console.log('Server is up on port ' + process.env.PORT)
    } catch (error) {
        console.log(error.message)
    }
})