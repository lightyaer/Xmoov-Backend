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
    _orderProduct: ProductWrapperSchema,
    remarks: {
        type: String
    },
    remarks: {
        type: String
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