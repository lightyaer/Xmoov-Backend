const mongoose = require('mongoose');
const validator = require('validator');

const purchaseOrderSchema = new mongoose.Schema({

    _author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    _salesOrder: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    _product: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Please select a product'],
        ref: 'Product ID'
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
    discount: {
        type: Number,
        default: 0
    },
    total: {
        type: Number,
        default: 0
    }
})

var PurchaseOrder = mongoose.model('PurchaseOrder', purchaseOrderSchema);

module.exports = {
    PurchaseOrder
}