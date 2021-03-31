const http = require('http');
require('./db/mongoose');
require('dotenv').config()
const {registerUser, loginUser, logoutUser, resetPassword,userData} = require('./routes/user')
const {toJSON} = require('./JSON/json')
const {bookingTicket, bookedTickets} = require('./routes/ticket')
const addTrain = require('./routes/train')

const server = http.createServer((req, res) => {
    body = ""
    
    req.on('data', chunk => {
        body = body + chunk
    })
    req.on('end', () => {
        //end of data
        if(req.url == "/api/register/" && req.method == 'POST'){
            registerUser(res, body)  
        } else if(req.url == "/api/login/" && req.method == 'POST'){
            loginUser(res, body)
        } else if(req.url == "/api/logout/" && req.method == 'POST'){
            logoutUser(req, res)
        } else if(req.url == "/api/resetpassword/" && req.method == 'PATCH'){
            resetPassword(req, res, body)
        } else if(req.url == "/api/user/" && req.method == 'GET'){
            userData(req, res)
        } else if(req.url == "/api/addtrain/" && req.method == 'POST'){
            addTrain(res, body)
        } else if(req.url == "/api/bookingticket/" && req.method == 'POST'){
            bookingTicket(req, res, body)
        } else if(req.url == "/api/bookedtickets/" && req.method == 'GET'){
            bookedTickets(req, res)
        } else {
            res.status = 404
            res.setHeader('Content-Type', 'application/json')
            res.end(toJSON({error : "api error"}))
        }
    })
    
})

server.listen(process.env.PORT, process.env.HOST, () => {
    console.log('Server is up on port ' + process.env.PORT)
})