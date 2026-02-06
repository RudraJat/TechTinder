import { useState, useEffect, useRef } from "react";
import {
  User, Mail, Lock, Image, FileText, Briefcase, Tag, Calendar, Users,
  Edit3, Save, X, Eye, EyeOff, ArrowLeft, Camera, Check
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:1111";

/* ──────────────────────────────────────────────
   HELPER: gradient colors
   ────────────────────────────────────────────── */
const GRADS = [
  "from-cyan-400 to-blue-500",
  "from-purple-500 to-fuchsia-500",
  "from-rose-400 to-pink-500",
  "from-amber-400 to-orange-500",
  "from-emerald-400 to-teal-500",
];
const gradOf = (s = "") => GRADS[s.charCodeAt(0) % GRADS.length];

const SKILL_BG = [
  "bg-cyan-500/15 text-cyan-300 border-cyan-500/25",
  "bg-purple-500/15 text-purple-300 border-purple-500/25",
  "bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/25",
  "bg-amber-500/15 text-amber-300 border-amber-500/25",
  "bg-emerald-500/15 text-emerald-300 border-emerald-500/25",
];
const skillBg = (s = "") => SKILL_BG[s.charCodeAt(0) % SKILL_BG.length];

/* ══════════════════════════════════════════════
   MAIN PROFILE PAGE COMPONENT
   ══════════════════════════════════════════════ */
function ProfilePage() {
  const navigate = useNavigate();

  /* ── user data ── */
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ── edit mode toggle ── */
  const [editMode, setEditMode] = useState(false);

  /* ── editable form state ── */
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    role: [],
    photoUrl: "",
    bio: "",
    skills: [],
  });

  /* ── password change modal ── */
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [pwForm, setPwForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showOldPw, setShowOldPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [pwMsg, setPwMsg] = useState(null); // { type: "success"|"error", text }

  /* ── feedback ── */
  const [msg, setMsg] = useState(null); // { type: "success"|"error", text }
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  /* ── fetch user profile on mount ── */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${BASE_URL}/profile/view`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          const u = data.data;
          setUser(u);
          setForm({
            firstName: u.firstName || "",
            lastName: u.lastName || "",
            age: u.age || "",
            gender: u.gender || "",
            role: Array.isArray(u.role) ? u.role : [],
            photoUrl: u.photoUrl || "",
            bio: u.bio || "",
            skills: u.skills || [],
          });
        } else {
          navigate("/login");
        }
      } catch (e) {
        console.error("Profile fetch failed:", e);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  /* ── show message toast ── */
  const showMsg = (type, text) => {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 6000);
  };

  const handlePhotoFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showMsg("error", "Please select an image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, photoUrl: reader.result }));
    };
    reader.onerror = () => {
      showMsg("error", "Failed to read image file.");
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  /* ── handle form input change ── */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* ── skills: comma-separated string ↔ array ── */
  const [skillInput, setSkillInput] = useState("");
  
  const addSkillsFromString = (val) => {
    const newSkills = val.split(",").map((s) => s.trim()).filter(Boolean);
    if (newSkills.length > 0) {
      setForm((prev) => ({
        ...prev,
        skills: [...new Set([...prev.skills, ...newSkills])],
      }));
    }
  };

  const handleSkillsKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkillsFromString(skillInput);
      setSkillInput("");
    }
  };

  const handleSkillsChange = (e) => {
    const val = e.target.value;
    if (val.includes(",")) {
      const beforeComma = val.substring(0, val.lastIndexOf(","));
      addSkillsFromString(beforeComma);
      setSkillInput("");
    } else {
      setSkillInput(val);
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  /* ── save profile changes ── */
  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${BASE_URL}/profile/edit`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");

      setUser(data.data);
      showMsg("success", data.message || "Profile updated!");
      setEditMode(false);
    } catch (e) {
      showMsg("error", e.message);
    } finally {
      setSaving(false);
    }
  };

  /* ── cancel edit ── */
  const handleCancelEdit = () => {
    // reset form to current user data
    setForm({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      age: user.age || "",
      gender: user.gender || "",
      role: Array.isArray(user.role) ? user.role : [],
      photoUrl: user.photoUrl || "",
      bio: user.bio || "",
      skills: user.skills || [],
    });
    setEditMode(false);
  };

  /* ── change password ── */
  const handlePasswordChange = async () => {
    // Clear previous message
    setPwMsg(null);

    // Validation checks
    if (!pwForm.oldPassword.trim()) {
      setPwMsg({ type: "error", text: "Current password is required." });
      return;
    }

    if (!pwForm.newPassword.trim()) {
      setPwMsg({ type: "error", text: "New password is required." });
      return;
    }

    if (!pwForm.confirmPassword.trim()) {
      setPwMsg({ type: "error", text: "Please confirm your new password." });
      return;
    }

    if (pwForm.newPassword.length < 8) {
      setPwMsg({ type: "error", text: "Password must be at least 8 characters." });
      return;
    }

    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwMsg({ type: "error", text: "New passwords don't match." });
      return;
    }

    if (pwForm.oldPassword === pwForm.newPassword) {
      setPwMsg({ type: "error", text: "New password must be different from current password." });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${BASE_URL}/profile/passwordChange`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          oldPassword: pwForm.oldPassword,
          newPassword: pwForm.newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to change password");

      setPwMsg({ type: "success", text: data.message || "Password changed successfully!" });
      setPwForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
      // Close modal after a short delay so user can see the success message
      setTimeout(() => setShowPasswordModal(false), 1500);
    } catch (e) {
      setPwMsg({ type: "error", text: e.message });
    } finally {
      setSaving(false);
    }
  };

  /* ── input styles ── */
  const inputCls = (readonly = false) =>
    `w-full px-4 py-3 rounded-xl text-white text-sm font-medium transition-all ${
      readonly
        ? "bg-white/[0.03] border border-white/[0.08] cursor-not-allowed"
        : editMode
        ? "bg-white/[0.08] border border-white/20 focus:border-purple-500 focus:outline-none"
        : "bg-white/[0.03] border border-white/[0.08]"
    }`;

  /* ── loading screen ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center animate-pulse">
            <User className="w-8 h-8 text-white" />
          </div>
          <p className="text-slate-600 font-bold tracking-widest uppercase text-xs animate-pulse">
            Loading Profile…
          </p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  /* ── main render ── */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white relative overflow-hidden">
      {/* ═══ Animated background blobs ═══ */}
      <div className="fixed inset-0 overflow-hidden opacity-30 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-fuchsia-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* ═══ Grid pattern ═══ */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40 pointer-events-none"></div>

      {/* ═══ Main container ═══ */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* ── Header with back button ── */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/home")}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Back to Home</span>
          </button>

          {!editMode && (
            <button
              onClick={() => setEditMode(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              <Edit3 className="w-4 h-4" />
              Edit Profile
            </button>
          )}
        </div>

        {/* ── Feedback toast ── */}
        {msg && (
          <div
            className={`mb-6 px-5 py-3 rounded-xl border text-sm font-semibold flex items-center gap-2 ${
              msg.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400"
                : "bg-rose-500/10 border-rose-500/25 text-rose-400"
            }`}
          >
            {msg.type === "success" ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
            {msg.text}
          </div>
        )}

        {/* ═══ Profile Card ═══ */}
        <div className="bg-white/[0.05] backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl shadow-black/20 overflow-hidden">
          {/* ── Avatar section ── */}
          <div className="relative h-48 bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-fuchsia-500/20 flex items-center justify-center">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50"></div>
            
            <div className="relative">
              <div className={`w-32 h-32 rounded-2xl bg-gradient-to-br ${gradOf(user.firstName)} flex items-center justify-center shadow-2xl shadow-purple-500/30`}>
                {form.photoUrl ? (
                  <img src={form.photoUrl} alt="" className="w-full h-full object-cover rounded-2xl" />
                ) : (
                  <span className="text-6xl font-black text-white">{(user.firstName || "?")[0]}</span>
                )}
              </div>
              {editMode && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform"
                  aria-label="Upload profile photo"
                >
                  <Camera className="w-5 h-5 text-white" />
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoFileChange}
              className="hidden"
            />
          </div>

          {/* ── Form fields ── */}
          <div className="p-8 space-y-6">
            {/* Name row */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  <User className="w-3.5 h-3.5" />
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  disabled={!editMode}
                  className={inputCls()}
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  <User className="w-3.5 h-3.5" />
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  disabled={!editMode}
                  className={inputCls()}
                />
              </div>
            </div>

            {/* Email (readonly) */}
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                <Mail className="w-3.5 h-3.5" />
                Email <span className="text-slate-600 normal-case text-xs">(cannot be changed)</span>
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                className={inputCls(true)}
              />
            </div>

            {/* Age + Gender row */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Age */}
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  <Calendar className="w-3.5 h-3.5" />
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  disabled={!editMode}
                  min="13"
                  max="100"
                  className={inputCls()}
                />
              </div>

              {/* Gender */}
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  <Users className="w-3.5 h-3.5" />
                  Gender
                </label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  disabled={!editMode}
                  className={`${inputCls()} appearance-none cursor-pointer`}
                >
                  <option value="" className="bg-slate-800">Select gender</option>
                  <option value="male" className="bg-slate-800">Male</option>
                  <option value="female" className="bg-slate-800">Female</option>
                  <option value="other" className="bg-slate-800">Other</option>
                </select>
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                <Briefcase className="w-3.5 h-3.5" />
                Role (Select 1-3)
              </label>
              {editMode ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    "Frontend Developer",
                    "Backend Developer",
                    "Fullstack Developer",
                    "Mobile Developer",
                    "DevOps Engineer",
                    "Designer",
                    "Student",
                    "Other",
                  ].map((roleOption) => {
                    const isSelected = form.role.includes(roleOption);
                    const isDisabled = !isSelected && form.role.length >= 3;
                    return (
                      <button
                        key={roleOption}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setForm((prev) => ({
                              ...prev,
                              role: prev.role.filter((r) => r !== roleOption),
                            }));
                          } else if (form.role.length < 3) {
                            setForm((prev) => ({
                              ...prev,
                              role: [...prev.role, roleOption],
                            }));
                          }
                        }}
                        disabled={isDisabled}
                        className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                          isSelected
                            ? "bg-purple-500/20 border-2 border-purple-500 text-purple-300"
                            : isDisabled
                            ? "bg-white/[0.03] border border-white/10 text-slate-600 cursor-not-allowed"
                            : "bg-white/[0.05] border border-white/20 text-slate-400 hover:bg-white/10 hover:border-purple-500/50"
                        }`}
                      >
                        {roleOption}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {form.role && form.role.length > 0 ? (
                    form.role.map((r, i) => (
                      <span
                        key={i}
                        className="px-4 py-2 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-300 text-sm font-semibold"
                      >
                        {r}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-600 text-sm italic">No roles selected</span>
                  )}
                </div>
              )}
            </div>

            {/* Photo URL */}
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                <Image className="w-3.5 h-3.5" />
                Photo URL
              </label>
              <input
                type="url"
                name="photoUrl"
                value={form.photoUrl}
                onChange={handleChange}
                disabled={!editMode}
                placeholder="https://example.com/photo.jpg"
                className={inputCls()}
              />
            </div>

            {/* Bio */}
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                <FileText className="w-3.5 h-3.5" />
                Bio
              </label>
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                disabled={!editMode}
                rows={4}
                maxLength={500}
                placeholder="Tell others about yourself..."
                className={`${inputCls()} resize-none`}
              />
              <div className="text-right text-xs text-slate-600 mt-1 font-semibold">
                {form.bio.length} / 500
              </div>
            </div>

            {/* Skills */}
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                <Tag className="w-3.5 h-3.5" />
                Skills <span className="text-slate-600 normal-case text-xs">(Press Enter or comma to add)</span>
              </label>
              <input
                value={skillInput}
                onChange={handleSkillsChange}
                onKeyDown={handleSkillsKeyDown}
                disabled={!editMode}
                placeholder="Type skill and press Enter..."
                className={inputCls()}
              />
              {form.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {form.skills.map((s, i) => (
                    <span key={i} className={`px-3 py-1 rounded-full border text-xs font-bold ${skillBg(s)} flex items-center gap-1.5`}>
                      {s}
                      {editMode && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(s)}
                          className="hover:text-rose-400 transition-colors"
                        >
                          ×
                        </button>
                      )}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Password change button (always visible) */}
            <div className="pt-4 border-t border-white/10">
              <button
                onClick={() => setShowPasswordModal(true)}
                className="flex items-center gap-2 px-4 py-3 bg-white/[0.06] border border-white/10 text-slate-300 font-bold text-sm rounded-xl hover:bg-white/10 hover:border-white/20 transition-all"
              >
                <Lock className="w-4 h-4" />
                Change Password
              </button>
            </div>

            {/* Save / Cancel buttons (only in edit mode) */}
            {editMode && (
              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleCancelEdit}
                  disabled={saving}
                  className="flex-1 py-3 bg-white/[0.06] border border-white/10 text-slate-300 font-bold rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
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
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ═══ Password Change Modal ═══ */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm" 
            onClick={() => {
              setShowPasswordModal(false);
              setPwMsg(null);
              setPwForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
            }} 
          />
          
          <div className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl shadow-2xl shadow-black/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-white">Change Password</h3>
              <button 
                onClick={() => {
                  setShowPasswordModal(false);
                  setPwMsg(null);
                  setPwForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
                }} 
                className="text-slate-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Message Display */}
            {pwMsg && (
              <div
                className={`mb-6 px-5 py-3 rounded-xl border text-sm font-semibold flex items-center gap-2 ${
                  pwMsg.type === "success"
                    ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400"
                    : "bg-rose-500/10 border-rose-500/25 text-rose-400"
                }`}
              >
                {pwMsg.type === "success" ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <X className="w-4 h-4" />
                )}
                {pwMsg.text}
              </div>
            )}

            <div className="space-y-4">
              {/* Old Password */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showOldPw ? "text" : "password"}
                    value={pwForm.oldPassword}
                    onChange={(e) => setPwForm((p) => ({ ...p, oldPassword: e.target.value }))}
                    placeholder="Enter current password"
                    className="w-full px-4 py-3 pr-12 bg-white/[0.08] border border-white/20 rounded-xl text-white text-sm font-medium focus:border-purple-500 focus:outline-none"
                  />
                  <button
                    onClick={() => setShowOldPw(!showOldPw)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                  >
                    {showOldPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPw ? "text" : "password"}
                    value={pwForm.newPassword}
                    onChange={(e) => setPwForm((p) => ({ ...p, newPassword: e.target.value }))}
                    placeholder="Enter new password"
                    className="w-full px-4 py-3 pr-12 bg-white/[0.08] border border-white/20 rounded-xl text-white text-sm font-medium focus:border-purple-500 focus:outline-none"
                  />
                  <button
                    onClick={() => setShowNewPw(!showNewPw)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                  >
                    {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={pwForm.confirmPassword}
                  onChange={(e) => setPwForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                  placeholder="Re-enter new password"
                  className="w-full px-4 py-3 bg-white/[0.08] border border-white/20 rounded-xl text-white text-sm font-medium focus:border-purple-500 focus:outline-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPwMsg(null);
                    setPwForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
                  }}
                  disabled={saving}
                  className="flex-1 py-3 bg-white/[0.06] border border-white/10 text-slate-300 font-bold text-sm rounded-xl hover:bg-white/10 transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordChange}
                  disabled={saving}
                  className="flex-1 py-3 bg-gradient-to-r from-rose-500 to-fuchsia-600 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
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

export default ProfilePage;