const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require('../models/listing');
const methodOverride = require('method-override');
const {validateReview, isLoggedIn,isReviewAuther} = require("../middleware.js");
const reviewController = require('../controller/review.js');




router.use(methodOverride("_method"));


//review request
router.post("/", validateReview,
    isLoggedIn,
     wrapAsync(reviewController.createReview));


//Delete review 
router.delete("/:reviewsId",
    isLoggedIn,
    isReviewAuther,
    wrapAsync(reviewController.destroyReview));


module.exports = router;
