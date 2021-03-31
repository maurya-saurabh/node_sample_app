const mongoose = require('mongoose');


const trainSchema = new mongoose.Schema({
    train_id: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        minlength: 5,
    },
    train_name: {
        type: String,
        required: true,
        trim: true,
    },
    train_data: [{
        station: {
            type: String,
            required: true,
            trim: true
        },
        fare: {
            type: Number,
            required: true,
            min: 0
        }
    }],
    remaining_seats : {
        type: Number,
        required: true,
        min:0
    }

})

trainSchema.statics.findTrainsBtwStations = async (source, destination) => {
    
    const source_trains = await Train.find({"train_data.station": source, remaining_seats: {$gt: 0}})
    const trains = []
    source_trains.forEach((train) => {
        train.train_data.forEach((item) => {
            if(item.station == destination){
                trains.push(train)
            }
        })
    })
    if (!trains) {
        throw {error:'No train found between source and destination'}
    }


    return trains[0]
}



const Train = mongoose.model('Train', trainSchema)

module.exports = Train