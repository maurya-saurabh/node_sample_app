// train schema
// find trains b/t s-d - static
// find trains with +fare and rem seat > 0 - static
// dec 1 seat from train rem seat - method

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
    if(!source_trains[0]){
        console.log('here')
        throw new Error('No train found between source and destination')
    }
    console.log(source_trains)
    const trains = []
    source_trains.forEach((train) => {
        train.train_data.forEach((item) => {
            if(item.station == destination){
                trains.push(train)
            }
        })
    })
    if (!trains[0]) {
        throw new Error('No train found between source and destination')
    }


    return trains[0]
}



const Train = mongoose.model('Train', trainSchema)

module.exports = Train