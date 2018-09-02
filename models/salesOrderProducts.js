const mongoose = require('mongoose');


var SalesOrderProductSchema = new mongoose.Schema({
    _product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
});

module.exports = {
    SalesOrderProductSchema
}