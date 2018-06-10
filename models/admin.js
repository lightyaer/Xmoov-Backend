const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var AdminSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 2,
        required: [true, 'Please enter your Name'],
        trim: true
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

AdminSchema.methods.toJSON = function () {
    var user = this;
    var userObject = user.toObject();
    return _.pick(userObject, ['_id', 'email', 'name']);
}

AdminSchema.methods.removeToken = function (token) {
    var admin = this;
    return admin.update({
        $pull: {
            tokens: { token }
        }
    });
}

AdminSchema.statics.findByCredentials = function (email, password) {
    var Admin = this;
    return Admin.findOne({ email }).then(admin => {
        if (!admin) {
            return Promise.reject();
        }

        return new Promise((resolve, reject) => {
            bcrypt.compare(password, admin.password, (err, hash) => {
                if (hash) {
                    resolve(admin);
                } else {
                    reject();
                }
            })
        })
    })
}

AdminSchema.pre('save', function (next) {
    var admin = this;
    if (admin.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(admin.password, salt, (err, hash) => {
                admin.password = hash;
                next();
            })
        })
    }
})

AdminSchema.statics.findBytoken = function (token) {
    var Admin = this;
    var decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
        return Admin.findOne({
            '_id': decoded._id,
            'tokens.token': token,
            'tokens.access': 'auth'
        })
    } catch (e) {
        return Promise.reject();
    }
}

AdminSchema.methods.generateAuthToken = function () {
    var admin = this;
    var access = 'auth';
    var token = jwt.sign({ _id: admin._id.toHexString(), access }, process.env.JWT_SECRET).toString();
    admin.tokens.push({ access, token });
    return admin.save().then(() => {
        return token;
    })
}

var Admin = mongoose.model('Admin', AdminSchema);

module.exports = {
    Admin
}