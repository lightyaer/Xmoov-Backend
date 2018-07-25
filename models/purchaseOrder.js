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