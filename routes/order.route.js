const express = require("express");
const router = express.Router();
const orderController = require('../controllers/order.controller')
const verify = require('./verifyToken');

router.get('/orders',verify, orderController.index);
router.post('/orders', orderController.store);
router.get('/orders/:id', orderController.showOrder);
module.exports  = router;