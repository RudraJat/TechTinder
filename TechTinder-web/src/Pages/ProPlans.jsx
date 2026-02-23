import { useEffect, useState } from "react";
import { Check, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:1111";

const plan = {
  name: "Pro",
  price: "$19",
  features: [
    "Unlimited matches",
    "Priority matching",
    "Connect & chat with other",
    "Advanced features",
  ],
  popular: true,
  planKey: "month",
};

function ProPlans() {
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState(null);
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  const canCancelPending = subscription?.status && ["created", "authenticated", "active", "paused"].includes(subscription.status);

  const fetchStatus = async () => {
    const [profileRes, subscriptionRes] = await Promise.all([
      fetch(`${BASE_URL}/profile/view`, {
        method: "GET",
        credentials: "include",
      }),
      fetch(`${BASE_URL}/api/subscription-status`, {
        method: "GET",
        credentials: "include",
      }),
    ]);

    if (!profileRes.ok) {
      navigate("/login");
      return;
    }

    const profileData = await profileRes.json();
    const subscriptionData = subscriptionRes.ok ? await subscriptionRes.json() : { subscription: null };

    setUser(profileData?.data || null);
    setSubscription(subscriptionData?.subscription || null);
  };

  useEffect(() => {
    (async () => {
      try {
        await fetchStatus();
      } catch {
        setMessage({ type: "error", text: "Failed to load Pro plans." });
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleCancelSubscription = async () => {
    setProcessing(true);
    try {
      const res = await fetch(`${BASE_URL}/api/cancel-subscription`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Failed to cancel subscription");
      }

      showMessage("success", data?.message || "Subscription cancelled");
      await fetchStatus();
    } catch (error) {
      showMessage("error", error.message || "Failed to cancel subscription");
    } finally {
      setProcessing(false);
    }
  };

  const handleContinue = async () => {
    if (!window.Razorpay) {
      showMessage("error", "Razorpay SDK not loaded. Please refresh and try again.");
      return;
    }

    setProcessing(true);

    try {
      let razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!razorpayKey) {
        const keyRes = await fetch(`${BASE_URL}/api/razorpay-key`, {
          method: "GET",
          credentials: "include",
        });

        const keyData = await keyRes.json();
        if (!keyRes.ok || !keyData?.key) {
          throw new Error(keyData?.error || "Missing Razorpay key configuration");
        }

        razorpayKey = keyData.key;
      }

      const orderRes = await fetch(`${BASE_URL}/api/create-order`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planKey: plan.planKey }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        throw new Error(orderData?.error || "Failed to create order");
      }

      const options = {
        key: razorpayKey,
        order_id: orderData.id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "TechTinder",
        description: `Pro Membership - ${plan.name}`,
        theme: {
          color: "#7c3aed",
        },
        prefill: {
          name: `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),
          email: user?.email || "",
        },
        modal: {
          ondismiss: () => {
            showMessage("error", "Payment cancelled. You can try again.");
          },
        },
        handler: async (response) => {
          try {
            const verifyRes = await fetch(`${BASE_URL}/api/verify-payment`, {
              method: "POST",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) {
              throw new Error(verifyData?.error || "Payment verification failed");
            }

            showMessage("success", "Payment successful. Pro activated!");
            await fetchStatus();
            setTimeout(() => navigate("/profile"), 1200);
          } catch (error) {
            showMessage("error", error.message || "Verification failed");
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response) => {
        showMessage("error", response?.error?.description || "Payment failed");
      });
      rzp.open();
    } catch (error) {
      showMessage("error", error.message || "Unable to start payment");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white flex items-center justify-center">
        <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Loading Pro plans...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <button
          onClick={() => navigate("/profile")}
          className="mb-4 inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-slate-300 hover:text-white hover:border-purple-500/40 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {message && (
          <div
            className={`mb-4 rounded-xl px-4 py-3 text-sm font-semibold border ${
              message.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                : "bg-rose-500/10 border-rose-500/20 text-rose-300"
            }`}
          >
            {message.text}
          </div>
        )}

        {user?.isPremium && (
          <div className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-300">
            Your Pro membership is active.
          </div>
        )}

        <div className="bg-white/[0.05] backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-black/30 p-4 md:p-6">
          <h1 className="text-3xl font-black text-center bg-gradient-to-r from-cyan-400 to-fuchsia-400 bg-clip-text text-transparent">Get TechTinder Pro®</h1>
          <p className="text-slate-400 text-sm text-center mt-1">One simple plan</p>

          <div className="mt-8 rounded-2xl border border-purple-500 bg-purple-500/15 text-white shadow-lg shadow-purple-500/20 p-5 relative">
            {plan.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-cyan-500 to-purple-600 text-white">
                Most Popular
              </span>
            )}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">{plan.name}</h2>
              <p className="text-2xl font-black">{plan.price}</p>
            </div>

            <ul className="space-y-3 text-sm">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-cyan-400" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-6 text-xs text-slate-400 leading-relaxed">
            By tapping Continue, you will be charged and your subscription will renew until you cancel via Account Settings, and you agree to our <Link to="/terms" className="text-purple-300 hover:text-purple-200">Terms</Link>.
          </p>

          <button
            onClick={handleContinue}
            disabled={processing || user?.isPremium}
            className="mt-5 w-full h-12 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-base font-bold tracking-wide hover:shadow-lg hover:shadow-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? "Please wait..." : user?.isPremium ? "Pro Active" : "Continue"}
          </button>

          {canCancelPending && !user?.isPremium && (
            <button
              onClick={handleCancelSubscription}
              disabled={processing}
              className="mt-3 text-sm font-semibold text-slate-400 hover:text-white underline disabled:opacity-60"
            >
              Cancel current pending plan
            </button>
          )}

          <button
            onClick={() => navigate("/feed")}
            className="mt-5 mx-auto flex items-center justify-center text-lg font-bold text-white hover:text-slate-300 transition-colors"
          >
            No Thanks
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProPlans;
