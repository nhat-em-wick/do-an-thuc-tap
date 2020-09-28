const express = require("express");
const userController = require('../controllers/user.controller');
const verify = require('./verifyToken');
var router = express.Router();
const verifyAdmin = require('./verifyAdmin');

router.get('/login', userController.loginPage);

router.get('/register', userController.registerPage );

router.post('/my-account', userController.login);

router.post('/register',userController.register);

router.get('/my-account/:id', userController.myAccount);

router.get('/my-account/edit/:id', userController.editUser);

router.put('/my-account/:id', userController.putUser);

router.get('/admin', userController.Admin);

router.get('/logout',verify, userController.logOut);
module.exports = router;