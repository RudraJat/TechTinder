const mongoose = require("mongoose");

const subscriptionSchema= new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    razorpaySubcriptionId:{
        type: String,
        unique: true,
        required: true,
    },
    razorpayOrderId: {
        type: String,
    },
    razorpayPaymentId: {
        type: String,
    },
    planId:{
        type: String,
    },
    status: {
        type: String,
        enum: [
            "created",
            "authenticated",
            "active",
            "paused",
            "cancelled",
            "completed",
            "expired"
        ],
        default: "created",
    },
    currentStart:{
        type: Date,
    },
    currentEnd:{
        type: Date,
    },
    totalCount: {
        type: Number,
    },
    paidCount: {
        type: Number,
        default: 0,
    },
    amount:{
        type: Number,
    },
},
{
    timestamps: true
});

module.exports = mongoose.model("Subscription", subscriptionSchema);