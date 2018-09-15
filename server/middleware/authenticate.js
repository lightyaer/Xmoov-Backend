var { Driver } = require('../../models/driver');

var authenticate = (req, res, next) => {
    var token = req.header('x-auth');
    console.log(token);

    Driver.findByToken(token).then((driver) => {

        if (!driver) {

            return Promise.reject();
        }
        console.log(driver);
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