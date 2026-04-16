const Listing = require('../models/listing');
const { isLoggedIn , isOwner, validateListing} = require('../middleware');
const WrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');



module.exports.index = async (req,res)=>{
        const allListings = await Listing.find({});
        res.render("listings/index.ejs", {allListings});
};

module.exports.renderNewForm = (req,res)=>{
        res.render("listings/new.ejs");
};

module.exports.showListing = async (req,res)=>{
        const {id} = req.params;
        const listing = await Listing.findById(id)
        .populate({
            path:"reviews" ,
            populate : 
             {
                path : "author"
            },
            })
        .populate("owner");
        if(!listing){
            req.flash("error", "Cannot find that listing!");
            res.redirect("/listings");
        }
        
        res.render("listings/show.ejs", {listing});
};

module.exports.createListing = async (req,res,next)=>{
        if(!req.file){
                throw new ExpressError(400, "Listing image is required");
        }
        let url = req.file.path;
        let filename = req.file.filename;
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = {url, filename};
        await newListing.save();
        req.flash("success", "Successfully created a new listing!");
        res.redirect(`/listings`);
};

module.exports.renderEditForm = async (req,res)=>{
        const {id} = req.params;
        const listing = await Listing.findById(id);
        req.flash("success", "Successfully updated the listing!");

        if(!listing){
            req.flash("error", "Cannot find that listing!");
            res.redirect("/listings");
        }

        let originalImageUrl = listing.image.url;
        originalImageUrl = originalImageUrl.replace(/\/upload\//, "/upload/w_300/"); // Resize the image to width 300px for the edit form
        
        res.render("listings/edit.ejs", {listing , originalImageUrl});
};

module.exports.updateListing = async (req,res)=>{
        let {id} = req.params;
        let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
        if(typeof req.file !== "undefined"){
                let url = req.file.path;
                let filename = req.file.filename;
                listing.image = {url, filename};
                await listing.save();
        }
        req.flash("success", "Successfully updated the listing!");
        res.redirect(`/listings/${id}`);
};

module.exports.destroyListing =  async (req,res)=>{
        const {id} = req.params;
        await Listing.findByIdAndDelete(id);
        req.flash("success", "Successfully deleted the listing!");
        res.redirect(`/listings`);
};