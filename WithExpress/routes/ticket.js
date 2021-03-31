const express = require('express')
const User = require('../models/users')
const Train = require('../models/trains')
const Ticket = require('../models/tickets')
const auth = require('../auth/auth')

const router = new express.Router()

// router.post('/addtrain', async(req, res) => {
//     const train = new Train(req.body)

//     try {
//         await train.save()
//         res.status(201).send(train)
//     } catch (e) {
//         res.status(409).send({error:e.message})
//     }
// })
function calculate_fare(train_data,source, destination){
    source_fare = 0
    dest_fare = 0
    train_data.forEach((station) => {
        if(station.station == source){
            source_fare = station.fare
        }
        if(station.station == destination){
            dest_fare = station.fare
        }
    })
    return dest_fare - source_fare
}
router.post('/bookingticket', auth, async (req, res) => {
    try{
        const train = await Train.findTrainsBtwStations(req.body.source, req.body.destination)
        const fare = calculate_fare(train.train_data, req.body.source, req.body.destination)
        const ticket = new Ticket({
            ticket_id : req.body.ticket_id,
            train_id : train.train_id,
            source : req.body.source,
            destination :  req.body.destination,
            passenger_name : req.body.passenger_name,
            seat_num : train.remaining_seats,
            fare : fare,
            email : req.user.email
        })
        if(!train.remaining_seats > 0){
            throw new Error('Seats Are Full')
        }
        train.remaining_seats = train.remaining_seats - 1
        await train.save()
        await ticket.save()
        const response_code = '0000'
        res.status(201).send({ticket, response_code})
    } catch(e) {
        const response_code = '2001'
        res.status(401).send({error:e.message, response_code})
    }
})

router.get('/bookedtickets', auth, async (req, res) => {
    try {
        const tickets = await Ticket.findTicketbyemail(req.user.email)
        const response_code = '0000'
        res.status(200).send({tickets, response_code})
    } catch (e) {
        const response_code = '2003'
        res.status(404).send({error:e.message, response_code})
    }
})
module.exports = router