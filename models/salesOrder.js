const mongoose = require('mongoose');
const validator = require('validator');

var SalesOrderSchema = new mongoose.Schema({
    _author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    _retailer: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    orderStatus: {
        orderCreated: {
            type: Boolean,
            default: true
        },
        procured: {
            type: Boolean,
            default: false
        },
        inTransit: {
            type: Boolean,
            default: false
        },
        delivered: {
            type: Boolean,
            default: false
        },
        cashCollected: {
            type: Boolean,
            default: false
        }
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
        required: [true, 'Please enter the Item Type'],
        trim: true
    },
    itemSubType: {
        type: String,
        trim: true,
        required: [true, 'Please enter the Item Sub Type']
    },
    itemName: {
        type: String,
        trim: true,
        required: [true, 'Please enter the Item Name']
    },
    remarks: {
        type: String
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
    commission: {
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