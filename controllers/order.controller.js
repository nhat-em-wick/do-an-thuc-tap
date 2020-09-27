const orderModel  = require('../models/order.model')
const userModel = require("../models/user.model");
const jwt = require('jsonwebtoken');


module.exports.index = async (req, res)=>{
    const token = req.header('auth-token');
    const decoded = jwt.decode(token);
    const user = await userModel.findOne({_id: decoded._id});
    res.render('cart/checkOut',{user: user});

}

module.exports.store = async (req, res)=>{
    const {phone, address} = req.body;
    if(!phone || !address){
        res.redirect('/cart');
    }
    const token = req.header('auth-token');
    const decoded = jwt.decode(token);
    let order = new orderModel({
        customerId:decoded._id,
        items: req.session.cart.items,
        phone: phone,
        address: address
    })
    order = await order.save();
    res.redirect('/');
}