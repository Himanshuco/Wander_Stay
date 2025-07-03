const express = require("express");
const router = express.Router(); 
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn , isOwner , validateListing} = require("../middleware.js");


//Index Route
router.get("/", async(req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
});

// New Route
router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/new.ejs");
});


// Show Route
// Show Route - show a single listing with populated reviews and authors
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const listing = await Listing.findById(id)
          .populate({
            path: "reviews",
            populate: { path: "author" }
          })
          .populate("owner");
        
        if (!listing) {
            req.flash("error", "Listing not found");
            return res.redirect("/listings");
        }
        res.render("listings/show.ejs", { listing });
    } catch (err) {
        console.error("Error fetching listing:", err);
        req.flash("error", "Something went wrong");
        res.redirect("/listings");
    }
});


// Create Route
router.post("/", isLoggedIn, validateListing, wrapAsync(async (req, res) => {
  const newListingData = req.body.listing;
  newListingData.owner = req.user._id;
  const newListing = new Listing(newListingData);
  await newListing.save();
  req.flash("success", "Listing Successfully Created");
  res.redirect("/listings");
}));


// Edit Route
router.get("/:id/edit", isLoggedIn , isOwner, async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error" , "Listing Not found");
        return res.redirect("/listings");
    }
    req.flash("success" , "Listing Successfully Edited");
    res.render("listings/edit.ejs", {listing});
    
});

// Update Route
router.put("/:id", isLoggedIn , isOwner, validateListing, wrapAsync(async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success","Listing successfully updated");
    res.redirect(`/listings/${id}`)
}));

// Delete Route
router.delete("/:id", isLoggedIn,  isOwner ,async (req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success" , "Listing Successfully Deleted");
    res.redirect("/listings");
});

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



