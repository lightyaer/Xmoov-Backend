const router = require('express').Router();
const _ = require('lodash');
const cors = require('cors');


const { ObjectID } = require('mongodb');

const { authenticate } = require('../../middleware/authenticate');

const { PurchaseOrder } = require('../../../models/purchaseOrder');


router.use(cors());

router.get('/all', authenticate, async (req, res) => {

    try {

        let name = req.query.name;

        const result = await PurchaseOrder.find(
            {
                _author: req.driver._id,
                itemName: new RegExp(name, "i")
            });
        if (!result) {
            return res.status(400).send({ message: "No Purchase Order Created" });
        }

        return res.status(200).send(result);

    } catch (error) {
        return res.status(400).send({ message: "Couldn't get all Purchase Orders" });
    }
});

router.post('/create', authenticate, async (req, res) => {

    try {
        const purchaseOrder = new PurchaseOrder({
            _author: req.driver._id,
            _salesOrder: req.body._salesOrder,
            itemCode: req.body.itemCode,
            itemType: req.body.itemType,
            itemSubType: req.body.itemSubType,
            itemName: req.body.itemName,
            remarks: req.body.remarks,
            quantity: req.body.quantity,
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
            itemCode: req.body.itemCode,
            itemType: req.body.itemType,
            itemSubType: req.body.itemSubType,
            itemName: req.body.itemName,
            remarks: req.body.remarks,
            quantity: req.body.quantity,
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

router.get('/:id', authenticate, async (req, res) => {
    try {
        let id = req.params.id;
        if (!ObjectID.isValid(id)) {

            return res.status(404).send({ message: "Invalid Purchase Order ID" });
        }

        const result = await PurchaseOrder.findOne({ _id: id, _author: req.driver._id });
        if (!result) {
            return res.status(400).send({ message: "Purchase Order Not Found" });

        }

        return res.status(200).send(result);

    } catch (error) {
        return res.status(400).send({ message: "Couldn't get Purchase Order" });
    }
})

module.exports = router