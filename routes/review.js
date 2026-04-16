const express = require('express');
const router = express.Router({mergeParams: true});
const WrapAsync = require('../utils/wrapAsync');
const Listing = require('../models/listing.js');
const Review = require('../models/review.js');
const { isLoggedIn , validateReview, isReviewAuthor} = require('../middleware.js');


const reviewController = require('../controllers/reviews.js');







// Review routes will be added here in the future
// Post route to create a new review for a listing
router.post(
    "/",
    isLoggedIn,
    validateReview,
    WrapAsync(reviewController.createReview)
);


// delete route to delete a review from a listing
router.delete(
    "/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    WrapAsync(reviewController.destroyReview )
);


module.exports = router;






