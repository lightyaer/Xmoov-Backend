require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');
const { mongoose } = require('../db/mongoose');
var driverRoutes = require('./routes/user/driver');
var retailerRoutes = require('./routes/user/retailer');
var salesOrderRoutes = require('./routes/user/salesOrder');
var adminRoutes = require('./routes/admin/admin');



var app = express();
var PORT = process.env.PORT;

app.use(bodyParser.json());

app.use('/admin', adminRoutes);

app.use('/drivers', driverRoutes);

app.use('/retailers', retailerRoutes);

app.use('/salesorders', salesOrderRoutes);

app.listen(PORT, () => {
    console.log(`Server is up on Port ${PORT}`);
})

module.exports = {
    app
}