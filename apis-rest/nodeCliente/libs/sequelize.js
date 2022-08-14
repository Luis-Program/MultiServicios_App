const { Sequelize } = require('sequelize');
const setUpModels = require('../db/models/index');
const { config } = require('../config/config');

// const USER = encodeURIComponent(config.dbUser);
// const PASSWORD = encodeURIComponent(config.dbPassword);
// const URI = `mysql://${USER}:${PASSWORD}@${config.dbHost}:${config.dbPort}/${config.dbName}`;
const URI = config.dbUrl;

const sequelize = new Sequelize(URI, {
  // host: config.dbHost,
  dialect: 'mysql',
  logging: false,
});

setUpModels(sequelize);

// sequelize.sync();

module.exports = sequelize;
