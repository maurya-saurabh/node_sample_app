const jwt = require('jsonwebtoken')
const User = require('../models/users')
require('dotenv').config()

const auth = async (req, callback) => {
    try {
        const token = req.headers.authorization.replace('Bearer ', '')
        console.log(token)
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ email: decoded.email, 'tokens.token': token })
        if (!user) {
            throw new Error()
        }

        req.token = token
        req.user = user
        callback(undefined, req)
    } catch (e) {
        callback({ error: 'Please authenticate.' }, undefined)
    }
}

module.exports = auth