import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  X,
  Users,
  Bell,
  Sparkles,
  LogOut,
  Code2,
  Search,
  UserCheck,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  User,
} from "lucide-react";

/* ──────────────────────────────────────────────
   CONFIG  – point BASE_URL at your Express server
   ────────────────────────────────────────────── */
const BASE_URL = "http://localhost:1111";

/* ──────────────────────────────────────────────
   HELPERS
   ────────────────────────────────────────────── */
const GRADS = [
  "from-cyan-400 to-blue-500",
  "from-purple-500 to-fuchsia-500",
  "from-rose-400 to-pink-500",
  "from-amber-400 to-orange-500",
  "from-emerald-400 to-teal-500",
  "from-indigo-400 to-violet-500",
];
const gradOf = (s = "") => GRADS[s.charCodeAt(0) % GRADS.length];

const SKILL_BG = [
  "bg-cyan-500/15 text-cyan-300 border-cyan-500/25",
  "bg-purple-500/15 text-purple-300 border-purple-500/25",
  "bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/25",
  "bg-amber-500/15 text-amber-300 border-amber-500/25",
  "bg-emerald-500/15 text-emerald-300 border-emerald-500/25",
  "bg-rose-500/15 text-rose-300 border-rose-500/25",
];
const skillBg = (s = "") => SKILL_BG[s.charCodeAt(0) % SKILL_BG.length];

/* generic authenticated fetch – sends cookie so userAuth works */
async function api(path) {
  const r = await fetch(`${BASE_URL}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

async function apiPost(path, body) {
  const r = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return r.json();
}

/*SUB-COMPONENTS*/

/* ── Avatar circle ─────────────────────────── */
function Avatar({ user, size = "lg" }) {
  const dim =
    size === "lg" ? "w-full h-full" : size === "md" ? "w-14 h-14" : "w-10 h-10";
  const text =
    size === "lg" ? "text-6xl" : size === "md" ? "text-xl" : "text-base";

  if (user.photoUrl) {
    return (
      <img
        src={user.photoUrl}
        alt={user.firstName}
        className={`${dim} object-cover ${size === "lg" ? "" : "rounded-full"}`}
      />
    );
  }
  return (
    <div
      className={`${dim} bg-gradient-to-br ${gradOf(user.firstName)} flex items-center justify-center ${size === "lg" ? "" : "rounded-full"}`}
    >
      <span className={`${text} font-black text-white`}>
        {(user.firstName || "?")[0]}
      </span>
    </div>
  );
}

/* ── Skill pills ────────────────────────────── */
function SkillPills({ skills = [] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((s, i) => (
        <span
          key={i}
          className={`px-3 py-1 rounded-full border text-xs font-bold ${skillBg(s)}`}
        >
          {s}
        </span>
      ))}
    </div>
  );
}

  /* ── Feed card (single swipeable profile) ───── */
function FeedCard({
  user,
  swipeDir,
  onMouseDown,
  onMouseUp,
  onMouseLeave,
  onTouchStart,
  onTouchEnd,
}) {
  let translate = "translate-x-0 opacity-100";
  if (swipeDir === "right") translate = "translate-x-[110%] opacity-0";
  if (swipeDir === "left") translate = "-translate-x-[110%] opacity-0";

  return (
    <div
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      className={`relative w-full rounded-3xl overflow-hidden shadow-2xl shadow-purple-900/40 border border-white/10 bg-white/5 backdrop-blur-xl transform transition-all duration-350 ease-out cursor-grab active:cursor-grabbing select-none ${translate}`}
      style={{ aspectRatio: "3/4", transitionDuration: "380ms" }}
    >
      {/* photo / gradient bg */}
      <div className="absolute inset-0">
        <Avatar user={user} size="lg" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
      </div>

      {/* LIKE / PASS stamp */}
      {swipeDir === "right" && (
        <div
          className="absolute top-8 left-5 z-20 border-[3px] border-emerald-400 rounded-lg px-3 py-0.5"
          style={{ transform: "rotate(-12deg)" }}
        >
          <span className="text-emerald-400 text-2xl font-black drop-shadow-lg">
            LIKE
          </span>
        </div>
      )}
      {swipeDir === "left" && (
        <div
          className="absolute top-8 right-5 z-20 border-[3px] border-rose-400 rounded-lg px-3 py-0.5"
          style={{ transform: "rotate(12deg)" }}
        >
          <span className="text-rose-400 text-2xl font-black drop-shadow-lg">
            PASS
          </span>
        </div>
      )}

      {/* info overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
        <div className="flex items-end justify-between mb-2">
          <div>
            <h2 className="text-3xl font-black text-white leading-tight drop-shadow">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-slate-300 font-semibold text-sm mt-0.5">
              {user.age ? `${user.age} · ` : ""}{user.gender || ""}
            </p>
            {user.role && user.role.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {user.role.map((r, i) => (
                  <span key={i} className="text-[10px] font-bold text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded-full">
                    {r}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="w-10 h-10 rounded-full bg-black/30 backdrop-blur border border-white/20 flex items-center justify-center">
            <Code2 className="w-5 h-5 text-cyan-400" />
          </div>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed mb-3 line-clamp-2 drop-shadow">
          {user.bio}
        </p>
        <SkillPills skills={user.skills} />
      </div>
    </div>
  );
}

/* ── Empty state ────────────────────────────── */
function EmptyState({ icon: Icon, title, sub }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-8 py-20 gap-5">
      <div className="w-24 h-24 rounded-3xl bg-white/[0.04] border border-white/10 flex items-center justify-center">
        <Icon className="w-12 h-12 text-slate-700" />
      </div>
      <h3 className="text-xl font-black text-white">{title}</h3>
      <p className="text-slate-500 text-sm max-w-xs">{sub}</p>
    </div>
  );
}

/* ══════════════════════════════════════════════
   TAB VIEWS
   ══════════════════════════════════════════════ */

/* ── FEED TAB ───────────────────────────────── */
function FeedTab({
  feed,
  currentIdx,
  swipeDir,
  onLike,
  onPass,
  onTouchStart,
  onTouchEnd,
  onMouseDown,
  onMouseUp,
  onMouseLeave,
}) {
  const remaining = feed.length - currentIdx;

  if (remaining <= 0) {
    return (
      <EmptyState
        icon={Sparkles}
        title="All caught up 🎉"
        sub="You've reviewed all available profiles! No more profiles right now. Come back later to discover new developers!"
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center px-4 pt-3 pb-4 gap-3">
      {/* counter */}
      <p className="text-slate-600 text-xs font-bold uppercase tracking-widest">
        {remaining} profile{remaining !== 1 ? "s" : ""} to review
      </p>

      {/* card stack */}
      <div className="relative w-full" style={{ maxWidth: 380 }}>
        {/* ghost card behind (peek) */}
        {currentIdx + 1 < feed.length && (
          <div
            className="absolute inset-x-3 top-3 bottom-0 rounded-3xl bg-white/[0.035] border border-white/[0.06]"
            style={{ transform: "scale(0.97)" }}
          />
        )}
        {/* active card */}
        <div className="relative z-10">
          <FeedCard
            user={feed[currentIdx]}
            swipeDir={swipeDir}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseLeave}
          />
        </div>
      </div>

      {/* action buttons row */}
      <div className="flex items-center justify-center gap-5 mt-1">
        {/* PASS */}
        <button
          onClick={onPass}
          className="w-15 h-15 rounded-full bg-white/[0.06] border-2 border-rose-500/35 hover:border-rose-500/70 hover:bg-rose-500/10 flex items-center justify-center transition-all active:scale-90"
          style={{ width: 58, height: 58 }}
        >
          <X className="w-6 h-6 text-rose-400" />
        </button>

        {/* LIKE – big centre button */}
        <button
          onClick={onLike}
          className="rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 shadow-lg shadow-emerald-500/35 hover:shadow-emerald-500/55 flex items-center justify-center transition-all active:scale-90 hover:-translate-y-1"
          style={{ width: 76, height: 76 }}
        >
          <Heart className="w-9 h-9 text-white fill-white" />
        </button>
      </div>

      <p className="text-slate-600 text-xs mt-0.5">
        Swipe left / right or tap buttons
      </p>
    </div>
  );
}

/* ── REQUESTS TAB ───────────────────────────── */
function RequestsTab({ requests, onAccept, onReject }) {
  if (requests.length === 0) {
    return (
      <EmptyState
        icon={Bell}
        title="No pending requests"
        sub="When someone sends you a connection request it will show up here."
      />
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3">
      {requests.map((req) => {
        const u = req.fromUserId;
        return (
          <div
            key={req._id}
            className="bg-white/[0.05] backdrop-blur-xl border border-white/10 rounded-2xl p-4 hover:border-white/20 transition-all"
          >
            {/* avatar + info row */}
            <div className="flex items-start gap-4">
              <Avatar user={u} size="md" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-white text-sm">
                    {u.firstName} {u.lastName}
                  </h3>
                  <span className="text-xs text-slate-500 font-semibold">
                    {u.age ? `${u.age} · ` : ""}{u.gender || ""}
                  </span>
                </div>
                {u.role && u.role.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {u.role.map((r, i) => (
                      <span key={i} className="text-[10px] font-bold text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded-full">
                        {r}
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-slate-400 text-xs mt-0.5 leading-relaxed line-clamp-2">
                  {u.bio}
                </p>
                <div className="mt-2">
                  <SkillPills skills={u.skills} />
                </div>
              </div>
            </div>

            {/* action buttons */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => onReject(req._id)}
                className="flex-1 py-2.5 rounded-xl bg-white/[0.05] border border-rose-500/30 hover:bg-rose-500/10 hover:border-rose-500/50 text-rose-400 font-bold text-sm flex items-center justify-center gap-2 transition-all"
              >
                <X className="w-4 h-4" /> Ignore
              </button>
              <button
                onClick={() => onAccept(req._id)}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all"
              >
                <UserCheck className="w-4 h-4" /> Accept
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── CONNECTIONS TAB ────────────────────────── */
function ConnectionsTab({ connections }) {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);

  const filtered = connections.filter((c) => {
    const q = search.toLowerCase();
    return (
      !q ||
      c.firstName?.toLowerCase().includes(q) ||
      c.lastName?.toLowerCase().includes(q) ||
      (c.skills || []).some((s) => s.toLowerCase().includes(q))
    );
  });

  if (connections.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No connections yet"
        sub="Start swiping on the Feed tab to find your perfect coding partner!"
      />
    );
  }

  return (
    <div className="flex-1 overflow-y-auto flex flex-col gap-3 px-4 py-3">
      {/* search */}
      <div className="relative top-0 z-10 pb-1">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name or skill…"
          className="w-full pl-10 pr-4 py-3 bg-white/[0.06] border border-white/10 rounded-xl text-white placeholder-slate-600 text-sm focus:outline-none focus:border-purple-500 transition-colors"
        />
      </div>

      {filtered.length === 0 && (
        <p className="text-slate-600 text-sm text-center py-10">
          No results found
        </p>
      )}

      {/* connection cards */}
      {filtered.map((c) => {
        const open = expanded === c._id;
        return (
          <div
            key={c._id}
            className="bg-white/[0.05] backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all"
          >
            {/* collapsed row */}
            <button
              onClick={() => setExpanded(open ? null : c._id)}
              className="w-full flex items-center gap-4 p-4 text-left"
            >
              <Avatar user={c} size="sm" />
              <div className="flex-1 min-w-0">
                <h3 className="font-black text-white text-sm">
                  {c.firstName} {c.lastName}
                </h3>
                <p className="text-slate-500 text-xs">
                  {c.age ? `${c.age} · ` : ""}{c.gender || ""}
                </p>
                {c.role && c.role.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {c.role.map((r, i) => (
                      <span key={i} className="text-[10px] font-bold text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded-full">
                        {r}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {open ? (
                <ChevronUp className="w-4 h-4 text-slate-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-500" />
              )}
            </button>

            {/* expanded detail */}
            {open && (
              <div className="px-4 pb-4 border-t border-white/[0.08] pt-3">
                <p className="text-slate-400 text-xs leading-relaxed mb-3">
                  {c.bio}
                </p>
                <SkillPills skills={c.skills} />
                <button className="mt-4 w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-purple-500/20 hover:shadow-purple-500/40 transition-all">
                  <MessageCircle className="w-4 h-4" /> Send Message
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════════════════
   ROOT PAGE
   ══════════════════════════════════════════════ */
function TechTinderHome({ onLogout }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState("feed");
  const [feed, setFeed] = useState([]);
  const [requests, setRequests] = useState([]);
  const [connections, setConns] = useState([]);
  const [activeDevs, setActiveDevs] = useState(0);
  const [loading, setLoading] = useState(true);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [swipeDir, setSwipeDir] = useState(null);
  const animating = useRef(false);
  const touchStartX = useRef(0);
  const mouseStartX = useRef(0);
  const isDragging = useRef(false);
  const [dragX, setDragX] = useState(0); // live pixel offset while dragging
  const [isSnapping, setIsSnapping] = useState(false); // true while the snap-back animation runs

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreUsers, setHasMoreUsers] = useState(true);
  const loadingRef = useRef(false);
  const seenIdsRef = useRef(new Set());

  /* ── fetch everything in parallel on mount ── */
  useEffect(() => {
    (async () => {
      try {
        const [feedRes, reqRes, connRes, statsRes] = await Promise.all([
          api("/user/feed?page=1&limit=10"),
          api("/user/request/received"),
          api("/user/connections"),
          api("/stats"),
        ]);

        // Handle all responses
        setFeed(feedRes.data || []);
        setRequests(reqRes.data || []);
        setConns(connRes.data || []);
        setActiveDevs(statsRes.activeDevs || 0);

        // Only assume no more users if we got 0 users on first page
        if (!feedRes.data || feedRes.data.length === 0) {
          setHasMoreUsers(false);
        }
      } catch (e) {
        console.error("API load error:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ── Auto-load more users when running low ── */
  useEffect(() => {
    // Only proceed if we have feed data and haven't reached the end
    if (feed.length === 0 || !hasMoreUsers || loadingRef.current) {
      return;
    }

    const remainingProfiles = feed.length - currentIdx;

    // Trigger load when only 1 profile remains
    if (remainingProfiles <= 1) {
      loadingRef.current = true;
      setIsLoadingMore(true);

      (async () => {
        try {
          const nextPage = currentPage + 1;
          const remainingIds = feed
            .slice(currentIdx)
            .map((u) => u?._id)
            .filter(Boolean);
          const excludeSet = new Set([...seenIdsRef.current, ...remainingIds]);
          const excludeIds = Array.from(excludeSet).join(",");
          const feedRes = await api(
            `/user/feed?page=${nextPage}&limit=10&excludeIds=${encodeURIComponent(excludeIds)}`,
          );

          if (feedRes.data && feedRes.data.length > 0) {
            setFeed((prevFeed) => [...prevFeed, ...feedRes.data]);
            setCurrentPage(nextPage);

            // Only stop if we get 0 users (no more available)
            // Even if less than 10, there might be more on next page
          } else {
            setHasMoreUsers(false);
          }
        } catch (e) {
          console.error("Error loading more users:", e);
        } finally {
          setIsLoadingMore(false);
          loadingRef.current = false;
        }
      })();
    }
  }, [currentIdx, feed.length, currentPage, hasMoreUsers]);

  /* ── swipe trigger ── */
  const triggerSwipe = useCallback((dir, userId, status) => {
    if (animating.current) return;
    animating.current = true;
    setSwipeDir(dir);
    /* POST in background */
    if (userId) {
      seenIdsRef.current.add(userId);
      apiPost(`/request/send/${status}/${userId}`, {}).catch(() => {});
    }
    setTimeout(() => {
      setSwipeDir(null);
      setCurrentIdx((i) => i + 1);
      animating.current = false;
    }, 400);
  }, []);

  const handleLike = useCallback(() => {
    triggerSwipe("right", feed[currentIdx]?._id, "interested");
  }, [feed, currentIdx, triggerSwipe]);

  const handlePass = useCallback(() => {
    triggerSwipe("left", feed[currentIdx]?._id, "ignored");
  }, [feed, currentIdx, triggerSwipe]);

  /* touch handlers (mobile) */
  const onTouchStart = (e) => {
    mouseStartX.current = e.touches[0].clientX;
    isDragging.current = true;
  };

  const onTouchMove = (e) => {
    if (!isDragging.current) return;
    setDragX(e.touches[0].clientX - mouseStartX.current);
  };

  const onTouchEnd = (e) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const diff = e.changedTouches[0].clientX - mouseStartX.current;

    if (diff > 60) {
      setDragX(window.innerWidth);
      setTimeout(() => {
        setDragX(0);
        handleLike();
      }, 350);
    } else if (diff < -60) {
      setDragX(-window.innerWidth);
      setTimeout(() => {
        setDragX(0);
        handlePass();
      }, 350);
    } else {
      setIsSnapping(true);
      setDragX(0);
      setTimeout(() => setIsSnapping(false), 300);
    }
  };

  /* mouse handlers (desktop) */

  const onMouseDown = (e) => {
    e.preventDefault(); // stop text-select while dragging
    mouseStartX.current = e.clientX;
    isDragging.current = true;
  };

  const onMouseMove = (e) => {
    if (!isDragging.current) return;
    setDragX(e.clientX - mouseStartX.current); // update live offset
  };

  const onMouseUp = (e) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const diff = e.clientX - mouseStartX.current;

    if (diff > 60) {
      // ── fly off to the right, THEN tell parent to advance
      setDragX(window.innerWidth); // instant big value → CSS transition carries it off
      setTimeout(() => {
        setDragX(0);
        handleLike();
      }, 350);
    } else if (diff < -60) {
      setDragX(-window.innerWidth);
      setTimeout(() => {
        setDragX(0);
        handlePass();
      }, 350);
    } else {
      // ── below threshold → snap back to center
      setIsSnapping(true);
      setDragX(0);
      setTimeout(() => setIsSnapping(false), 300); // duration matches the CSS transition
    }
  };

  const onMouseLeave = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    setIsSnapping(true);
    setDragX(0);
    setTimeout(() => setIsSnapping(false), 300);
  };

  /* ── request accept / reject ── */
  const handleAccept = async (reqId) => {
    try {
      await apiPost(`/request/review/accepted/${reqId}`, {});
      setRequests((p) => p.filter((r) => r._id !== reqId));
      setConns((p) => [
        ...p,
        requests.find((r) => r._id === reqId)?.fromUserId,
      ]);
    } catch (err) {
      console.error("Error accepting request:", err);
      alert("Failed to accept request. Please try again.");
    }
  };
  const handleReject = async (reqId) => {
    try {
      await apiPost(`/request/review/rejected/${reqId}`, {});
      setRequests((p) => p.filter((r) => r._id !== reqId));
    } catch (err) {
      console.error("Error rejecting request:", err);
      alert("Failed to reject request. Please try again.");
    }
  };

  /* ── logout ── */
  const handleLogout = async () => {
    if (!confirm("Are you sure you want to logout?")) {
      return;
    }
    try {
      await apiPost("/logout", {});
      navigate("/");
    } catch (err) {
      console.error("Error logging out:", err);
      alert("Logout failed. Please try again.");
    }
  };

  /* ── loading screen ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-5">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center shadow-xl shadow-purple-500/40 animate-pulse">
          <Code2 className="w-10 h-10 text-white" />
        </div>
        <p className="text-slate-600 font-bold tracking-widest uppercase text-xs animate-pulse">
          Loading…
        </p>
        <div className="w-56 flex flex-col gap-3 mt-2">
          {[75, 55, 85, 45].map((w, i) => (
            <div
              key={i}
              className="h-2.5 bg-white/[0.06] rounded-full animate-pulse"
              style={{ width: `${w}%` }}
            />
          ))}
        </div>
      </div>
    );
  }

  /* ── main render ── */
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white flex flex-col relative overflow-hidden"
      style={{ maxWidth: 480, margin: "0 auto" }}
    >
      {/* ═══ Animated background blobs ═══ */}
      <div
        className="fixed inset-0 overflow-hidden opacity-30 pointer-events-none"
        style={{ zIndex: 0 }}
      >
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-fuchsia-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* ═══ Grid pattern overlay ═══ */}
      <div
        className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40 pointer-events-none"
        style={{ zIndex: 0 }}
      ></div>

      {/* ═══ HEADER ═══ */}
      <header className="sticky top-0 z-30 bg-slate-950/85 backdrop-blur-2xl border-b border-white/[0.08] px-4 pt-2 pb-2">
        {/* brand row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center shadow-md shadow-purple-500/30">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black bg-gradient-to-r from-cyan-400 to-fuchsia-400 bg-clip-text text-transparent tracking-tight">
              TECHTINDER
            </span>
          </div>
          <div className="flex items-center gap-2">
            {/* Profile button */}
            <button
              onClick={() => navigate("/profile")}
              className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center hover:bg-purple-500/15 hover:border-purple-500/30 transition-all"
            >
              <User className="w-4 h-4 text-slate-400" />
            </button>

            {/* Logout button */}
            <button
              onClick={onLogout || handleLogout}
              className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center hover:bg-rose-500/15 hover:border-rose-500/30 transition-all"
            >
              <LogOut className="w-4 h-4 text-slate-400" />
            </button>
          </div>
          
        </div>

        {/* live stat */}
        <div className="mb-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {activeDevs.toLocaleString()} devs active
          </span>
        </div>

        {/* tab pills */}
        <div className="flex gap-2">
          {[
            { key: "feed", label: "Feed", icon: Sparkles },
            {
              key: "requests",
              label: "Requests",
              icon: Bell,
              badge: requests.length,
            },
            { key: "connections", label: "Connected", icon: Users },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`relative flex-1 flex items-center justify-center gap-1.5 text-xs font-bold py-2.5 rounded-xl transition-all duration-300 ${
                tab === t.key
                  ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg shadow-purple-500/25"
                  : "bg-white/[0.05] text-slate-400 hover:bg-white/10"
              }`}
            >
              <t.icon className="w-3.5 h-3.5" />
              {t.label}
              {t.badge > 0 && (
                <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center px-1 shadow-md shadow-rose-500/40">
                  {t.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </header>

      {/* ═══ TAB CONTENT ═══ */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {tab === "feed" && (
          <FeedTab
            feed={feed}
            currentIdx={currentIdx}
            swipeDir={swipeDir}
            onLike={handleLike}
            onPass={handlePass}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseLeave}
          />
        )}
        {tab === "requests" && (
          <RequestsTab
            requests={requests}
            onAccept={handleAccept}
            onReject={handleReject}
          />
        )}
        {tab === "connections" && <ConnectionsTab connections={connections} />}
      </main>

      {/* iOS safe area */}
      <div className="h-6" />
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33%      { transform: translate(30px, -50px) scale(1.1); }
          66%      { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

export default TechTinderHome;
