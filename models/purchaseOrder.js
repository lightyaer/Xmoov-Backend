const mongoose = require('mongoose');
const validator = require('validator');
const { ProductWrapperSchema } = require('../models/productsWrapper');
const purchaseOrderSchema = new mongoose.Schema({

    _author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    _salesOrder: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    _orderProducts: [ProductWrapperSchema],
    remarks: {
        type: String,
        required: [true, "Please enter some Remarks"]
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
    },
    grandTotal: {
        type: Number,
        default: 0
    }
})

var PurchaseOrder = mongoose.model('PurchaseOrder', purchaseOrderSchema);

module.exports = {
    PurchaseOrder
}