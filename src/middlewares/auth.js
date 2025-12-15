const jwt = require("jsonwebtoken");
const User = require("../model/user.js");

const userAuth = async (req, res, next)=>{
    try{
        const {token}=req.cookies;
        if(!token){
            throw new Error("No token found in cookies");
        }
        const decodedMessage = await jwt.verify(token, "RudraSecretKey");
        const {_id}= decodedMessage;
        const user = await user.findById(_id);
        
        if(!user){
            throw new Error("User not found");
        }
        req.user = user;
        next();
    }catch(err){
        res.status(400).send("Authentication failed. "+err.message);
    }
}