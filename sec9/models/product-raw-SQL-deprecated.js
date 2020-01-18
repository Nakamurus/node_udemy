// deprecated

const db = require('../util/database');

const Cart = require('./cart');

module.exports = class Product {
  constructor(id, title, image, description, price) {
    this.id = id;
    this.title = title;
    this.image = image;
    this.description = description;
    this.price = price;
  }

  save() {
    return db.execute('INSERT INTO products (title, price, image, description) VALUES (?, ?, ?, ?)',
      [this.title, this.price, this.image, this.description]
    );
  }

  static deleteById(id) {
  }

  static fetchAll() {
    return db.execute('SELECT * FROM products');
    // want to use result, so don't use '.then()' but just return it
  }

  static findById(id) {
    return db.execute('SELECT * FROM products WHERE products.id = ?', [id]);
  }
}