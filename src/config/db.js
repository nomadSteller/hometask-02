const Sequelize = require('sequelize');
const { databaseConfig } = require('./env.constant')

const sequelize = new Sequelize({
  dialect: databaseConfig.dialect,
  storage: databaseConfig.storage
});

sequelize
  .authenticate()
  .then(function(err) {
    console.log('Connection has been established successfully.');
  })
  .catch(function (err) {
    console.log('Unable to connect to the database:', err);
  });

module.exports = sequelize;
