const csv = require('fast-csv');
const path = require('path');
/* Returns an array of objects key'd to the headers array in the parameters  */
let filePath = path.join(__dirname + '/../server/routes/admin/uploads/items.csv')
let obj = [];
csv
    .fromPath(filePath, {
        headers: ['barcode', 'SKU', 'nameEn', 'nameAr', 'cost', 'price'],
        discardUnmappedColumns: true,
        ltrim: true,
        rtrim: true,
        objectMode: true,
        renameHeaders: true
    })
    .on("data", function (parsedData) {
        obj.push(parsedData);

    })
    .on("end", function (data) {
        console.log(data);

    })
    .on('error', function (err) {

    })



