const mongoose = require('mongoose');
const validator = require('validator');

var ReceiptSchema = new mongoose.Schema({

    _author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    _salesOrder: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    _receipt: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true
    }
});

var Receipt = mongoose.model('receipt', ReceiptSchema);

module.exports = {
    Receipt
}