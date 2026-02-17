const express = require("express");
const router = express.Router();
const cloudinary = require("../config/cloudinary");

router.get("/get-signature", async (req, res) => {
    try {
        const timestamp = Math.round(new Date().getTime() / 1000);
        const folder = "profile-photo";

        const signature = cloudinary.utils.api_sign_request(
            {
                timestamp,
                folder,
            },
            process.env.CLOUDINARY_API_SECRET
        );

        return res.status(200).json({
            signature,
            timestamp,
            folder,
            cloudName: process.env.CLOUDINARY_CLOUD_NAME,
            apiKey: process.env.CLOUDINARY_API_KEY,
        });
    } catch (err) {
        return res.status(500).json({ message: "Signature generation failed" });
    }
});

module.exports=router;