const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

require('./config/db')

// Importing routes
const contractsRoutes = require('./routes/contract.route')
const jobsRoutes = require('./routes/jobs.route')
const balancesRoutes = require('./routes/balances.route')
const adminRoutes = require('./routes/admin.route')


app.use('/contracts', contractsRoutes)
app.use('/jobs', jobsRoutes)
app.use('/balances', balancesRoutes)
app.use('/admin', adminRoutes)

module.exports = app;
