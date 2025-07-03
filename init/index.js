const mongoose= require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderstay";

main()
    .then(()=>{
        console.log("Connected to DB")
    })
    .catch((err)=>{
        console.log(err);
    });

async function main(){
    await mongoose.connect(MONGO_URL);
};

const initDB = async () =>{
    await Listing.deleteMany({});
    // initData.data=initData.data.map(({...obj, owner:"6866697904f10bb02a408045"}));
    initData.data = initData.data.map(obj => ({
    ...obj,
    owner: "6866697904f10bb02a408045"
    }));

    await Listing.insertMany(initData.data);
    console.log("Db was initialized");
};

initDB();