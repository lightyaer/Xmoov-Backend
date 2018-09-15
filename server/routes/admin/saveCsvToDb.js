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
        if (!sampleFile) {
            res.status(400).send({ message: " No File Received" });
        }


        let name = 'products - ' + new Date().getTime();
        let path = __dirname + '../../assets/uploads/' + name;
        
        // Use the mv() method to place the file somewhere on your server
        await sampleFile.mv(path);
        let data = await parseCSV(path, ['barcode', 'SKU', 'nameEn', 'nameAr', 'cost', 'price']);
        let result = await Product.insertMany(data);

        res.status(200).send({ message: "File Successfully Inserted to DB" });

    } catch (error) {
        console.log(error);
        res.status(400).send();
    }



});

module.exports = router