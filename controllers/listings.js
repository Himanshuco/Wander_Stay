const Listing = require("../models/listing");
const fetch = require("node-fetch");

module.exports.index = async(req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.showListings = async (req, res) => {
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
};

module.exports.createListing = async (req, res) => {
  const newListingData = req.body.listing;
  newListingData.owner = req.user._id;

  if (!newListingData.image || !newListingData.image.url) {
    newListingData.image = {
      filename: "default-image",
      url: "https://plus.unsplash.com/premium_photo-1666739387996-2a45b0a5dab7?q=80&w=1953&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    };
  }

  const newListing = new Listing(newListingData);
  await newListing.save();

  req.flash("success", "Listing Successfully Created");
  res.redirect("/listings");
};



module.exports.editListing = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error" , "Listing Not found");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", {listing});
    
};

module.exports.updateListing = async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success","Listing successfully updated");
    res.redirect(`/listings/${id}`)
};

module.exports.deltedListing = async (req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success" , "Listing Successfully Deleted");
    res.redirect("/listings");
};