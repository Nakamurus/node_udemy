require('dotenv').config();
const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

const MONGODBCONNECTIONSTR = process.env.MONGODBCONNECTIONSTR;

let _db;

const mongoConnect = cb => {
    MongoClient.connect(
        MONGODBCONNECTIONSTR
    )
      .then(client => {
          console.log('Connected!');
          _db = client.db(); // store a connection to my database
          cb()
      })
      .catch(err => {
          console.log(err)
          throw err
      });
};

const getDb = () => {
    // returns access to the database if it exists
    if (_db) {
        return _db;
    }
    throw 'No database found!';
};

exports.mongoConnect = mongoConnect
exports.getDb = getDb;