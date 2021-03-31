const User = require('../models/users')
const auth = require('../auth/auth')
const {fromJSON, toJSON} = require('../JSON/json')

const registerUser = async(res, body) => {
    const data = fromJSON(body)

    const user = new User(data)

    try {
        await user.save()
        const token = await user.generateAuthToken()
        const json_user = toJSON({user, token})
        res.statusCode = 201
        res.setHeader('Content-Type', 'application/json')
        res.end(json_user)
    } catch (e) {
        const json_error = toJSON(e)
        res.statusCode = 409
        res.setHeader('Content-Type', 'application/json')
        res.end(json_error)
    }
    
}

const loginUser = async(res, body) => {
    const data = fromJSON(body)

    try {
        const user = await User.findByCredentials(data.email, data.password)
        const token = await user.generateAuthToken()
        const json_user = toJSON(token)
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.end(json_user)
    } catch (e) {
        const json_error = toJSON(e)
        res.statusCode = 401
        res.setHeader('Content-Type', 'application/json')
        res.end(json_error)
    }
}

const logoutUser = (req, res) => {
    auth(req, async (error, req) => {
        try{
            if(error) {
                throw error
            }
            req.user.tokens = req.user.tokens.filter((token) => {
                return token.token !== req.token
            })
            await req.user.save()
    
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.end(toJSON({message : "logged out successfully"}))
        } catch (e) {
            const json_error = toJSON(e)
            res.statusCode = 400
            res.setHeader('Content-Type', 'application/json')
            res.end(json_error)
        }
    })
    
}

const resetPassword = (req, res, body) => {
    const data = fromJSON(body)
    auth(req, async (error, req) => {
        try{
            if(error){
                throw error
            }
            if(!data.new_password){
                throw {error : 'New Passowrd Required'}
            }
            const user = await User.findByCredentials(req.user.email, data.password)
            user.password = data.new_password
            await user.save()
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.end(toJSON({message : "Password Changed"}))
        } catch(e){
            const json_error = toJSON(e)
            res.statusCode = 400
            res.setHeader('Content-Type', 'application/json')
            res.end(json_error)
        }
        
    })
}

const userData = (req, res) => {
    auth(req, async (error, req) => {
        try{
            if(error){
                throw error
            }
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.end(toJSON(req.user))
        } catch(e) {
            const json_error = toJSON(e)
            res.statusCode = 400
            res.setHeader('Content-Type', 'application/json')
            res.end(json_error)
        }
    })
}

module.exports = {registerUser, loginUser, logoutUser, resetPassword, userData}