const express = require("express");
const userController = require('../controllers/user.controller');
const verify = require('./verifyToken');
var router = express.Router();

// login page
router.get("/login", userController.loginPage);

// register page
router.get("/register",verify,  userController.registerPage );

router.post('/login', userController.login);

router.post('/register',userController.register)

router.get('/my-account/:id', userController.myAccount)


module.exports = router;