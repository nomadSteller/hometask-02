const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('../config/db');
const { Job, Contract, Profile } = require('../models');
const jobsRoutes = require('../routes/jobs.route')

const app = express();
app.use(bodyParser.json());
app.use('/jobs', jobsRoutes)

beforeAll(async () => {
  // process.env.DB_STORAGE_PATH = './database01.sqlite3'
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

describe('Jobs Routes', () => {
  it('should get unpaid jobs', async () => {
    const response = await request(app)
      .get('/jobs/unpaid')
      .set('profile_id', 1);

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  },15000);

  it('should pay for a job', async () => {
    const response = await request(app)
      .post('/jobs/1/pay')
      .set('profile_id', 1);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Payment successful');

    const job = await Job.findByPk(1);
    expect(job.paid).toBe(true);
  },20000);
});
