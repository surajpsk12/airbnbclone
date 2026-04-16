const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError");
const { listingSchema ,reviewSchema} = require("./schema");


module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to do that!");
        return res.redirect("/login");
    }
    next();
}   

module.exports.saveRedirectUrl = (req,res,next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
        delete req.session.redirectUrl;
    }
    next();
}   



module.exports.isOwner = async (req,res,next) => {
    const {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error", "You don't have permission to edit!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}   

module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(400, msg);
    } else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(400, msg);
    } else {
        next();
    }
}



module.exports.isReviewAuthor = async (req,res,next) => {
    const {id , reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(!review){
        req.flash("error", "Review not found!");
        return res.redirect(`/listings/${id}`);
    }
    if(!review.author){
        req.flash("error", "This review has no valid author and cannot be managed.");
        return res.redirect(`/listings/${id}`);
    }
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the author of this review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}   
