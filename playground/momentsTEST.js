const moment = require('moment');
//1525372200000
console.log('TESTING');

const endDate = moment(1522780200000).add(30, 'days');
const startDate = moment(1522780200000);
console.log(startDate + ' ' + endDate);

console.log(moment().isBefore(moment(endDate)) && moment().isAfter(moment(startDate)));