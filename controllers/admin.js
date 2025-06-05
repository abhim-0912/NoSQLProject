const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product',{
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const {title,imageUrl,price,description} = req.body;
  
  const product = new Product({
    title,
    imageUrl,
    price,
    description,
    userId: req.user._id
  });

  product
    .save()
    .then(() => {
      console.log("Created Product");
      res.redirect('/admin/products');
    })
    .catch(err=> {
      console.log("Error in Creating product : ",err);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if(!editMode){
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      if(!product){
        return res.redirect('/');
      }
      res.render('admin/edit-product',{
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product
      });
    })
    .catch(err => {
      console.log("Error editing the Product : ",err);
    })

};

exports.postEditProduct = (req, res, next) => {
  const {productId,title,imageUrl,price,description} = req.body;
  Product.findById(productId)
    .then(product => {
      if(!product){
        return res.redirect('/admin/products');
      }
      product.title = title;
      product.imageUrl = imageUrl;
      product.price = price;
      product.description = description;
      return product.save();
    })
    .then(() => {
      console.log("Updated Product");
      res.redirect('/admin/products');
    })
    .catch(err => {
      console.log("Error in updating the product : ",err);
    })
};

exports.getProducts = (req, res, next) => {
  Product.find({userId: req.user._id})
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    })
    .catch(err => {
      console.log("Error getting all products : ",err);
    })
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByIdAndRemove(prodId)
    .then(() => {
      console.log("Destroyed product");
      res.redirect('/admin/products');
    })
    .catch(err => {
      console.log("Error deleting the product : ",err);
    })
};
