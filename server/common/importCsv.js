const csv = require('fast-csv');
const path = require('path');
/* Returns an array of objects key'd to the headers array in the parameters  */

let parseCsv = (path, headers) => {

    return new Promise((resolve, reject) => {
        let obj = [];
        csv
            .fromPath(path, {
                headers: headers,
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
                resolve(obj);
            })
            .on('error', function (err) {
                reject(err);
            })
    });
}

module.exports = parseCsv;

