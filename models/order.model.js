const mongoose = require('mongoose');
const { string } = require('@hapi/joi');
const orderSchema = new mongoose.Schema({
    customerId:{type: String,required:true},
    items: { type: Object, required: true },
    phone: { type: String, required: true},
    address: { type: String, required: true},
    status: { type: String, default: 'order_placed'}
})

module.exports = mongoose.model('Orders', orderSchema);