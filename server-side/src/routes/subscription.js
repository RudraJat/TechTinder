const express = require("express");
const razorpay = require("../config/razorpay");
const Subscription = require("../models/subscriptionSchema");
const User = require("../models/userSchema");
const userAuth = require("../middlewares/auth.js");
const crypto = require("crypto");

const router = express.Router();
let cachedAutoPlanId = null;

const PRO_PLAN_CATALOG = {
    week: {
        amountPaise: 9900,
        durationDays: 7,
        displayName: "TechTinder Pro - 1 Week",
    },
    month: {
        amountPaise: 1900,
        durationDays: 30,
        displayName: "TechTinder Pro - 1 Month",
    },
    six_months: {
        amountPaise: 81900,
        durationDays: 180,
        displayName: "TechTinder Pro - 6 Months",
    },
};

const DEFAULT_PRO_PLAN_KEY = "month";

const createAutoPlan = async () => {
    const createdPlan = await razorpay.plans.create({
        period: "monthly",
        interval: 1,
        item: {
            name: "TechTinder Pro Membership",
            amount: 1900,
            currency: "INR",
            description: "TechTinder Pro Membership",
        },
    });

    cachedAutoPlanId = createdPlan.id;
    return cachedAutoPlanId;
};

const resolvePlanId = async () => {
    if (process.env.RAZORPAY_PLAN_ID) {
        try {
            await razorpay.plans.fetch(process.env.RAZORPAY_PLAN_ID);
            return process.env.RAZORPAY_PLAN_ID;
        } catch {
            return await createAutoPlan();
        }
    }

    if (cachedAutoPlanId) {
        try {
            await razorpay.plans.fetch(cachedAutoPlanId);
            return cachedAutoPlanId;
        } catch {
            cachedAutoPlanId = null;
        }
    }

    return await createAutoPlan();
};

router.get("/razorpay-key", (req, res) => {
    if (!process.env.RAZORPAY_KEY_ID) {
        return res.status(500).json({ error: "Razorpay key is not configured on server" });
    }

    return res.json({ key: process.env.RAZORPAY_KEY_ID });
});

router.get("/razorpay-health", async (req, res) => {
    try {
        const keyId = process.env.RAZORPAY_KEY_ID;
        const keySecret = process.env.RAZORPAY_KEY_SECRET;
        const envPlanId = process.env.RAZORPAY_PLAN_ID;

        if (!keyId || !keySecret) {
            return res.status(500).json({
                ok: false,
                error: "Missing Razorpay credentials in server env",
                missing: {
                    RAZORPAY_KEY_ID: !keyId,
                    RAZORPAY_KEY_SECRET: !keySecret,
                },
            });
        }

        await razorpay.plans.all({ count: 1 });

        let planConfigured = false;
        let planValid = false;
        let planError = null;

        if (envPlanId) {
            planConfigured = true;
            try {
                await razorpay.plans.fetch(envPlanId);
                planValid = true;
            } catch (err) {
                planError = err?.error?.description || err?.message || "Invalid plan id";
            }
        }

        return res.json({
            ok: true,
            keyMode: keyId.startsWith("rzp_live_") ? "live" : keyId.startsWith("rzp_test_") ? "test" : "unknown",
            planConfigured,
            planValid,
            planError,
            autoPlanFallbackEnabled: true,
        });
    } catch (err) {
        return res.status(400).json({
            ok: false,
            error: err?.error?.description || err?.message || "Razorpay health check failed",
            code: err?.error?.code || err?.statusCode,
        });
    }
});

router.post("/create-order", userAuth, async (req, res) => {
    try {
        const userId = req.user?._id;
        const requestedPlanKey = req.body?.planKey;
        const selectedPlanKey = PRO_PLAN_CATALOG[requestedPlanKey]
            ? requestedPlanKey
            : DEFAULT_PRO_PLAN_KEY;
        const selectedPlan = PRO_PLAN_CATALOG[selectedPlanKey];

        const user = await User.findById(userId).select("isPremium email");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (user.isPremium) {
            return res.status(400).json({ error: "You already have Pro membership" });
        }

        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            return res.status(500).json({
                error: "Razorpay credentials are not configured on server",
            });
        }

        const order = await razorpay.orders.create({
            amount: selectedPlan.amountPaise,
            currency: "INR",
            receipt: `pro-${userId.toString().slice(-8)}-${Date.now().toString().slice(-6)}`,
            notes: {
                userId: userId.toString(),
                userEmail: user.email,
                planName: selectedPlan.displayName,
                planKey: selectedPlanKey,
                durationDays: String(selectedPlan.durationDays),
            },
        });

        res.json({
            id: order.id,
            amount: order.amount,
            currency: order.currency,
        });
    } catch (err) {
        const errorMsg =
            err?.error?.description ||
            err?.error?.reason ||
            err?.message ||
            "Failed to create payment order";

        res.status(500).json({
            error: errorMsg,
            code: err?.error?.code || err?.statusCode,
        });
    }
});

router.get("/subscription-status", userAuth, async (req, res) => {
    try {
        const userId = req.user?._id;
        const latestSubscription = await Subscription.findOne({ user: userId }).sort({ createdAt: -1 });

        return res.json({
            subscription: latestSubscription,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/create-subscription", userAuth, async(req, res) => {
    try {
        const userId = req.user?._id;

        const user = await User.findById(userId).select("isPremium");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (user.isPremium) {
            return res.status(400).json({ error: "You already have Pro membership" });
        }

        const confirmedActiveStatuses = ["authenticated", "active"];
        const existingActiveSubscription = await Subscription.findOne({
            user: userId,
            status: { $in: confirmedActiveStatuses },
        }).sort({ createdAt: -1 });

        if (existingActiveSubscription) {
            return res.status(400).json({
                error: "You already have an ongoing subscription. Please check your subscription status.",
                subscriptionId: existingActiveSubscription.razorpaySubcriptionId,
            });
        }

        const existingCreatedSubscription = await Subscription.findOne({
            user: userId,
            status: "created",
        }).sort({ createdAt: -1 });

        if (existingCreatedSubscription) {
            return res.json(await razorpay.subscriptions.fetch(existingCreatedSubscription.razorpaySubcriptionId));
        }

        const planId = await resolvePlanId();

        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            return res.status(500).json({
                error: "Razorpay credentials are not configured on server",
            });
        }

        const subscription= await razorpay.subscriptions.create({
            plan_id: planId,
            total_count: 12,
            customer_notify: 1
        });

        await Subscription.create({
            user: userId,
            razorpaySubcriptionId: subscription.id,
            planId: subscription.plan_id,
            totalCount: subscription.total_count,
            amount: 1900,
        });

        res.json(subscription);
    } catch (err) {
        const razorpayMessage =
            err?.error?.description ||
            err?.error?.reason ||
            err?.message ||
            "Failed to create Razorpay subscription";

        const razorpayCode = err?.error?.code || err?.statusCode;
        const statusCode = typeof err?.statusCode === "number" ? err.statusCode : 500;

        const normalizedMessage =
            typeof razorpayMessage === "string" && razorpayMessage.toLowerCase().includes("requested url was not found")
                ? "Razorpay rejected this request. Check Razorpay keys, account mode (test/live), and plan configuration."
                : razorpayMessage;

        res.status(statusCode).json({
            error: normalizedMessage,
            code: razorpayCode,
        });
    }
});

router.post("/cancel-subscription", userAuth, async (req, res) => {
    try {
        const userId = req.user?._id;

        const subscription = await Subscription.findOne({
            user: userId,
            status: "created",
        }).sort({ createdAt: -1 });

        if (!subscription) {
            return res.status(404).json({
                error: "No pending subscription to cancel",
            });
        }

        try {
            await razorpay.subscriptions.pause(subscription.razorpaySubcriptionId);
        } catch {
            
        }

        await Subscription.updateOne(
            { _id: subscription._id },
            { status: "cancelled" }
        );

        return res.json({
            message: "Pending subscription cancelled. You can start a new subscription now.",
        });
    } catch (err) {
        res.status(500).json({
            error: err?.message || "Failed to cancel subscription",
        });
    }
});

router.post("/verify-payment", userAuth, async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const userId = req.user?._id;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({
                error: "Missing payment details",
            });
        }

        const body = `${razorpay_order_id}|${razorpay_payment_id}`;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({
                error: "Payment signature verification failed",
            });
        }

        const razorpayOrder = await razorpay.orders.fetch(razorpay_order_id);
        const orderPlanKey = razorpayOrder?.notes?.planKey;
        const selectedPlan = PRO_PLAN_CATALOG[orderPlanKey] || PRO_PLAN_CATALOG[DEFAULT_PRO_PLAN_KEY];

        await User.updateOne(
            { _id: userId },
            { isPremium: true }
        );

        const now = new Date();
        const planEndDate = new Date(now.getTime() + selectedPlan.durationDays * 24 * 60 * 60 * 1000);

        await Subscription.create({
            user: userId,
            razorpaySubcriptionId: `one-time-${razorpay_payment_id}`,
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
            status: "active",
            amount: razorpayOrder?.amount || selectedPlan.amountPaise,
            currentStart: now,
            currentEnd: planEndDate,
            paidCount: 1,
            totalCount: 1,
            planId: orderPlanKey || DEFAULT_PRO_PLAN_KEY,
        });

        res.json({
            message: "Payment verified successfully. Pro membership activated!",
            isPremium: true,
        });
    } catch (err) {
        res.status(500).json({
            error: err?.message || "Payment verification failed",
        });
    }
});

module.exports = router;