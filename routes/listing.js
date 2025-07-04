const express = require("express");
const router = express.Router(); 
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn , isOwner , validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");


//Index Route
router.get("/",wrapAsync(listingController.index));

// New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Show Route
router.get("/:id", wrapAsync(listingController.showListings));

// Create Route
router.post("/", isLoggedIn, validateListing, wrapAsync(listingController.createListing));

// Edit Route
router.get("/:id/edit", isLoggedIn , isOwner, wrapAsync(listingController.editListing));

// Update Route
router.put("/:id", isLoggedIn , isOwner, validateListing, wrapAsync(listingController.updateListing));

// Delete Route
router.delete("/:id", isLoggedIn,  isOwner ,wrapAsync(listingController.deltedListing));

module.exports = router;


// app.get("/listings/:id", async(req,res)=>{
//     let {id} = req.params;
//     const listing = await Listing.findById(id);
//     res.render("listings/show.ejs",{listing});
// });

// app.post("/listings", wrapAsync(async(req,res)=> {
//     // let{title , description , image ,  price , country , location} = req.body;
//     // let listing = req.body.listing;
//     // console.log(listing);
//     const newListing = new Listing(req.body.listing);
//     await newListing.save();
//     res.redirect("/listings");
// })
// );



// const listingSchema = new mongoose.Schema({
//   title: String,
//   description: String,
//   image: {
//     filename: String,
//     url: String
//   },
//   price: Number,
//   location: String,
//   country: String
// });



