const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const {
  registerValidation,
  updateUserValidation,
  loginValidation,
} = require("../validation/user.validate");

module.exports.loginPage = (req, res) => {
  res.render("users/login");
};

module.exports.registerPage = (req, res) => {
  res.render("users/register");
};

module.exports.editUser = async (req, res) => {
  const user = await userModel.findById(req.params.id);
  res.render("users/editUser", { user: user });
};

module.exports.myAccount = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.params.id });
    res.render("users/myAccount", { user: user });
  } catch (error) {
    res.redirect("/");
  }
};

module.exports.register = async (req, res) => {
  // validation data
  const { name, email, password } = req.body;
  const { error } = registerValidation(req.body);
  let errs = [];
  if (error) {
    errs.push({ msg: error.details[0].message });
    res.render("users/register", { errs: errs, name, email, password });
  } else {
    // checking if user is already in the database
    const emailExist = await userModel.findOne({ email: req.body.email });
    if (emailExist) {
      errs.push({ msg: "email exits" });
      res.render("users/register", { errs: errs, name, email, password });
    } else {
      // // hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      // create user
      const user = new userModel({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
      }); 
      try {
        let saveUSer = await user.save();
        res.redirect("/login");
      } catch (error) {
        res.sendStatus(404);
      }
    }
  }
};

module.exports.Admin = async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(process.env.PASSWORD_ADMIN, salt);
  try {
    const user = new userModel({
      name: process.env.NAME_ADMIN,
      email: process.env.EMAIL_ADMIN,
      password: hashedPassword,
      isAdmin: true,
    });
    const userAdmin = await user.save();
  } catch (error) {
    res.send({ message: error.message });
  }
};

module.exports.login = async (req, res) => {
  // validation data
  const { email, password } = req.body;
  let errs = [];
  const { error } = loginValidation(req.body);
  if (error) {
    errs.push({ msg: error.details[0].message });
    res.render("users/login", { errs: errs, email, password });
  }
  // checking if email exist
  const user = await userModel.findOne({ email: req.body.email });
  if (!user) {
    errs.push({ msg: "Email is not found!" });
    res.render("users/login", { errs: errs, email, password });
  }
  // password is correct
  const valiPass = await bcrypt.compare(req.body.password, user.password);
  if (!valiPass) {
    errs.push({ msg: "Password is wrong!" });
    res.render("users/login", { errs: errs, email, password });
  } else {
    // create and assign a token
    const token = await jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, {
      expiresIn: "1h",
    });
    res.header('auth-token',token).send({
      _id:user.id,
      name:user.name,
      email:user.email,
      isAdmin:user.isAdmin
    });
    //create cookie
    //res.cookie("access_token", token);
    //res.redirect(`/my-account/${user._id}`)
  }
};

//update user
module.exports.putUser = async (req, res) => {
  const user = await userModel.findOne({ _id: req.params.id });
  const { name, password } = req.body;
  const { error } = updateUserValidation(req.body);
  let errs = [];
  if (error) {
    errs.push({ msg: error.details[0].message });
    res.render(`users/editUser`, { errs: errs, user: user });
  } else {
    try {
      // hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      let updateUser = await userModel.updateOne(
        { _id: user._id },
        {
          $set: { name: name, password: hashedPassword },
        }
      );
      res.redirect(`/my-account/${user._id}`);
    } catch{
      res.redirect(`/my-account/edit/${user._id}`);
    }
  }
};
