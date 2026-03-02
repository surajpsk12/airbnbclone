const express = require('express');
const router = express.Router({mergeParams: true});
const WrapAsync = require('../utils/WrapAsync');
const ExpressError = require('../utils/ExpressError');
const { reviewSchema} = require('../schema');
const Listing = require('../models/listing.js');
const Review = require('../models/review.js');






const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(400, msg);
    } else {
        next();
    }
}






// Review routes will be added here in the future
// Post route to create a new review for a listing
router.post(
    "/",
    validateReview,
    WrapAsync(async (req,res)=>{
        const {id} = req.params;
        const listing = await Listing.findById(id);
        const review = new Review(req.body.review);
        listing.reviews.push(review);
        await review.save();
        await listing.save();
        res.redirect(`/listings/${id}`);
})
)


// delete route to delete a review from a listing
router.delete(
    "/:reviewId",
    WrapAsync(async (req,res)=>{
        const {id, reviewId} = req.params;
        await Review.findByIdAndDelete(reviewId);
        await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
        res.redirect(`/listings/${id}`);
}));


module.exports = router;






