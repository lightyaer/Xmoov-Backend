const router = require('express').Router();
const _ = require('lodash');
const cors = require('cors');
const { ObjectID } = require('mongodb');

const { authenticate } = require('../../middleware/authenticate');

const { Product } = require('../../../models/products');

router.use(cors());

router.get('/all', authenticate, async (req, res) => {

    try {
        let name = req.query.name;
        let products = await Product.find({
            nameEn: new RegExp(name, "i")
        });
        res.status(200).send(products);
    } catch (err) {
        res.status(400).send();
    }

});

router.get('/:id', authenticate, async (req, res) => {

    try {
        let id = req.params.id;
        if (!ObjectID.isValid(id)) {
            res.status(400).send();
        }
        let product = await Product.findById({ _id: id });
        res.status(200).send(product);
    } catch (err) {
        res.status(400).send();
    }

});


module.exports = router;