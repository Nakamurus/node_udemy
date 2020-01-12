const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    // const isLoggedIn = req
    //   .get('Cookie')
    //   .split(';')[1]
    //   .trim()
    //   .split('=')[1];
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: false
    });
}

exports.postLogin = (req, res, next) => {
    User.findById('5e198147996b5a4878a72a1e')
      .then(user => {
          req.session.isLoggedIn = true;
          req.session.user = user;
          req.session.save(err => {
              // to make sure to redirect after updating session info
              console.log(err);
              res.redirect('/');
          });
      })
      .catch(err => console.log(err));
    // res.setHeader('Set-Cookie', 'loggedIn=true; HttpOnly') // setting header allows us to set a cookie
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });
}
