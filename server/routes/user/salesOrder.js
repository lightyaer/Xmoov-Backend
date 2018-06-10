const router = require('express').Router();
const _ = require('lodash');
const cors = require('cors');

const { ObjectID } = require('mongodb');
const { authenticate } = require('../../middleware/authenticate');
const { SalesOrder } = require('../../../models/salesOrder');

router.use(cors());

//#region SALES ORDER

//GET ALL SALES ORDERS FOR A DRIVER
router.get('/all', authenticate, async (req, res) => {

    let stageKey, stageValue, orderDate, itemName;
    stageKey = req.query.stageKey;
    stageValue = req.query.stageValue === 'true' ? true : false;
    stageKey = "orderStatus." + stageKey;
    
    orderDate = Number(req.query.orderDate);
    itemName = req.query.itemName ? req.query.itemName : "";

    try {
        const salesOrders = await SalesOrder.find(
            {
                _author: req.driver.id,
                [stageKey]:stageValue,
                orderDate : { $lte : orderDate},
                itemName: new RegExp( itemName ,"i")            
            }
        );
        if (!salesOrders) {
            res.status(200).send({ message: 'No Sales Orders created' })
        }
        return res.status(200).send(salesOrders);
    } catch (e) {
        return res.status(400).send({ message: 'Couldn\'t get a list of salesOrder' })
    }

})

//GET SALESORDER BY ID 
router.get('/:id', authenticate, async (req, res) => {

    try {
        let id = req.params.id;
        if (!ObjectID.isValid(id)) {
            return res.status(400).send({ message: 'Sales Order ID is Invalid' });
        }
        const salesOrder = await SalesOrder.findOne({ _id: id, _author: req.driver._id })
        if (salesOrder) {
            return res.status(200).send(salesOrder);
        }

        return res.status(400).send({ message: 'Sales Order not found.' });
    } catch (e) {

        return res.status(404).send({ message: 'Sales Order not found, Server Error' });
    }
})

//SAVE SALES ORDER
router.post('/create', authenticate, async (req, res) => {
    try {
        const salesOrder = new SalesOrder({
            _author: req.driver._id,
            _retailer: req.body._retailer,
            orderDate: req.body.orderDate,
            itemCode: req.body.itemCode,
            itemType: req.body.itemType,
            itemSubType: req.body.itemSubType,
            itemName: req.body.itemName,
            quantity: req.body.quantity,
            unitPrice: req.body.unitPrice,
            tax: req.body.tax,
            handling: req.body.handling,
            commission: req.body.commission,
            discount: req.body.discount,
            total: req.body.total,
            grandTotal: req.body.grandTotal,
            orderStatus: req.body.orderStatus
        })

        const result = await salesOrder.save();
        return res.status(200).send(result);

    } catch (e) {
        console.log(e);
        return res.status(400).send({ message: 'couldn\'t save Sales Order' })
    }
})

//UPDATE SALES ORDER
router.patch('/:id', authenticate, async (req, res) => {

    try {

        let id = req.params.id;
        if (!ObjectID.isValid(id)) {
            return res.status(400).send({ message: 'Sales Order ID is invalid' });
        }

        const patchSalesOrder = {
            orderDate: req.body.orderDate,
            itemCode: req.body.itemCode,
            itemType: req.body.itemType,
            itemSubType: req.body.itemSubType,
            itemName: req.body.itemName,
            quantity: req.body.quantity,
            unitPrice: req.body.unitPrice,
            tax: req.body.tax,
            handling: req.body.handling,
            commission: req.body.commission,
            discount: req.body.discount,
            total: req.body.total,
            grandTotal: req.body.grandTotal,
            orderStatus: req.body.orderStatus
        }

        const salesOrder = await SalesOrder.findOneAndUpdate(
            {
                _id: id,
                _author: req.driver._id,
                _retailer: req.body._retailer
            },
            {
                $set: patchSalesOrder
            }, {
                new: true
            });
        if (!salesOrder) {
            return res.status(404).send({ message: 'Couldn\'t Update Sales Order' });
        }

        return res.status(200).send(salesOrder);
    } catch (e) {
        console.log(e);
        return res.status(400).send({ message: 'Something went wrong, Couldn\'t Update Sales Order' })
    }
})

//UPDATE ORDER STATUS
router.patch('/orderstatus/:id', authenticate, async (req, res) => {

    try {
        let body = _.pick(req.body, ['orderStatus']);

        const orderStatus = body;

        const salesOrder = await SalesOrder.findOneAndUpdate(
            {
                _id: id,
                _author: req.driver._id,
                _retailer: req.body._retailer
            },
            {
                $set: orderStatus
            }, {
                new: true
            });

        if (!salesOrder) {
            return res.status(404).send({ message: 'Couldn\'t Update Order Status' });
        }
        return res.status(200).send(salesOrder);


    } catch (e) {
        return res.status(400).send({ message: 'Something went wrong, Couldn\'t Update Order Status' })
    }


})

//DELETE SALES ORDER BY ID
router.delete('/:id', authenticate, async (req, res) => {

    try {

        let id = req.params.id;
        if (!ObjectID.isValid(id)) {
            return res.status(400).send({ message: 'Sales Order ID is Invalid' });
        }

        const salesOrder = await SalesOrder.findByIdAndRemove({ _id: id, _author: req.driver._id })
        if (salesOrder) {
            return res.status(200).send(salesOrder);
        }

        return res.status(400).send({ message: 'Deletion not Possible' })

    } catch (e) {
        return res.status(400).send({ message: 'Sales Order couldn\'t be deleted, Server Error' });
    }

})

// GET SALES ORDERS BY RETAILER ID 
router.get('/retailer/:id', authenticate, async (req, res) => {

    try {

        let id = req.params.id;
        if (!ObjectID.isValid(id)) {
            return res.status(400).send({ message: 'Retailer ID is Invalid' });
        }

        const salesOrders = await SalesOrder.find({ _retailer: id, _author: req.driver._id });
        if (!salesOrders) {
            return res.status(400).send({ message: 'Sales Order by RetailerID doesn\'t exist' })
        }
        return res.status(200).send(salesOrders)


    } catch (e) {
        return res.status(400).send({ message: 'Couldn\'t get Sales Order by RetailerID, Server Error' });
    }



})

//#endregion

module.exports = router