require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');
const { mongoose } = require('../db/mongoose');
let driverRoutes = require('./routes/user/driver');
let retailerRoutes = require('./routes/user/retailer');
let salesOrderRoutes = require('./routes/user/salesOrder');
let purchaseOrderRoutes = require('./routes/user/purchaseOrder');
let adminRoutes = require('./routes/admin/admin');
let fileRoutes = require('./routes/admin/saveCsvToDb');
let productRoutes = require('./routes/user/product');
let receiptRoutes = require('./routes/user/receipts');

let app = express();
let PORT = process.env.PORT;

app.use(bodyParser.json());

app.use('/admin', adminRoutes);

app.use('/drivers', driverRoutes);

app.use('/retailers', retailerRoutes);

app.use('/salesorders', salesOrderRoutes);

app.use('/purchaseorders', purchaseOrderRoutes);

app.use('/products', productRoutes);

app.use('/uploads', fileRoutes);

app.use('/receipts', receiptRoutes);

app.listen(PORT, () => {
    console.log(`Server is up on Port ${PORT}`);
})

module.exports = {
    app
}