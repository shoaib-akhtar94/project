const express = require("express");
const router = express.Router({mergeParams: true});
const listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const review = require("../models/review.js");
const { isLoggedIn, isReviewAuthor } = require("../middlware.js");

const reviewControllers = require("../controllers/review.js")

//review
//post route
router.post("/",
    isLoggedIn,
    wrapAsync(reviewControllers.createReview)
);

// delete review route
router.delete("/:reviewId", 
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewControllers.destroyReview));

module.exports = router;