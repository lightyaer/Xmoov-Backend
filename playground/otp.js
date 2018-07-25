require('../server/config/config');
const Nexmo = require('nexmo');
const nexmo = new Nexmo({
  apiKey: process.env.NEXMO_API_KEY,
  apiSecret: process.env.NEXMO_API_SECRET
})
const otp = (Math.random() * 1000000 + 1).toFixed(0);
const text = 'OTP for Signing Up to XMOOV is ' + otp;
nexmo.message.sendSms('XMOOVS', '919820190820', text, { type: 'unicode' }, (err, response) => {
  if (err) {
    console.log(err);

  }
  if (response) {
    console.log(response);

  }
});