const express = require('express');
const router = express.Router();
const WrapAsync = require('../utils/WrapAsync');
const ExpressError = require('../utils/ExpressError');
const { listingSchema, reviewSchema} = require('../schema');
const Listing = require('../models/listing.js');



const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(400, msg);
    } else {
        next();
    }
}


// Index route to display all listings or home route 
router.get(
    "/",
    WrapAsync(async (req,res)=>{
        const allListings = await Listing.find({});
        res.render("listings/index.ejs", {allListings});
}));



// new route to show form to create a new listing
router.get(
    "/new", 
    (req,res)=>{
        res.render("listings/new.ejs");
})

// show route to display a specific listing 
router.get(   
    "/:id",
    WrapAsync(async (req,res)=>{
        const {id} = req.params;
        const listing = await Listing.findById(id).populate("reviews");
        res.render("listings/show.ejs", {listing});
}));


// create route to add a new listing to the database
router.post(
    "/",
    validateListing,
    WrapAsync( async (req,res,next)=>{
        
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        res.redirect(`/listings`);
}));


// update : edit and update route 
// two steps : 
// 1. show edit form (get request : /listings/:id/edit) , 2. update the listing in the database (put request : /listings/:id )

// edit route 
router.get(
    "/:id/edit",
    WrapAsync(async (req,res)=>{
        const {id} = req.params;
        const listing = await Listing.findById(id);
        res.render("listings/edit.ejs", {listing});
}));

// update route 
router.put(
    "/:id",
    validateListing,
    WrapAsync(async (req,res)=>{
        const {id} = req.params;
        await Listing.findByIdAndUpdate(id, {...req.body.listing});
        res.redirect(`/listings/${id}`);
})); 


// delete route to delete a listing from the database
router.delete(
    "/:id",
    WrapAsync( async (req,res)=>{
        const {id} = req.params;
        await Listing.findByIdAndDelete(id);
        res.redirect(`/listings`);
}));




module.exports = router;
