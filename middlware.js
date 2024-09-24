const listing = require("./models/listing");
const review = require("./models/review")

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        // console.log(req.path, req.originalUrl )
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged in to create listing!");
        return res.redirect("/login")
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl
    }
    next();
};

module.exports.isOwner = async(req, res, next) => {
    let {id} = req.params;
    let Listing = await listing.findById(id);
    if(!Listing.owner.equals(res.locals.curUser._id)){
        req.flash("error", "you are not the owner of this listing");
        return res.redirect(`/listing/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async(req, res, next) => {
    let {id, reviewId} = req.params;
    let Review = await review.findById(reviewId);
    if(!Review.author.equals(res.locals.curUser._id)){
        req.flash("error", "you are not the author of this listing");
        return res.redirect(`/listing/${id}`);
    }
    next();
}