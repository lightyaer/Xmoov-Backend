const router = require('express').Router();
const fileUpload = require('express-fileupload');
let parseCSV = require('../../common/importCsv');
const { Product } = require('../../../models/products');

router.use(fileUpload());
router.post('/products/uploadCSV', async (req, res) => {

    try {
        if (!req.files)
            return res.status(400).send('No files were uploaded.');

        // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file

        let sampleFile = req.files.sampleFile;
        let name = 'products - ' + new Date().getTime();

        // Use the mv() method to place the file somewhere on your server
        await sampleFile.mv(__dirname + '/uploads/' + name);
        let data = await parseCSV(__dirname + '/uploads/' + name, ['barcode', 'SKU', 'nameEn', 'nameAr', 'cost', 'price']);
        let result = await Product.insertMany(data);
        res.status(200).send(result);

    } catch (error) {
        console.log(error);
        res.status(400).send();
    }



});

module.exports = router