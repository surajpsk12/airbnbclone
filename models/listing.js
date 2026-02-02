const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    price: {
        type: Number
        
    },
    location: { 
        type: String
        
    },
    country : String ,
    images: {
        type: String , 
        default: "https://unsplash.com/photos/a-lake-surrounded-by-mountains-under-a-blue-sky-Aln972onVgE",
        set: (v) => v === '' ? "https://unsplash.com/photos/foggy-mountain-summit-1Z2niiBPg5A" : v
    } 
    
});


const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;