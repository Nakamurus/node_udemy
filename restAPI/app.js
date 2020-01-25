require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');

const feedRoutes = require('./routes/feed');

const app = express();

// app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.use((req, res, next) => {
    // set these to avoid CORS(Cross Origin Resource Sharing) Errors
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT', 'PATCH', 'DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
})

app.use('/feed', feedRoutes);

mongoose
    .connect(
        process.env.MONGODBCONNECTIONSTR,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
    .then(result => {
        app.listen(8080);
    })
    .catch(err => console.log(err));
