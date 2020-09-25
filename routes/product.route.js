const express = require("express");
const productController = require('../controllers/product.controller');
const verify = require('./verifyToken');
const multer = require('multer');
//var upload = multer({ dest: './public/images' })
const path =require('path');
const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now()+path.extname(file.originalname))
    }
})
   
const upload = multer({ storage: storage });

router.get('/products/seach', productController.searchProduct)

router.get('/products', productController.listProduct);

router.get('/products/add', productController.showAddProduct);

router.post('/products/add', upload.single('mybook') ,productController.addProduct);

router.get('/products/edit/:id', productController.getProduct);

router.put('/products/:id',upload.single('mybook'), productController.editProduct);

router.get('/products/:id', productController.showProductUpdate);

router.delete('/products/:id', productController.deleteImage, productController.deleteProduct);

module.exports = router;