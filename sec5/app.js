// const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({extended: false}));
// bodyParser is now preinstalled with express.js,
// but it's recommended to install manually to parse body without crush
// even if this would be removed in the future.

app.use(adminRoutes);
app.use(shopRoutes);


app.use('/', (req, res, next) => {
    // This always runs, because specifies a slash as a path and it is the first middleware.
    console.log('This always runs!')
    next(); // allows the req to continue to the next middleware in line
});


// const server = http.createServer(app);

app.listen(3000);