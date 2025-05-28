//make the schema
const mongoose = require("mongoose");
const { Schema} = mongoose;
const review = require('./review.js');

const listingSchema = new Schema({
  title: String,
  description: String,
  image: {
    url: String,
    filename: String,
  },
  price: Number,
  location: String,
  country: String,
  latitude: Number ,      // Added latitude
  longitude: Number,     // Added longitude
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

listingSchema.post('findOneAndDelete',async(listing)=>{
  if(listing) {
    await review.deleteMany({_id:{$in:listing.reviews}});
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing
