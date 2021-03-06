const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

const ObjectId = mongodb.ObjectId;

class User {
    constructor(username, email, cart, id) {
        this.name = username;
        this.email = email;
        this.cart = cart; // {items: []}
        this._id = id;
    }

    save() {
        const db = getDb();
        return db.collection('users').insertOne(this);
    }

    addToCart(product) {
        const cartProductIndex = this.cart.items.findIndex(cp => {
            return cp.productId.toString() === product._id.toString();
        });
        let newQUantity = 1;
        const updatedCartItems = [...this.cart.items];

        if (cartProductIndex >= 0) {
            newQUantity = this.cart.items[cartProductIndex].quantity + 1;
            updatedCartItems[cartProductIndex].quantity = newQUantity;
        } else {
            updatedCartItems.push({
                productId: new ObjectId(product._id),
                quantity: newQUantity
            });
        }
        const updatedCart = {
            items: updatedCartItems
        };
        const db = getDb();
        return db
          .collection('users')
          .updateOne(
              { _id: new ObjectId(this._id) },
              { $set: {cart: updatedCart} }
          );
    }

    getCart() {
        const db = getDb();
        const productIds = this.cart.items.map(i => {
            return i.productId;
        });
        return db
        .collection('products')
        .find({ _id: { $in: productIds } })
        .toArray()
        .then(products => {
            return products.map(p => {
                return {
                    ...p,
                    quantity: this.cart.items.find(i => {
                        return i.productId.toString() === p._id.toString();
                    }).quantity
                };
            });
        });
    }

    deleteItemFromCart(productId) {
        const updatedCartItems = this.cart.items.filter(item => {
            return item.productId.toString() !== productId.toString();
            // idが一致しないものを真で返す
        });
        const db = getDb();
        return db
          .collection('users')
          .updateOne(
              { _id: new ObjectId(this._id) },
              { $set: { cart: {items: updatedCartItems} }}
              // idが一致しないものだけを改めてCartに入れる
          );
    }

    addOrder() {
        const db = getDb();
        return this.getCart()
          .then(products => {
              const order = {
                  items: products,
                  user: {
                      _id: new ObjectId(this._id),
                      name: this.name
                  }
              };
              return db.collection('orders').insertOne(order);
          })
          .then(result => {
              // init cart
              this.cart = { items: [] };
              return db
                .collection('users')
                .updateOne(
                    { _id: new ObjectId(this._id ) },
                    { $set: { cart: { items: [] } }}
                );
          });
    }

    getOrders() {
        const db = getDb();
        return db
          .collection('orders')
          .find({ 'users._id': new ObjectId(this._id) })
          .toArray();
    }

    static findByPk(userId) {
        const db = getDb();
        return db.collection('users')
          .findOne({ _id: new ObjectId(userId) })
          .then(user => {
              console.log(user);
              return user;
          })
          .catch(err => console.log(err))
    }
}

module.exports = User;