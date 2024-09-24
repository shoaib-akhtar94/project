if(process.env.NODE_ENV != "production"){
  require('dotenv').config()
}
// console.log(process.env.CLOUD_SECRET-CODE)

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const listing = require("./models/listing.js");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js")
const {listingSchema, reviewSchema} = require("./schema.js")
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingsRouter = require("./routers/listing.js");
const reviewsRouter = require("./routers/reviews.js");
const usersRouter = require("./routers/users.js")

const app = express();

const dburl = process.env.ATLAS_URL;

main()
.then((res) => {
    console.log("connected to DB")
}).catch(err => console.log(err)); 

async function main() {
  await mongoose.connect(dburl);
}


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
  mongoUrl: dburl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
})

const sessionOptions = {
  store, // connect mongo store
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.curUser = req.user;
  next();
});


app.use("/listing", listingsRouter);
app.use("/listing/:id/reviews", reviewsRouter);
app.use("/", usersRouter)


app.all("*", (req, res, next) =>{
    next(new ExpressError(404, "page not found!"));
});


app.use((err, req, res, next) => {
  let {status = 500, message} = err;
  res.status(status).render("error.ejs", {message})
});

app.listen(8080, () => {
    console.log("server is listening to port 8080")
});