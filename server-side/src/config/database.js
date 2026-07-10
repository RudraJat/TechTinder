// This connects backend to MongoDB.

const mongoose = require("mongoose");

const connectDB = async () => {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || process.env.DATABASE_URL;

    if (!mongoUri) {
        throw new Error("MongoDB connection string is missing. Set MONGO_URI in server-side/.env.");
    }

    await mongoose.connect(mongoUri);
};

module.exports = connectDB;