const listing = require('../models/listing.js');
const ExpressError = require('../utils/ExpressError.js');
const listingSchema = require("../schema.js");
const reviewSchema = require("../schema.js");
const User = require('../models/user.js');

module.exports.index= async (req,res)=>{
    let allListings= await listing.find({});
    res.render('./listings/index.ejs',{allListings});
 };
 module.exports.renderNewform = async (req,res)=>{
    res.render('./listings/new.ejs');
}
module.exports.createNewform = async (req, res, next) => {
    try {
        const { title, description, price, location, country, latitude, longitude } = req.body.listing;
        const url = req.file.path;
        const filename = req.file.filename;

        const newListing = new listing({
            title,
            description,
            price,
            location,
            country,
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            owner: req.user._id,
            image: { url, filename }
        });

        await newListing.save();
        req.flash("success", "New Listing Created!");
        res.redirect('/listings');
    } catch (err) {
        next(err);
    }
};

module.exports.showRoute = async (req,res)=>{
    let {id} = req.params;
    const list= await listing.findById(id).populate({path:"reviews",populate:{
        path:"author"
    },}).populate("owner");
    if(!list) {
        req.flash("error","Listing you requested for does not exist!");
        res.redirect('/listings');
    }
    else {
    res.render('./listings/show.ejs',{list});
}}
module.exports.editRoute = async (req,res)=>{
    let {id} = req.params;
    const list= await listing.findById(id);
    if(!list) {
        req.flash("error","listing does not exist!");
        res.redirect('/listings');
    }
    else {
        console.log(list);
    res.render('./listings/edit.ejs',{list});
    } 
}
module.exports.update = async (req,res)=>{
   
    let {id} = req.params;
    let update = req.body;
    await listing.findByIdAndUpdate(id,update);
    if(req.file) {
        let url = req.file.path;
        let filename = req.file.filename;
        update.image = {url,filename};
    await listing.findByIdAndUpdate(id,update);
    req.flash("success","Listing updated!");
     return res.redirect(`/listings/${id}`);
    }
    req.flash("success","Listing updated!");
    res.redirect(`/listings/${id}`);
    
}
module.exports.delete = async (req,res)=>{
    let {id} = req.params;
    await listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted !");
    res.redirect('/listings');
}