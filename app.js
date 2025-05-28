// AIRBNB-MAJOR-PROJECT
require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');
const listings = require('./router/listings.js');
const reviews = require('./router/reviews.js');
const user = require('./router/user.js');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');


//set the path 
app.set('view engine','ejs');
app.set('views',path.join(__dirname,"views"));

//set the parsing
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,"public")));
app.engine('ejs',ejsMate);

//connect with Database
const dbUrl = process.env.MONGO_ATLAS_LINK;
async function main() {
    await mongoose.connect(dbUrl);
}
main().then((res)=> console.log("Connected with Database"))
.catch((err)=> console.log(err));

const store = MongoStore.create({mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
        touchAfter:24*3600,
    }
});
store.on("error",()=>{
    console.log("error in mongo session code",err);
});

const sessionOption = {
    store,
    secret: process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httponly : true
    } ,
}

app.use(session(sessionOption));
app.use(flash());

//using passport
app.use(passport.initialize());
app.use(passport.session());//used to know which session does the page belongs to
passport.use(new LocalStrategy(User.authenticate()));//users will authenticate through local strategy
passport.serializeUser(User.serializeUser());//add the user info in the session
passport.deserializeUser(User.deserializeUser());//removes the user data from session


app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash('error');
    res.locals.curUser =req.user;
    next();
});

app.use('/listings',listings);
app.use('/listings/:id/reviews',reviews);
app.use('/',user);

//middle ware for handling error
app.use((req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
}); 

app.use((err,req,res,next)=>{
    let {statusCode=500,message = "Something went wrong"} =err;
    res.render("./listings/error.ejs",{message})
});

//start the server
app.listen('8080',()=> {
    console.log("Server is Listining at port 8080");
});