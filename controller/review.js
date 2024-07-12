const Listing = require('../models/listing');
const Review = require('../models/review')

module.exports.createReview = async(req,res)=>{
    console.log(req.params.id);
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.reviews);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","Review Successfully");


    res.redirect(`/allListing/${listing._id}`)
}

module.exports.destroyReview = async(req,res)=>{
    let {id,reviewsId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewsId}});
    await Review.findByIdAndDelete(reviewsId);
    req.flash("success","Listing Deleted Successfully");
    res.redirect(`/allListing/${id}`);
}