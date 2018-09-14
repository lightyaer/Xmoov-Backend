const router = require('express').Router();
const _ = require('lodash');
const mongoose = require('mongoose');
const cors = require('cors');


const { ObjectID } = require('mongodb');

const { authenticate } = require('../../middleware/authenticate');

const { PurchaseOrder } = require('../../../models/purchaseOrder');

const { SalesOrder } = require('../../../models/salesOrder');

router.use(cors());

//GET ALL PURCHASE ORDERS 
router.get('/all', authenticate, async (req, res) => {

    try {

        let name = _.isString(req.query.name) ? req.query.name : "";
        const result = await PurchaseOrder.aggregate([
            {
                $match: {
                    _author: req.driver._id
                }
            },
            {
                $unwind:
                {
                    path: '$_orderProducts'
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: '_orderProducts._product',
                    foreignField: '_id',
                    as: 'products'
                }
            },
            {
                $unwind: {
                    path: '$products'
                }
            },
            {
                $match: {
                    "products.nameEn": {
                        $options: 'i',
                        $regex: name,

                    }
                }
            },
            {
                $group: {
                    _id: "$_id",
                    _salesOrder: { $first: "$_salesOrder" },
                    productObjects: {
                        $push: {
                            $mergeObjects: ['$_orderProducts', '$products']
                        }
                    },
                    discount: { $first: "$discount" },
                    tax: { $first: "$tax" },
                    total: { $first: "$total" },
                    _author: { $first: "$_author" },
                    remarks: { $first: "$remarks" },
                    grandTotal: { $first: "$grandTotal" }
                }
            }
        ]);
        if (!result) {
            return res.status(400).send({ message: "No Purchase Order Created" });
        }

        return res.status(200).send(result);

    } catch (error) {
        console.log(error);
        return res.status(400).send({ message: "Couldn't get all Purchase Orders" });
    }
});

//GET PURCHASE ORDER BY ID
router.get('/:id', authenticate, async (req, res) => {
    try {
        let id = req.params.id;
        if (!ObjectID.isValid(id)) {

            return res.status(404).send({ message: "Invalid Purchase Order ID" });
        }
        const purchaseOrder = await PurchaseOrder.aggregate([
            {
                $match: {
                    _id: mongoose.Types.ObjectId(id),
                    _author: mongoose.Types.ObjectId(req.driver._id)
                }
            },
            {
                $unwind: {
                    path: "$_orderProducts",

                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: '_orderProducts._product',
                    foreignField: '_id',
                    as: 'products'
                }
            },
            {
                $unwind: {
                    path: "$products"
                }
            },
            {
                $group: {
                    _id: "$_id",
                    productObjects: {
                        $push: {
                            $mergeObjects: ['$_orderProducts', '$products']
                        }
                    },
                    discount: { $first: "$discount" },
                    tax: { $first: "$tax" },
                    total: { $first: "$total" },
                    grandTotal: { $first: "$grandTotal" },
                    _author: { $first: "$_author" },
                    _salesOrder: { $first: "$_salesOrder" },
                    remarks: { $first: "$remarks" }
                }
            }
        ]);
        if (!purchaseOrder) {
            return res.status(400).send({ message: "Purchase Order Not Found" });
        }

        return res.status(200).send(purchaseOrder[0]);

    } catch (error) {
        console.log(error);
        return res.status(400).send({ message: "Couldn't get Purchase Order" });
    }
})

//CREATE PURCHASE ORDER
router.post('/create', authenticate, async (req, res) => {

    try {
        const purchaseOrder = new PurchaseOrder({
            _author: req.driver._id,
            _salesOrder: req.body._salesOrder,
            _orderProducts: req.body.productObjects,
            remarks: req.body.remarks,
            grandTotal: req.body.grandTotal,
            tax: req.body.tax,
            discount: req.body.discount,
            total: req.body.total
        });

        const result = await purchaseOrder.save();
        return res.status(200).send(result);
    } catch (error) {
        console.log(error);
        return res.status(400).send({ message: 'Couldn\'t save the Purchase Order' });
    }

});
//GET REMAINDER QUANTITIES
router.get('/getQuantities/:id', authenticate, async (req, res) => {
    try {
        let id = req.params.id;
        if (!ObjectID.isValid(id)) {
            return res.status(404).send({ message: 'Invalid Sales Order ID' });
        }

        const quantities = await PurchaseOrder.aggregate([
            {
                $match: {
                    _id: id
                }
            },
            {
                $unwind: {
                    path: "$_orderProducts"
                }
            },
            {
                $lookup: {
                    from: 'salesorders',
                    localField: '_salesOrder',
                    foreignField: '_id',
                    as: 'salesOrder'
                }
            },
            {
                $unwind: {
                    path: "$salesOrder"
                }
            },
            {
                $unwind: {
                    path: "$salesOrder._orderProduct"
                }
            },
            {
                $project: {
                    soProducts: "$salesOrder._orderProduct",
                    _orderProducts: "$_orderProducts",
                    idEq: { $eq: ["$salesOrder._orderProduct._id", "$_orderProducts._id"] }
                }
            },
            {
                $match: {
                    idEq: true
                }
            },
            {
                $project: {
                    _id: "$_id",
                    quantity: {
                        $subtract: ["$soProducts.quantity", "$_orderProducts.quantity"]
                    }
                }
            }
        ])
        res.status(200).send({ quantities });

    } catch (error) {
        console.log(error);
        res.status(400).send();
    }

})

//DELETE PURCHASE ORDER BY ID
router.delete('/:id', authenticate, async (req, res) => {

    try {
        let id = req.params.id;
        if (!ObjectID.isValid(id)) {
            return res.status(404).send({ message: 'Invalid Purchase Order ID' });
        }

        const purchaseOrder = await PurchaseOrder.findByIdAndRemove({ _id: id, _author: req.driver._id })
        if (!purchaseOrder) {
            return res.status(400).send({ message: "Purchase Order not found" });
        }
        return res.status(200).send(purchaseOrder)

    } catch (error) {
        console.log(error);
        return res.status(400).send({ message: 'Couldn\'t delete the Purchase Order' });
    }

});

//UPDATE PURCHASE ORDER
router.patch('/:id', authenticate, async (req, res) => {

    try {
        let id = req.params.id;
        if (!ObjectID.isValid(id)) {
            return res.status(404).send({ message: "Purchase Order ID is not valid" });
        }
        const patchPurchaseOrder = {
            _salesOrder: req.body._salesOrder,
            remarks: req.body.remarks,
            _orderProducts: req.body.productObjects,
            tax: req.body.tax,
            discount: req.body.discount,
            grandTotal: req.body.grandTotal,
            total: req.body.total
        };

        const result = await PurchaseOrder.findOneAndUpdate(
            {
                _id: id,
                _author: req.driver._id,
                _salesOrder: req.body._salesOrder
            },
            {
                $set: patchPurchaseOrder
            }, {
                new: true
            });

        if (!result) {
            return res.status(400).send({ message: "Purchase Order not found" });
        }
        return res.status(200).send(result);

    } catch (error) {
        console.log(error);
        return res.status(400).send({ message: "Couldn't Update Purchase Order" })
    }

});



module.exports = router



