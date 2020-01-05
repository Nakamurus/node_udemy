const mysql = require('mysql2');

const pool = mysql.createPool({ // pool of connection
    host: 'localhost',
    user: 'root',
    database: 'node-complete',
    password: 'ROSIAdekirusql1'
});

module.exports = pool.promise();