const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing =  require("./models/listing.js")

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderstay";

main().then(()=>{
    console.log("Connected to DB")
})
.catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(MONGO_URL);
};

app.get("/",(req,res)=>{
    res.send("I am working");
});

const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: {
    filename: String,
    url: String
  },
  price: Number,
  location: String,
  country: String
});

const Listing = mongoose.model('Listing', listingSchema);


app.listen(8080,()=>{
    console.log("Server started");
});
