const mongoose = require('mongoose');
const validator = require('validator');

var SalesOrderSchema = new mongoose.Schema({
    
    _retailer: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    orderDate: {
        type: Number,
        required: [true, 'Please enter the Order Date'],
    },
    itemCode: {
        type: Number,
        required: [true, 'Please enter the Item Code']
    },
    itemType: {
        type: String,
        required: [true, 'Please enter the Item Type']
    },
    itemSubType: {
        type: String,
        required: [true, 'Please enter the Item Sub Type']
    },
    itemName: {
        type: String,
        required: [true, 'Please enter the Item Name']
    },
    quantity: {
        type: Number,
        required: [true, 'Please enter the Quantity']
    },
    unitPrice: {
        type: Number,
        default: 1
    },
    tax: {
        type: Number,
        default: 1
    },
    handling: {
        type: Number,
        default: 1
    },
    commision: {
        type: Number,
        default: 1
    },
    discount: {
        type: Number,
        default: 0
    },
    total: {
        type: Number,
        default: 0
    },
    grandTotal: {
        type: Number,
        default: 0
    }
})

var SalesOrder = mongoose.model('SalesOrder', SalesOrderSchema);

module.exports = {
    SalesOrder
}