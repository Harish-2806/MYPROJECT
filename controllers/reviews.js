const Listing=require("../models/listing");
const Review=require("../models/review");
const ExpressError=require("../utils/ExpressError.js");
module.exports.createreview=async(req,res)=>{
    
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
   console.log(newReview);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("s","New Review created");
    res.redirect(`/listings/${listing._id}`);
};
module.exports.destroyreview=async(req,res)=>{
    let{id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash("s","Review deleted");
    res.redirect(`/listings/${id}`);
};