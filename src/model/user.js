const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        minlength: 4,
        maxlength: 20,
        required: true,
    },
    lastName: {
        type: String,
        minlength: 4,
        maxlength: 20,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
    },
    age: {
        type: Number,   
        min: 13,
    },
    gender: {
        type: String,
    },
    bio: {
        type: String,
        maxlength: 500,
        default: "This user prefers to keep an air of mystery about them.",
    }, 
});

const User = mongoose.model("User", userSchema);
module.exports = User;