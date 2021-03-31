const express = require('express')
const User = require('../models/users')
const auth = require('../auth/auth')

const router = new express.Router()

router.post('/register', async(req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        const token = await user.generateAuthToken()
        const response_code = '0000'
        res.status(201).send({ user, token, response_code })
    } catch (e) {
        const response_code = '0001'
        if(e.name === 'MongoError' && e.code === 11000){
            res.status(409).send({error:"Email address already exist", response_code})
        }else {
            res.status(409).send({error:e.message, response_code})
        }
    }
})
router.post('/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        const response_code = '0000'
        res.status(200).send({token, response_code})
    } catch (e) {
        const response_code = '1001'
        res.status(401).send({error:e.message, response_code})
    }
})
router.post('/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        const response_code = '0000'
        res.send({message:'logged out successfully', response_code})
    } catch (e) {
        const response_code = '1011'
        res.status(500).send({error:e.message, response_code})
    }
})
router.patch('/resetpassword', auth, async (req, res) => {
    
    try {
        if(!req.body.new_password){
            throw new Error('New Passowrd Required')
        }
        const user = await User.findByCredentials(req.user.email, req.body.old_password)
        user.password = req.body.new_password
        await user.save()
        const response_code = '0000'
        res.send({message:"password changed", response_code})
    } catch (e) {
        const response_code = '1101'
        res.status(400).send({error:e.message, response_code})
    }
})
router.get('/user', auth, async (req, res) => {
    try{
        const response_code = '0000'
        res.status(200).send({user:req.user, response_code})
    } catch(e){
        const response_code = '1003'
        res.status(404).send({error:e.message, response_code})
    }
    
})

module.exports = router