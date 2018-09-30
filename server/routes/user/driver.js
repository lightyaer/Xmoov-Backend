const router = require('express').Router();
const Nexmo = require('nexmo');
const _ = require('lodash');
var moment = require('moment');

const { authenticate } = require('../../middleware/authenticate');
const { Driver } = require('../../../models/driver');
const cors = require('cors');
const corsOptions = {
    exposedHeaders: ['x-auth']
}

router.use(cors());
//#region DRIVER

//COLLECT DETAILS OF DRIVERS AND SEND OTP TO MOBILE NUMBER
let body;
let otp;
//
router.post('/signup', async (req, res) => {
    try {
        body = _.pick(req.body, ['email', 'password', 'name', 'mobileNo', 'vehicleRegNo', 'address']);

        const nexmo = new Nexmo({
            apiKey: process.env.NEXMO_API_KEY,
            apiSecret: process.env.NEXMO_API_SECRET
        })
        otp = (Math.random() * 1000000 + 1).toFixed(0);
        let text = 'OTP for Signing up is ' + otp;
        setTimeout(() => {
            text = undefined;
        }, 180000
        );

        if (text) {
            nexmo.message.sendSms("XMOOVS", body.mobileNo, 'OTP for Signing up is ' + otp, { type: 'unicode' },
                (err, responseData) => {
                    if (err) {
                        return res.status(400).send({ message: 'error in sending OTP' })
                    }
                    if (responseData) {
                        return res.status(200).send({ message: 'OTP has been sent ' + otp });
                    }
                })
        }
    } catch (e) {
        let errStr = "";
        for (let err of Object.keys(e.errors)) {
            errStr += e.errors[err].message + ',';
        }
        if (errStr.length > 0) {
            return res.status(400).send({ message: errStr });
        }
        res.status(400).send({ message: 'Couldn\'t send otp' })
    }
})

//VERIFY DRIVER MOBILE NO AND SAVE DB
router.post('/otp', cors(corsOptions), async (req, res) => {

    try {
        if (req.body.otp === otp) {
            body.otpAuth = true;
            body.subscribedOn = new Date().getTime();
            var newDriver = new Driver(body);
            await newDriver.save();
            const token = await newDriver.generateAuthToken();
            res.status(200).header('x-auth', token).send(newDriver);
        } else {
            res.status(400).send({ message: 'OTP didn\'t Match' })
        }
    } catch (e) {
        if (e.errors) {
            let errStr = "";
            for (let err of Object.keys(e.errors)) {
                errStr += e.errors[err].message + ',';
            }
            if (errStr.length > 0) {
                return res.status(400).send({ message: errStr });
            }
        }
        res.status(400).send({ message: 'Couldn\'t Sign Up' })
    }
})

//VERIFY DRIVER, GET DRIVER DETAILS
router.get('/me', authenticate, async (req, res) => {

    res.status(200).send(req.driver);
})

//SET LANGUAGE
router.post('/lang', authenticate, async (req, res) => {
    try {
        let lang = req.body.lang;
        lang = lang ? lang : 'en';
        const driver = await Driver.findOneAndUpdate(
            { _id: req.driver._id },
            { $set: { lang: lang } },
            { upsert: true, new: true }
        )
        return res.status(200).send(driver);
    } catch (error) {
        return res.status(400).send();
    }
})

//LOGIN FOR DRIVER
router.post('/login', cors(corsOptions), async (req, res) => {
    try {

        const body = _.pick(req.body, ['email', 'password']);
        let driver = await Driver.findByCredentials(body.email, body.password);

        const endDate = moment(driver.subscribedOn).add(30, 'days');
        const startDate = moment(driver.subscribedOn);
        if (moment().isBefore(moment(endDate)) && moment().isAfter(moment(startDate))) {
            const token = await driver.generateAuthToken();
            res.status(200).header('x-auth', token).send(driver);
        } else {
            res.status(401).send({ message: 'Subscription has ended, Kindly renew the Service' });
        }
    } catch (e) {

        return res.status(400).send({ message: e.message });
    }
})

//LOGOUT FOR DRIVER
router.delete('/me/token', authenticate, async (req, res) => {
    try {
        await req.driver.removeToken(req.token)
        res.status(200).send();
    } catch (e) {

        res.status(400).send({ message: 'Failed to Logout, please try again' });
    }
})

router.post('/check', cors(corsOptions), async (req, res) => {
    try {
        const body = _.pick(req.body, ['email']);
        let driver = await Driver.findOne({ email: body.email });
        if (driver.tokens[0]) {

            res.status(200).header('x-auth', driver.tokens[0].token).send(driver);
        } else {
            res.status(401).send({ message: 'Please Login to continue' });
        }
    } catch (e) {
        res.status(401).send({ message: 'Please Login to continue' });
    }
})


//#endregion

module.exports = router