var { Driver } = require('../../models/driver');

var authenticate = (req, res, next) => {
    var token = req.header('x-auth');


    Driver.findByToken(token).then((driver) => {
        console.log(driver);
        if (!driver) {

            return Promise.reject();
        }
        req.driver = driver;
        req.token = token;
        next();
    }).catch(() => {

        res.status(401).send({ message: "Please Login" });
    })
};

module.exports = {
    authenticate
}