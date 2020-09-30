
module.exports.updateCart = (req, res) => {
  if (!req.session.cart) {
    req.session.cart = {
      items: {},
      totalQty: 0,
      totalPrice: 0,
    };
  }
  let cart = req.session.cart;
  if (!cart.items[req.body._id]) {
    cart.items[req.body._id] = {
      item: req.body,
      qty: 1,
    };
    cart.totalQty += 1;
    cart.totalPrice += req.body.price;
  } else {
    cart.items[req.body._id].qty = cart.items[req.body._id].qty + 1;
    cart.totalQty += 1;
    cart.totalPrice += req.body.price;
  }
  res.json({ totalQty: req.session.cart.totalQty});
};

module.exports.getItemCart = (req, res) => {
  res.render("cart/cartItem");
};


module.exports.removeItem = (req, res)=>{
  const cart = req.session.cart;
  const qtyItemRemove = cart.items[req.params.id].qty;
  const priceItemRemove = (cart.items[req.params.id].item.price)*qtyItemRemove;
  cart.totalQty -= qtyItemRemove;
  cart.totalPrice -= priceItemRemove;
  delete cart.items[req.params.id];
  res.redirect('/cart');
};