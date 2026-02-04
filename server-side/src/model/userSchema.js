const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema(
    {
    firstName: {
        type: String,
        // index: true, -- indexing to improve query performance
        minlength: 4,
        maxlength: 20,
        required: true,
    },
    lastName: {
        type: String,
        minlength: 3,
        maxlength: 20,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email address");
            }
        }
    },
    password: {
        type: String,
        required: false,
        validate(value){
            if(value && !validator.isStrongPassword(value)){
                throw new Error("Enter a strong password");
            }
        }
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    linkedinId:{
        type: String,
        unique: true,
        sparse:true//Multiple users can exist without linkedinId, Users with linkedinId must be unique 
    },
    photoUrl: {
        type: String,
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Enter a valid URL for photo");
            }
        }
    },
    age: {
        type: Number,   
        min: 13,
    },
    gender: {
        
        type: String,
        enum:{
            values: ["female", "male", "other"],
            message: "{VALUE} is incorrect gender type."
        }
        //it will only work when we create new object but not for updating existing object
        // validate(value){
        //     //if the value is not one of the following, throw an error
        //     if(!["male", "female", "other"].includes(value)){
        //         throw new Error("Invalid gender value");
        //     }
        // }
    },
    bio: {
        type: String,
        maxlength: 500,
        default: "This user prefers to keep an air of mystery about them.",
    },
    role: {
        type: String,
        enum: {
            values: ["Frontend Developer", "Backend Developer", "Fullstack Developer", "Mobile Developer", "DevOps Engineer", "Designer", "Student", "Other"],
            message: "{VALUE} is not a valid role"
        },
        default: "Other"
    }
    },
    {
        timestamps: true, // Automatically manage createdAt and updatedAt fields
    }
);

userSchema.methods.getJWT = async function(){
    const user = this;

    const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    return token;
}

userSchema.methods.validatePassword = async function(passwordInputByUser){
    const user = this;
    const isPasswordMatch = bcrypt.compare(passwordInputByUser, user.password);
    
    return isPasswordMatch
}

const User = mongoose.model("User", userSchema);
module.exports = User;