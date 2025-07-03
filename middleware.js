const ExpressError = require("./utils/ExpressError.js");
const Listing = require("./models/listing.js");
const { reviewSchema } = require("./schema.js");

// module.exports.isLoggedIn = (req, res, next) => {
//   if (!req.isAuthenticated()) {
//     req.session.redirectUrl = req.originalUrl;
//     console.log("Storing redirectUrl:", req.session.redirectUrl);  
//     req.flash("error", "You must be logged in .");
//     return res.redirect("/login");
//   }
//   next();
// };

module.exports.isLoggedIn = (req, res, next) => {
  console.log("Checking if user is authenticated...");
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    console.log("Not authenticated, redirecting to login");
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in first!");
    return res.redirect("/login");
  }
  console.log("Authenticated, proceeding"); //debug
  next();
};


// module.exports.saveRedirectUrl = (req , res , next)=>{
//     if(req.session.redirectUrl){
//         res.locals.redirectUrl=req.session.redirectUrl;
//     }
//     next();
// };

module.exports.saveRedirectUrl = (req, res, next) => {
  console.log("Before saveRedirectUrl, session:", req.session);  // debug
  res.locals.redirectUrl = req.session.redirectUrl || "/listings";
  delete req.session.redirectUrl;
  console.log("After saveRedirectUrl, locals:", res.locals.redirectUrl);  // debug
  next();
};

module.exports.isOwner = async (req , res , next) =>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You can't edit the Listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400 , errMsg);
    } else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const {id , reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(res.locals.currUser._id)){
    req.flash("error", "You are not allowed to delete this review!");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

const Review = require("./models/review");



