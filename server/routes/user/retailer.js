const router = require('express').Router();
const _ = require('lodash');
const cors = require('cors');
const { ObjectID } = require('mongodb');

const { authenticate } = require('../../middleware/authenticate');

const { Retailer } = require('../../../models/retailer');

router.use(cors());
//#region RETAILER

//SAVE A RETAILER
router.post('/create', authenticate, async (req, res) => {
    try {
        const retailer = new Retailer({
            _author: req.driver._id,
            name: req.body.name,
            company: req.body.name,
            address: req.body.address,
            postalCode: req.body.postalCode,
            phoneNo: req.body.phoneNo,
            email: req.body.email,
            shipToSame: req.body.shipToSame,
            shipName: req.body.shipName,
            shipCompany: req.body.shipCompany,
            shipAddress: req.body.shipAddress,
            shipPostalCode: req.body.shipPostalCode,
            shipPhoneNo: req.body.shipPhoneNo,
            shipEmail: req.body.shipEmail
        });

        const result = await retailer.save();
        return res.status(200).send(result);
    } catch (e) {
        console.log(e);
        return res.status(400).send({ message: 'Couldn\'t save the Retailer' })
    }
})

//GET ALL RETAILERS FOR A DRIVER
router.get('/all', authenticate, async (req, res) => {

    let name = req.query.RetailerName;

    try {
        const retailers = await Retailer.find({ _author: req.driver._id, name: new RegExp(name, "i") })
        if (!retailers) {
            return res.status(200).send({ message: 'No Retailers Created' })
        }
        return res.status(200).send(retailers);
    } catch (e) {
        return res.status(400).send({ message: 'Could\'t get list of retailers' });
    }
});

//GET RETAILER BY ID
router.get('/:id', authenticate, async (req, res) => {
    try {
        let id = req.params.id;
        if (!ObjectID.isValid(id)) {
            return res.status(404).send({ message: 'Invalid Retailer ID' });
        }

        const retailer = await Retailer.findOne({ _id: id, _author: req.driver._id })
        if (retailer) {
            return res.status(200).send(retailer);
        }
        return res.status(404).send({ message: 'Retailer Not Found' });

    } catch (e) {

        return res.status(404).send({ message: 'Retailer Not Found, Server Error' });
    }
})

//DELETE RETAILER BY ID
router.delete('/:id', authenticate, async (req, res) => {
    try {
        let id = req.params.id;
        if (!ObjectID.isValid(id)) {
            return res.status(401).send({ message: 'Invalid Retailer ID' })
        }

        const retailer = await Retailer.findByIdAndRemove({ _id: id, _author: req.driver._id });
        if (!retailer) {
            return res.status(400).send({ message: 'Retailer not found' });
        }
        return res.status(200).send(retailer);
    } catch (e) {
        return res.status(400).send({ message: 'Retailer couldn\'t be Deleted' });
    }
})

//UPDATE RETAILER BY ID
router.patch('/:id', authenticate, async (req, res) => {
    try {
        let id = req.params.id;
        if (!ObjectID.isValid(id)) {
            return res.status(400).send({ message: 'Retailer ID is not Valid' });
        }

        const patchRetailer = {
            _author: req.driver._id,
            name: req.body.name,
            company: req.body.company,
            address: req.body.address,
            postalCode: req.body.postalCode,
            phoneNo: req.body.phoneNo,
            email: req.body.email,
            shipToSame: req.body.shipToSame,
            shipName: req.body.shipName,
            shipCompany: req.body.shipCompany,
            shipAddress: req.body.shipAddress,
            shipPostalCode: req.body.shipPostalCode,
            shipPhoneNo: req.body.shipPhoneNo,
            shipEmail: req.body.shipEmail
        }

        const retailer = await Retailer.findOneAndUpdate(
            {
                _id: id,
                _author: req.driver._id
            },
            {
                $set: patchRetailer
            },
            {
                new: true
            });
        if (!retailer) {
            return res.status(404).send({ message: 'Couldn\'t Update Retailer' });
        }
        return res.status(200).send(retailer);
    } catch (e) {
        console.log(e);
        return res.status(400).send({ message: 'Something went wrong, Couldn\'t Update Retailer' })
    }
})

//#endregion

module.exports = router