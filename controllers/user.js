const User = require("../models/user")

module.exports.renderSignupUSer = (req, res) => {
    res.render("users/signup.ejs")
};

module.exports.singupUser=(async(req, res) => {
    try{
        let {username, email, password} = req.body;
        const newUser = new User({email, username})
        const registerdUser = await User.register(newUser, password);
        console.log(registerdUser);
        req.login(registerdUser, (err) => {
            if (err) { 
                return next(err); 
            }
            req.flash("success", "welcome to Wandurlust!");
            res.redirect("/listing")
          })
    } catch(e) {
        req.flash("error", e.message);
        res.redirect("/signup")
    }
});

module.exports.loginUser = async (req, res) => {
    req.flash("success", "welcome to Wandurlust!");
    let redirectUrl = res.locals.redirectUrl || "/listing"
    res.redirect(redirectUrl)
};

module.exports.logoutUser = (req, res, next) => {
    req.logout((err) => {
        if(err){
            return next(err)
        }
        req.flash("success", "you are logout!");
        res.redirect("listing")
    })
}