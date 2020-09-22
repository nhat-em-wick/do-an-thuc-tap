const express = require("express");
const productController = require('../controllers/product.controller');
const verify = require('./verifyToken');
const multer = require('multer');
var upload = multer({ dest: './public/images' })
const path =require('path');
const router = express.Router();

router.get('/products', productController.listProduct);

router.get('/products/add', productController.getProduct);

router.post('/products/add', upload.single('mybook') ,productController.addProduct);

module.exports = router;