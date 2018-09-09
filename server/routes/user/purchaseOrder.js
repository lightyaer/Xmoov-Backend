const router = require('express').Router();
const _ = require('lodash');
const mongoose = require('mongoose');
const cors = require('cors');


const { ObjectID } = require('mongodb');

const { authenticate } = require('../../middleware/authenticate');

const { PurchaseOrder } = require('../../../models/purchaseOrder');


router.use(cors());

//GET ALL PURCHASE ORDERS 
router.get('/all', authenticate, async (req, res) => {

    try {



        const result = await PurchaseOrder.aggregate([
            {
                $match: {
                    _author: req.driver._id
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: '_orderProduct._product',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            {
                $unwind: {
                    path: '$product'
                }
            }
        ]);
        if (!result) {
            return res.status(400).send({ message: "No Purchase Order Created" });
        }

        return res.status(200).send(result);

    } catch (error) {
        return res.status(400).send({ message: "Couldn't get all Purchase Orders" });
    }
});

//CREATE PURCHASE ORDER
router.post('/create', authenticate, async (req, res) => {

    try {
        const purchaseOrder = new PurchaseOrder({
            _author: req.driver._id,
            _salesOrder: req.body._salesOrder,
            _orderProduct: req.body._orderProduct,
            remarks: req.body.remarks,
            unitPrice: req.body.unitPrice,
            tax: req.body.tax,
            discount: req.body.discount,
            total: req.body.total
        });

        const result = await purchaseOrder.save();
        return res.status(200).send(result);
    } catch (error) {
        return res.status(400).send({ message: 'Couldn\'t save the Purchase Order' });
    }

});

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
            _orderProduct: req.body._orderProduct,
            unitPrice: req.body.unitPrice,
            tax: req.body.tax,
            discount: req.body.discount,
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

        return res.status(400).send({ message: "Couldn't Update Purchase Order" })
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
                $lookup: {
                    from: 'products',
                    localField: '_orderProduct._product',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            {
                $unwind: {
                    path: '$product'
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

module.exports = router