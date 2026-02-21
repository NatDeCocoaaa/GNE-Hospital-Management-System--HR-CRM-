// src/pages/PMS/FrontDeskDashboard.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Front Desk / PMS orchestrator page. Wires together:
//   • KPI stat cards
//   • Patient queue table
//   • Doctor Availability Checker
//   • Bed Management Grid
//   • Patient Registration Form (modal)
//   • Assign Patient Modal
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useMemo } from "react";
import {
  UserPlus, Users, BedDouble, Stethoscope, Activity,
  Clock, Calendar, Search, UserCheck, ChevronRight,
  Zap, MoreHorizontal, LogOut, Eye,
} from "lucide-react";
import { usePMSStore }             from "../../hooks/usePMSStore";
import PatientRegistrationForm     from "../../components/PMS/PatientRegistrationForm";
import DoctorAvailabilityChecker   from "../../components/PMS/DoctorAvailabilityChecker";
import BedManagementGrid           from "../../components/PMS/BedManagementGrid";
import AssignPatientModal          from "../../components/PMS/AssignPatientModal";

// ── Small KPI card ─────────────────────────────────────────────────────────────
function KpiCard({ label, value, sub, icon: Icon, accent }) {
  const accents = {
    blue:   "bg-primary-50  border-primary-200  text-primary-600",
    green:  "bg-success-50  border-success-200  text-success-600",
    red:    "bg-danger-50   border-danger-200   text-danger-600",
    amber:  "bg-warning-50  border-warning-200  text-warning-600",
    violet: "bg-violet-50   border-violet-200   text-violet-600",
  };
  const [iconBg, , iconText] = (accents[accent] ?? accents.blue).split(" ");

  return (
    <div className="bg-white rounded-2xl border border-surface-200 shadow-card p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
        <Icon className={`w-5 h-5 ${iconText}`} />
      </div>
      <div>
        <p className="font-display text-2xl font-bold text-surface-900 leading-none">{value}</p>
        <p className="text-xs text-surface-500 mt-0.5">{label}</p>
        {sub && <p className="text-[11px] text-success-600 font-medium mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ── Status badge ───────────────────────────────────────────────────────────────
const STATUS_BADGE = {
  "Waiting":             "bg-warning-100 text-warning-700",
  "Admitted":            "bg-success-100 text-success-700",
  "Discharged":          "bg-surface-100 text-surface-500",
  "Under Observation":   "bg-primary-100 text-primary-700",
};
const VISIT_BADGE = {
  "Walk-in":    "bg-warning-50  text-warning-600",
  "Appointment":"bg-primary-50  text-primary-700",
  "Emergency":  "bg-danger-50   text-danger-700",
  "Referral":   "bg-violet-50   text-violet-700",
};

function PatientRow({ patient, onAssign, onDischarge, onView }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const timeAgo = (() => {
    const diff = Date.now() - new Date(patient.registeredAt).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  })();

  return (
    <tr className="hover:bg-surface-50 transition-colors group">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-xl bg-primary-100 flex items-center justify-center text-xs font-bold text-primary-700 shrink-0">
            {(patient.initials ?? patient.name.split(" ").map((w) => w[0]).join("")).slice(0,2)}
          </span>
          <div>
            <p className="text-sm font-semibold text-surface-900">{patient.name}</p>
            <p className="text-xs text-surface-500">{patient.age}y · {patient.gender}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${VISIT_BADGE[patient.visitType] ?? ""}`}>
          {patient.visitType}
        </span>
      </td>
      <td className="px-4 py-3 max-w-[200px]">
        <p className="text-xs text-surface-600 truncate">{patient.reason}</p>
      </td>
      <td className="px-4 py-3">
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_BADGE[patient.status] ?? ""}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${patient.status === "Waiting" ? "bg-warning-500 animate-pulse" : patient.status === "Admitted" ? "bg-success-500" : "bg-surface-400"}`} />
          {patient.status}
        </span>
      </td>
      <td className="px-4 py-3">
        <p className="text-xs text-surface-500">{patient.bedId ?? "—"}</p>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5 text-xs text-surface-500">
          <Clock className="w-3 h-3" />{timeAgo}
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1 justify-end">
          {patient.status === "Waiting" && (
            <button
              onClick={() => onAssign(patient.id)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-[11px] font-semibold transition-colors"
            >
              <UserCheck className="w-3 h-3" /> Assign
            </button>
          )}
          <div className="relative">
            <button
              onClick={() => setMenuOpen((p) => !p)}
              className="p-1.5 rounded-lg hover:bg-surface-200 text-surface-400 transition-colors"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-8 z-20 w-40 bg-white rounded-xl border border-surface-200 shadow-xl overflow-hidden">
                  <button
                    onClick={() => { onView(patient); setMenuOpen(false); }}
                    className="flex items-center gap-2 w-full px-3 py-2.5 text-xs text-surface-700 hover:bg-surface-50"
                  >
                    <Eye className="w-3.5 h-3.5 text-surface-400" /> View Details
                  </button>
                  {patient.status !== "Discharged" && (
                    <button
                      onClick={() => { onDischarge(patient.id); setMenuOpen(false); }}
                      className="flex items-center gap-2 w-full px-3 py-2.5 text-xs text-danger-600 hover:bg-danger-50"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Discharge
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}

// ── Tabs ───────────────────────────────────────────────────────────────────────
const TABS = [
  { id: "overview",  label: "Overview",        icon: Activity   },
  { id: "patients",  label: "Patient Queue",   icon: Users      },
  { id: "beds",      label: "Bed Management",  icon: BedDouble  },
];

// ── Main Dashboard ─────────────────────────────────────────────────────────────
export default function FrontDeskDashboard() {
  const {
    patients, beds, doctors,
    availableDoctors, bedStats, patientStats,
    registerPatient, assignPatient, dischargePatient,
  } = usePMSStore();

  const [activeTab,          setActiveTab]          = useState("overview");
  const [showRegister,       setShowRegister]       = useState(false);
  const [showAssign,         setShowAssign]         = useState(false);
  const [preselectedPatient, setPreselectedPatient] = useState(null);
  const [selectedDoctor,     setSelectedDoctor]     = useState(null);
  const [selectedBed,        setSelectedBed]        = useState(null);
  const [patientSearch,      setPatientSearch]      = useState("");
  const [patientFilter,      setPatientFilter]      = useState("all");

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });

  const openAssign = (patientId = null) => {
    setPreselectedPatient(patientId);
    setShowAssign(true);
  };

  const handleAssign = ({ patientId, doctorId, bedId }) => {
    const result = assignPatient({ patientId, doctorId, bedId });
    setSelectedDoctor(null);
    setSelectedBed(null);
    return result;
  };

  // Filtered patient list
  const filteredPatients = useMemo(() => {
    return patients.filter((p) => {
      const matchesStatus = patientFilter === "all" || p.status === patientFilter;
      const matchesSearch = p.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
                            p.reason.toLowerCase().includes(patientSearch.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [patients, patientFilter, patientSearch]);

  return (
    <div className="space-y-6">

      {/* ── Page Header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-surface-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" /> {today}
          </p>
          <h1 className="font-display text-2xl font-bold text-surface-900">Front Desk</h1>
          <p className="text-sm text-surface-500 mt-1">
            Patient registration, doctor assignment &amp; bed management.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => openAssign()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-surface-200 bg-white hover:bg-surface-50 text-surface-700 text-sm font-medium transition-colors shadow-sm"
          >
            <UserCheck className="w-4 h-4 text-primary-600" /> Assign Patient
          </button>
          <button
            onClick={() => setShowRegister(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold shadow-sm transition-colors"
          >
            <UserPlus className="w-4 h-4" /> Register Patient
          </button>
        </div>
      </div>

      {/* ── KPI Row ──────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard label="Total Patients"   value={patientStats.total}     icon={Users}       accent="blue"   sub={`+${patientStats.today} today`} />
        <KpiCard label="Waiting"          value={patientStats.waiting}   icon={Clock}       accent="amber"  />
        <KpiCard label="Admitted"         value={patientStats.admitted}  icon={Activity}    accent="green"  />
        <KpiCard label="Beds Available"   value={bedStats.empty}         icon={BedDouble}   accent="violet" sub={`${bedStats.occupancyPct}% occupancy`} />
        <KpiCard label="Avail. Doctors"   value={availableDoctors.length} icon={Stethoscope} accent="green" />
      </div>

      {/* ── Tabs ─────────────────────────────────────────────────────────────── */}
      <div className="bg-surface-100 rounded-2xl p-1.5 flex gap-1 w-fit">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all
              ${activeTab === id
                ? "bg-white text-primary-700 shadow-sm border-2 border-primary-200"
                : "text-surface-500 hover:text-surface-700 border-2 border-transparent"
              }
            `}
          >
            <Icon className={`w-4 h-4 ${activeTab === id ? "text-primary-600" : "text-surface-400"}`} />
            {label}
          </button>
        ))}
      </div>

      {/* ── TAB: Overview ────────────────────────────────────────────────────── */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Patient Queue (condensed) */}
          <div className="xl:col-span-2 bg-white rounded-2xl border border-surface-200 shadow-card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-surface-200">
              <div>
                <h2 className="font-display text-base font-bold text-surface-900">Patient Queue</h2>
                <p className="text-xs text-surface-500">{patientStats.waiting} waiting · {patientStats.admitted} admitted</p>
              </div>
              <button
                onClick={() => setActiveTab("patients")}
                className="flex items-center gap-1 text-xs text-primary-600 font-semibold hover:text-primary-700"
              >
                View all <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-surface-100 bg-surface-50">
                    {["Patient", "Type", "Reason", "Status", "Bed", "Time", ""].map((h) => (
                      <th key={h} className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-surface-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100">
                  {patients.slice(0, 5).map((p) => (
                    <PatientRow
                      key={p.id}
                      patient={p}
                      onAssign={openAssign}
                      onDischarge={dischargePatient}
                      onView={() => {}}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Doctor Availability (sidebar) */}
          <div>
            <DoctorAvailabilityChecker
              doctors={doctors}
              selectedDoctor={selectedDoctor}
              onSelectDoctor={setSelectedDoctor}
              showAllToggle={true}
            />
          </div>
        </div>
      )}

      {/* ── TAB: Patient Queue ───────────────────────────────────────────────── */}
      {activeTab === "patients" && (
        <div className="bg-white rounded-2xl border border-surface-200 shadow-card overflow-hidden">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4 border-b border-surface-200">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 pointer-events-none" />
              <input
                value={patientSearch}
                onChange={(e) => setPatientSearch(e.target.value)}
                placeholder="Search patients…"
                className="w-full pl-9 pr-4 py-2 rounded-xl text-sm border border-surface-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
              />
            </div>
            <div className="flex gap-2">
              {["all","Waiting","Admitted","Discharged"].map((f) => (
                <button
                  key={f}
                  onClick={() => setPatientFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${patientFilter === f ? "bg-primary-600 text-white" : "bg-surface-100 text-surface-600 hover:bg-surface-200"}`}
                >
                  {f === "all" ? "All" : f}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-surface-100 bg-surface-50">
                  {["Patient","Type","Reason","Status","Bed","Time","Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-surface-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                {filteredPatients.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-16 text-center text-surface-400 text-sm">
                      No patients match your filter.
                    </td>
                  </tr>
                ) : (
                  filteredPatients.map((p) => (
                    <PatientRow
                      key={p.id}
                      patient={p}
                      onAssign={openAssign}
                      onDischarge={dischargePatient}
                      onView={() => {}}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Bed Management */}
      {activeTab === "beds" && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <BedManagementGrid
              beds={beds}
              selectedBed={selectedBed}
              onSelectBed={setSelectedBed}
            />
          </div>
          <div>
            <DoctorAvailabilityChecker
              doctors={doctors}
              selectedDoctor={selectedDoctor}
              onSelectDoctor={setSelectedDoctor}
            />
            {/* Quick Assign CTA */}
            {selectedBed && selectedDoctor && (
              <button
                onClick={() => openAssign()}
                className="mt-3 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold shadow-md shadow-primary-200 transition-all"
              >
                <UserCheck className="w-4 h-4" />
                Assign to {selectedBed.id} + {selectedDoctor.name.split(" ").slice(-1)[0]}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Patient Registration */}
      {showRegister && (
        <PatientRegistrationForm
          onClose={() => setShowRegister(false)}
          onRegister={(data) => {
            const id = registerPatient(data);
            return id;
          }}
        />
      )}

      {showAssign && (
        <AssignPatientModal
          patients={patients}
          doctors={doctors}
          beds={beds}
          onClose={() => { setShowAssign(false); setPreselectedPatient(null); }}
          onAssign={handleAssign}
          preselectedPatientId={preselectedPatient}
          preselectedDoctorId={selectedDoctor?.id ?? null}
          preselectedBedId={selectedBed?.id ?? null}
        />
      )}
    </div>
  );
}