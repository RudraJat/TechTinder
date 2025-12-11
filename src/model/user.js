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
        //it will only work when we create new object but not for updating existing object
        validate(value){
            //if the value is not one of the following, throw an error
            if(!["male", "female", "other"].includes(value)){
                throw new Error("Invalid gender value");
            }
        }
    },
    bio: {
        type: String,
        maxlength: 500,
        default: "This user prefers to keep an air of mystery about them.",
    }, 
    skills: {
        type: [String], // Array of strings
    }
},
{
    timestamps: true, // Automatically manage createdAt and updatedAt fields
});

const User = mongoose.model("User", userSchema);
module.exports = User;