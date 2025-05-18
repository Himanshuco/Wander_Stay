const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const listingSchema = new Schema ({
    title : {
        type : String,
        required : true,
    } ,
    description : String,
    image :{
        // type :String,
        // default : "https://unsplash.com/photos/a-living-room-filled-with-furniture-and-a-fire-place-GWdZpXUPMs0",
        // set : (v)=> v==="" ? "https://unsplash.com/photos/a-living-room-filled-with-furniture-and-a-fire-place-GWdZpXUPMs0" : v,
        filename: String,
        url: String
    } ,
    price :Number,
    location : String,
    country : String
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
