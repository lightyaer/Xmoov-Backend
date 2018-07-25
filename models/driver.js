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
        // validate: {
        //     validator: function (v) {
        //         return /^(?:\+971|00971|0|\+91)?(?:50|51|52|55|56|2|3|4|6|7|9)\d{7}$/.test(v);
        //     },
        //     message: '{VALUE} is not a valid Mobile Number'
        // }
    },
    vehicleRegNo: {
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
        unique: [true, 'Email already Exists, Please Login'],
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
    otpAuth: {
        type: Boolean
    },
    subscribedOn: {
        type: Number,
        required: true
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


DriverSchema.methods.toJSON = function () {
    var user = this;
    var userObject = user.toObject();
    return _.pick(userObject, ['_id', 'email', 'address', 'vehicleRegNo', 'mobileNo', 'name', 'subscribedOn', 'otpAuth']);
}

DriverSchema.methods.generateAuthToken = function () {
    var driver = this;
    var access = 'auth';
    var token = jwt.sign({ _id: driver._id.toHexString(), access }, process.env.JWT_SECRET).toString();
    driver.tokens.push({ access, token });
    return driver.save().then(() => {
        return token;
    });
}

DriverSchema.statics.findByToken = function (token) {
    var Driver = this;
    var decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
        return Driver.findOne({
            '_id': decoded._id,
            'tokens.token': token,
            'tokens.access': 'auth'
        })
    }
    catch (e) {
        return Promise.reject();
    }
}

DriverSchema.pre('save', function (next) {
    var driver = this;
    if (driver.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(driver.password, salt, (err, hash) => {
                driver.password = hash;
                next();
            });
        });
    } else {
        next();
    }
})

DriverSchema.statics.findByCredentials = function (email, password) {
    var Driver = this;
    return Driver.findOne({ email }).then(driver => {
        if (driver.otpAuth && !driver) {
            return Promise.reject();
        }

        return new Promise((resolve, reject) => {
            bcrypt.compare(password, driver.password, (err, hash) => {
                if (hash) {
                    resolve(driver);
                } else {
                    reject({ message: "Please check the Username and Password." });
                }
            })
        })
    })
}

DriverSchema.methods.removeToken = function (token) {
    var driver = this;
    return driver.update({
        $pull: {
            tokens: { token }
        }
    });
}

var Driver = mongoose.model('Driver', DriverSchema);

module.exports = {
    Driver
}