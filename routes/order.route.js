const express = require("express");
const router = express.Router();
const orderController = require('../controllers/order.controller')
const verify = require('./verifyToken');

router.get('/orders',verify, orderController.index)
router.post('/orders', orderController.store)
module.exports  = router;