const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

const listing = require("../models/listing.js")
const  {listingSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js")

module.exports.index = async(req, res) => {
    const allListings = await listing.find({});
    res.render("listings/index.ejs", {allListings})
};

module.exports.renderNewForm = (req, res) => {
    console.log(req.user)
     res.render("listings/new.ejs")
};

module.exports.showListing = (async(req, res) => {
    let {id} = req.params;
    const Listing = await listing.findById(id)
    .populate({
       path:"reviews",
       populate: {
           path: "author",
       },
   })
    .populate("owner")
    if(!Listing){
       req.flash("error", "Listing you requested for does not exist!");
       res.redirect("/listing");
    }
    console.log(Listing)
    res.render("listings/show.ejs", {Listing})
});


module.exports.createListing = async(req, res) => {
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
        .send()

    let url = req.file.path;
    let filename = req.file.filename;
    const result = listingSchema.validate(req.body)
    console.log(result)
    if(result.error){
        throw new ExpressError(404, result.error);
    }
    const newListing = new listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename}
    newListing.geometry = response.body.features[0].geometry;
    let listingSave = await newListing.save();
    console.log(listingSave)
    req.flash("success", "New Listing Created!");
    res.redirect("/listing");
};


module.exports.renderEditForm = async(req, res) => {
    let {id} = req.params;
    const Listing = await listing.findById(id);
    if(!Listing) {
        req.flash("error", "Listing you requested for does not exist")
        res.redirect("/listings")
    }

    let originalImageUrl = Listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300")
    res.render("listings/edit.ejs", {Listing, originalImageUrl})
};

module.exports.updateListing = async(req, res) => {
    if(!req.body.listing){
        throw new ExpressError(400, "send valid data for listing")
    }
    let {id} = req.params;
    let Listing = await listing.findByIdAndUpdate(id, {...req.body.listing});
    if(typeof req.file !== "undefine"){
        let url = req.file.path;
        let filename = req.file.filename;
        Listing.image = {url, filename};
        await Listing.save();
    }
    req.flash("success", "Listing Updated!");
    res.redirect(`/listing/${id}`)
};


module.exports.destroyListing = async(req, res) => {
    let {id} = req.params;
    let deletelisting = await listing.findByIdAndDelete(id);
    console.log(deletelisting);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listing")
};