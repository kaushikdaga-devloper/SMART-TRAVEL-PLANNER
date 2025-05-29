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

//for search feature
const axios = require('axios');

module.exports.searchListings = async (req, res, next) => {
    const query = req.query.query;
    if (!query) {
        req.flash("error", "No search query provided.");
        return res.redirect("/listings");
    }

    const geoApiKey = process.env.GEOAPIFY_API_KEY;
    const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;

    const geoUrl = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(query)}&format=json&limit=5&apiKey=${geoApiKey}`;

    try {
        const geoRes = await axios.get(geoUrl);
        const results = geoRes.data.results;

        const searchResults = await Promise.all(results.map(async (place, index) => {
            const placeName = place.city || place.name || place.address_line1 || place.formatted;
            const location = [place.city, place.state, place.country].filter(Boolean).join(', ');
            const latitude = place.lat;
            const longitude = place.lon;
            const country = place.country;

            // Get relevant images (tourist attractions, hotels, resorts)
           // Get relevant and unique image (tourist attractions, hotels, resorts)
let imgUrl = "https://source.unsplash.com/featured/?travel";
try {
    const queryString = `${placeName} tourism OR hotels OR resorts`;
    const unsplashRes = await axios.get(`https://api.unsplash.com/search/photos`, {
        params: { query: queryString, per_page: 10 },
        headers: { Authorization: `Client-ID ${unsplashKey}` }
    });

    const results = unsplashRes.data.results;
    if (results.length > 0) {
        // Pick a random image from top 10 results
        const randomIndex = Math.floor(Math.random() * results.length);
        imgUrl = results[randomIndex].urls.small;
    }
} catch (err) {
    console.log("Unsplash error:", err.message);
}


            // Description based on the location
            let description = `Explore the charm of ${placeName}, located in ${location}. A perfect destination for your next adventure!`;
            if (placeName.toLowerCase() === 'paris') {
                description = `Paris, the City of Light, brims with picturesque streets, rich history, and world-class museums and monuments. Essential landmarks include the Eiffel Tower, Louvre, Musée d'Orsay, and Notre Dame. Explore diverse neighborhoods from the upscale 8th arrondissement to trendy Belleville in the 11th.`;
            } else if (placeName.toLowerCase() === 'new york') {
                description = `New York City offers a blend of iconic landmarks and diverse neighborhoods. From the Empire State Building and Central Park to the vibrant streets of SoHo and Greenwich Village, there's something for everyone.`;
            } else if (placeName.toLowerCase() === 'tokyo') {
                description = `Tokyo, a city blending past, present, and future, offers a unique cultural experience. Visit historic temples, modern skyscrapers, and enjoy world-class shopping and dining.`;
            }

            return {
                _id: `search-${index}`,
                title: placeName,
                location,
                country,
                latitude,
                longitude,
                price: Math.floor(Math.random() * 5000) + 1000,
                image: { url: imgUrl },
                description
            };
        }));

        res.render('./listings/search.ejs', { searchResults,query });

    } catch (err) {
        console.error("Geoapify error:", err.message);
        req.flash("error", "Error retrieving location data.");
        res.redirect("/listings");
    }
};
module.exports.renderSearchResult = (req, res) => {
    const {
        title,
        location,
        country,
        price,
        image,
        latitude,
        longitude,
        description
    } = req.query;

    const listing = {
        title,
        location,
        country,
        price: Number(price),
        image: { url: image },
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        owner: { username: req.user ? req.user.username : 'Guest' },
        description: description || 'No description available.',
        reviews: []
    };

    res.render('./listings/searchResult.ejs', {
        list: listing,
        curUser: req.user
    });
};
