import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Eye, EyeOff, Stethoscope, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const DEMO_CREDENTIALS = [
  { role: "Doctor", email: "doctor@medicore.com", label: "Doctor", color: "bg-blue-100 text-blue-700 border-blue-200" },
  { role: "HR", email: "hr@medicore.com", label: "HR", color: "bg-purple-100 text-purple-700 border-purple-200" },
  { role: "FrontDesk", email: "desk@medicore.com", label: "Front Desk", color: "bg-sky-100 text-sky-700 border-sky-200" },
];

export default function Login() {
  const navigate = useNavigate();
  const { signIn, isAuthenticated, redirectPath } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [demoRole, setDemoRole] = useState("Doctor");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Background Placeholder: Replace the URL or color below
  const backgroundStyle = {
    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url('https://your-placeholder-image-url.com/bg.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundColor: '#f8fafc' // Fallback color
  };

  if (isAuthenticated) return <Navigate to={redirectPath} replace />;

  const fillDemo = (cred) => {
    setEmail(cred.email);
    setPassword("demo1234");
    setDemoRole(cred.role);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError("Please enter your email and password."); return; }
    setLoading(true);
    setError("");
    try {
      const { redirectTo } = await signIn({ email, password, role: demoRole });
      setSuccess(true);
      setTimeout(() => navigate(redirectTo, { replace: true }), 600);
    } catch (err) {
      setError(err.message ?? "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center p-6 font-sans"
      style={backgroundStyle}
    >
      {/* Centered Card */}
      <div className="w-full max-w-[450px] bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-10">
        
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-600 shadow-lg mb-4">
            <Stethoscope className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">GNE Hospital</h1>
          <p className="mt-2 text-gray-500 text-center">Sign in to your professional portal</p>
        </div>

        {/* Demo Credentials */}
        <div className="mb-8 p-4 rounded-2xl bg-gray-50 border border-gray-100">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3 text-center">
            Quick Fill Demo
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {DEMO_CREDENTIALS.map((cred) => (
              <button
                key={cred.role}
                type="button"
                onClick={() => fillDemo(cred)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border-2 ${
                  demoRole === cred.role ? `${cred.color} border-blue-500` : "bg-white text-gray-500 border-transparent hover:bg-gray-100"
                }`}
              >
                {cred.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-green-50 border border-green-100 text-green-700 text-sm">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Login successful! Redirecting…</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              placeholder="name@medicore.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              required
            />
          </div>

          <div>
            <div className="flex justify-between mb-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Password</label>
              <button type="button" className="text-xs text-blue-600 hover:underline font-semibold">Forgot?</button>
            </div>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                placeholder="••••••••"
                className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-70"
          >
            {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Sign In"}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <p className="mt-8 text-center text-[10px] text-gray-400 uppercase tracking-widest">
          © 2026 GNE Health Systems
        </p>
      </div>
    </div>
  );
}