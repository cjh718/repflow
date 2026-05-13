import { useState, useEffect, useRef, useCallback } from "react";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
  bg: "#0A0A0B",
  surface: "#141416",
  card: "#1C1C1F",
  border: "#2A2A2E",
  accent: "#C8FF00",        // neon lime
  accentOrange: "#FF5C1A",
  accentDim: "#8AAF00",
  white: "#FFFFFF",
  grey1: "#F0F0F0",
  grey2: "#A0A0A8",
  grey3: "#505058",
  premium: "#FFB800",
  red: "#FF3B30",
  green: "#30D158",
};

const FONT = {
  display: "'Barlow Condensed', 'Impact', sans-serif",
  body: "'DM Sans', 'Segoe UI', sans-serif",
  mono: "'JetBrains Mono', 'Courier New', monospace",
};

// API Configuration
const API_URL = 'http://localhost:5001/api';

// ─── Workout Data ─────────────────────────────────────────────────────────────
const WORKOUT_DB = {
  beginner: {
    core: [
      { id: 1, name: "Plank Hold", reps: null, duration: 20, rounds: 3, rest: 15, muscle: "Core", emoji: "🔥", desc: "Straight body, engage abs" },
      { id: 2, name: "Crunches", reps: 15, duration: null, rounds: 3, rest: 15, muscle: "Core", emoji: "💪", desc: "Slow controlled motion" },
      { id: 3, name: "Leg Raises", reps: 12, duration: null, rounds: 3, rest: 20, muscle: "Lower Core", emoji: "⚡", desc: "Keep lower back flat" },
      { id: 4, name: "Dead Bug", reps: 10, duration: null, rounds: 3, rest: 15, muscle: "Core", emoji: "🦎", desc: "Opposite arm & leg" },
    ],
    fullbody: [
      { id: 5, name: "Jumping Jacks", reps: null, duration: 30, rounds: 3, rest: 15, muscle: "Full Body", emoji: "🌟", desc: "Full range of motion" },
      { id: 6, name: "Bodyweight Squats", reps: 15, duration: null, rounds: 3, rest: 20, muscle: "Legs", emoji: "🦵", desc: "Chest up, knees out" },
      { id: 7, name: "Push-Ups (Knee)", reps: 12, duration: null, rounds: 3, rest: 20, muscle: "Chest/Arms", emoji: "🙌", desc: "Modified for beginners" },
      { id: 8, name: "Mountain Climbers", reps: null, duration: 20, rounds: 3, rest: 15, muscle: "Core/Cardio", emoji: "🏔️", desc: "Drive knees to chest" },
    ],
    hiit: [
      { id: 9, name: "High Knees", reps: null, duration: 20, rounds: 4, rest: 10, muscle: "Cardio", emoji: "🏃", desc: "Pump those arms" },
      { id: 10, name: "Butt Kicks", reps: null, duration: 20, rounds: 4, rest: 10, muscle: "Cardio", emoji: "🦶", desc: "Heels to glutes" },
      { id: 11, name: "Jump Squats", reps: 10, duration: null, rounds: 4, rest: 15, muscle: "Legs/Cardio", emoji: "⬆️", desc: "Land softly" },
    ],
    stretching: [
      { id: 12, name: "Child's Pose", reps: null, duration: 30, rounds: 2, rest: 5, muscle: "Back/Hips", emoji: "🧘", desc: "Breathe deeply" },
      { id: 13, name: "Hip Flexor Stretch", reps: null, duration: 25, rounds: 2, rest: 5, muscle: "Hips", emoji: "🌀", desc: "Each side" },
      { id: 14, name: "Hamstring Stretch", reps: null, duration: 25, rounds: 2, rest: 5, muscle: "Hamstrings", emoji: "🦿", desc: "Keep back straight" },
    ],
  },
  intermediate: {
    core: [
      { id: 20, name: "Plank", reps: null, duration: 40, rounds: 4, rest: 15, muscle: "Core", emoji: "🔥", desc: "Hips level, squeeze glutes" },
      { id: 21, name: "Bicycle Crunches", reps: 20, duration: null, rounds: 4, rest: 15, muscle: "Obliques", emoji: "🚲", desc: "Full rotation each side" },
      { id: 22, name: "V-Ups", reps: 15, duration: null, rounds: 4, rest: 20, muscle: "Core", emoji: "✌️", desc: "Reach for feet" },
      { id: 23, name: "Russian Twists", reps: 20, duration: null, rounds: 4, rest: 15, muscle: "Obliques", emoji: "🌪️", desc: "Feet off ground" },
    ],
    fullbody: [
      { id: 24, name: "Burpees", reps: 10, duration: null, rounds: 4, rest: 20, muscle: "Full Body", emoji: "💥", desc: "Chest to ground" },
      { id: 25, name: "Jump Lunges", reps: 12, duration: null, rounds: 4, rest: 20, muscle: "Legs", emoji: "⚡", desc: "Switch legs in air" },
      { id: 26, name: "Push-Ups", reps: 15, duration: null, rounds: 4, rest: 20, muscle: "Chest/Arms", emoji: "💪", desc: "Full range of motion" },
      { id: 27, name: "Plank Rows", reps: 12, duration: null, rounds: 4, rest: 20, muscle: "Back/Core", emoji: "🏋️", desc: "Alternate arms" },
    ],
    hiit: [
      { id: 28, name: "Box Jumps", reps: 10, duration: null, rounds: 5, rest: 15, muscle: "Power/Legs", emoji: "📦", desc: "Land with soft knees" },
      { id: 29, name: "Tuck Jumps", reps: 8, duration: null, rounds: 5, rest: 20, muscle: "Explosive Power", emoji: "🦘", desc: "Knees to chest" },
      { id: 30, name: "Speed Skaters", reps: null, duration: 25, rounds: 5, rest: 10, muscle: "Cardio/Legs", emoji: "⛸️", desc: "Wide lateral jumps" },
    ],
  },
  advanced: {
    core: [
      { id: 40, name: "Dragon Flag", reps: 8, duration: null, rounds: 5, rest: 20, muscle: "Core", emoji: "🐉", desc: "Control the descent" },
      { id: 41, name: "L-Sit Hold", reps: null, duration: 15, rounds: 5, rest: 20, muscle: "Core/Strength", emoji: "🔱", desc: "Legs parallel to floor" },
      { id: 42, name: "Ab Wheel Rollout", reps: 10, duration: null, rounds: 5, rest: 25, muscle: "Core", emoji: "🎡", desc: "Full extension" },
    ],
    fullbody: [
      { id: 43, name: "Pistol Squats", reps: 8, duration: null, rounds: 5, rest: 25, muscle: "Legs/Balance", emoji: "🎯", desc: "Each leg, full depth" },
      { id: 44, name: "Archer Push-Ups", reps: 10, duration: null, rounds: 5, rest: 25, muscle: "Chest/Arms", emoji: "🏹", desc: "Full arm extension" },
      { id: 45, name: "Muscle-Ups", reps: 5, duration: null, rounds: 5, rest: 30, muscle: "Full Upper", emoji: "🦍", desc: "Explosive pull to dip" },
    ],
  },
};

const CATEGORIES = [
  { key: "core", label: "Core", emoji: "🔥", color: "#FF5C1A" },
  { key: "fullbody", label: "Full Body", emoji: "⚡", color: "#C8FF00" },
  { key: "hiit", label: "HIIT", emoji: "💥", color: "#FF2D55" },
  { key: "stretching", label: "Stretch", emoji: "🧘", color: "#5AC8FA" },
  { key: "chest", label: "Chest", emoji: "💪", color: "#C8FF00" },
  { key: "arms", label: "Arms", emoji: "🦾", color: "#FF9F0A" },
  { key: "legs", label: "Legs", emoji: "🦵", color: "#FF5C1A" },
  { key: "fatburn", label: "Fat Burn", emoji: "🔆", color: "#FF2D55" },
];

const LEVELS = [
  { key: "beginner", label: "Beginner", desc: "Start your journey", color: C.green },
  { key: "intermediate", label: "Intermediate", desc: "Level up", color: C.accent },
  { key: "advanced", label: "Advanced", desc: "Push limits", color: C.accentOrange },
];

const DURATIONS = [5, 10, 20, 30];

// ─── Animated Exercise Illustration ──────────────────────────────────────────
function ExerciseAnimation({ exercise, isResting }) {
  const frames = ["🏋️", exercise.emoji, "💪", exercise.emoji];
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    if (isResting) return;
    const t = setInterval(() => setFrame(f => (f + 1) % frames.length), 600);
    return () => clearInterval(t);
  }, [isResting]);

  return (
    <div style={{
      width: 160, height: 160, borderRadius: 24,
      background: `radial-gradient(circle at 40% 40%, ${C.card} 0%, ${C.bg} 100%)`,
      border: `2px solid ${isResting ? C.grey3 : C.accent}20`,
      display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden",
      boxShadow: isResting ? "none" : `0 0 40px ${C.accent}20`,
      transition: "all 0.4s ease",
    }}>
      {!isResting && [0, 1, 2].map(i => (
        <div key={i} style={{
          position: "absolute",
          width: 60 + i * 35, height: 60 + i * 35,
          borderRadius: "50%",
          border: `1px solid ${C.accent}${["40", "25", "10"][i]}`,
          animation: `pulse ${1.2 + i * 0.3}s ease-in-out infinite`,
          animationDelay: `${i * 0.15}s`,
        }} />
      ))}
      <span style={{ fontSize: 64, zIndex: 1, transition: "all 0.3s ease",
        filter: isResting ? "grayscale(1) opacity(0.5)" : "none",
        animation: isResting ? "none" : "bounce 0.6s ease infinite alternate",
      }}>
        {isResting ? "😮‍💨" : frames[frame]}
      </span>
    </div>
  );
}

// ─── Circular Timer ───────────────────────────────────────────────────────────
function CircularTimer({ value, max, color, size = 220, strokeW = 12 }) {
  const r = (size - strokeW * 2) / 2;
  const circ = 2 * Math.PI * r;
  const progress = max > 0 ? (value / max) : 0;
  const offset = circ * (1 - progress);

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none"
          stroke={C.border} strokeWidth={strokeW} />
        <circle cx={size/2} cy={size/2} r={r} fill="none"
          stroke={color} strokeWidth={strokeW}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.9s linear", filter: `drop-shadow(0 0 8px ${color}80)` }}
        />
      </svg>
      <div style={{
        position: "absolute", inset: 0, display: "flex",
        flexDirection: "column", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{
          fontFamily: FONT.display, fontSize: 68, fontWeight: 900,
          color: C.white, letterSpacing: "-2px", lineHeight: 1,
        }}>{value}</div>
        <div style={{ fontFamily: FONT.body, fontSize: 12, color: C.grey2, marginTop: 2 }}>SECONDS</div>
      </div>
    </div>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────
function ProgressBar({ value, max, color = C.accent }) {
  return (
    <div style={{ width: "100%", height: 4, background: C.border, borderRadius: 2, overflow: "hidden" }}>
      <div style={{
        height: "100%", width: `${(value / max) * 100}%`,
        background: color, borderRadius: 2,
        transition: "width 0.5s ease",
        boxShadow: `0 0 8px ${color}80`,
      }} />
    </div>
  );
}

// ─── Badge ────────────────────────────────────────────────────────────────────
function Badge({ label, color = C.accent, small }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: small ? "2px 8px" : "4px 12px",
      borderRadius: 99, border: `1px solid ${color}60`,
      background: `${color}15`,
      fontFamily: FONT.body, fontSize: small ? 10 : 11,
      fontWeight: 700, color, letterSpacing: "0.08em",
      textTransform: "uppercase",
    }}>{label}</span>
  );
}

// ─── Screen: Splash ───────────────────────────────────────────────────────────
function SplashScreen({ onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2200); return () => clearTimeout(t); }, [onDone]);
  return (
    <div style={{
      ...screen(), background: `radial-gradient(ellipse at 30% 20%, ${C.accent}18 0%, transparent 60%), ${C.bg}`,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{ animation: "fadeUp 0.6s ease forwards", opacity: 0, textAlign: "center" }}>
        <div style={{
          width: 80, height: 80, borderRadius: 22,
          background: `linear-gradient(135deg, ${C.accent} 0%, #8AFF00 100%)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 20, marginLeft: "auto", marginRight: "auto",
          boxShadow: `0 20px 60px ${C.accent}40`,
        }}>
          <span style={{ fontSize: 38 }}>⚡</span>
        </div>
        <div style={{ fontFamily: FONT.display, fontSize: 52, fontWeight: 900, color: C.white, letterSpacing: "-1px" }}>
          REP<span style={{ color: C.accent }}>FLOW</span>
        </div>
        <div style={{ fontFamily: FONT.body, fontSize: 14, color: C.grey2, marginTop: 6, letterSpacing: "0.3em" }}>
          GUIDED WORKOUT FLOW
        </div>
      </div>
      <div style={{
        position: "absolute", bottom: 60,
        animation: "fadeUp 0.6s 1.2s ease forwards", opacity: 0,
        display: "flex", gap: 6,
      }}>
        {[0,1,2].map(i => (
          <div key={i} style={{
            width: i === 1 ? 20 : 6, height: 6, borderRadius: 3,
            background: i === 1 ? C.accent : C.grey3,
            animation: `pulse 1s ${i * 0.2}s ease infinite`,
          }} />
        ))}
      </div>
    </div>
  );
}

// ─── Screen: Login ────────────────────────────────────────────────────────────
function LoginScreen({ onLogin, onSwitchToSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }
      
      // Store token and user data
      localStorage.setItem('repflow_token', data.token);
      localStorage.setItem('repflow_user', JSON.stringify(data.user));
      
      onLogin(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      ...screen(),
      background: `radial-gradient(ellipse at 70% 10%, ${C.accentOrange}20 0%, transparent 50%),
                   radial-gradient(ellipse at 20% 80%, ${C.accent}12 0%, transparent 50%), ${C.bg}`,
      display: "flex", flexDirection: "column", padding: "0 24px 40px", overflowY: "auto",
    }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", paddingTop: 60 }}>
        <div style={{ animation: "fadeUp 0.5s ease forwards" }}>
          <div style={{ fontFamily: FONT.display, fontSize: 13, letterSpacing: "0.4em", color: C.accent, marginBottom: 16, fontWeight: 700 }}>
            ⚡ WELCOME BACK
          </div>
          <div style={{ fontFamily: FONT.display, fontSize: 54, fontWeight: 900, color: C.white, lineHeight: 0.95, marginBottom: 32, letterSpacing: "-1px" }}>
            LOGIN TO<br /><span style={{ color: C.accent }}>YOUR ACCOUNT</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ animation: "fadeUp 0.5s 0.1s ease forwards", opacity: 0 }}>
          <div style={{ marginBottom: 20 }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%", padding: "18px 16px",
                background: C.card, border: `1px solid ${C.border}`,
                borderRadius: 14, color: C.white, fontFamily: FONT.body,
                fontSize: 16, outline: "none",
              }}
              required
            />
          </div>
          <div style={{ marginBottom: 24 }}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%", padding: "18px 16px",
                background: C.card, border: `1px solid ${C.border}`,
                borderRadius: 14, color: C.white, fontFamily: FONT.body,
                fontSize: 16, outline: "none",
              }}
              required
            />
          </div>
          
          {error && (
            <div style={{
              color: C.red, fontSize: 13, marginBottom: 16,
              textAlign: "center", fontFamily: FONT.body,
            }}>{error}</div>
          )}
          
          <button type="submit" disabled={loading} style={{
            ...btnPrimary(),
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}>
            {loading ? "LOGGING IN..." : "LOG IN →"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: 24 }}>
          <span style={{ color: C.grey2, fontSize: 14 }}>Don't have an account? </span>
          <button onClick={onSwitchToSignup} style={{
            background: "none", border: "none", color: C.accent,
            fontWeight: 700, cursor: "pointer", fontSize: 14,
          }}>Sign up</button>
        </div>
      </div>
    </div>
  );
}

// ─── Screen: Signup ───────────────────────────────────────────────────────────
function SignupScreen({ onSignup, onSwitchToLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name: name || email.split('@')[0] })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }
      
      // Store token and user data
      localStorage.setItem('repflow_token', data.token);
      localStorage.setItem('repflow_user', JSON.stringify(data.user));
      
      onSignup(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      ...screen(),
      background: `radial-gradient(ellipse at 70% 10%, ${C.accentOrange}20 0%, transparent 50%),
                   radial-gradient(ellipse at 20% 80%, ${C.accent}12 0%, transparent 50%), ${C.bg}`,
      display: "flex", flexDirection: "column", padding: "0 24px 40px", overflowY: "auto",
    }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", paddingTop: 40 }}>
        <div style={{ animation: "fadeUp 0.5s ease forwards" }}>
          <div style={{ fontFamily: FONT.display, fontSize: 13, letterSpacing: "0.4em", color: C.accent, marginBottom: 16, fontWeight: 700 }}>
            ⚡ JOIN THE MOVEMENT
          </div>
          <div style={{ fontFamily: FONT.display, fontSize: 54, fontWeight: 900, color: C.white, lineHeight: 0.95, marginBottom: 32, letterSpacing: "-1px" }}>
            CREATE YOUR<br /><span style={{ color: C.accent }}>FREE ACCOUNT</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ animation: "fadeUp 0.5s 0.1s ease forwards", opacity: 0 }}>
          <div style={{ marginBottom: 16 }}>
            <input
              type="text"
              placeholder="Display Name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: "100%", padding: "18px 16px",
                background: C.card, border: `1px solid ${C.border}`,
                borderRadius: 14, color: C.white, fontFamily: FONT.body,
                fontSize: 16, outline: "none",
              }}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%", padding: "18px 16px",
                background: C.card, border: `1px solid ${C.border}`,
                borderRadius: 14, color: C.white, fontFamily: FONT.body,
                fontSize: 16, outline: "none",
              }}
              required
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <input
              type="password"
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%", padding: "18px 16px",
                background: C.card, border: `1px solid ${C.border}`,
                borderRadius: 14, color: C.white, fontFamily: FONT.body,
                fontSize: 16, outline: "none",
              }}
              required
            />
          </div>
          <div style={{ marginBottom: 24 }}>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{
                width: "100%", padding: "18px 16px",
                background: C.card, border: `1px solid ${C.border}`,
                borderRadius: 14, color: C.white, fontFamily: FONT.body,
                fontSize: 16, outline: "none",
              }}
              required
            />
          </div>
          
          {error && (
            <div style={{
              color: C.red, fontSize: 13, marginBottom: 16,
              textAlign: "center", fontFamily: FONT.body,
            }}>{error}</div>
          )}
          
          <button type="submit" disabled={loading} style={{
            ...btnPrimary(),
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}>
            {loading ? "CREATING ACCOUNT..." : "SIGN UP →"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: 24 }}>
          <span style={{ color: C.grey2, fontSize: 14 }}>Already have an account? </span>
          <button onClick={onSwitchToLogin} style={{
            background: "none", border: "none", color: C.accent,
            fontWeight: 700, cursor: "pointer", fontSize: 14,
          }}>Log in</button>
        </div>
      </div>
    </div>
  );
}

// ─── Screen: Onboarding ───────────────────────────────────────────────────────
function OnboardingScreen({ onGetStarted }) {
  return (
    <div style={{
      ...screen(),
      background: `radial-gradient(ellipse at 70% 10%, ${C.accentOrange}20 0%, transparent 50%),
                   radial-gradient(ellipse at 20% 80%, ${C.accent}12 0%, transparent 50%), ${C.bg}`,
      display: "flex", flexDirection: "column", padding: "0 24px 40px",
    }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", paddingTop: 60 }}>
        <div style={{ animation: "fadeUp 0.5s ease forwards" }}>
          <div style={{ fontFamily: FONT.display, fontSize: 13, letterSpacing: "0.4em", color: C.accent, marginBottom: 16, fontWeight: 700 }}>
            ⚡ NO GYM NEEDED
          </div>
          <div style={{ fontFamily: FONT.display, fontSize: 54, fontWeight: 900, color: C.white, lineHeight: 0.95, marginBottom: 20, letterSpacing: "-1px" }}>
            TRAIN<br /><span style={{ color: C.accent }}>SMARTER.</span><br />FLOW<br />HARDER.
          </div>
          <div style={{ fontFamily: FONT.body, fontSize: 15, color: C.grey2, lineHeight: 1.6, marginBottom: 32 }}>
            Timer-guided workouts for every level. Press start and follow along — no thinking required.
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginBottom: 40, animation: "fadeUp 0.5s 0.1s ease forwards", opacity: 0 }}>
          {[["200+", "Exercises"], ["50+", "Workouts"], ["3", "Levels"]].map(([v, l]) => (
            <div key={l} style={{
              flex: 1, padding: "14px 8px", background: C.card, borderRadius: 14,
              border: `1px solid ${C.border}`, textAlign: "center",
            }}>
              <div style={{ fontFamily: FONT.display, fontSize: 22, fontWeight: 900, color: C.accent }}>{v}</div>
              <div style={{ fontFamily: FONT.body, fontSize: 11, color: C.grey2, marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, animation: "fadeUp 0.5s 0.2s ease forwards", opacity: 0 }}>
        <button onClick={onGetStarted} style={btnPrimary()}>GET STARTED</button>
      </div>
    </div>
  );
}

// ─── Screen: Home Dashboard ───────────────────────────────────────────────────
function HomeScreen({ onStartWorkout, onProfile, onPremium, isPremium, streakDays, completedWorkouts, user, onLogout }) {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
  const weekDays = ["M", "T", "W", "T", "F", "S", "S"];
  const activeDay = new Date().getDay();

  return (
    <div style={{ ...screen(), overflowY: "auto" }}>
      <div style={{
        padding: "52px 24px 20px",
        background: `linear-gradient(180deg, ${C.surface} 0%, transparent 100%)`,
        position: "sticky", top: 0, zIndex: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: FONT.body, fontSize: 12, color: C.grey2, letterSpacing: "0.2em" }}>{today.toUpperCase()}</div>
            <div style={{ fontFamily: FONT.display, fontSize: 28, fontWeight: 900, color: C.white, letterSpacing: "-0.5px" }}>
              LET'S FLOW 🔥
            </div>
            {user && (
              <div style={{ fontFamily: FONT.body, fontSize: 12, color: C.accent, marginTop: 4 }}>
                Welcome back, {user.name}!
              </div>
            )}
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button onClick={onProfile} style={{
              width: 40, height: 40, borderRadius: 12,
              background: C.card, border: `1px solid ${C.border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", fontSize: 18,
            }}>👤</button>
          </div>
        </div>
      </div>

      <div style={{ padding: "0 24px 100px" }}>
        <div style={{
          background: `linear-gradient(135deg, ${C.accent}18 0%, transparent 100%)`,
          border: `1px solid ${C.accent}30`, borderRadius: 20, padding: "20px",
          marginBottom: 24, display: "flex", alignItems: "center", gap: 16,
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: `linear-gradient(135deg, ${C.accent} 0%, #8AFF00 100%)`,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26,
            boxShadow: `0 8px 24px ${C.accent}40`,
          }}>🔥</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: FONT.display, fontSize: 28, fontWeight: 900, color: C.accent }}>
              {streakDays} DAY STREAK
            </div>
            <div style={{ fontFamily: FONT.body, fontSize: 12, color: C.grey2 }}>
              Keep it up! Train today to maintain your streak.
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", gap: 8, justifyContent: "space-between" }}>
            {weekDays.map((d, i) => {
              const idx = i === 6 ? 0 : i + 1;
              const isToday = idx === activeDay;
              const done = i < (activeDay - 1 + 7) % 7 && streakDays > i;
              return (
                <div key={i} style={{
                  flex: 1, padding: "10px 4px", borderRadius: 12,
                  background: isToday ? C.accent : done ? `${C.accent}20` : C.card,
                  border: `1px solid ${isToday ? C.accent : done ? C.accentDim + "50" : C.border}`,
                  textAlign: "center",
                  boxShadow: isToday ? `0 4px 16px ${C.accent}40` : "none",
                }}>
                  <div style={{ fontFamily: FONT.body, fontSize: 10, color: isToday ? C.bg : done ? C.accent : C.grey3, fontWeight: 700 }}>{d}</div>
                  <div style={{ fontSize: 14, marginTop: 4 }}>{done ? "✓" : isToday ? "⚡" : "·"}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <SectionLabel>QUICK START</SectionLabel>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
            {[
              { label: "5 Min Blast", sub: "High Intensity", dur: 5, cat: "hiit", level: "beginner", emoji: "⚡", color: C.accentOrange },
              { label: "Core Focus", sub: "Beginner Friendly", dur: 10, cat: "core", level: "beginner", emoji: "🔥", color: C.accent },
              { label: "Full Body", sub: "Intermediate", dur: 20, cat: "fullbody", level: "intermediate", emoji: "💥", color: "#FF2D55" },
              { label: "Stretch Flow", sub: "Recovery", dur: 10, cat: "stretching", level: "beginner", emoji: "🧘", color: "#5AC8FA" },
            ].map((w, i) => (
              <button key={i} onClick={() => onStartWorkout(w)} style={{
                background: C.card, border: `1px solid ${C.border}`, borderRadius: 18,
                padding: "18px 16px", cursor: "pointer", textAlign: "left", position: "relative", overflow: "hidden",
              }}>
                <div style={{
                  position: "absolute", top: 0, right: 0, width: 80, height: 80,
                  background: `radial-gradient(circle, ${w.color}20 0%, transparent 70%)`,
                }} />
                <div style={{ fontSize: 24, marginBottom: 8 }}>{w.emoji}</div>
                <div style={{ fontFamily: FONT.body, fontSize: 14, fontWeight: 700, color: C.white }}>{w.label}</div>
                <div style={{ fontFamily: FONT.body, fontSize: 11, color: C.grey2, marginTop: 2 }}>{w.sub}</div>
                <div style={{
                  marginTop: 10, display: "inline-flex", alignItems: "center",
                  gap: 4, fontFamily: FONT.mono, fontSize: 11, color: w.color, fontWeight: 700,
                }}>⏱ {w.dur} MIN</div>
              </button>
            ))}
          </div>
        </div>

        <SectionLabel>ALL WORKOUTS</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
          {CATEGORIES.map((cat) => (
            <button key={cat.key} onClick={() => onStartWorkout({ cat: cat.key, level: "beginner", dur: 10, label: cat.label, emoji: cat.emoji, color: cat.color })}
              style={{
                background: C.card, border: `1px solid ${C.border}`,
                borderLeft: `3px solid ${cat.color}`, borderRadius: 14,
                padding: "16px 14px", cursor: "pointer", textAlign: "left",
                display: "flex", alignItems: "center", gap: 12,
              }}>
              <span style={{ fontSize: 22 }}>{cat.emoji}</span>
              <div>
                <div style={{ fontFamily: FONT.body, fontSize: 13, fontWeight: 700, color: C.white }}>{cat.label}</div>
                <div style={{ fontFamily: FONT.body, fontSize: 10, color: C.grey2 }}>
                  {WORKOUT_DB.beginner[cat.key]?.length || 3} exercises
                </div>
              </div>
            </button>
          ))}
        </div>

        <div style={{ marginTop: 28 }}>
          <SectionLabel>YOUR PROGRESS</SectionLabel>
          <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
            {[
              { label: "Workouts", value: completedWorkouts, unit: "done" },
              { label: "Calories", value: completedWorkouts * 142, unit: "kcal" },
              { label: "Minutes", value: completedWorkouts * 12, unit: "active" },
            ].map(s => (
              <div key={s.label} style={{
                flex: 1, background: C.card, borderRadius: 16, padding: "16px 12px",
                border: `1px solid ${C.border}`, textAlign: "center",
              }}>
                <div style={{ fontFamily: FONT.display, fontSize: 26, fontWeight: 900, color: C.accent }}>{s.value}</div>
                <div style={{ fontFamily: FONT.body, fontSize: 10, color: C.grey2 }}>{s.unit}</div>
                <div style={{ fontFamily: FONT.body, fontSize: 11, color: C.grey3, marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Screen: Workout Setup ────────────────────────────────────────────────────
function WorkoutSetupScreen({ initial, onBack, onBegin }) {
  const [level, setLevel] = useState(initial?.level || "beginner");
  const [category, setCategory] = useState(initial?.cat || "core");
  const [duration, setDuration] = useState(initial?.dur || 10);

  const exercises = WORKOUT_DB[level]?.[category] || WORKOUT_DB.beginner.core;

  return (
    <div style={{ ...screen(), overflowY: "auto" }}>
      <div style={{ padding: "52px 24px 100px" }}>
        <button onClick={onBack} style={backBtn()}>← Back</button>

        <div style={{ fontFamily: FONT.display, fontSize: 36, fontWeight: 900, color: C.white, marginBottom: 24, letterSpacing: "-0.5px" }}>
          CUSTOMIZE<br /><span style={{ color: C.accent }}>WORKOUT</span>
        </div>

        <SectionLabel>DIFFICULTY LEVEL</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12, marginBottom: 24 }}>
          {LEVELS.map(l => (
            <button key={l.key} onClick={() => setLevel(l.key)} style={{
              background: level === l.key ? `${l.color}15` : C.card,
              border: `2px solid ${level === l.key ? l.color : C.border}`,
              borderRadius: 16, padding: "16px 18px", cursor: "pointer", textAlign: "left",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              transition: "all 0.2s ease",
              boxShadow: level === l.key ? `0 4px 20px ${l.color}25` : "none",
            }}>
              <div>
                <div style={{ fontFamily: FONT.body, fontSize: 15, fontWeight: 700, color: level === l.key ? l.color : C.white }}>{l.label}</div>
                <div style={{ fontFamily: FONT.body, fontSize: 12, color: C.grey2 }}>{l.desc}</div>
              </div>
              {level === l.key && <div style={{ color: l.color, fontSize: 18 }}>✓</div>}
            </button>
          ))}
        </div>

        <SectionLabel>WORKOUT TYPE</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 12, marginBottom: 24 }}>
          {CATEGORIES.map(c => (
            <button key={c.key} onClick={() => setCategory(c.key)} style={{
              background: category === c.key ? `${c.color}15` : C.card,
              border: `2px solid ${category === c.key ? c.color : C.border}`,
              borderRadius: 14, padding: "14px 12px", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 10,
              transition: "all 0.2s ease",
            }}>
              <span style={{ fontSize: 20 }}>{c.emoji}</span>
              <span style={{ fontFamily: FONT.body, fontSize: 13, fontWeight: 700, color: category === c.key ? c.color : C.white }}>
                {c.label}
              </span>
            </button>
          ))}
        </div>

        <SectionLabel>DURATION</SectionLabel>
        <div style={{ display: "flex", gap: 10, marginTop: 12, marginBottom: 32 }}>
          {DURATIONS.map(d => (
            <button key={d} onClick={() => setDuration(d)} style={{
              flex: 1, padding: "14px 0",
              background: duration === d ? C.accent : C.card,
              border: `2px solid ${duration === d ? C.accent : C.border}`,
              borderRadius: 14, cursor: "pointer",
              fontFamily: FONT.display, fontSize: 18, fontWeight: 900,
              color: duration === d ? C.bg : C.white,
              transition: "all 0.2s ease",
              boxShadow: duration === d ? `0 4px 16px ${C.accent}40` : "none",
            }}>{d}<br /><span style={{ fontSize: 10, fontWeight: 400 }}>MIN</span></button>
          ))}
        </div>

        <div style={{
          background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: "20px",
          marginBottom: 24,
        }}>
          <div style={{ fontFamily: FONT.body, fontSize: 12, color: C.grey2, marginBottom: 12, letterSpacing: "0.15em" }}>WORKOUT PREVIEW</div>
          {exercises.slice(0, 3).map((ex, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "10px 0", borderBottom: i < 2 ? `1px solid ${C.border}` : "none",
            }}>
              <span style={{ fontSize: 20 }}>{ex.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: FONT.body, fontSize: 13, fontWeight: 700, color: C.white }}>{ex.name}</div>
                <div style={{ fontFamily: FONT.body, fontSize: 11, color: C.grey2 }}>
                  {ex.duration ? `${ex.duration}s` : `${ex.reps} reps`} × {ex.rounds} rounds · {ex.rest}s rest
                </div>
              </div>
              <Badge label={ex.muscle} small />
            </div>
          ))}
          {exercises.length > 3 && (
            <div style={{ fontFamily: FONT.body, fontSize: 12, color: C.grey2, paddingTop: 10 }}>
              +{exercises.length - 3} more exercises
            </div>
          )}
        </div>

        <button onClick={() => onBegin({ exercises, level, category, duration })} style={btnPrimary()}>
          ⚡ START WORKOUT
        </button>
      </div>
    </div>
  );
}

// ─── Screen: Active Workout ───────────────────────────────────────────────────
function ActiveWorkoutScreen({ config, isPremium, onComplete, onBack }) {
  const { exercises } = config;
  const [exIdx, setExIdx] = useState(0);
  const [round, setRound] = useState(1);
  const [phase, setPhase] = useState("work");
  const [timeLeft, setTimeLeft] = useState(3);
  const [paused, setPaused] = useState(false);
  const [finished, setFinished] = useState(false);
  const [countdownDone, setCountdownDone] = useState(false);

  const ex = exercises[exIdx];
  const totalExercises = exercises.length;
  const workDuration = ex?.duration || 30;
  const restDuration = ex?.rest || 15;

  useEffect(() => {
    if (countdownDone) return;
    const t = setInterval(() => {
      setTimeLeft(v => {
        if (v <= 1) { clearInterval(t); setCountdownDone(true); setPhase("work"); setTimeLeft(workDuration); return 0; }
        return v - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [countdownDone, workDuration]);

  useEffect(() => {
    if (!countdownDone || paused || finished) return;
    const t = setInterval(() => {
      setTimeLeft(v => {
        if (v <= 1) {
          clearInterval(t);
          handleTimerEnd();
          return 0;
        }
        return v - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [countdownDone, paused, phase, exIdx, round, finished]);

  function handleTimerEnd() {
    if (phase === "work") {
      if (round < ex.rounds) {
        setPhase("rest");
        setTimeLeft(restDuration);
      } else {
        if (exIdx + 1 < totalExercises) {
          if (isPremium) {
            advanceExercise();
          } else {
            setPhase("manual");
          }
        } else {
          setFinished(true);
        }
      }
    } else if (phase === "rest") {
      setPhase("work");
      setRound(r => r + 1);
      setTimeLeft(workDuration);
    }
  }

  function advanceExercise() {
    const next = exIdx + 1;
    if (next < totalExercises) {
      setExIdx(next);
      setRound(1);
      setPhase("work");
      setTimeLeft(exercises[next].duration || 30);
    } else {
      setFinished(true);
    }
  }

  const isResting = phase === "rest";
  const isManual = phase === "manual";
  const timerMax = phase === "work" ? workDuration : phase === "rest" ? restDuration : 3;
  const timerColor = isResting ? "#5AC8FA" : phase === "manual" ? C.premium : C.accent;

  if (finished) {
    return (
      <div style={{
        ...screen(),
        background: `radial-gradient(ellipse at 50% 30%, ${C.accent}20 0%, transparent 60%), ${C.bg}`,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "40px 24px",
      }}>
        <div style={{ fontSize: 80, marginBottom: 16 }}>🏆</div>
        <div style={{ fontFamily: FONT.display, fontSize: 48, fontWeight: 900, color: C.white, textAlign: "center", letterSpacing: "-1px" }}>
          WORKOUT<br /><span style={{ color: C.accent }}>COMPLETE!</span>
        </div>
        <div style={{ fontFamily: FONT.body, fontSize: 14, color: C.grey2, textAlign: "center", marginTop: 12, marginBottom: 32 }}>
          You crushed it! Keep the streak alive tomorrow.
        </div>
        <div style={{ display: "flex", gap: 16, marginBottom: 40 }}>
          {[["🔥", `${exercises.length}`, "Exercises"], ["⏱", config.duration, "Minutes"], ["💪", exercises.reduce((a, e) => a + e.rounds, 0), "Rounds"]].map(([e, v, l]) => (
            <div key={l} style={{ textAlign: "center", background: C.card, borderRadius: 16, padding: "16px 20px", border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 20 }}>{e}</div>
              <div style={{ fontFamily: FONT.display, fontSize: 24, fontWeight: 900, color: C.accent }}>{v}</div>
              <div style={{ fontFamily: FONT.body, fontSize: 10, color: C.grey2 }}>{l}</div>
            </div>
          ))}
        </div>
        <button onClick={onComplete} style={btnPrimary()}>BACK TO HOME</button>
      </div>
    );
  }

  return (
    <div style={{ ...screen(), background: C.bg, display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "52px 20px 12px", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={onBack} style={{ ...iconBtn(), fontSize: 16 }}>✕</button>
        <div style={{ flex: 1 }}>
          <ProgressBar value={exIdx} max={totalExercises} color={C.accent} />
        </div>
        <div style={{ fontFamily: FONT.mono, fontSize: 12, color: C.grey2 }}>
          {exIdx + 1}/{totalExercises}
        </div>
      </div>

      <div style={{ textAlign: "center", padding: "8px 0 4px" }}>
        {!countdownDone ? (
          <Badge label="GET READY" color={C.premium} />
        ) : isResting ? (
          <Badge label="REST" color="#5AC8FA" />
        ) : isManual ? (
          <Badge label="DONE — TAP NEXT" color={C.premium} />
        ) : (
          <Badge label={`ROUND ${round} / ${ex.rounds}`} color={C.accent} />
        )}
      </div>

      <div style={{ textAlign: "center", padding: "12px 24px 0" }}>
        <div style={{ fontFamily: FONT.display, fontSize: 32, fontWeight: 900, color: C.white, letterSpacing: "-0.5px" }}>
          {!countdownDone ? "GET READY" : isResting ? "REST" : ex.name}
        </div>
        {countdownDone && !isResting && (
          <div style={{ fontFamily: FONT.body, fontSize: 13, color: C.grey2, marginTop: 4 }}>{ex.desc}</div>
        )}
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24, padding: "8px 0" }}>
        <ExerciseAnimation exercise={ex} isResting={isResting} />
        <CircularTimer value={timeLeft} max={timerMax} color={timerColor} />
        {ex.reps && !ex.duration && countdownDone && !isResting && (
          <div style={{ fontFamily: FONT.body, fontSize: 13, color: C.grey2 }}>
            {ex.reps} reps this round
          </div>
        )}
      </div>

      <div style={{
        margin: "0 20px 12px",
        background: C.card, border: `1px solid ${C.border}`, borderRadius: 16,
        padding: "10px 16px", display: "flex", alignItems: "center", gap: 12,
      }}>
        <span style={{ fontSize: 18 }}>🎵</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: FONT.body, fontSize: 12, fontWeight: 700, color: C.white }}>Workout Beats</div>
          <div style={{ fontFamily: FONT.body, fontSize: 10, color: C.grey2 }}>EDM Mix — RepFlow Radio</div>
        </div>
        <button style={{ ...iconBtn(), fontSize: 14 }}>⏮</button>
        <button style={{ ...iconBtn(), fontSize: 14 }}>⏸</button>
        <button style={{ ...iconBtn(), fontSize: 14 }}>⏭</button>
        {!isPremium && <Badge label="FREE" small color={C.grey2} />}
      </div>

      <div style={{ padding: "0 20px 40px", display: "flex", gap: 12 }}>
        <button onClick={() => setPaused(p => !p)} style={{
          flex: 1, padding: "16px 0",
          background: paused ? C.accent : C.card,
          border: `2px solid ${paused ? C.accent : C.border}`,
          borderRadius: 16, cursor: "pointer",
          fontFamily: FONT.body, fontSize: 15, fontWeight: 700,
          color: paused ? C.bg : C.white,
          boxShadow: paused ? `0 4px 16px ${C.accent}40` : "none",
        }}>{paused ? "▶ RESUME" : "⏸ PAUSE"}</button>

        {(isManual || isPremium) && (
          <button onClick={advanceExercise} style={{
            flex: 1, padding: "16px 0",
            background: `linear-gradient(135deg, ${C.accent} 0%, #8AFF00 100%)`,
            border: "none", borderRadius: 16, cursor: "pointer",
            fontFamily: FONT.body, fontSize: 15, fontWeight: 700, color: C.bg,
            boxShadow: `0 4px 20px ${C.accent}40`,
          }}>NEXT ›</button>
        )}

        {!isManual && (
          <button onClick={advanceExercise} style={{
            width: 54, padding: "16px 0",
            background: C.card, border: `2px solid ${C.border}`, borderRadius: 16,
            cursor: "pointer", fontFamily: FONT.body, fontSize: 12, color: C.grey2,
          }}>SKIP</button>
        )}
      </div>

      {!isPremium && isManual && (
        <div style={{
          margin: "-20px 20px 30px",
          background: `${C.premium}15`, border: `1px solid ${C.premium}40`,
          borderRadius: 14, padding: "10px 14px",
          fontFamily: FONT.body, fontSize: 12, color: C.premium, textAlign: "center",
        }}>
          ⭐ Upgrade to Pro for auto-transitions + voice coaching
        </div>
      )}
    </div>
  );
}

// ─── Screen: Premium ──────────────────────────────────────────────────────────
function PremiumScreen({ onBack, onUpgrade }) {
  const [plan, setPlan] = useState("annual");
  const features = [
    ["⚡", "Auto-transition between exercises"],
    ["🎤", "Real-time voice coaching"],
    ["🎵", "Spotify & Apple Music integration"],
    ["📊", "Full workout history & analytics"],
    ["🤖", "AI-generated personalized plans"],
    ["🏆", "Exclusive workout programs"],
    ["📵", "Zero ads, forever"],
    ["⌚", "Apple Watch support (coming soon)"],
  ];

  const handleUpgrade = async () => {
    const token = localStorage.getItem('repflow_token');
    try {
      const response = await fetch(`${API_URL}/premium/upgrade`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        onUpgrade();
      } else {
        alert('Upgrade failed. Please try again.');
      }
    } catch (error) {
      console.error('Upgrade error:', error);
      alert('Network error. Please try again.');
    }
  };

  return (
    <div style={{
      ...screen(), overflowY: "auto",
      background: `radial-gradient(ellipse at 50% -10%, ${C.premium}25 0%, transparent 50%), ${C.bg}`,
    }}>
      <div style={{ padding: "52px 24px 100px" }}>
        <button onClick={onBack} style={backBtn()}>← Back</button>

        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>⭐</div>
          <div style={{ fontFamily: FONT.display, fontSize: 42, fontWeight: 900, color: C.white, letterSpacing: "-1px" }}>
            REP<span style={{ color: C.premium }}>FLOW</span> PRO
          </div>
          <div style={{ fontFamily: FONT.body, fontSize: 15, color: C.grey2, marginTop: 8 }}>
            Unlock the full guided experience
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
          {[
            { key: "annual", label: "Annual", price: "SGD 39.98", sub: "/ year · SGD 3.33/mo", save: "SAVE 33%" },
            { key: "monthly", label: "Monthly", price: "SGD 4.98", sub: "/ month", save: null },
          ].map(p => (
            <button key={p.key} onClick={() => setPlan(p.key)} style={{
              background: plan === p.key ? `${C.premium}15` : C.card,
              border: `2px solid ${plan === p.key ? C.premium : C.border}`,
              borderRadius: 18, padding: "18px 20px", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              transition: "all 0.2s ease",
              boxShadow: plan === p.key ? `0 4px 20px ${C.premium}25` : "none",
            }}>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontFamily: FONT.body, fontSize: 15, fontWeight: 700, color: plan === p.key ? C.premium : C.white }}>{p.label}</div>
                <div style={{ fontFamily: FONT.body, fontSize: 12, color: C.grey2 }}>{p.sub}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: FONT.display, fontSize: 22, fontWeight: 900, color: plan === p.key ? C.premium : C.white }}>{p.price}</div>
                {p.save && <Badge label={p.save} color={C.premium} small />}
              </div>
            </button>
          ))}
        </div>

        <div style={{ background: C.card, borderRadius: 20, padding: "20px", border: `1px solid ${C.border}`, marginBottom: 28 }}>
          {features.map(([e, f], i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 14, padding: "10px 0",
              borderBottom: i < features.length - 1 ? `1px solid ${C.border}` : "none",
            }}>
              <span style={{ fontSize: 18 }}>{e}</span>
              <span style={{ fontFamily: FONT.body, fontSize: 14, color: C.white }}>{f}</span>
              <span style={{ marginLeft: "auto", color: C.green, fontSize: 16 }}>✓</span>
            </div>
          ))}
        </div>

        <button onClick={handleUpgrade} style={{
          ...btnPrimary(),
          background: `linear-gradient(135deg, ${C.premium} 0%, #FF8C00 100%)`,
          color: "#000",
          boxShadow: `0 8px 32px ${C.premium}50`,
        }}>
          START PRO — {plan === "annual" ? "SGD 39.98/yr" : "SGD 4.98/mo"}
        </button>
        <div style={{ fontFamily: FONT.body, fontSize: 11, color: C.grey3, textAlign: "center", marginTop: 12 }}>
          Cancel anytime · Secure payment · 7-day free trial
        </div>
      </div>
    </div>
  );
}

// ─── Screen: Profile ──────────────────────────────────────────────────────────
function ProfileScreen({ onBack, isPremium, onPremium, streakDays, completedWorkouts, user, onLogout }) {
  const badges = [
    { emoji: "🔥", label: "First Workout", earned: completedWorkouts >= 1 },
    { emoji: "💪", label: "3 in a Row", earned: streakDays >= 3 },
    { emoji: "⚡", label: "Week Warrior", earned: streakDays >= 7 },
    { emoji: "🏆", label: "10 Workouts", earned: completedWorkouts >= 10 },
    { emoji: "🌟", label: "30-Day Club", earned: streakDays >= 30 },
    { emoji: "🎯", label: "Consistency", earned: completedWorkouts >= 5 },
  ];

  const handleLogout = () => {
    localStorage.removeItem("repflow_token");
    localStorage.removeItem("repflow_user");
    onLogout();
  };

  return (
    <div style={{ ...screen(), overflowY: "auto" }}>
      <div style={{ padding: "52px 24px 100px" }}>
        <button onClick={onBack} style={backBtn()}>← Back</button>

        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 88, height: 88, borderRadius: 26,
            background: `linear-gradient(135deg, ${C.accent} 0%, #8AFF00 100%)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px", fontSize: 42,
            boxShadow: `0 12px 40px ${C.accent}40`,
          }}>💪</div>
          <div style={{ fontFamily: FONT.display, fontSize: 26, fontWeight: 900, color: C.white }}>
            {user?.name?.toUpperCase() || "ATHLETE"}
          </div>
          <div style={{ fontFamily: FONT.body, fontSize: 13, color: C.grey2, marginTop: 4 }}>
            {user?.email}
          </div>
          {isPremium ? (
            <Badge label="⭐ PRO MEMBER" color={C.premium} />
          ) : (
            <button onClick={onPremium} style={{
              background: "none", border: `1px solid ${C.premium}60`, borderRadius: 99,
              padding: "4px 14px", cursor: "pointer",
              fontFamily: FONT.body, fontSize: 11, color: C.premium, fontWeight: 700,
            }}>Upgrade to Pro ›</button>
          )}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 28 }}>
          {[
            { label: "Streak", value: `${streakDays}🔥`, sub: "days" },
            { label: "Workouts", value: completedWorkouts, sub: "total" },
            { label: "Calories", value: `${completedWorkouts * 142}`, sub: "burned" },
          ].map(s => (
            <div key={s.label} style={{
              background: C.card, borderRadius: 16, padding: "16px 12px",
              border: `1px solid ${C.border}`, textAlign: "center",
            }}>
              <div style={{ fontFamily: FONT.display, fontSize: 22, fontWeight: 900, color: C.accent }}>{s.value}</div>
              <div style={{ fontFamily: FONT.body, fontSize: 10, color: C.grey2 }}>{s.sub}</div>
              <div style={{ fontFamily: FONT.body, fontSize: 11, color: C.grey3 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <SectionLabel>ACHIEVEMENT BADGES</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 12 }}>
          {badges.map((b, i) => (
            <div key={i} style={{
              background: b.earned ? `${C.accent}12` : C.card,
              border: `1px solid ${b.earned ? C.accent + "40" : C.border}`,
              borderRadius: 16, padding: "16px 8px", textAlign: "center",
              opacity: b.earned ? 1 : 0.4,
            }}>
              <div style={{ fontSize: 28, marginBottom: 6, filter: b.earned ? "none" : "grayscale(1)" }}>{b.emoji}</div>
              <div style={{ fontFamily: FONT.body, fontSize: 10, fontWeight: 700, color: b.earned ? C.white : C.grey3 }}>
                {b.label}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 28 }}>
          <button onClick={handleLogout} style={{
            width: "100%", padding: "16px 0",
            background: `${C.red}15`, border: `1px solid ${C.red}40`,
            borderRadius: 16, cursor: "pointer",
            fontFamily: FONT.body, fontSize: 15, fontWeight: 700,
            color: C.red, letterSpacing: "0.05em",
          }}>
            LOG OUT
          </button>
        </div>

        <div style={{ marginTop: 28 }}>
          <SectionLabel>SETTINGS</SectionLabel>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 1 }}>
            {["Notifications", "Voice Coach", "Units (metric)", "Dark Mode", "Privacy Policy", "About RepFlow"].map((s, i) => (
              <div key={i} style={{
                background: C.card, padding: "16px 18px",
                borderRadius: i === 0 ? "14px 14px 0 0" : i === 5 ? "0 0 14px 14px" : 0,
                borderTop: i > 0 ? `1px solid ${C.border}` : "none",
                display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer",
              }}>
                <span style={{ fontFamily: FONT.body, fontSize: 14, color: C.white }}>{s}</span>
                <span style={{ color: C.grey3 }}>›</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Tab Bar ──────────────────────────────────────────────────────────────────
function TabBar({ active, onChange }) {
  const tabs = [
    { key: "home", emoji: "🏠", label: "Home" },
    { key: "workouts", emoji: "⚡", label: "Train" },
    { key: "premium", emoji: "⭐", label: "Pro" },
    { key: "profile", emoji: "👤", label: "Profile" },
  ];

  return (
    <div style={{
      position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
      width: 390, height: 80, background: C.surface,
      borderTop: `1px solid ${C.border}`,
      display: "flex", alignItems: "flex-start", paddingTop: 10,
      backdropFilter: "blur(20px)", zIndex: 100,
    }}>
      {tabs.map(t => (
        <button key={t.key} onClick={() => onChange(t.key)} style={{
          flex: 1, border: "none", background: "none", cursor: "pointer",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
          padding: "6px 0",
        }}>
          <span style={{ fontSize: 20, filter: active === t.key ? "none" : "grayscale(1) opacity(0.5)" }}>
            {t.emoji}
          </span>
          <span style={{
            fontFamily: FONT.body, fontSize: 10, fontWeight: 700, letterSpacing: "0.05em",
            color: active === t.key ? C.accent : C.grey3,
          }}>{t.label}</span>
        </button>
      ))}
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function SectionLabel({ children }) {
  return (
    <div style={{ fontFamily: FONT.body, fontSize: 11, fontWeight: 700, color: C.grey2, letterSpacing: "0.2em" }}>
      {children}
    </div>
  );
}

function screen() {
  return { width: 390, height: 844, background: C.bg, position: "relative", overflowY: "hidden" };
}

function btnPrimary() {
  return {
    width: "100%", padding: "18px 0",
    background: `linear-gradient(135deg, ${C.accent} 0%, #8AFF00 100%)`,
    border: "none", borderRadius: 18, cursor: "pointer",
    fontFamily: FONT.body, fontSize: 16, fontWeight: 800, color: C.bg,
    letterSpacing: "0.05em", boxShadow: `0 8px 32px ${C.accent}40`,
  };
}

function btnSecondary() {
  return {
    width: "100%", padding: "16px 0",
    background: "none", border: `1px solid ${C.border}`, borderRadius: 18, cursor: "pointer",
    fontFamily: FONT.body, fontSize: 15, fontWeight: 600, color: C.grey1,
  };
}

function backBtn() {
  return {
    background: "none", border: "none", cursor: "pointer",
    fontFamily: FONT.body, fontSize: 14, color: C.grey2, marginBottom: 16, padding: 0,
  };
}

function iconBtn() {
  return {
    width: 36, height: 36, borderRadius: 10, border: `1px solid ${C.border}`,
    background: C.card, cursor: "pointer", color: C.white, fontSize: 14,
    display: "flex", alignItems: "center", justifyContent: "center",
  };
}

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function RepFlowApp() {
  const [appScreen, setAppScreen] = useState("splash");
  const [tab, setTab] = useState("home");
  const [workoutConfig, setWorkoutConfig] = useState(null);
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [streakDays, setStreakDays] = useState(0);
  const [completedWorkouts, setCompletedWorkouts] = useState(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("repflow_token");
    const savedUser = localStorage.getItem("repflow_user");
    
    if (token && savedUser) {
      // Verify token with server
      fetch(`${API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => {
        if (res.ok) {
          const userData = JSON.parse(savedUser);
          setUser(userData);
          setIsPremium(userData.isPremium || false);
          setStreakDays(userData.streakDays || 0);
          setCompletedWorkouts(userData.completedWorkouts || 0);
          setAppScreen("main");
        } else {
          // Token invalid
          localStorage.removeItem("repflow_token");
          localStorage.removeItem("repflow_user");
          setAppScreen("splash");
        }
      })
      .catch(() => {
        setAppScreen("splash");
      });
    } else {
      setAppScreen("splash");
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsPremium(userData.isPremium);
    setStreakDays(userData.streakDays);
    setCompletedWorkouts(userData.completedWorkouts);
    setAppScreen("main");
  };

  const handleSignup = (userData) => {
    setUser(userData);
    setIsPremium(userData.isPremium);
    setStreakDays(userData.streakDays);
    setCompletedWorkouts(userData.completedWorkouts);
    setAppScreen("main");
  };

  const handleLogout = () => {
    setUser(null);
    setAppScreen("onboarding");
  };

  const handleUpgrade = () => {
    setIsPremium(true);
    // Update user in localStorage
    if (user) {
      const updatedUser = { ...user, isPremium: true };
      localStorage.setItem("repflow_user", JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
    setAppScreen("main");
  };

  const injectStyles = () => (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;700;900&family=DM+Sans:wght@400;600;700;800&family=JetBrains+Mono:wght@400;700&display=swap');
      @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes pulse { 0%,100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.08); opacity: 0.7; } }
      @keyframes bounce { from { transform: translateY(0); } to { transform: translateY(-6px); } }
      * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
      ::-webkit-scrollbar { width: 0; }
    `}</style>
  );

  const shell = (content, showTabs = true, activeTab = tab) => (
    <div style={{
      width: 390, minHeight: 844,
      background: C.bg, borderRadius: 50,
      overflow: "hidden", position: "relative",
      boxShadow: "0 40px 120px #00000090, 0 0 0 1px #ffffff15, inset 0 0 0 1px #ffffff08",
      fontFamily: FONT.body,
    }}>
      {injectStyles()}
      {content}
      {showTabs && <TabBar active={activeTab} onChange={t => {
        if (t === "premium") { setTab("home"); setTimeout(() => setAppScreen("premium"), 50); return; }
        setTab(t);
      }} />}
    </div>
  );

  if (appScreen === "splash") {
    return shell(<SplashScreen onDone={() => setAppScreen("onboarding")} />, false);
  }

  if (appScreen === "onboarding") {
    return shell(<OnboardingScreen onGetStarted={() => setAppScreen("login")} />, false);
  }

  if (appScreen === "login") {
    return shell(<LoginScreen onLogin={handleLogin} onSwitchToSignup={() => setAppScreen("signup")} />, false);
  }

  if (appScreen === "signup") {
    return shell(<SignupScreen onSignup={handleSignup} onSwitchToLogin={() => setAppScreen("login")} />, false);
  }

  if (appScreen === "workout-setup") {
    return shell(
      <WorkoutSetupScreen
        initial={workoutConfig}
        onBack={() => setAppScreen("main")}
        onBegin={(cfg) => { setActiveWorkout(cfg); setAppScreen("active"); }}
      />, false
    );
  }

  if (appScreen === "active") {
    return shell(
      <ActiveWorkoutScreen
        config={activeWorkout}
        isPremium={isPremium}
        onComplete={() => { 
          setCompletedWorkouts(c => c + 1); 
          setStreakDays(s => s + 1);
          // Update in localStorage
          if (user) {
            const updatedUser = { ...user, completedWorkouts: completedWorkouts + 1, streakDays: streakDays + 1 };
            localStorage.setItem("repflow_user", JSON.stringify(updatedUser));
            setUser(updatedUser);
          }
          setAppScreen("main"); 
        }}
        onBack={() => setAppScreen("main")}
      />, false
    );
  }

  if (appScreen === "premium") {
    return shell(
      <PremiumScreen
        onBack={() => setAppScreen("main")}
        onUpgrade={handleUpgrade}
      />, false
    );
  }

  const handleStartWorkout = (cfg) => { setWorkoutConfig(cfg); setAppScreen("workout-setup"); };

  const tabContent = {
    home: <HomeScreen
      onStartWorkout={handleStartWorkout}
      onProfile={() => setTab("profile")}
      onPremium={() => setAppScreen("premium")}
      isPremium={isPremium}
      streakDays={streakDays}
      completedWorkouts={completedWorkouts}
      user={user}
      onLogout={handleLogout}
    />,
    workouts: <WorkoutSetupScreen
      initial={null}
      onBack={() => setTab("home")}
      onBegin={(cfg) => { setActiveWorkout(cfg); setAppScreen("active"); }}
    />,
    profile: <ProfileScreen
      onBack={() => setTab("home")}
      isPremium={isPremium}
      onPremium={() => setAppScreen("premium")}
      streakDays={streakDays}
      completedWorkouts={completedWorkouts}
      user={user}
      onLogout={handleLogout}
    />,
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#050507",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexDirection: "column", gap: 24, padding: "40px 20px",
      fontFamily: FONT.body,
    }}>
      <style>{`
        body { margin: 0; background: #050507; }
      `}</style>

      <div style={{ fontFamily: FONT.body, fontSize: 12, color: "#ffffff30", letterSpacing: "0.3em" }}>
        ⚡ REPFLOW — GUIDED WORKOUT APP
      </div>

      {shell(tabContent[tab] || tabContent.home)}

      <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center" }}>
        {[
          { label: user ? `👤 ${user.name}` : "Not logged in", desc: "Your account" },
          { label: "FREE MODE", desc: "Manual next exercise" },
          { label: isPremium ? "PRO ACTIVE ⭐" : "UPGRADE IN-APP", desc: isPremium ? "Auto-transition ON" : "Tap ⭐ Pro tab" },
          { label: "STREAK: " + streakDays + " DAYS 🔥", desc: "Keep training daily" },
        ].map(({ label, desc }) => (
          <div key={label} style={{ textAlign: "center" }}>
            <div style={{ fontFamily: FONT.body, fontSize: 11, fontWeight: 700, color: C.accent, letterSpacing: "0.1em" }}>{label}</div>
            <div style={{ fontFamily: FONT.body, fontSize: 10, color: "#ffffff40" }}>{desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}