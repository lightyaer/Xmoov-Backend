const mongoose = require('mongoose');
const validator = require('validator');
//['barcode', 'SKU', 'nameEn', 'nameAr', 'cost', 'price']
var ProductSchema = new mongoose.Schema({
    barcode: {
        type: String,
        required: true,
        trim: true
    },
    SKU: {
        type: String,
        trim: true
    },
    nameEn: {
        type: String,
        required: true,
        trim: true
    },
    nameAr: {
        type: String,
        required: true,
        trim: true
    },
    cost: {
        type: String,

    },
    price: {
        type: String,


    }

});

let Product = mongoose.model('Product', ProductSchema);

module.exports = {
    Product
}