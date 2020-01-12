const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  })
}

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user // mongoose retrieve just an id from entire user data
  });
  // MongoDB
  // const product = new Product(
  //   title,
  //   price,
  //   description,
  //   imageUrl,
  //   null,
  //   req.user._id
  // );
  product
    .save()
    .then(result => {
      console.log('Created Product');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err))
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product
    .findById(prodId) // mongoose method
    // .findByPk(prodId) // raw mongoDB
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product
      });
    })
  // Sequelize
  // req.user
  //   .getProducts({ where: {id: prodId } })
  // // Product.findByPk(prodId) it is equivalent to above code
  //   .then(products => {
  //     const product = products[0]
  //     if (!product) {
  //       return res.redirect('/');
  //     } else {
  //       res.render('admin/edit-product', {
  //         pageTitle: 'Edit Product',
  //         path: '/admin/edit-product',
  //         editing: editMode,
  //         product: product
  //       })
  //     }
  //   })
    .catch(err => console.log(err))

  // Using raw SQL
  // Product.findById(prodId, product => {
  //   if(!product) {
  //     return res.redirect('/');
  //   }
  //   res.render('admin/edit-product', {
  //     pageTitle: 'Edit Product',
  //     path: '/admin/edit-product',
  //     editing: editMode,
  //     product: product
  //   });
  // });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedtitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  
  Product.findById(prodId)
    .then(product => {
      product.title = updatedtitle;
      product.price = updatedPrice;
      product.description = updatedDesc;
      product.imageUrl = updatedImageUrl;
      return product.save();
    })

  // raw MongoDB
  // const product = new Product(
  //   updatedtitle,
  //   updatedPrice,
  //   updatedDesc,
  //   updatedImageUrl,
  //   prodId
  // );
      // Sequelize
    // Product.findByPk(prodId)
    //   .then(product => {
      // product.title = updatedtitle;
      // product.price = updatedPrice;
      // product.imageUrl = updatedImageUrl;
      // product.description = updatedDesc;
      // return product.save();
  // product
  //   .save()
    .then(result => {
      console.log('UPDATED PRODUCT');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err))

  // raw SQL version
  // const updatedProduct = new Product(
  //   prodId,
  //   updatedtitle,
  //   updatedImageUrl,
  //   updatedDesc,
  //   updatedPrice
  // );
  // updatedProduct.save();
  // res.redirect('/admin/products');
};

exports.getProducts = (req, res, next) => {
  Product
    .find() // mongoose method
    // .select('title price -_id')
    // mongoose method which retrieve/ doesn't retrieve specific path
    // .populate('userId', 'name') mongoose method which populates
    // Population is the process of automatically replacing the specified paths in the document with document(s) from other collection(s). 
    // .fetchAll() // raw mongoDB
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    })
    .catch(err => console.log(err))

  // Sequelize
  // req.user
  //   .getProducts()
  // // Product.findAll()
  //   .then(products => {
  //     res.render('admin/products', {
  //       prods: products,
  //       pageTitle: 'Admin Products',
  //       path: '/admin/products'
  //     });
  //   })
  //   .catch(err => console.log(err))

  // Using raw SQL
    // Product.fetchAll(products => {
  //   res.render('admin/products', {
  //     prods: products,
  //     pageTitle: 'Admin Products',
  //     path: '/admin/products'
  //   });
  // });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product
    .findByIdAndRemove(prodId)
    // .deleteByPk(prodId) // raw MongoDB
    .then(() => {
      console.log('DESTROYED PRODUCT');
      res.redirect('/admin/products');
    })
  // Sequelize
  // Product.findByPk(prodId)
  //   .then(product => {
  //     return product.destroy();
  //   })
    // .then(result => {
    //   console.log('DESCTROYED PRODUCT');
    //   res.redirect('/admin/products');
    // })
    .catch(err => console.log(err))

  // raw SQL version
  // Product.deleteById(prodId);
  // res.redirect('/admin/products')
}
