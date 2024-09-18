const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

require('./config/db')

// Importing routes
const contractsRoutes = require('./routes/contract.route')

app.use('/contracts', contractsRoutes)

module.exports = app;
