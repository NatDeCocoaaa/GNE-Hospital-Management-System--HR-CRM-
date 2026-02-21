// src/components/Layout/Layout.jsx
import { useState, createContext, useContext } from "react";
import {
  // HR icons
  Users, UserPlus, ClipboardList, BarChart3, Calendar,
  // FrontDesk icons
  LayoutDashboard, CalendarPlus, BedDouble, Receipt, PhoneCall,
  // Doctor icons
  Stethoscope, FileText, FlaskConical, Pill, HeartPulse,
  // Shared
  Settings, LogOut, Bell, Search, Menu, X, ChevronDown,
  Building2, ChevronsLeft,
} from "lucide-react";
import LogoutModal from "../Auth/LogoutModal";

// ─── Role-based navigation config ────────────────────────────────────────────

const NAV_CONFIG = {
  HR: {
    label: "Human Resources",
    color: "text-violet-600",
    bgAccent: "bg-violet-50",
    sections: [
      {
        title: "Overview",
        links: [
          { label: "Dashboard",      icon: LayoutDashboard, href: "/hr/dashboard" },
          { label: "Analytics",      icon: BarChart3,        href: "/hr/analytics" },
        ],
      },
      {
        title: "Staff Management",
        links: [
          { label: "All Employees",  icon: Users,          href: "/hr/employees" },
          { label: "Recruitment",    icon: UserPlus,       href: "/hr/recruitment" },
          { label: "Leave Requests", icon: ClipboardList,  href: "/hr/leave" },
          { label: "Schedules",      icon: Calendar,       href: "/hr/schedules" },
        ],
      },
    ],
  },

  FrontDesk: {
    label: "Front Desk",
    color: "text-sky-600",
    bgAccent: "bg-sky-50",
    sections: [
      {
        title: "Overview",
        links: [
          { label: "Dashboard",       icon: LayoutDashboard, href: "/desk/dashboard" },
        ],
      },
      {
        title: "Patient Services",
        links: [
          { label: "Appointments",    icon: CalendarPlus,   href: "/desk/appointments" },
          { label: "Admissions",      icon: BedDouble,      href: "/desk/admissions" },
          { label: "Billing",         icon: Receipt,        href: "/desk/billing" },
          { label: "Inquiries",       icon: PhoneCall,      href: "/desk/inquiries" },
        ],
      },
    ],
  },

  Doctor: {
    label: "Doctor Portal",
    color: "text-primary-600",
    bgAccent: "bg-primary-50",
    sections: [
      {
        title: "Overview",
        links: [
          { label: "Dashboard",       icon: LayoutDashboard, href: "/doctor/dashboard" },
          { label: "My Patients",     icon: HeartPulse,     href: "/doctor/patients" },
        ],
      },
      {
        title: "Clinical",
        links: [
          { label: "Consultations",   icon: Stethoscope,    href: "/doctor/consultations" },
          { label: "Medical Records", icon: FileText,       href: "/doctor/records" },
          { label: "Lab Results",     icon: FlaskConical,   href: "/doctor/lab" },
          { label: "Prescriptions",   icon: Pill,           href: "/doctor/prescriptions" },
        ],
      },
    ],
  },
};

// ─── Context (optional — lift up if you have a real auth store) ───────────────
const LayoutContext = createContext({});
export const useLayout = () => useContext(LayoutContext);

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar({ role, collapsed, onToggle, activePath, onNavigate, onLogout }) {
  const config = NAV_CONFIG[role] ?? NAV_CONFIG.Doctor;

  return (
    <aside
      className={`
        relative flex flex-col bg-white border-r border-surface-200 shadow-sidebar
        sidebar-transition shrink-0 h-screen overflow-hidden
        ${collapsed ? "w-[68px]" : "w-[240px]"}
      `}
    >
      {/* Logo / Brand */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-surface-200 shrink-0">
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-600 shadow shrink-0">
          <Building2 className="w-4 h-4 text-white" />
        </span>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="font-display font-semibold text-sm text-surface-900 leading-tight whitespace-nowrap">
              MediCore
            </p>
            <p className="text-[10px] font-medium text-surface-400 uppercase tracking-widest whitespace-nowrap">
              {config.label}
            </p>
          </div>
        )}
      </div>

      {/* Nav sections */}
      <nav className="flex-1 py-4 overflow-y-auto scrollbar-thin px-2 space-y-5">
        {config.sections.map((section) => (
          <div key={section.title}>
            {!collapsed && (
              <p className="px-3 mb-1 text-[10px] font-bold uppercase tracking-widest text-surface-400">
                {section.title}
              </p>
            )}
            <ul className="space-y-0.5">
              {section.links.map(({ label, icon: Icon, href }) => {
                const isActive = activePath === href;
                return (
                  <li key={href}>
                    <button
                      onClick={() => onNavigate(href)}
                      title={collapsed ? label : undefined}
                      className={`
                        nav-item w-full
                        ${isActive ? "active" : ""}
                        ${collapsed ? "justify-center px-0" : ""}
                      `}
                    >
                      <Icon
                        className={`w-[18px] h-[18px] shrink-0 transition-colors
                          ${isActive ? "text-primary-600" : "text-surface-400 group-hover:text-primary-600"}`}
                      />
                      {!collapsed && <span>{label}</span>}
                      {isActive && !collapsed && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-600" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="border-t border-surface-200 py-3 px-2 space-y-0.5 shrink-0">
        <button
          className={`nav-item w-full ${collapsed ? "justify-center px-0" : ""}`}
          title={collapsed ? "Settings" : undefined}
        >
          <Settings className="w-[18px] h-[18px] text-surface-400 shrink-0" />
          {!collapsed && <span>Settings</span>}
        </button>
        <button
          className={`nav-item w-full text-danger-500 hover:text-danger-600 hover:bg-danger-50 ${collapsed ? "justify-center px-0" : ""}`}
          title={collapsed ? "Logout" : undefined}
          onClick={onLogout}
        >
          <LogOut className="w-[18px] h-[18px] shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      {/* Collapse toggle button */}
      <button
        onClick={onToggle}
        className="
          absolute -right-3 top-[72px] z-10
          w-6 h-6 rounded-full bg-white border border-surface-200 shadow
          flex items-center justify-center
          hover:bg-primary-50 hover:border-primary-300 transition-colors
        "
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <ChevronsLeft
          className={`w-3.5 h-3.5 text-surface-500 transition-transform duration-200
            ${collapsed ? "rotate-180" : ""}`}
        />
      </button>
    </aside>
  );
}

// ─── Topbar ───────────────────────────────────────────────────────────────────

function Topbar({ role, user, onMobileMenuToggle, onLogout }) {
  const config = NAV_CONFIG[role] ?? NAV_CONFIG.Doctor;
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const roleColors = {
    HR:        "bg-violet-100 text-violet-700",
    FrontDesk: "bg-sky-100 text-sky-700",
    Doctor:    "bg-primary-100 text-primary-700",
  };

  const avatarBg = {
    HR:        "bg-violet-600",
    FrontDesk: "bg-sky-600",
    Doctor:    "bg-primary-600",
  };

  const initials = (user?.name ?? "U").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-surface-200 shadow-topbar shrink-0">
      {/* Left: Mobile menu toggle + Search */}
      <div className="flex items-center gap-4">
        <button
          className="lg:hidden p-1.5 rounded-lg hover:bg-surface-100 text-surface-500"
          onClick={onMobileMenuToggle}
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden md:flex items-center gap-2 bg-surface-100 rounded-xl px-3 py-2 w-64">
          <Search className="w-4 h-4 text-surface-400 shrink-0" />
          <input
            type="text"
            placeholder="Search anything…"
            className="bg-transparent text-sm text-surface-700 placeholder:text-surface-400 outline-none w-full"
          />
        </div>
      </div>

      {/* Right: Notifications + User */}
      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <button className="relative p-2 rounded-xl hover:bg-surface-100 transition-colors">
          <Bell className="w-5 h-5 text-surface-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger-500 rounded-full ring-2 ring-white" />
        </button>

        {/* Divider */}
        <div className="w-px h-7 bg-surface-200" />

        {/* User pill with dropdown */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen((p) => !p)}
            className="flex items-center gap-2.5 pl-1 pr-3 py-1.5 rounded-xl hover:bg-surface-100 transition-colors group"
          >
            <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0 ${avatarBg[role] ?? "bg-primary-600"}`}>
              {initials}
            </span>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-semibold text-surface-800 leading-tight">
                {user?.name ?? "Dr. Smith"}
              </p>
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${roleColors[role] ?? roleColors.Doctor}`}>
                {config.label}
              </span>
            </div>
            <ChevronDown className={`w-4 h-4 text-surface-400 hidden sm:block transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Dropdown */}
          {userMenuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
              <div className="absolute right-0 top-12 z-20 w-48 bg-white rounded-2xl border border-surface-200 shadow-xl overflow-hidden">
                {/* User info header */}
                <div className="px-4 py-3 border-b border-surface-100 bg-surface-50">
                  <p className="text-xs font-bold text-surface-800 truncate">{user?.name ?? "User"}</p>
                  <p className="text-[11px] text-surface-500">{user?.department ?? config.label}</p>
                </div>
                <div className="py-1">
                  <button
                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-xs font-medium text-surface-700 hover:bg-surface-50 transition-colors"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <Settings className="w-3.5 h-3.5 text-surface-400" /> Settings
                  </button>
                  <div className="border-t border-surface-100 my-1" />
                  <button
                    onClick={() => { setUserMenuOpen(false); onLogout(); }}
                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-xs font-semibold text-danger-600 hover:bg-danger-50 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

// ─── Mobile overlay ───────────────────────────────────────────────────────────

function MobileOverlay({ open, onClose, role, activePath, onNavigate, onLogout }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      {/* Scrim */}
      <div
        className="absolute inset-0 bg-surface-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Drawer */}
      <div className="absolute left-0 top-0 h-full w-[260px] bg-white shadow-2xl">
        <div className="flex items-center justify-between px-4 h-16 border-b border-surface-200">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-600 shadow">
              <Building2 className="w-4 h-4 text-white" />
            </span>
            <p className="font-display font-semibold text-surface-900">MediCore HMS</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-100">
            <X className="w-5 h-5 text-surface-500" />
          </button>
        </div>
        <Sidebar
          role={role}
          collapsed={false}
          onToggle={onClose}
          activePath={activePath}
          onNavigate={(href) => { onNavigate(href); onClose(); }}
          onLogout={onLogout}
        />
      </div>
    </div>
  );
}

// ─── Main Layout export ───────────────────────────────────────────────────────

/**
 * Props:
 *   role      — "HR" | "FrontDesk" | "Doctor"
 *   user      — { name: string, avatar?: string }
 *   children  — page content
 */
export default function Layout({ role = "Doctor", user, children }) {
  const [collapsed,    setCollapsed]    = useState(false);
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [showLogout,   setShowLogout]   = useState(false);
  const [activePath,   setActivePath]   = useState(() => {
    // Default first link of the role
    return NAV_CONFIG[role]?.sections[0]?.links[0]?.href ?? "/";
  });

  const ctxValue = { role, activePath, setActivePath, collapsed };

  return (
    <LayoutContext.Provider value={ctxValue}>
      <div className="flex h-screen overflow-hidden bg-surface-50">

        {/* ── Desktop Sidebar ── */}
        <div className="hidden lg:flex">
          <Sidebar
            role={role}
            collapsed={collapsed}
            onToggle={() => setCollapsed((p) => !p)}
            activePath={activePath}
            onNavigate={setActivePath}
            onLogout={() => setShowLogout(true)}
          />
        </div>

        {/* ── Mobile Sidebar Drawer ── */}
        <MobileOverlay
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          role={role}
          activePath={activePath}
          onNavigate={setActivePath}
          onLogout={() => { setMobileOpen(false); setShowLogout(true); }}
        />

        {/* ── Main Column ── */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <Topbar
            role={role}
            user={user}
            onMobileMenuToggle={() => setMobileOpen(true)}
            onLogout={() => setShowLogout(true)}
          />

          {/* Page content */}
          <main className="flex-1 overflow-y-auto p-6">
            {children ?? (
              <PlaceholderContent role={role} activePath={activePath} />
            )}
          </main>
        </div>
      </div>

      {/* ── Logout confirmation modal ── */}
      {showLogout && (
        <LogoutModal onClose={() => setShowLogout(false)} />
      )}
    </LayoutContext.Provider>
  );
}

// ─── Demo placeholder (remove in production) ─────────────────────────────────

function PlaceholderContent({ role, activePath }) {
  const config = NAV_CONFIG[role] ?? NAV_CONFIG.Doctor;
  const allLinks = config.sections.flatMap((s) => s.links);
  const current  = allLinks.find((l) => l.href === activePath);
  const Icon     = current?.icon ?? LayoutDashboard;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Page heading */}
      <div className="mb-8">
        <h1 className="font-display text-2xl font-semibold text-surface-900">
          {current?.label ?? "Dashboard"}
        </h1>
        <p className="mt-1 text-sm text-surface-500">
          {config.label} · {activePath}
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Patients",   value: "1,284", delta: "+12%", color: "primary" },
          { label: "Appointments",     value: "86",    delta: "+4%",  color: "success" },
          { label: "Pending Reports",  value: "14",    delta: "-2",   color: "warning" },
          { label: "Alerts",           value: "3",     delta: "+1",   color: "danger"  },
        ].map(({ label, value, delta, color }) => (
          <div key={label} className="card">
            <p className="text-xs font-semibold text-surface-400 uppercase tracking-wide mb-3">
              {label}
            </p>
            <p className="font-display text-2xl font-bold text-surface-900">{value}</p>
            <p className={`mt-1 text-xs font-semibold
              ${color === "primary" ? "text-primary-600" : ""}
              ${color === "success" ? "text-success-600" : ""}
              ${color === "warning" ? "text-warning-600" : ""}
              ${color === "danger"  ? "text-danger-600"  : ""}
            `}>{delta} this week</p>
          </div>
        ))}
      </div>

      {/* Empty state panel */}
      <div className="card flex flex-col items-center justify-center py-20 text-center">
        <span className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center mb-4">
          <Icon className="w-7 h-7 text-primary-600" />
        </span>
        <h2 className="font-display text-lg font-semibold text-surface-800 mb-1">
          {current?.label ?? "Module"} Module
        </h2>
        <p className="text-sm text-surface-400 max-w-xs">
          This section will render its own page component here as a child of{" "}
          <code className="font-mono text-primary-600">&lt;Layout&gt;</code>.
        </p>
      </div>
    </div>
  );
}