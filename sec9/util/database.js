const mysql = require('mysql2');

const pool = mysql.createPool({ // pool of connection
    host: 'localhost',
    user: 'root',
    database: 'node-complete',
    password: 'nodecomplete'
});

module.exports = pool.promise();