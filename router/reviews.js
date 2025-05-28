const express = require('express');
const router = express.Router({mergeParams:true});
const wrapAsync = require('../utils/wrapasync.js');
const ExpressError = require('../utils/ExpressError.js');

const {isLoggedIn,isOwner,isReviewAuthor,ValidateReview} = require('../middleware.js');
const reviewcontroller = require('../controllers/reviews.js');
//for reviews 


router.post('/',isLoggedIn,ValidateReview ,wrapAsync(reviewcontroller.createReview));

//review delete route

router.delete('/:reviewid',isLoggedIn,isReviewAuthor,wrapAsync(reviewcontroller.destroyReview));
module.exports = router;