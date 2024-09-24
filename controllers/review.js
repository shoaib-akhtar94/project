const listing = require("../models/listing");
const review = require("../models/review");

module.exports.createReview = async(req, res) => {
    let Listing = await listing.findById(req.params.id);
    let newReview = new review(req.body.review);
    newReview.author = req.user._id;
    Listing.reviews.push(newReview);

    await newReview.save();
    await Listing.save();
    req.flash("success", "New Review Created!");
    res.redirect(`/listing/${Listing._id}`);
};

module.exports.destroyReview = async(req, res) => {
    let {id, reviewId} = req.params;

    await listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!");
    res.redirect(`/listing/${id}`)
};