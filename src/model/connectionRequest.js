const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User" // Linking to User model - establishing relationship
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum:{
            values: ["ignored", "interested", "accepted", "rejected"],
            message: "{VALUE} is incorrect status type."
        }
    }
},{
    timestamps: true
}
);

//indexing to improve query performance - jabh search karenge fromUserId or toUserId to isse easy ho jayega
//This is known as compound index - an index on multiple fields
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }); //1 for ascending order

//Using pre method -  yeh save hone se pehle kuch operations karne ke liye hota hai
connectionRequestSchema.pre("save", function(){
        const connectionRequest = this;
        // Block self-requests at the model layer as a safety net
        if(connectionRequest.fromUserId?.toString() === connectionRequest.toUserId?.toString()){
            throw new Error("You can't send a connection request to yourself.");
        }
});

const ConnectionRequest = mongoose.model("ConnectionRequest", connectionRequestSchema);
module.exports = ConnectionRequest;