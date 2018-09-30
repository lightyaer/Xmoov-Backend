const mongoose = require('mongoose');
const { ProductWrapperSchema } = require('../models/productsWrapper');
const purchaseOrderSchema = new mongoose.Schema({

    _author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    _salesOrder: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Please choose a Sales Order."],
    },
    _orderProducts: {
        type: [ProductWrapperSchema],
        validate: {
            validator: function (v) {
                return v.length === 0 ? false : true;
            },
            message: 'Please choose Product/s.'
        }
    },
    remarks: {
        type: String,
        required: [true, "Please enter some Remarks"]
    },
    tax: {
        type: Number,
        default: 0
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