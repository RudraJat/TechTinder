const express = require("express");
const crypto = require("crypto");
const Subscription = require("../models/subscriptionSchema");
const User = require("../models/userSchema");

const router = express.Router();

router.post(
    "/webhook",
    express.raw({ type: "application/json"}), //Razorpay data raw form me bhjta he or usse phle express.json() se data convert krlia to signature verify nhi hoga
    async(req,res)=>{
        const signature = req.headers["x-razorpay-signature"]; //Razorpay sends data in header

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
            .update(req.body)
            .digest("hex");

        if(signature !== expectedSignature){
            return res.status(400).json({message: "Invalid Signature"});
        }

        const event = JSON.parse(req.body);

        const sub = event.payload.subscription?.entity;
        
        if(!sub) return res.json({status: "ignored"});

        //Activated
        if(event.event === "subscription.activated"){
            await Subscription.updateOne(
                {razorpaySubcriptionId: sub.id},
                {
                    status: sub.status,
                    currentStart: new Date(sub.current_start *1000), //Razorpay timestamps are in seconds, JavaScript Date needs milliseconds.
                    currentEnd: new Date(sub.current_end *1000),
                    paidCount: sub.paid_count,
                }
            );

            const subscription = await Subscription.findOne({
                razorpaySubcriptionId: sub.id
            });

            await User.updateOne(
                {_id: subscription.user},
                {isPremium: true}
            );
        }

        //Cancelled
        if(event.event === "subscription.cancelled"){
            await Subscription.updateOne(
                {razorpaySubcriptionId: sub.id},
                {status: "cancelled"}
            );

            const subscription = await Subscription.findOne({
                razorpaySubcriptionId: sub.id,
            });

            if (subscription?.user) {
                await User.updateOne(
                    { _id: subscription.user },
                    { isPremium: false }
                );
            }
        }

        if (event.event === "subscription.completed" || event.event === "subscription.expired") {
            await Subscription.updateOne(
                { razorpaySubcriptionId: sub.id },
                {
                    status: sub.status,
                    currentEnd: sub.current_end ? new Date(sub.current_end * 1000) : undefined,
                }
            );

            const subscription = await Subscription.findOne({
                razorpaySubcriptionId: sub.id,
            });

            if (subscription?.user) {
                await User.updateOne(
                    { _id: subscription.user },
                    { isPremium: false }
                );
            }
        }

        res.json({status: "ok"});
    }
);

module.exports = router;