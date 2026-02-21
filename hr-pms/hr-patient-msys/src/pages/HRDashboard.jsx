// src/pages/HR/HRDashboard.jsx
// ─────────────────────────────────────────────────────────────────────────────
// HR Dashboard page — orchestrates:
//   • StatsRow (summary KPIs)
//   • Tab navigation (Employees / Departments)
//   • EmployeeTable (TanStack Table)
//   • DepartmentGrid
//   • AddEmployeeModal (multi-step form)
// ─────────────────────────────────────────────────────────────────────────────

import { useState }          from "react";
import {
  Users, UserCheck, UserX, Stethoscope, Building2,
  TrendingUp, Calendar, Download,
} from "lucide-react";
import { useHRStore }         from "../../hooks/useHRStore";
import EmployeeTable          from "../../components/HR/EmployeeTable";
import DepartmentGrid         from "../../components/HR/DepartmentGrid";
import AddEmployeeModal       from "../../components/HR/AddEmployeeModal";

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, icon: Icon, color, trend }) {
  const colorMap = {
    blue:   { icon: "bg-primary-100 text-primary-600", border: "border-primary-200" },
    green:  { icon: "bg-success-100 text-success-600", border: "border-success-200" },
    amber:  { icon: "bg-warning-100 text-warning-600", border: "border-warning-200" },
    purple: { icon: "bg-violet-100 text-violet-600",   border: "border-violet-200"  },
    teal:   { icon: "bg-teal-100 text-teal-600",       border: "border-teal-200"    },
  };
  const c = colorMap[color] ?? colorMap.blue;

  return (
    <div className={`bg-white rounded-2xl border ${c.border} shadow-card p-5 flex items-center gap-4`}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${c.icon}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-2xl font-display font-bold text-surface-900 leading-none">{value}</p>
        <p className="text-xs font-medium text-surface-500 mt-0.5">{label}</p>
        {sub && (
          <p className="text-[11px] text-surface-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-success-500" />
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

// ── Tab button ────────────────────────────────────────────────────────────────
function Tab({ label, icon: Icon, active, onClick, count }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-semibold
        transition-all border-2
        ${active
          ? "bg-white border-primary-200 text-primary-700 shadow-sm"
          : "border-transparent text-surface-500 hover:text-surface-700 hover:bg-white/50"
        }
      `}
    >
      <Icon className={`w-4 h-4 ${active ? "text-primary-600" : "text-surface-400"}`} />
      {label}
      {count !== undefined && (
        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${active ? "bg-primary-100 text-primary-700" : "bg-surface-200 text-surface-500"}`}>
          {count}
        </span>
      )}
    </button>
  );
}

// Main 
export default function HRDashboard() {
  const {
    employees, departments, stats,
    addEmployee, updateEmployee, deleteEmployee,
    addDepartment, updateDepartment, deleteDepartment,
  } = useHRStore();

  const [activeTab,      setActiveTab]      = useState("employees");
  const [showAddModal,   setShowAddModal]   = useState(false);
  const [editingEmp,     setEditingEmp]     = useState(null); // for future edit modal

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div className="space-y-6">
      {/* Header*/}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-surface-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" /> {today}
          </p>
          <h1 className="font-display text-2xl font-bold text-surface-900">HR Dashboard</h1>
          <p className="text-sm text-surface-500 mt-1">
            Manage staff, schedules, and hospital departments from one place.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-surface-200 bg-white hover:bg-surface-50 text-surface-600 text-sm font-medium transition-colors shadow-sm">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="Total Staff"    value={stats.total}       icon={Users}        color="blue"   sub={`+${stats.newThisMonth} this month`} />
        <StatCard label="Active"         value={stats.active}      icon={UserCheck}    color="green"  />
        <StatCard label="On Leave"       value={stats.onLeave}     icon={UserX}        color="amber"  />
        <StatCard label="Doctors"        value={stats.doctors}     icon={Stethoscope}  color="purple" />
        <StatCard label="Departments"    value={stats.departments} icon={Building2}    color="teal"   />
      </div>

      {/* Tabs */}
      <div className="bg-surface-100 rounded-2xl p-1.5 flex gap-1">
        <Tab
          label="Employees"
          icon={Users}
          active={activeTab === "employees"}
          onClick={() => setActiveTab("employees")}
          count={employees.length}
        />
        <Tab
          label="Departments"
          icon={Building2}
          active={activeTab === "departments"}
          onClick={() => setActiveTab("departments")}
          count={departments.length}
        />
      </div>

      {/* Tab Content */}
      {activeTab === "employees" && (
        <EmployeeTable
          employees={employees}
          onAdd={() => setShowAddModal(true)}
          onEdit={(emp) => {
            // TODO: open EditEmployeeModal (same multi-step form pre-filled)
            setEditingEmp(emp);
            console.log("Edit:", emp);
          }}
          onDelete={deleteEmployee}
          onStatusChange={updateEmployee}
        />
      )}

      {activeTab === "departments" && (
        <DepartmentGrid
          departments={departments}
          onAdd={addDepartment}
          onUpdate={updateDepartment}
          onDelete={deleteDepartment}
        />
      )}

      {/* Add Employee */}
      {showAddModal && (
        <AddEmployeeModal
          onClose={() => setShowAddModal(false)}
          onSave={(data) => {
            addEmployee(data);
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
}