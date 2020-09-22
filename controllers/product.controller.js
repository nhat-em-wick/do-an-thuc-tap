const productModel = require('../models/product.model');
const {productValidation} = require('../validation/product.validation');

module.exports.listProduct = (req, res)=>{
  res.render('products/index');
}

module.exports.getProduct = (req, res)=>{
  res.render('products/addProduct');
}

module.exports.addProduct = (req, res)=>{
  const { title, description, price } = req.body;
  req.body.mybook = req.file.path.split('/').slice(1).join('/');
  const { error } = productValidation(req.body);
  let errs = [];
  if (error) {
    errs.push({ msg: error.details[0].message });
    res.render("products/addProduct", { errs: errs, title, description, price });
  }
  
}


