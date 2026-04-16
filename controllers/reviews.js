const Review = require("../models/review");
const Listing = require("../models/listing");


module.exports.createReview = async (req,res)=>{
        const {id} = req.params;
        const listing = await Listing.findById(id);
        if(!listing){
                req.flash("error", "Cannot find that listing!");
                return res.redirect("/listings");
        }
        if(!req.user){
                req.flash("error", "You must be logged in to leave a review!");
                return res.redirect(`/listings/${id}`);
        }
        const newReview = new Review(req.body.review);
        newReview.author = req.user._id;
        listing.reviews.push(newReview);
        await newReview.save();
        await listing.save();
        req.flash("success", "Successfully created a new review!");
        res.redirect(`/listings/${id}`);
};

module.exports.destroyReview = async (req,res)=>{
        const {id, reviewId} = req.params;
        await Review.findByIdAndDelete(reviewId);
        await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
        req.flash("success", "Successfully deleted the review!");
        res.redirect(`/listings/${id}`);
};