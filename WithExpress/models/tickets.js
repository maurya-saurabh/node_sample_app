// tickets schema
// get ticket for single user email

const mongoose = require('mongoose');


const ticketSchema = new mongoose.Schema({
    ticket_id: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        minlength: 5,
    },
    train_id: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        minlength: 5,
    },
    source: {
        type: String,
        required: true,
        trim: true,
    },
    destination: {
        type: String,
        required: true,
        trim: true
    },
    passenger_name: {
        type: String,
        required: true,
        trim: true
    },
    seat_num : {
        type: Number,
        required: true
    },
    fare : {
        type: Number,
        required:true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    }
})


ticketSchema.statics.findTicketbyemail = async (email) => {
    const tickets = await Ticket.find({email})
    if (!tickets) {
        throw new Error('No ticket booked')
    }
    return tickets
}



const Ticket = mongoose.model('Ticket', ticketSchema)

module.exports = Ticket