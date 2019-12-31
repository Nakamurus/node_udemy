const express = require('express');
const router = express.Router();

router.get('/add-product', (req, res, next) => {
    // get and post matches exact path, whereas use matches include path
    res.send(
        '<form method="POST" action="/product"><input type="text" name="title"><button type="submit">Add Product</button></form>'
    );
});

router.post('/product', (req, res, next) => {
    console.log(req.body);
    res.redirect('/');
})

module.exports = router;