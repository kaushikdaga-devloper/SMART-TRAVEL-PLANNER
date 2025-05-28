const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapasync.js');
const listingController = require('../controllers/listings.js');
const {isLoggedIn,isOwner,validateListing} = require('../middleware.js');
const multer = require('multer');
const {storage} = require('../cloudConfig.js');
const upload = multer({storage});

//handling the requests

// creating the index route
router.get('/',wrapAsync(listingController.index));

//new route
router.route('/new')
.get(isLoggedIn, listingController.renderNewform)
.post(upload.single('listing[image]'),wrapAsync(listingController.createNewform));


router.route('/:id')
.get(wrapAsync(listingController.showRoute)) 
.put(isLoggedIn,isOwner, upload.single('listing[image]'),wrapAsync(listingController.update))
.delete(isLoggedIn,isOwner ,wrapAsync(listingController.delete));//delete route
    
//Edit route
router.get('/:id/edit', isLoggedIn,wrapAsync(listingController.editRoute));


module.exports = router;