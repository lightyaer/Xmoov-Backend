const mongoose = require('mongoose');
const validator = require('validator');

var RetailerSchema = new mongoose.Schema({

    _author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: String,
        required: [true, 'Please enter Retailer\'s Name'],
        minlength: 2,
        trim: true
    },
    company: {
        type: String,
        required: [true, 'Please enter Company\'s Name'],
        minlength: 2,
        trim: true
    },
    address: {
        type: String,
        trim: true,
        required: [true, 'Please enter your Retailer\'s Address']
    },
    postalCode: {
        type: String,
        trim: true,
        validate: {
            validator: validator.isPostalCode,
            message: '{VALUE} is not a valid Postal Code'
        }
    },
    phoneNo: {
        type: String,
        trim: true,
        validate: {
            validator: validator.isMobilePhone,
            message: '{VALUE} is not a valid Mobile No.'
        }
    },
    email: {
        type: String,
        minlength: 6,
        required: [true, 'Email not entered'],
        trim: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    }



});

var Retailer = mongoose.model('Retailer', RetailerSchema);

module.exports = {
    Retailer
}