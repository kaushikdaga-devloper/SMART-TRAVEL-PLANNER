// AIRBNB-MAJOR-PROJECT
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const listing = require('../models/listing.js');
const initData = require('./data.js');

//connect with Database
const MONGO_URL = process.env.MONGO_ATLAS_LINK;
async function main() {
    await mongoose.connect(MONGO_URL);
}
main().then((res)=> console.log("Connected with Database"))
.catch((err)=> console.log(err));
let insert = async ()=>{
   await listing.insertMany(initData.data);
}
insert();
