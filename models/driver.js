const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var DriverSchema = new mongoose.Schema({

    name: {
        type: String,
        minlength: 2,
        required: [true, 'Please enter your Name'],
        trim: true
    },
    mobileNo: {
        type: String,
        minlength: 10,
        required: [true, 'Please enter your Mobile No.'],
        trim: true,
        validate: {
            validator: validator.isMobilePhone,
            message: '{VALUE} is not a valid Mobile Number'
        }
    },
    vehicaleRegNo: {
        type: String,
        minlength: 13,
        required: [true, 'Please enter your Venicle Reg No.'],
        trim: true
    },
    address: {
        type: String,
        trim: true,
        required: [true, 'Please enter your Address']
    },
    email: {
        type: String,
        minlength: 6,
        required: [true, 'Please enter you Email'],
        trim: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        required: [true, 'Please enter your Password'],
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]


})


var Driver = mongoose.model('Driver', DriverSchema);

module.exports = {
    Driver
}