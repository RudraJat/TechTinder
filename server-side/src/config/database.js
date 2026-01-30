const mongoose = require("mongoose");

const connectDB = async()=>{
    await mongoose.connect(
        "mongodb+srv://Rudra01:Rpsj123@nodeself.whijtvy.mongodb.net/TechTinder"
    );
};

module.exports = connectDB;