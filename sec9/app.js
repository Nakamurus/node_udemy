require('dotenv').config();

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const errorController = require('./controllers/error');
const User = require('./models/user');
const MONGODBCONNECTIONSTR = process.env.MONGODBCONNECTIONSTR;


const app = express();
const store = new MongoDBStore({
  uri: MONGODBCONNECTIONSTR,
  collection: 'sessions'
});

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: 'my secret',
    resave: false, // session won't be saved on every request but if something changed
    saveUninitialized: false,
    store: store
  })
)

app.use((req, res, next) => {
  User
    .findById('5e198147996b5a4878a72a1e')
    // .findByPk('5e16f4deab409d3f0841da34') // raw mongoDB
    .then(user => {
      req.user = user; // mongoose method
      // req.user = new User(user.name, user.email, user.cart, user._id); // raw mongoDB
      next();
    })
    .catch(err => console.log(err))
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(MONGODBCONNECTIONSTR)
  .then(result => {
    User.findOne().then(user => {
      if(!user) {
        const user = new User({
          name: 'Nakamura',
          email: 'test@test.com',
          cart: {
            items: []
          }
        });
        user.save();
      }
    });
    app.listen(3000);
  })
  .catch(err => console.log(err))