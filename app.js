const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate  = require("ejs-mate");
const wrapAsync  = require("./utils/wrapAsync.js");
const ExpressError  = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js");

const app = express();
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderstay";

// Connect to MongoDB
async function main() {
    await mongoose.connect(MONGO_URL);
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
    
// Basic route
app.get("/", (req, res) => {
    res.send("I am working");
});

//Middleware
const validateListing = (req,res,next)=>{
    let {error}  =listingSchema.validate(req.body);
    if(error){
        let errMsg  = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400 , errMsg);
    }else{
        next();
    }
}

// Get all listings
app.get("/listings", async(req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
});

app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
});

app.get("/listings/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const listing = await Listing.findById(id);
        if (!listing.image || !listing.image.url) {
            listing.image = {
                url: "https://plus.unsplash.com/premium_photo-1666739387996-2a45b0a5dab7?q=80&w=1953&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                filename: "default-image"
            };
        }

        res.render("listings/show.ejs", { listing });

    } catch (err) {
        console.error("Error fetching listing:", err);
        res.status(500).send("Internal Server Error");
    }
});


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

app.post("/listings", validateListing , wrapAsync(async (req, res, next) => {
    // const { title, description, price, location, country } = req.body.listing;

    // Basic manual validation
    // if (!title || !description || !price || !location || !country) {
    //     // Throw custom error if any field is missing
    //     throw new ExpressError(400, "All fields (title, description, price, location, country) are required.");
    // }
    
    const newListing = new Listing({ title, description, price, location, country });
    await newListing.save();
    res.redirect("/listings");
}));


app.get("/listings/:id/edit",async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});

});

app.put("/listings/:id" , validateListing , wrapAsync (async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id , {...req.body.listing});
    res.redirect("/listings");
})
);

app.delete("/listings/:id", async (req, res) =>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
});

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
