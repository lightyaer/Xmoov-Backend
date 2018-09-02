const mongoose = require('mongoose');
const validator = require('validator');
const { SalesOrderProductSchema } = require('./salesOrderProducts');

var SalesOrderSchema = new mongoose.Schema({
    _author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Driver ID'
    },
    _retailer: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Retailer ID'
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
    _orderProduct: [SalesOrderProductSchema],
    remarks: {
        type: String
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