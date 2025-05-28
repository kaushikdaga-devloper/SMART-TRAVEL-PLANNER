const listing = require('./models/listing.js');
const review = require('./models/review.js');
const ExpressError = require('./utils/ExpressError.js');

module.exports.isLoggedIn =(req,res,next)=>{
    if(!req.isAuthenticated()){
        //redirecr url
        req.session.redirectUrl = req.originalUrl;
        req.flash('error',"You must be Loged in to Create listing");
        return res.redirect('/login');
    }
    next();
};
module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl) {
        res.locals.redirectUrl =req.session.redirectUrl;
    }
    next();
};
module.exports.isOwner = async (req,res,next)=>{
    let {id} = req.params;
    let update = req.body;
    let list= await listing.findById(id);
    if(!list.owner._id.equals(res.locals.curUser._id)){
        req.flash("error","You dont have the autority");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
module.exports.ValidateReview = (req,res,next)=>{
    let {error}= reviewSchema.validate(req.body);
    if(error) {
        let errorMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError( 400,errorMsg);
    }
    else {
        next();
    }
}
module.exports.isReviewAuthor = async (req,res,next)=>{
    let {id,reviewid} = req.params;
    let userReview = await review.findById(reviewid);
    if(!userReview.author.equals(res.locals.curUser._id)){
        req.flash("error","You does not have the athority to delete it");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
module.exports.validateListing = (req,res,next)=>{
    let {error}= listingSchema.validate(req.body);
    if(error) {
        let errorMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError( 400,errorMsg);
    }
    else {
        next();
    }
}