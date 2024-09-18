const request = require('supertest');
const express = require('express');
const sequelize = require('../config/db');
const { Job, Contract, Profile } = require('../models');
const contractsRoutes = require('../routes/contract.route');

const app = express();
app.use(express.json());
app.use('/contracts', contractsRoutes)

beforeAll(async () => {
  await sequelize.sync({ force: true });

  // Create some mock data
  await Profile.bulkCreate([
    {id: 1, firstName: 'Harry', lastName: 'Potter', profession: 'Wizard', balance: 1150, type:'client'},
    {id: 2, firstName: 'John', lastName: 'Lenon', profession: 'Musician', balance: 64, type:'contractor'}
  ]);

  await Contract.create({ id:1, terms: 'bla bla bla', status: 'new', ClientId: 1, ContractorId:2 });
  await Job.create({ description: 'Test job', price: 400, ContractId: 1 });
},10000);

afterAll(async () => {
  await sequelize.close();
});

describe('Contracts Routes', () => {
  it('should get contract by id', async () => {
    const response = await request(app)
      .get('/contracts/1')
      .set('profile_id', 1);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.id).toBe(1);
  });

  it('should get all contracts for a profile', async () => {
    const response = await request(app)
      .get('/contracts')
      .set('profile_id', 1);

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });
});
