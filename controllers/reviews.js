const review =  require('../models/review.js');
const ExpressError = require('../utils/ExpressError.js');
const reviewSchema = require("../schema.js");
const listing = require('../models/listing.js');
module.exports.createReview = async (req,res)=>{
    let {id} =  req.params;
    let newReview = new review(req.body.review);
    newReview.author = req.user._id;
    let addListing= await listing.findById(id);

    addListing.reviews.push(newReview);
     await newReview.save();
     await addListing.save();
     req.flash("success","Review added successfully!");
     res.redirect(`/listings/${id}`);
}
module.exports.destroyReview = async( req,res)=>{
    let { id,reviewid} = req.params;
    await review.findOneAndDelete(reviewid);
    await listing.findByIdAndUpdate(id,{$pull :{reviews: reviewid}});
    req.flash("success","Review removed!");
    res.redirect(`/listings/${id}`);
}