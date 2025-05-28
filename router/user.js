const express = require('express');
const router = express.Router();
const passport = require('passport');
const {saveRedirectUrl} = require('../middleware.js');
const userController = require('../controllers/users.js');
const ExpressError = require('../utils/ExpressError.js');

//singin
router.route('/signup')
.get(userController.signup)
.post(userController.signupUser);
//for login route
router.route('/login')
.get(userController.login)
.post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}),
userController.loginUser);
//for logout route
router.get('/logout',userController.logoutUser);
module.exports = router;