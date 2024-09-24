const express = require("express");
const router = express.Router();
const listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const {listingSchema} = require("../schema.js")
const {isLoggedIn, isOwner} = require("../middlware.js")
const multer  = require('multer');
const {storage} = require("../cloudinary.js")
const upload = multer({ storage })



const listingControllers = require("../controllers/listing.js");

// index route
router.get("/", wrapAsync(listingControllers.index))
 
 //  new route
 router.get("/new", isLoggedIn, (listingControllers.renderNewForm))
 
 // show route
 router.get("/:id", wrapAsync(listingControllers.showListing));
 
 
 // Create route
 router.post("/", 
    isLoggedIn,
    upload.single('listing[image]'), 
    wrapAsync(listingControllers.createListing)
);

 
 // edit route
 router.get("/:id/edit",
    isLoggedIn,
    wrapAsync(listingControllers.renderEditForm));
 
 // update route
 router.put("/:id", isLoggedIn, isOwner, upload.single("listing[image]"), wrapAsync(listingControllers.updateListing))
 
 //delete route
 router.delete("/:id",isLoggedIn,isOwner, wrapAsync(listingControllers.destroyListing));

 module.exports = router;