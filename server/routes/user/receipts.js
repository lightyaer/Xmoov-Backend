const router = require('express').Router();
const { authenticate } = require('../../middleware/authenticate');
const { Receipt } = require('../../../models/receipts');
const cors = require('cors');


router.use(cors());

router.post('/create', authenticate, async (req, res) => {
    try {
        let receipt = new Receipt({
            _author: req.driver._id,
            _receipt: req.body._receipt,
            _salesOrder: req.body._salesOrder,
            date: req.body.date
        });

        const result = await receipt.save(receipt);
        if (result) {
            return res.status(200).send();
        }

        return res.status(400).send();

    } catch (error) {
        console.log(error);
        return res.status(400).send();
    }
})


module.exports = router