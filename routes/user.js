const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const Listing = require("../models/listing"); 

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs"); 
});

router.post("/signup",wrapAsync (async(req,res)=>{
    try{
        let {username , email , password}= req.body;
        const newUser = new User({email,username }); 
   
        let registeredUser = await User.register(newUser , password);
        //Automatically login after signup

        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success" , "Welcome to WanderStay");
            res.redirect("/listings");
        });
    }
    catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");

    }
})
);

router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
});

router.post('/login', saveRedirectUrl,
  passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
  (req, res) => {
    console.log("Redirecting to:", res.locals.redirectUrl);  
    req.flash("success", "Successfully logged in");
    res.redirect(res.locals.redirectUrl);
  });



router.get("/logout", (req, res, next) => {
    console.log("Logout route hit");
    req.logout(err => {
        if (err) return next(err);
        console.log("User successfully logged out");
        req.flash("success", "You successfully logged out");
        res.redirect("/listings");
    });
});

router.get("/profile", async (req, res, next) => {
  try {
    // Make sure user is logged in, or redirect otherwise
    if (!req.user) {
      req.flash("error", "You must be signed in to view your profile.");
      return res.redirect("/login");
    }

    // Find user by their ID from session
    const user = await User.findById(req.user._id);

    // Find all listings owned by this user and populate reviews with author
    const listings = await Listing.find({ owner: user._id })
      .populate({
        path: "reviews",
        populate: { path: "author" }
      })
      .populate("owner");

    if (!user) {
      req.flash("error", "User not found");
      return res.redirect("/");
    }

    res.render("users/profile", { user, listings });
  } catch (e) {
    next(e);
  }
});


module.exports = router;