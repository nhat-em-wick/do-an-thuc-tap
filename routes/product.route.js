const express = require("express");
const productController = require('../controllers/product.controller');
const verify = require('./verifyToken');
const router = express.Router();

const multer = require('multer');
const path =require('path');

const storage = multer.diskStorage({
  destination: './public/images',
  filename: function(req, file, cb){
      cb(null, file.fieldname + '-' + Date.now()+path.extname(file.originalname))
  }
});

var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || 
    file.mimetype == "image/jpeg" || file.mimetype == "image/gif") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  }
});

router.get('/products/seach', productController.searchProduct)

router.get('/products', productController.listProduct);

router.get('/products/add', productController.showAddProduct);

router.post('/products/add',upload.single('mybook') ,productController.addProduct);

router.get('/products/edit/:id', productController.getProduct);

router.put('/products/:id',upload.single('mybook'), productController.editProduct);

router.get('/products/:id', productController.showProductUpdate);

router.delete('/products/:id', productController.deleteImage, productController.deleteProduct);

module.exports = router;