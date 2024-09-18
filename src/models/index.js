const sequelize = require('../config/db');
const Profile = require('./profile.model');
const Contract = require('./contract.model');
const Job = require('./job.model');

Profile.hasMany(Contract, {as :'Contractor',foreignKey:'ContractorId'})
Contract.belongsTo(Profile, {as: 'Contractor'})

Profile.hasMany(Contract, {as : 'Client', foreignKey:'ClientId'})
Contract.belongsTo(Profile, {as: 'Client'})

Contract.hasMany(Job)
Job.belongsTo(Contract)

// Sync the models with the database
sequelize.sync()

module.exports = {
    sequelize,
    Profile,
    Contract,
    Job
};