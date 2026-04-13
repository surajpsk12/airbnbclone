const express = require('express');
const router = express.Router({mergeParams: true});
const WrapAsync = require('../utils/WrapAsync');
const Listing = require('../models/listing.js');
const Review = require('../models/review.js');
const { isLoggedIn , validateReview, isReviewAuthor} = require('../middleware.js');










// Review routes will be added here in the future
// Post route to create a new review for a listing
router.post(
    "/",
    isLoggedIn,
    validateReview,
    WrapAsync(async (req,res)=>{
        const {id} = req.params;
        const listing = await Listing.findById(id);
        const newReview = new Review(req.body.review);
        newReview.author = req.user._id;
        listing.reviews.push(newReview);
        await newReview.save();
        await listing.save();
        req.flash("success", "Successfully created a new review!");
        res.redirect(`/listings/${id}`);
})
)


// delete route to delete a review from a listing
router.delete(
    "/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    WrapAsync(async (req,res)=>{
        const {id, reviewId} = req.params;
        await Review.findByIdAndDelete(reviewId);
        await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
        req.flash("success", "Successfully deleted the review!");
        res.redirect(`/listings/${id}`);
}));


module.exports = router;






