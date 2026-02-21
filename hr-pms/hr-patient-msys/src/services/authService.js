// src/services/authService.js
// ─────────────────────────────────────────────────────────────────────────────
// Mock authentication service.
// Replace the MOCK_USERS lookup and the "fetch" call below with your real
// PHP backend endpoint when ready.  Everything else (token storage, role
// routing) stays the same.
// ─────────────────────────────────────────────────────────────────────────────

const TOKEN_KEY  = "hms_token";
const USER_KEY   = "hms_user";

// ── Role → dashboard route map ───────────────────────────────────────────────
export const ROLE_ROUTES = {
  HR:        "/hr/dashboard",
  FrontDesk: "/pms/dashboard",
  Doctor:    "/doctor/dashboard",
};

// ── Mock user database (demo only — remove in production) ───────────────────
const MOCK_USERS = {
  "hr@medicore.com": {
    id: "u001", name: "Sarah Mitchell", role: "HR",
    department: "Human Resources", avatar: "SM",
  },
  "desk@medicore.com": {
    id: "u002", name: "James Reyes", role: "FrontDesk",
    department: "Patient Services", avatar: "JR",
  },
  "doctor@medicore.com": {
    id: "u003", name: "Dr. Emily Chen", role: "Doctor",
    department: "Internal Medicine", avatar: "EC",
  },
};

// ── Tiny base64url encoder (browser-safe, no btoa padding issues) ────────────
function b64url(str) {
  return btoa(unescape(encodeURIComponent(str)))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// ── Build a mock JWT (header.payload.signature) ──────────────────────────────
function buildMockJWT(user) {
  const header  = b64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const now     = Math.floor(Date.now() / 1000);
  const payload = b64url(JSON.stringify({
    sub:  user.id,
    name: user.name,
    role: user.role,
    dept: user.department,
    iat:  now,
    exp:  now + 60 * 60 * 8,          // 8-hour session
  }));
  const sig = b64url(`mock-sig-${user.id}-${now}`); // placeholder signature
  return `${header}.${payload}.${sig}`;
}

// ── Decode (parse) our mock JWT without verification ─────────────────────────
export function decodeToken(token) {
  try {
    const [, payload] = token.split(".");
    const json = decodeURIComponent(escape(atob(payload.replace(/-/g, "+").replace(/_/g, "/"))));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

// ── Core login function ───────────────────────────────────────────────────────
/**
 * @param {string} email
 * @param {string} password
 * @param {string} role  — used only in demo mode to override mock user role
 * @returns {{ token: string, user: object, redirectTo: string }}
 */
export async function login({ email, password, role: demoRole }) {
  // ── REAL BACKEND: uncomment & adapt ──────────────────────────────────────
  // const res  = await fetch("/api/auth/login", {
  //   method:  "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body:    JSON.stringify({ email, password }),
  // });
  // if (!res.ok) throw new Error((await res.json()).message ?? "Login failed");
  // const { token } = await res.json();
  // const claims    = decodeToken(token);
  // ─────────────────────────────────────────────────────────────────────────

  // ── MOCK: simulate network latency ───────────────────────────────────────
  await new Promise((r) => setTimeout(r, 900));

  const mockUser = MOCK_USERS[email.toLowerCase()];
  if (!mockUser || password.length < 4) {
    throw new Error("Invalid email or password.");
  }

  // Allow the demo role selector to override the mock role
  const user  = { ...mockUser, role: demoRole || mockUser.role };
  const token = buildMockJWT(user);

  // Persist to sessionStorage (swap to localStorage for "remember me")
  sessionStorage.setItem(TOKEN_KEY, token);
  sessionStorage.setItem(USER_KEY, JSON.stringify(user));

  return {
    token,
    user,
    redirectTo: ROLE_ROUTES[user.role] ?? "/dashboard",
  };
}

// ── Logout ────────────────────────────────────────────────────────────────────
export function logout() {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
}

// ── Session helpers ───────────────────────────────────────────────────────────
export function getStoredToken()  { return sessionStorage.getItem(TOKEN_KEY); }
export function getStoredUser()   {
  try   { return JSON.parse(sessionStorage.getItem(USER_KEY)); }
  catch { return null; }
}

export function isAuthenticated() {
  const token  = getStoredToken();
  if (!token) return false;
  const claims = decodeToken(token);
  if (!claims)  return false;
  return claims.exp > Math.floor(Date.now() / 1000);
}