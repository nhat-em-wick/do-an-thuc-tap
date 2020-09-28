const express = require("express");
const router = express.Router();
const orderController = require('../controllers/order.controller')
const verify = require('./verifyToken');
const verifyAdmin = require('./verifyAdmin');

router.get('/orders',verify, orderController.index);
router.post('/orders',verify, orderController.store);
router.get('/orders/:id', orderController.showOrder);
module.exports  = router;