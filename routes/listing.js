const express = require('express');
const router = express.Router();
const WrapAsync = require('../utils/wrapAsync');
const Listing = require('../models/listing.js');
const { isLoggedIn , isOwner, validateListing} = require('../middleware.js');
const multer  = require('multer')
const { storage } = require('../cloudConfig.js');
const upload = multer({ storage });
const listingController = require('../controllers/listings.js');



router
    .route("/")
    .get( WrapAsync(listingController.index)) // Index route to display all listings or home route 
    .post( // create route to add a new listing to the database
        isLoggedIn,
        validateListing,
        upload.single('listing[image]'),
        WrapAsync( listingController.createListing));





// new route to show form to create a new listing
router.get("/new", isLoggedIn,listingController.renderNewForm)



router.route("/:id")
.get(WrapAsync(listingController.showListing))// show route to display a specific listing 
.put( // update route 
    isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
    validateListing,
    WrapAsync(listingController.updateListing))
.delete( // delete route to delete a listing from the database
    isLoggedIn,
    isOwner,
    WrapAsync(listingController.destroyListing));



// update : edit and update route 
// two steps : 
// 1. show edit form (get request : /listings/:id/edit) , 2. update the listing in the database (put request : /listings/:id )

// edit route 
router.get(
    "/:id/edit",
    isLoggedIn,
    isOwner,
    WrapAsync(listingController.renderEditForm));






module.exports = router;
