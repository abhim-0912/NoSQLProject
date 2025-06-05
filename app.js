const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const connectMongo = require('./util/database');

const errorController = require('./controllers/error');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(async (req, res, next) => {
  try {
    let user = await User.findOne();

    if (!user) {
      user = await User.create({
        name: 'TestUser',
        email: 'test@example.com',
        cart: { items: [] }
      });
    }

    req.user = user;
    next();
  } catch (err) {
    console.log("Middleware error:", err);
  }
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

connectMongo().then(() => {
  app.listen(3000, () => {
    console.log('Server is running at http://localhost:3000');
  });
});
