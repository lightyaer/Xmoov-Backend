const nexmo = new Nexmo({
    apiKey: process.env.NEXMO_API_KEY,
    apiSecret: process.env.NEXMO_API_SECRET
  })
const otp = (Math.random() * 10000 + 1)
const text = 'Sending OTP it' + otp;
nexmo.sendSms('xmoov', 9820190820, text );