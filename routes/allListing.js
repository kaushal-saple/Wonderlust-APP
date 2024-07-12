const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");
const listingController = require('../controller/allListings.js');
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});


//index route and create route
router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn,
        upload.single('listing[image][url]'),
        validateListing,
        wrapAsync(listingController.createListing))
;

//creating new  route form
router.get('/new',isLoggedIn,listingController.renderNewForm);

// showing ,updating , deleting listing route
router
    .route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(
        isLoggedIn,
        isOwner,
        upload.single('listing[image]'),
        validateListing,
        wrapAsync(listingController.updateListing))
    .delete(
        isLoggedIn,
        isOwner,
        wrapAsync(listingController.destroyListing))
;
        

//edit Listing
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.editListingForm));

module.exports = router;