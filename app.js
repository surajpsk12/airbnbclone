const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const Listing = require('./models/listing');
const path = require('path');



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
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));



app.get('/', (req, res) => {
    res.send('Hii , Welcome to Wanderlust');
});

// Index route to display all listings or home route 
app.get("/listings",async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
});

// show route to display a specific listing 
app.get("/listings/:id", async (req,res)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
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