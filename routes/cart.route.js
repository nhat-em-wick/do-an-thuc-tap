const express = require("express");
const router = express.Router();
const cartController = require('../controllers/cart.controller')
const verify = require('./verifyToken');

router.post('/updateCart', cartController.updateCart)

router.get('/cart',cartController.getItemCart)

router.delete('/cart/:id', cartController.removeItem);

module.exports  = router;