const mongoose = require('mongoose');
const { string, number } = require('@hapi/joi');
const orderSchema = new mongoose.Schema({
    customerId:{type: String,required:true},
    items: { type: Object, required: true },
    phone: { type: String, required: true},
    address: { type: String, required: true},
    status: { type: String, default: 'order_placed'},
    totalQty:{type: Number, default:0},
    totalPrice:{type:Number,default:0}
})

module.exports = mongoose.model('Orders', orderSchema);