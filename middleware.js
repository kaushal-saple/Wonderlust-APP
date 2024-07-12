const Listing = require('./models/listing');
const Review = require('./models/review');
const {allListingSchema,reviewSchema} = require("./schema.js");
const ExpressError = require("./utils/ExpressError");

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","you must be logged in to create listing")
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl = req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async(req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.curUser._id)){
        req.flash("error","You are not the owner of this Listing");
        return res.redirect(`/allListing/${id}`);
    }
    next();
}

module.exports.validateListing= (req,res,next) =>{
    let {error} = allListingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

module.exports.isReviewAuther = async(req,res,next)=>{
    let {id,reviewsId} = req.params;
    let review = await Review.findById(reviewsId);
    if(!review.author._id.equals(res.locals.curUser._id)){
        req.flash("error","You are not the owner of this Review");
        return res.redirect(`/allListing/${id}`);
    }
    next();
}

