const productModel = require("../models/product.model");
const { model } = require("../models/product.model");
const fs = require("fs");




module.exports.searchProduct = async (req, res) => {
  let q = req.query.q;
  let products = await productModel.find();
  let matchedProducts = products.filter((product) => {
    // matched la 1 array
    return product.title.indexOf(q) !== -1; // neu q nam trong title thi gia tri lon hon -1
  });
  if (matchedProducts.length < 1) {
    res.render("products/searchProducts", {
      msg: "no search",
      products: matchedProducts,
    });
  } else {
    res.render("products/searchProducts", { products: matchedProducts });
  }
};

// get list product
module.exports.listProduct = async (req, res) => {
  // panigation
  let page = parseInt(req.query.page) || 1;
  let perPage = 4; // item in page
  let start = (page - 1) * perPage;
  let end = page * perPage;
  let totalProducts = await productModel.find();
  let totalPages = Math.ceil(totalProducts.length / perPage);
  let products = await (await productModel.find()).slice(start, end);
  //
  res.render("products/index", {
    products: products,
    totalPages: totalPages,
    page: page,
  });
};

module.exports.showAddProduct = (req, res) => {
  res.render("products/addProduct");
};

module.exports.showProductUpdate = async (req, res) => {
  try {
    const product = await productModel.findOne({ _id: req.params.id });
    res.render("products/productUpdate", { product: product });
  } catch (error) {
    //res.redirect("/");
  }
};

// add product
module.exports.addProduct = async (req, res) => {
  const { title, description, price } = req.body;
  req.body.mybook = req.file.path.split("/").slice(1).join("/");
    try {
      const product = new productModel({
        title: title,
        description: description,
        price: price,
        image: req.body.mybook,
      });
      let saveProduct = await product.save();
      res.redirect("/products");
    } catch (error) {
      res.send({ msg: "Add Product Fail!" });
    }
  
};


module.exports.getProduct = async (req, res) => {
  const product = await productModel.findById(req.params.id);
  res.render("products/editProduct", { product: product });
};


module.exports.editProduct = async (req, res) => {
  const product = await productModel.findOne({ _id: req.params.id });
  const { title, description, price } = req.body;
  req.body.mybook = req.file.path.split("/").slice(1).join("/");
  try {
    let updateProduct = await productModel.updateOne(
      { _id: product._id },
      {
        $set: {
          title: title,
          description: description,
          price: price,
          image: req.body.mybook,
        },
      }
    );
    res.redirect(`/products/${product._id}`);
  } catch {
    //res.render(`product/edit/${product._id}`);
  }
};

//delete image in public
module.exports.deleteImage = async (req, res, next) => {
  const product = await productModel.findById(req.params.id);
  const filePath = `./public/${product.image}`;
  try {
    fs.unlink(filePath, (err) => {
      if (err) throw err;
    });
    next();
  } catch {
    res.send("fail");
  }
};

module.exports.deleteProduct = async function (req, res) {
  await productModel.findByIdAndDelete(req.params.id);
  res.redirect("/products");
};
