
process.env.DB_PATH = process.env.TEST_DB == 'isolated' ? './jestTestDb/db02.sqlite3' : './jestTestDb.sqlite3'
const sequelize = require('../config/db');

const { Job } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Job Model', () => {
  it('should create a new job', async () => {
    const job = await Job.create({
      id: Date.now(),
      description: 'Test job',
      price: 100.01,
    });
    
    expect(job).toBeDefined();
    expect(job.description).toBe('Test job');
    expect(job.price).toBe(100.01); // Note: DECIMAL returns string
    expect(job.paid).toBe(false);
  });

  it('should not allow null description', async () => {
    try {
      await Job.create({
        price: 100.00,
      });
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});
