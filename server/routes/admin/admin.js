const router = require('express').Router();
const Nexmo = require('nexmo');
const _ = require('lodash');
var moment = require('moment');
var { authenticate } = require('../../middleware/authenticate');
var { Driver } = require('../../../models/driver');
const cors = require('cors');
var corsOptions = {
    exposedHeaders: ['x-auth']
}













module.exports = router