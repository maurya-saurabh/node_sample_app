const Train = require('../models/trains')
const {fromJSON, toJSON} = require('../JSON/json')

const addTrain = async(res, body) => {
    const data = fromJSON(body)
    const train = new Train(data)

    try {
        await train.save()
        res.status = 201
        res.setHeader('Content-Type', 'application/json')
        res.end(toJSON(train))
    } catch (e) {
        res.status = 409
        res.setHeader('Content-Type', 'application/json')
        res.end(toJSON(e))
    }
}

module.exports = addTrain