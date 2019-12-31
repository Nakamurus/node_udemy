// const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
// bodyParser is now preinstalled with express.js,
// but it's recommended to install manually to parse body without crush
// even if this would be removed in the future.

app.use('/', (req, res, next) => {
    // This always runs, because specifies a slash as a path and it is the first middleware.
    console.log('This always runs!')
    next(); // allows the req to continue to the next middleware in line
});
app.use('/add-product', (req, res, next) => {
    res.send('<form method="POST" action="/product"><input type="text" name="title"><button type="submit">Add Product</button></form>')
});

app.use('/product', (req, res, next) => {
    console.log(req.body);
    res.redirect('/');
})

app.use('/2', (req, res, next) => {
    console.log('<h1>Hello from express 2 !</h1>')
})

// const server = http.createServer(app);

app.listen(3000);