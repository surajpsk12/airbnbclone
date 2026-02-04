const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const Listing = require('./models/listing');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');



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



app.get('/', (req, res) => {
    res.send('Hii , Welcome to Wanderlust');
});

// Index route to display all listings or home route 
app.get("/listings",async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
});



// new route to show form to create a new listing
app.get("/listing/new", (req,res)=>{
    res.render("listings/new.ejs");
})

// show route to display a specific listing 
app.get("/listings/:id", async (req,res)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
});


// create route to add a new listing to the database
app.post("/listings", async (req,res)=>{
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect(`/listings`);
});


// update : edit and update route 
// two steps : 
// 1. show edit form (get request : /listings/:id/edit) , 2. update the listing in the database (put request : /listings/:id )

// edit route 
app.get("/listings/:id/edit", async (req,res)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
});

// update route 
app.put("/listings/:id", async (req,res)=>{
    const {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
}); 


// delete route to delete a listing from the database
app.delete("/listings/:id", async (req,res)=>{
    const {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect(`/listings`);
});





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
























app.listen(port, () => {
    console.log(`server listening at http://localhost:${port}`);
}); 