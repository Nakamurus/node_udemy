// Without Sequelize version

// const mysql = require('mysql2');

// const pool = mysql.createPool({ // pool of connection
//     host: 'localhost',
//     user: 'root',
//     database: 'node-complete',
//     password: 'ROSIAdekirusql1'
// });

// module.exports = pool.promise();

// Now Sequelize version

const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-complete', 'root', 'node-complete', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;