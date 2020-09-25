const mongoose = require('mongoose');
const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
    customerId: { 
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
                },
    items: { type: Object, required: true },
    phone: { type: String, required: true},
    address: { type: String, required: true},
    status: { type: String, default: 'order_placed'}
})

module.exports = mongoose.model('Products', productSchema)