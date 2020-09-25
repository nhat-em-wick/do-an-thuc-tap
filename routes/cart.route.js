const express = require("express");
const router = express.Router();
const cartController = require('../controllers/cart.controller')

router.post('/updateCart', cartController.updateCart)

router.get('/cart', cartController.getItemCart)

module.exports  = router;