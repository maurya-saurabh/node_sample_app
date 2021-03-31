const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {user_db}= require('../db/mongoose')


require('dotenv').config();

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        trim: true,
        validate(str){
            if(!str.match(/[a-z]/g) || !str.match(/[A-Z]/g) || !str.match( /[0-9]/g)){
                throw new Error('Password must contain Uppercase, Lowercase and Number')
            }
        }
    },
    name: {
        type: String,
        required: false,
        trim: true
    },
    phone_num: {
        type: Number,
        required: false,
        validate(value) {
            if(value.toString().length != 10 ){
                throw new Error('Phone Number must be of length 10')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ email:user.email }, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('Email/Password is wrong')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Email/Password is wrong')
    }

    return user
}

userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})


const User = user_db.model('User', userSchema)

module.exports = User