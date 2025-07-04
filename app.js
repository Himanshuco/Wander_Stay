if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate  = require("ejs-mate");
const ExpressError  = require("./utils/ExpressError.js");
const session  =  require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const UserRouter = require("./routes/user.js"); //UserRouter
const listings = require("./routes/listing.js"); //ListingRouter
const reviews = require("./routes/review.js"); //ReviewRouter
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const app = express();
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderstay";

dbUrl = process.env.ATLASDB_URL;

// Connect to MongoDB
async function main() {
    await mongoose.connect(dbUrl);
}
main()
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => { 
        console.log("Connection error:", err);
});

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")));

const store = MongoStore.create({
    mongoUrl : dbUrl,
    crypto : {
        secret : process.env.secret,

    },
    touchAfter : 24 * 3600,
});

store.on("error", (err) => {
  console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOption = {
    store,
    secret : process.env.secret,
    resave: false,
    saveUninitialized : true,
    cookie: {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),  //Milisecond -> 7 days - 24 hours - 60 minutes - 60 seconds - 1000 miliseconds 
        maxAge: 1000 * 60 * 60 * 24 * 3,  // 3 days
        httpOnly : true
    }
};

// Basic route
// app.get("/", (req, res) => {
//     res.send("I am working");
// });

app.use(session(sessionOption));
app.use(flash());

//Password  //pbkdf2 Hashing algorithm is used
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currUser = req.user || null;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

// app.get("/demouser", async(req,res)=>{
//     let fakeuser = new user( {
//         email : "kapil@gmail.com",
//         username : "kapily",
// })
//     let registeredUser = await user.register(fakeuser,"kapil2904");
//     res.send(registeredUser);
// });

app.use("/", UserRouter); 
app.use("/listings", listings);
app.use("/listings/:id/reviews",reviews);


app.all(/.*/, (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});


//Middleware //err
// app.use((err, req, res, next) => {
//     // res.send("Something went wrong");
//     let { statusCode, message } = err;
//     res.status(statusCode).send(message);
// });

app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { message });
});



// Start the server
app.listen(8080, () => {
    console.log("Server started on port 8080");
});


// ⚠️ IMPORTANT: Route Matching Error Fix
//
// Originally used: app.all("*", ...)
// This caused the following error in newer versions of Express (v5+):
//
//   TypeError: Missing parameter name at 1: https://git.new/pathToRegexpError
//
// WHY?
// The wildcard `"*"` is parsed as a parameter by the `path-to-regexp` library
// (used internally by Express for route matching). But `*` alone is NOT a valid
// parameter in Express 5+, leading to a crash.
//
// ✅ FIX:
// Use "/.*/" instead, which is a valid path pattern that matches all routes.

// app.all("/*", (req, res, next) => {
//     next(new ExpressError(404, "Page Not Found!"));
// });   It will produce error