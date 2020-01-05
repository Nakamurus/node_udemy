// Without Sequelize version
// Sequelize version

const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-complete', 'root', 'ROSIAdekirusql1', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;