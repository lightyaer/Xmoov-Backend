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
    },//
    postalCode: {
        type: String,
        trim: true,
        validate: {
            validator: function (v) {
                return /^\d{6}$/.test(v);
            },
            message: '{VALUE} is not a valid Postal Code'
        }
    },
    phoneNo: {
        type: String,
        trim: true,
        validate: {
            validator: function (v) {
                return /^(\+?91|0)?[6789]\d{9}$/.test(v);
            },
            message: '{VALUE} is not a valid Mobile Number'
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
    },
    shipToSame: {
        type: Boolean,
        required: true,
        default: false
    },
    shipName: {
        type: String,
        trim: true,
        default: null
    },
    shipCompany: {
        type: String,
        trim: true,
        default: null
    },
    shipAddress: {
        type: String,
        trim: true,
        default: null
    },
    shipPostalCode: {
        type: Number,
        default: null
    },
    shipPhoneNo: {
        type: String,
        default: null
    },
    shipEmail: {
        type: String,
        trim: true,
        default: null
    }




});

var Retailer = mongoose.model('Retailer', RetailerSchema);

module.exports = {
    Retailer
}