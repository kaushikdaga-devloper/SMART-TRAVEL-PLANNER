const User = require('../models/user.js');
const ExpressError = require('../utils/ExpressError.js');

module.exports.signup = (req,res)=>{
    res.render('../views/users/signup.ejs');
}
module.exports.signupUser = async(req,res)=>{
    try {
    let {email , username , password} = req.body;
   const newUser= new User({email , username});
  const registerUser = await User.register(newUser,password);
  req.login(registerUser,(err)=>{
    if(err) {
        return next(err);
    }
    req.flash("success","Welcome to wanderlust");
    res.redirect('/listings');
  });
}

catch(e) {
    req.flash('err',"Something went wrong");
}
}
module.exports.login = (req,res)=>{
    res.render('../views/users/login.ejs');
}
module.exports.loginUser = async(req,res)=>{
    req.flash("success","Welcome Back");
    if(!res.locals.redirectUrl) {
        return res.redirect('/listings');
    }
    res.redirect(res.locals.redirectUrl);

}
module.exports.logoutUser = (req,res)=>{
    req.logOut((err)=>{
        if(err) {
            return next();
        }
        req.flash("success","Logged out !");
        res.redirect('/listings');
    });
}