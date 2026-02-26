const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const Listing = require('./models/listing.js');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const WrapAsync = require('./utils/WrapAsync');
const ExpressError = require('./utils/ExpressError');
const { listingSchema, reviewSchema} = require('./schema');
const Review = require('./models/review.js');
const MONGO_URL = "mongodb://127.0.0.1:27017/Wanderlust";

main().then(() => {
    console.log("Connected to MongoDB");
}).catch(err => {
    console.error("MongoDB connection error:", err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}



app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine("ejs", ejsMate);

const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(400, msg);
    } else {
        next();
    }
}

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(400, msg);
    } else {
        next();
    }
}





app.get('/',
     (req, res) => {
        res.send('Welcome to Wanderlust');
});

// Index route to display all listings or home route 
app.get(
    "/listings",
    WrapAsync(async (req,res)=>{
        const allListings = await Listing.find({});
        res.render("listings/index.ejs", {allListings});
}));



// new route to show form to create a new listing
app.get(
    "/listing/new", 
    (req,res)=>{
        res.render("listings/new.ejs");
})

// show route to display a specific listing 
app.get(   
    "/listings/:id",
    WrapAsync(async (req,res)=>{
        const {id} = req.params;
        const listing = await Listing.findById(id).populate("reviews");
        res.render("listings/show.ejs", {listing});
}));


// create route to add a new listing to the database
app.post(
    "/listings",
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
app.get(
    "/listings/:id/edit",
    WrapAsync(async (req,res)=>{
        const {id} = req.params;
        const listing = await Listing.findById(id);
        res.render("listings/edit.ejs", {listing});
}));

// update route 
app.put(
    "/listings/:id",
    validateListing,
    WrapAsync(async (req,res)=>{
        const {id} = req.params;
        await Listing.findByIdAndUpdate(id, {...req.body.listing});
        res.redirect(`/listings/${id}`);
})); 


// delete route to delete a listing from the database
app.delete(
    "/listings/:id",
    WrapAsync( async (req,res)=>{
        const {id} = req.params;
        await Listing.findByIdAndDelete(id);
        res.redirect(`/listings`);
}));

// Review routes will be added here in the future
// Post route to create a new review for a listing
app.post(
    "/listings/:id/reviews",
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
app.delete(
    "/listings/:id/reviews/:reviewId",
    WrapAsync(async (req,res)=>{
        const {id, reviewId} = req.params;
        await Review.findByIdAndDelete(reviewId);
        await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
        res.redirect(`/listings/${id}`);
}));

// app.get('/testListings', async (req, res) => {
//     let sampleListing = new Listing({
//         title: "Beautiful Beach House",
//         description: "A lovely beach house with stunning ocean views.",
//         price: 250,
//         location: "Malibu, CA",
//         images: ""
//     });

//     await sampleListing.save();
//     console.log("Sample listing saved:", sampleListing);
//     res.send([sampleListing]);
// });
app.use(
    (req, res, next) => {
        next(new ExpressError(404, "Page Not Found"));
});


app.use((err,req, res,next) => {
    let {statusCode = 500, message = "Something went wrong!"} = err;
    res.status(statusCode).render("listings/error.ejs", {err});
});




app.listen(port, () => {
    console.log(`server listening at http://localhost:${port}`);
}); 