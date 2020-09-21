const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const {
  registerValidation,
  loginValidation,
} = require("../validation/user.validate");

module.exports.myAccount = async (req, res) => {
  try {
    const user = await userModel.findOne({ id: req.params._id });
    res.render("users/myAccount", { user: user });
  } catch (error) {
    res.redirect("/");
  }
};

module.exports.loginPage = (req, res) => {
  res.render("users/login");
};

module.exports.registerPage = (req, res) => {
  res.render("users/register");
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
      errs.push({ msg: error.details[0].message });
      res.render("users/register", { errs: errs, name, email, password });
    } else {
        
      // hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      // create user
      const user = new userModel({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
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
      expiresIn: "60s",
    });
    res.header("auth-token", token);
    console.log(token);
    //create cookie
    //res.cookie("access_token", token);
    res.redirect(`/my-account/${user._id}`);
  }
};
