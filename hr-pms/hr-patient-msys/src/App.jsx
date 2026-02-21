// ─────────────────────────────────────────────────────────────────────────────
// Root of the app.  Wires together:
//   AuthProvider   → global auth state (context/AuthContext.jsx)
//   React Router   → route definitions
//   ProtectedRoute → role-gated access (components/Auth/ProtectedRoute.jsx)
//   Layout         → sidebar / topbar shell (components/Layout/Layout.jsx)
// ─────────────────────────────────────────────────────────────────────────────

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth }   from "/src/context/AuthContext";
import ProtectedRoute              from "/src/components/auth/SecurityRoute";
import LoginPage                   from "/src/pages/Login";
import Layout                      from "/src/components/Layout";

// ── Placeholder page (replace with your real page components) ─────────────────
function DashboardPage({ title }) {
  const { user, signOut } = useAuth();
  return (
    <div className="max-w-2xl mx-auto py-12 text-center">
      <p className="text-xs font-bold uppercase tracking-widest text-primary-400 mb-2">
        {user?.department}
      </p>
      <h1 className="font-display text-3xl font-bold text-surface-900 mb-1">{title}</h1>
      <p className="text-surface-500 mb-8">
        Logged in as <strong>{user?.name}</strong> ({user?.role})
      </p>
      <button
        onClick={signOut}
        className="px-5 py-2.5 rounded-xl bg-danger-500 hover:bg-danger-600 text-white text-sm font-semibold transition-colors"
      >
        Sign out
      </button>
    </div>
  );
}

// ── Root redirect: "/" → correct dashboard or login ───────────────────────────
function RootRedirect() {
  const { isAuthenticated, redirectPath } = useAuth();
  return <Navigate to={isAuthenticated ? redirectPath : "/login"} replace />;
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* ── Public ────────────────────────────────────────────── */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/"      element={<RootRedirect />} />

          {/* ── Doctor (role-gated) ────────────────────────────────── */}
          <Route element={<ProtectedRoute allowedRoles={["Doctor"]} />}>
            <Route path="/doctor/*" element={
              <Layout role="Doctor">
                <Routes>
                  <Route path="dashboard"     element={<DashboardPage title="Doctor Dashboard" />} />
                  <Route path="patients"      element={<DashboardPage title="My Patients" />} />
                  <Route path="consultations" element={<DashboardPage title="Consultations" />} />
                  <Route path="records"       element={<DashboardPage title="Medical Records" />} />
                  <Route path="lab"           element={<DashboardPage title="Lab Results" />} />
                  <Route path="prescriptions" element={<DashboardPage title="Prescriptions" />} />
                </Routes>
              </Layout>
            } />
          </Route>

          {/* ── HR (role-gated) ────────────────────────────────────── */}
          <Route element={<ProtectedRoute allowedRoles={["HR"]} />}>
            <Route path="/hr/*" element={
              <Layout role="HR">
                <Routes>
                  <Route path="dashboard"   element={<DashboardPage title="HR Dashboard" />} />
                  <Route path="analytics"   element={<DashboardPage title="Analytics" />} />
                  <Route path="employees"   element={<DashboardPage title="All Employees" />} />
                  <Route path="recruitment" element={<DashboardPage title="Recruitment" />} />
                  <Route path="leave"       element={<DashboardPage title="Leave Requests" />} />
                  <Route path="schedules"   element={<DashboardPage title="Schedules" />} />
                </Routes>
              </Layout>
            } />
          </Route>

          {/* ── Front Desk (role-gated) ────────────────────────────── */}
          <Route element={<ProtectedRoute allowedRoles={["FrontDesk"]} />}>
            <Route path="/pms/*" element={
              <Layout role="FrontDesk">
                <Routes>
                  <Route path="dashboard"    element={<DashboardPage title="Front Desk Dashboard" />} />
                  <Route path="appointments" element={<DashboardPage title="Appointments" />} />
                  <Route path="admissions"   element={<DashboardPage title="Admissions" />} />
                  <Route path="billing"      element={<DashboardPage title="Billing" />} />
                  <Route path="inquiries"    element={<DashboardPage title="Inquiries" />} />
                </Routes>
              </Layout>
            } />
          </Route>

          {/* 404 → root */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}