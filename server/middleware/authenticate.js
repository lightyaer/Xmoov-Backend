var { Driver } = require('../../models/driver');

var authenticate = (req, res, next) => {
    var token = req.header('x-auth');
    Driver.findByToken(token).then((driver) => {
        
        if (!driver) {
            return Promise.reject();
        }
        req.driver = driver;
        req.token = token;
        next();
    }).catch((e) => {
        res.status(401).send({ message: "Please Login" });
    })
};

module.exports = {
    authenticate
}