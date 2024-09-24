const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middlware.js");

const userControllers = require("../controllers/user.js")

router.get("/signup", userControllers.renderSignupUSer)

router.post("/signup", wrapAsync(userControllers.singupUser));

router.get("/login", (req, res) => {
    res.render("users/login.ejs")
});

//passport.authenticate is middlware in passport
router.post("/login",
    saveRedirectUrl,
    passport.authenticate("local", { 
    failureRedirect: "/login",
    failureFlash: true,
    }), userControllers.loginUser 
);

router.get("/logout", userControllers.logoutUser)

module.exports = router;