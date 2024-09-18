const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

process.env.DB_PATH = (process.env.TEST_DB == 'isolated') 
    ? './jestTestDb/db04.sqlite3' 
    : './jestTestDb.sqlite3'
const sequelize = require('../config/db');

const { Profile, Job, Contract } = require('../models');
const balancesRoutes = require('../routes/balances.route')

const app = express();
app.use(bodyParser.json());
app.use('/balances', balancesRoutes)

beforeAll(async () => {
    
  await sequelize.sync({ force: true });

  // Create some mock data
  await Profile.bulkCreate([
    {id: 1, firstName: 'Harry', lastName: 'Potter', profession: 'Wizard', balance: 1000, type:'client'},
    {id: 2, firstName: 'John', lastName: 'Lenon', profession: 'Musician', balance: 500, type:'contractor'}
  ]);

  await Contract.create({ id:1, terms: 'bla bla bla', status: 'in_progress', ClientId: 1, ContractorId:2 });
  await Job.create({ id: 1, description: 'Test job', price: 200, paid: false, ContractId: 1 });
},10000);

afterAll(async () => {
  await sequelize.close();
});

describe('Balances Routes', () => {
  it('should deposit into balance', async () => {
    const depositAmount = 50;

    const response = await request(app)
      .post(`/balances/deposit/1`)
      .send({ amount: depositAmount })
      .set('Accept', 'application/json')

      console.log("ERROR =>", response)
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Deposit successful');

    const profile = await Profile.findByPk(1);
    expect(profile.balance).toBe(1050); // Check if balance updated correctly
  });

  it('should not allow deposit above maximum limit', async () => {
    const depositAmount = 100;

    const response = await request(app)
      .post(`/balances/deposit/1`)
      .send({ amount: depositAmount })
      .set('Accept', 'application/json');

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('Maximum deposit allowed is 50');

    const profile = await Profile.findByPk(1);
    expect(profile.balance).toBe(1050); // Check if balance remains unchanged
  });
});
