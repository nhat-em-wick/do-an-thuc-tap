const express = require("express");
const userController = require('../controllers/user.controller');
const verify = require('./verifyToken');
var router = express.Router();
const verifyAdmin = require('./verifyAdmin');
// login page
router.get('/login', userController.loginPage);

// register page
router.get('/register', userController.registerPage );

router.post('/my-account', userController.login);

router.post('/register',userController.register);
// show account
router.get('/my-account/:id', userController.myAccount);

router.get('/my-account/edit/:id', userController.editUser);
//edit
router.put('/my-account/:id', userController.patchUser);

router.get('/admin', userController.Admin);


module.exports = router;