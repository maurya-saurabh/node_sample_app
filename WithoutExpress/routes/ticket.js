const Train = require('../models/trains')
const Ticket = require('../models/tickets')
const auth = require('../auth/auth')
const {fromJSON, toJSON} = require('../JSON/json')


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


const bookingTicket = (req, res, body) => {
    const data = fromJSON(body)
    
    auth(req, async (error, req) => {
        try{
            if(error){
                throw error
            }
            const train = await Train.findTrainsBtwStations(data.source, data.destination)
            const fare = calculate_fare(train.train_data, data.source, data.destination)
            const ticket = new Ticket({
                ticket_id : data.ticket_id,
                train_id : train.train_id,
                source : data.source,
                destination :  data.destination,
                passenger_name : data.passenger_name,
                seat_num : train.remaining_seats,
                fare : fare,
                email : req.user.email
            })
            train.remaining_seats = train.remaining_seats - 1
            await train.save()
            await ticket.save()
            res.status = 201
            res.setHeader('Content-Type', 'application/json')
            res.end(toJSON(ticket))
        } catch(e) {
            res.status = 401
            res.setHeader('Content-Type', 'application/json')
            res.end(toJSON(e))
        }

    })
}

const bookedTickets = (req, res) => {
    auth(req, async (error, req) => {
        try{
            if(error){
                throw error
            }
            const tickets = await Ticket.findTicketbyemail(req.user.email)
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.end(toJSON(tickets))
        } catch(e) {
            const json_error = toJSON(e)
            res.statusCode = 400
            res.setHeader('Content-Type', 'application/json')
            res.end(json_error)
        }
    })
}

module.exports = {bookingTicket, bookedTickets}