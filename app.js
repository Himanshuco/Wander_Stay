const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate  = require("ejs-mate");

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

// Get all listings
app.get("/listings", async(req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
});

app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
});

app.get("/listings/:id", async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
});

app.post("/listings",async(req,res)=>{
    // let{title , description , image ,  price , country , location} = req.body;
    // let listing = req.body.listing;
    // console.log(listing);
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
});

app.get("/listings/:id/edit",async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});

});

app.put("/listings/:id" , async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id , {...req.body.listing});
    res.redirect("/listings");
});

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

// Start the server
app.listen(8080, () => {
    console.log("Server started on port 8080");
});