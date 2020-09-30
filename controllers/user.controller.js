const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const {
  registerValidation,
  updateUserValidation,
  loginValidation,
} = require("../validation/user.validate");

const mailgun = require("mailgun-js");
const DOMAIN = 'sandbox2f2dbafd5f564f11b5e90b0bd48eff7f.mailgun.org';
const mg = mailgun({apiKey: process.env.MAILGUN_APIKEY, domain: DOMAIN});
const tokenList ={};
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
  const { name, email, password, conf_password } = req.body;
  const { error } = registerValidation(req.body);
  let errs = [];
  if(password!==conf_password){
    res.send({message:"Password not match"});
  }
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
        res.send({message:""});
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
      expiresIn: "30s",
    });
    const refreshToken =await jwt.sign({ _id: user._id }, process.env.REFRESH_TOKEN, {
      expiresIn: "24h",
    });
    const response = {
      "access_token":token,
      "refresh_token":refreshToken
    }

    tokenList[refreshToken] = response;
    res.set({
      'access_token': token,
      'refresh_token': refreshToken
    }).json({user:user,tokenList:tokenList});
  }
};

//update user
module.exports.putUser = async (req, res) => {
  const user = await userModel.findOne({ _id: req.params.id });
  const { name, password, conf_password } = req.body;
  const { error } = updateUserValidation(req.body);
  let errs = [];
  if(password !== conf_password){
    res.send({message:"Password no matched"})
  }
  if (error) {
    errs.push({ msg: error.details[0].message });
    res.render(`users/editUser`, { errs: errs, user: user });
  } else {
    try {
      
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


module.exports.forgotPassword = async (req, res)=>{
  const {email}= req.body;
  const user = await userModel.findOne({email: email});
  if(!user) return res.status(400).json({ message:'user with this email does not exists' })
  try {
    const token = await jwt.sign({ _id: user._id }, process.env.RESET_PASSWORD_KEY, {
      expiresIn: "10m"
    });
    const data ={
      from: 'admin@admin.mailgun.org',
      to: email,
      subject: 'Account Activation Link',
      html: `<h2>Please click on given link to reset password</h2>
              <a>localhost:3000/resetpassword/${token}</a>`
    }
    mg.messages().send(data, function (error, body) {
      console.log(body);
    });
    try {
    let resetLink = await user.updateOne({resetLink: token});
      res.json({message:'Email has been sent'});
    } catch {
      res.status(400).json({message:'reset password link err'})
    }
  } catch (error) {
     res.status(400).json({ message:'user with this email does not exists' })
  }
}

module.exports.resetPassword = async (req, res)=>{
  const {resetLink, newPass} = req.body;
  if(resetLink){
    try{
      const decoded =await jwt.verify(resetLink, process.env.RESET_PASSWORD_KEY);
      let user = await userModel.findOne({resetLink: resetLink});
      if(!user) res.status(400).json({message: 'user with this token does not exist'});
      // hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPass, salt);
      let changePass = await user.updateOne({password: hashedPassword});
      res.json({message:'Your password has been changed'});
    }catch{
      res.status(401).json({message:'Token Invali'});
    }
  }else{
    return res.status(401).json({message:'Authentication err!!'})
  }
}

module.exports.refreshToken = async (req, res)=>{
  const refreshToken = req.header('refresh-token')||req.body.token;
  if(refreshToken && (refreshToken in tokenList)) {
    const decoded = jwt.decode(refreshToken);
    const token = jwt.sign({_id:decoded._id}, process.env.TOKEN_SECRET, { expiresIn:'1m'})
    
    // update the token in the list
    tokenList[refreshToken].access_token = token;
    res.set({
      'access_token': token,
      'refresh_token': refreshToken
    }).json(tokenList);        
} else {
    res.status(404).json({message:'Invalid request'});
}
}