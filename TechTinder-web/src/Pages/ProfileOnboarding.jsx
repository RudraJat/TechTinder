import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Code2, ArrowRight, User, Briefcase, Image, FileText, Tag } from "lucide-react";

/* ──────────────────────────────────────────────
   CONFIG
   ────────────────────────────────────────────── */
const BASE_URL = "http://localhost:1111"; // ← change to your backend

/* ──────────────────────────────────────────────
   HELPER: generate gradient from name
   ────────────────────────────────────────────── */
const GRADS = [
  "from-cyan-400 to-blue-500",
  "from-purple-500 to-fuchsia-500",
  "from-rose-400 to-pink-500",
  "from-amber-400 to-orange-500",
  "from-emerald-400 to-teal-500",
];
const gradOf = (s = "") => GRADS[s.charCodeAt(0) % GRADS.length];

/* ══════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════ */
function ProfileOnboarding({ user = {}, onComplete }) {
  const navigate = useNavigate();
  
  /* ── Fetch user data on mount ── */
  const [userData, setUserData] = useState(user);
  const [loading, setLoading] = useState(!user?.firstName);

  useEffect(() => {
    if (!user?.firstName) {
      // If user data is not passed, fetch it
      const fetchUser = async () => {
        try {
          const res = await fetch(`${BASE_URL}/profile/view`, {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          });

          if (res.ok) {
            const data = await res.json();
            setUserData(data.data || {});
          } else {
            navigate("/login", { replace: true });
          }
        } catch (err) {
          console.error("Failed to fetch user:", err);
          navigate("/login", { replace: true });
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [user, navigate]);

  /* ── form state (seeded from user object) ── */
  const [form, setForm] = useState({
    age:      user?.age      || "",
    gender:   user?.gender   || "",
    bio:      user?.bio      || "",
    role:     Array.isArray(user?.role) ? user.role : (user?.role ? [user.role] : []),
    photoUrl: user?.photoUrl || "",
    skills:   user?.skills   || [],
  });

  /* ── current step: 0 (welcome) | 1 (basics) | 2 (profile) | 3 (bio+skills) ── */
  const [step, setStep] = useState(0);

  /* ── feedback ── */
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  // Only initialize form once when component mounts or user prop changes
  useEffect(() => {
    setForm({
      age:      userData?.age      || "",
      gender:   userData?.gender   || "",
      bio:      userData?.bio      || "",
      role:     Array.isArray(userData?.role) ? userData.role : (userData?.role ? [userData.role] : []),
      photoUrl: userData?.photoUrl || "",
      skills:   userData?.skills   || [],
    });
  }, [userData?.email]); // Only reset when user email changes (indicates new user)

  /* ── skills: comma-separated string ↔ array ── */
  const skillsStr = form.skills.join(", ");
  const [skillsInput, setSkillsInput] = useState(skillsStr);

  // keep skillsInput in sync when form.skills changes (e.g., initial load)
  useEffect(() => {
    setSkillsInput("");
  }, [form.skills]);

  const addSkillsFromString = (val) => {
    const newSkills = val.split(",").map((s) => s.trim()).filter(Boolean);
    setForm((prev) => ({
      ...prev,
      skills: [...new Set([...prev.skills, ...newSkills])], // Add to existing, avoid duplicates
    }));
  };

  const handleSkillsKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const currentValue = e.target.value.trim();
      if (currentValue) {
        addSkillsFromString(currentValue);
        setSkillsInput(""); // Clear input after adding
      }
    }
  };

  const handleSkillsChange = (e) => {
    setSkillsInput(e.target.value);
  };

  const handleRemoveSkill = (skillToRemove) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  /* ── handlers ── */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  /* ── handle role selection (multiple, max 3) ── */
  const handleRoleToggle = (selectedRole) => {
    setForm((prev) => {
      const currentRoles = prev.role || [];
      if (currentRoles.includes(selectedRole)) {
        // Remove if already selected
        return { ...prev, role: currentRoles.filter((r) => r !== selectedRole) };
      } else if (currentRoles.length < 3) {
        // Add if less than 3
        return { ...prev, role: [...currentRoles, selectedRole] };
      }
      // Do nothing if already 3 roles selected
      return prev;
    });
    setError(null);
  };

  /* ── validation per step ── */
  const validateStep = () => {
    if (step === 1) {
      if (!form.age || form.age < 13) return "Age must be 13 or older";
      if (!form.gender) return "Please select your gender";
    }
    if (step === 2) {
      if (!form.role || form.role.length === 0) return "Please select at least one role";
      if (form.role.length > 3) return "Maximum 3 roles allowed";
      // photoUrl is optional
    }
    if (step === 3) {
      if (!form.bio || form.bio.length < 20) return "Bio must be at least 20 characters";
      if (form.skills.length === 0) return "Add at least one skill";
    }
    return null;
  };

  /* ── next step or submit ── */
  const handleNext = async () => {
    const err = validateStep();
    if (err) return setError(err);

    if (step < 3) {
      setStep(step + 1);
    } else {
      // final step → PATCH /profile/edit
      setSaving(true);
      setError(null);
      try {
        // Build payload: omit empty photoUrl, ensure skills is an array, convert age to number when present
        const payload = {};
        Object.entries(form).forEach(([k, v]) => {
          if (k === "photoUrl") {
            if (v && String(v).trim()) payload.photoUrl = String(v).trim();
          } else if (k === "skills") {
            if (Array.isArray(v) && v.length > 0) payload.skills = v;
          } else if (k === "age") {
            if (v !== "" && v != null) payload.age = Number(v);
          } else {
            if (v !== "" && v != null) payload[k] = v;
          }
        });

        console.debug("Submitting profile edit payload:", payload);

        const res = await fetch(`${BASE_URL}/profile/edit`, {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const text = await res.text();
        let data;
        try {
          data = JSON.parse(text || "{}");
        } catch (err) {
          data = { error: text };
        }

        if (!res.ok) {
          console.error("/profile/edit failed", res.status, data);
          throw new Error(data.error || `Failed to save profile (status ${res.status})`);
        }

        // stop spinner
        setSaving(false);

        // success → call parent callback to redirect to home
        if (typeof onComplete === "function") {
          onComplete(data.data);
        } else {
          navigate("/home", { replace: true });
        }
      } catch (e) {
        setSaving(false);
        setError(e.message);
      }
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  /* ── shared input class ── */
  const inputCls =
    "w-full px-4 py-4 bg-white border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-base font-medium focus:outline-none focus:border-purple-500 transition-all";

  /* ── progress dots ── */
  const totalSteps = 4; // 0 (welcome) + 3 data steps
  const progressPercent = (step / (totalSteps - 1)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white flex items-center justify-center p-4 overflow-hidden relative">
      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center animate-pulse">
            <Code2 className="w-8 h-8 text-white" />
          </div>
          <p className="text-slate-400 font-bold tracking-widest uppercase text-xs animate-pulse">
            Loading your profile…
          </p>
        </div>
      )}

      {!loading && (
        <>
          {/* ═══ Animated background blobs ═══ */}
          <div className="fixed inset-0 overflow-hidden opacity-30 pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-fuchsia-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
          </div>

          {/* ═══ Grid pattern ═══ */}
          <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40 pointer-events-none"></div>

          {/* ═══ Main card ═══ */}
          <div className="relative w-full max-w-xl z-10">
            <div className="bg-white rounded-3xl shadow-2xl shadow-purple-900/50 overflow-hidden">
              {/* Progress bar */}
              <div className="h-1.5 bg-slate-200">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 via-purple-600 to-fuchsia-600 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="p-8 sm:p-12">
            {/*STEP 0: WELCOME */}
            {step === 0 && (
              <div className="flex flex-col items-center text-center gap-6">
                {/* avatar */}
                <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${gradOf(userData.firstName)} flex items-center justify-center shadow-lg shadow-purple-500/30`}>
                  {userData.photoUrl ? (
                    <img src={userData.photoUrl} alt="" className="w-full h-full object-cover rounded-2xl" />
                  ) : (
                    <span className="text-5xl font-black text-white">{(userData.firstName || "?")[0]}</span>
                  )}
                </div>

                <div>
                  <h1 className="text-4xl font-black text-slate-900 mb-2">
                    Welcome, {userData.firstName}!
                  </h1>
                  <p className="text-slate-600 text-lg">
                    Let's set up your profile so you can start connecting with amazing developers.
                  </p>
                </div>

                {/* techtinder logo badge */}
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full">
                  <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-lg flex items-center justify-center">
                    <Code2 className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-black bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent">
                    TECHTINDER
                  </span>
                </div>

                <button
                  onClick={handleNext}
                  className="w-full mt-4 py-4 bg-gradient-to-r from-cyan-500 via-purple-600 to-fuchsia-600 text-white font-black text-lg rounded-xl shadow-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all flex items-center justify-center gap-2"
                >
                  Get Started <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {/*STEP 1: AGE & GENDER*/}
            {step === 1 && (
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">Basic Info</h2>
                    <p className="text-slate-600 text-sm">Tell us a bit about yourself</p>
                  </div>
                </div>

                {/* Age */}
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2 uppercase tracking-wide">
                    Your Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={form.age}
                    onChange={handleChange}
                    placeholder="25"
                    className={inputCls}
                    min="13"
                    max="100"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2 uppercase tracking-wide">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    className={`${inputCls} cursor-pointer appearance-none`}
                  >
                    <option value="">Select your gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {error && (
                  <div className="px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm font-semibold">
                    {error}
                  </div>
                )}

                <div className="flex gap-3 mt-2">
                  <button
                    onClick={handleBack}
                    className="flex-1 py-3 bg-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-300 transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleNext}
                    className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: ROLE & PHOTO*/}
            {step === 2 && (
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-fuchsia-500 rounded-xl flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">What You Do</h2>
                    <p className="text-slate-600 text-sm">Help others understand your expertise</p>
                  </div>
                </div>

                {/* Role - Multiple Selection (max 3) */}
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2 uppercase tracking-wide">
                    Your Roles <span className="text-slate-500 font-normal normal-case text-xs">(select up to 3)</span>
                  </label>
                  <div className="space-y-2">
                    {[
                      "Frontend Developer",
                      "Backend Developer",
                      "Fullstack Developer",
                      "Mobile Developer",
                      "DevOps Engineer",
                      "Designer",
                      "Student",
                      "Other",
                    ].map((roleOption) => (
                      <label key={roleOption} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={form.role?.includes(roleOption) || false}
                          onChange={() => handleRoleToggle(roleOption)}
                          disabled={!form.role?.includes(roleOption) && form.role?.length >= 3}
                          className="w-5 h-5 accent-purple-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        <span className="text-sm font-semibold text-slate-900">{roleOption}</span>
                      </label>
                    ))}
                  </div>
                  {form.role && form.role.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {form.role.map((r) => (
                        <span key={r} className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white text-xs font-bold rounded-full shadow-sm">
                          {r}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Photo URL (optional) */}
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2 uppercase tracking-wide">
                    Profile Photo URL <span className="text-slate-500 font-normal normal-case text-xs">(optional)</span>
                  </label>
                  <div className="relative">
                    <Image className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="url"
                      name="photoUrl"
                      value={form.photoUrl}
                      onChange={handleChange}
                      placeholder="https://example.com/photo.jpg"
                      className={`${inputCls} pl-12`}
                    />
                  </div>
                  {form.photoUrl && (
                    <div className="mt-3 flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                      <img src={form.photoUrl} alt="preview" className="w-12 h-12 rounded-lg object-cover" onError={(e) => e.target.style.display = 'none'} />
                      <span className="text-xs text-slate-600 font-semibold">Preview</span>
                    </div>
                  )}
                </div>

                {error && (
                  <div className="px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm font-semibold">
                    {error}
                  </div>
                )}

                <div className="flex gap-3 mt-2">
                  <button
                    onClick={handleBack}
                    className="flex-1 py-3 bg-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-300 transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleNext}
                    className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* ═══════════════════════════════════
                STEP 3: BIO & SKILLS (final)
                ═══════════════════════════════════ */}
            {step === 3 && (
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-fuchsia-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">Tell Your Story</h2>
                    <p className="text-slate-600 text-sm">Make a great first impression</p>
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2 uppercase tracking-wide">
                    Bio <span className="text-slate-500 font-normal normal-case text-xs">(min 20 chars)</span>
                  </label>
                  <textarea
                    name="bio"
                    value={form.bio}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Tell others about yourself, your projects, what you're passionate about..."
                    className={`${inputCls} resize-none`}
                    maxLength={500}
                  />
                  <div className="text-right text-xs text-slate-500 mt-1 font-semibold">
                    {form.bio.length} / 500
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2 uppercase tracking-wide">
                    Skills <span className="text-slate-500 font-normal normal-case text-xs">(comma separated)</span>
                  </label>
                  <div className="relative">
                    <Tag className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                    <input
                      name="skills"
                      value={skillsInput}
                      onChange={handleSkillsChange}
                      onBlur={() => {
                        if (skillsInput.trim()) {
                          addSkillsFromString(skillsInput);
                          setSkillsInput("");
                        }
                      }}
                      onKeyDown={handleSkillsKeyDown}
                      placeholder="Type skill and press Enter or comma..."
                      className={`${inputCls} pl-12`}
                    />
                  </div>
                  {form.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {form.skills.map((s, i) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-xs font-bold rounded-full shadow-sm flex items-center gap-2"
                        >
                          {s}
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(s)}
                            className="ml-1 hover:text-red-200 font-bold"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {error && (
                  <div className="px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm font-semibold">
                    {error}
                  </div>
                )}

                <div className="flex gap-3 mt-2">
                  <button
                    onClick={handleBack}
                    disabled={saving}
                    className="flex-1 py-3 bg-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={saving}
                    className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        Complete Setup <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
              </div>
            </div>

            {/* Step indicator dots */}
            <div className="flex justify-center gap-2 mt-6">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-2 rounded-full transition-all ${
                    i === step
                      ? "w-8 bg-gradient-to-r from-cyan-400 to-purple-500"
                      : i < step
                        ? "w-2 bg-emerald-400"
                        : "w-2 bg-white/30"
                  }`}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {/* animations */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33%      { transform: translate(30px, -50px) scale(1.1); }
          66%      { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
};

export default ProfileOnboarding;