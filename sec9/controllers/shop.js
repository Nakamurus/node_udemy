const Product = require('../models/product');
// const Cart = require('../models/cart');
const Order = require('../models/order');

exports.getProducts = (req, res, next) => {
  Product
    .find() // mongoose method
    // .fetchAll() // using raw mongoDB
    // .findAll // using Sequelize
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products',
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => console.log(err))

  // using raw SQL
  // Product.fetchAll()
  //   .then(([rows, fieldData]) => {
  //     res.render('shop/product-list', {
  //       prods: rows,
  //       pageTitle: 'All Products',
  //       path: '/products'
  //     });
  //   })

  // fetching from file
  // Product.fetchAll(products => {
  //   res.render('shop/product-list', {
  //     prods: products,
  //     pageTitle: 'All Products',
  //     path: '/products'
  //   });
  // });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId) // mongoose method
  // Product.findByPk(prodId) // raw MongoDB
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products',
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => console.log(err));

  // Using raw SQL
  // Product.findById(prodId)
  //   .then(([product]) => {
  //     res.render('shop/product-detail', {
  //       product: product[0],
  //       pageTitle: product.title,
  //       path: '/products'
  //     });
  //   })
  //   .catch(err => console.log(err));

  // Fetching from file
  // Product.findById(prodId, products => {
  //   res.render('shop/product-detail', {
  //     product: product,
  //     pageTitle: product.title,
  //     path: '/products'
  //   });
  // });
};

exports.getIndex = (req, res, next) => {
  Product
    .find() // mongoose method
    // .fetchAll() // raw mongoDB
    // .findAll() // using Sequelize
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => {
      console.log(err)
    })

  // using raw SQL
  // Product.fetchAll()
  //   .then(([rows, fieldData]) => {
  //     res.render('shop/index', {
  //       prods: rows,
  //       pageTitle: 'shop',
  //       path: '/'
  //          });
  //   })
  //   .catch(err => console.log(err));

  // Fetching from file
  // Product.fetchAll(products => {
  //   res.render('shop/index', {
  //     prods: products,
  //     pageTitle: 'shop',
  //     path: '/'
  //   });
  // });
};

exports.getCart = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    res.redirect('/login')
  } else {
    req.user
    .populate('cart.items.productId')
    .execPopulate()
    // .getCart() // mongoDB
    .then(user => {
      const products = user.cart.items;
      // return cart
      //   .getProducts()
      //   .then(products => {
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products,
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => console.log(err));
    // })
    // .catch(err => console.log(err))

  // Cart.getCart(cart => {
  //   Product.fetchAll(products => {
  //     const cartProducts  = [];
  //     for (product of products) {
  //       const cartProductData = cart.products.find(
  //         prod => prod.id === product.id
  //       );
  //       if (cartProductData) {
  //         cartProducts.push({ productData: product,  qty: cartProductData.qty });
  //       }
  //     }
  //     res.render('shop/cart', {
  //       path: '/cart',
  //       pageTitle: 'Your cart',
  //       products: cartProducts
  //     });
  //   });
  // });
  }
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
  // Product.findByPk(prodId) // mongoDB
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(result => {
      console.log(result);
      res.redirect('/cart');
    })
  // Sequelize
  // let fetchedCart;
  // let newQuantity = 1;
  // req.user
  //   .getCart()
  //   .then(cart => {
  //     fetchedCart = cart;
  //     return cart.getProducts({ where: { id: prodId }});
  //   })
  //   .then(products => {
  //     let product;
  //     if (products.length > 0) {
  //       product = products[0];
  //     }
  //     if (product) {
  //       const oldQuantity = product.cartItem.quantity;
  //       newQuantity = oldQuantity + 1;
  //       return product;
  //       }
  //     return Product.findByPk(prodId);
  //   })
  //   .then(product => {
  //     return fetchedCart.addProduct(product, {
  //       through: { quantity: newQuantity }
  //     });
  //   })
  //   .then(() => {
  //     res.redirect('/cart');
  //   })
  //   .catch(err => console.log(err));

  // raw SQL
  // Product.findById(prodId, product => {
  //   Cart.addProduct(prodId, product.price);
  // });
  // res.redirect('/cart');
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
  // Sequelize
  //   .getCart()
  //   .then(cart => {
  //     return cart.getProducts({ where: {id: prodId } });
  //   })
  //   .then(products => {
  //     const product = products[0];
  //     return product.cartItem.destroy();
  //   })
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err))

  // Product.findById(prodId, product => {
  //   Cart.deleteProduct(prodId, product.price);
  //   res.redirect('/cart');
  // });
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items.map(i => {
        return {quantity: i.quantity, product: {...i.productId._doc } };
        // ._doc allow to get all info about product, not just productId
        // and here we spread out all info using  ...
      });
      const order = new Order({
        user: {
          name: req.user.name,
          userId: req.user
        },
        products: products
      });
      return order.save();
    })
  // let fetchedCart
  // req.user
  //   .addOrder()
    // Sequelize
    // .getCart()
    // .then(cart => {
    //   fetchedCart = cart;
    //   return cart.getProducts();
    // })
    // .then(products => {
    //   return req.user
    //     .createOrder()
    //     .then(order => {
    //       return order.addProducts(
    //         products.map(product => {
    //           product.orderItem = {quantity: product.cartItem.quantity };
    //           return product
    //         })
    //       )
    //     })
    //     .catch(err => console.log(err))
    // })
    // .then(result => {
    //   return fetchedCart.setProducts(null)
    // })
    .then(result => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect('/orders');
    })
    .catch(err => console.log(err))
}

exports.getOrders = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    res.redirect('/')
  } else {
    Order
      .find({ 'user.userId': req.user._id })
    // req.user
    //   .getOrders()  // mongoDB
      // Sequelize
      // .getOrders({include: ['products']})
      .then(orders => {
        res.render('shop/orders', {
          path: '/orders',
          pageTitle: 'Your Orders',
          orders: orders,
          isAuthenticated: req.isLoggedIn
        })
      })
      .catch(err => console.log(err))
  }
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout',
    isAuthenticated: req.session.isLoggedIn
  });
};
