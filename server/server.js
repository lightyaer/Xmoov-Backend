const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const { ObjectID } = require('mongodb');
const bcrypt = require('bcryptjs');
const cors = require('cors');

var app = express();
app.use(bodyParser.json());
var PORT = process.env.PORT;

//ROUTES FOR ALL 





app.listen(PORT, () => {
    console.log(`Server is up on Port ${PORT}`);
})