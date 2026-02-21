// src/pages/Doctor/DoctorDashboard.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Doctor Dashboard — the complete clinical view. Wires together:
//   • Daily KPI bar
//   • Appointment list (left panel)
//   • Patient header (right panel)
//   • PatientConsultView with 3 tabs
//   • CareDecisionToggle
//   • NotificationCenter
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import {
  Activity, Users, CheckCircle2, Clock, AlertTriangle,
  Stethoscope, Calendar, ChevronLeft, Menu, X,
} from "lucide-react";
import { useDoctorStore }       from "../../hooks/useDoctorStore";
import { CURRENT_DOCTOR, APPT_STATUS } from "../../data/doctorData";
import AppointmentList          from "../../components/Doctor/AppointmentList";
import PatientConsultView       from "../../components/Doctor/PatientConsultView";
import CareDecisionToggle       from "../../components/Doctor/CareDecisionToggle";
import NotificationCenter       from "../../components/Doctor/NotificationCenter";

// ── KPI stat chip ──────────────────────────────────────────────────────────────
function StatChip({ icon: Icon, label, value, color }) {
  const colors = {
    blue:   "bg-primary-50 text-primary-700 border-primary-200",
    amber:  "bg-warning-50 text-warning-700 border-warning-200",
    green:  "bg-success-50 text-success-700 border-success-200",
    red:    "bg-danger-50  text-danger-700  border-danger-200",
  };
  return (
    <div className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border ${colors[color] ?? colors.blue}`}>
      <Icon className="w-4 h-4 shrink-0" />
      <div>
        <p className="text-lg font-display font-bold leading-none">{value}</p>
        <p className="text-[10px] font-semibold uppercase tracking-wider opacity-80">{label}</p>
      </div>
    </div>
  );
}

// ── Patient identity header ────────────────────────────────────────────────────
function PatientHeader({ appt, onBack }) {
  const visitColors = {
    "Walk-in":    "bg-warning-100 text-warning-700",
    "Appointment":"bg-primary-100 text-primary-700",
    "Emergency":  "bg-danger-100  text-danger-700",
    "Referral":   "bg-violet-100  text-violet-700",
  };
  const AVATAR_COLORS = [
    "bg-blue-500","bg-violet-500","bg-emerald-500","bg-orange-500",
    "bg-pink-500","bg-cyan-500","bg-amber-600","bg-teal-500",
  ];
  const avatarBg = AVATAR_COLORS[appt.patientId?.charCodeAt(1) % AVATAR_COLORS.length] ?? "bg-primary-500";
  const initials = appt.name.split(" ").map((w) => w[0]).join("").slice(0, 2);
  const s = APPT_STATUS[appt.status];

  return (
    <div
      className="rounded-2xl overflow-hidden mb-5 shadow-card"
      style={{ background: "linear-gradient(135deg, #1e40af 0%, #2563eb 60%, #0ea5e9 100%)" }}
    >
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 rounded-2xl opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />
      <div className="relative p-5">
        {/* Back button (mobile) */}
        <button onClick={onBack} className="lg:hidden flex items-center gap-1 text-blue-200 text-xs font-semibold mb-3 hover:text-white transition-colors">
          <ChevronLeft className="w-3.5 h-3.5" /> Back to list
        </button>

        <div className="flex items-start gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold text-white shrink-0 shadow-lg ${avatarBg}`}>
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <h2 className="font-display text-xl font-bold text-white">{appt.name}</h2>
              {appt.priority === "high" && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-danger-500/90 text-white text-[10px] font-bold">
                  <AlertTriangle className="w-2.5 h-2.5" /> HIGH PRIORITY
                </span>
              )}
            </div>
            <p className="text-blue-200 text-sm">{appt.age} yrs · {appt.gender} · {appt.bloodType}</p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${visitColors[appt.visitType] ?? ""}`}>
                {appt.visitType}
              </span>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${s.bg} ${s.text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${s.dot} ${s.pulse ? "animate-pulse" : ""}`} />
                {s.label}
              </span>
              {appt.bedId && (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/20 text-white">
                  Bed: {appt.bedId}
                </span>
              )}
            </div>
          </div>
          <div className="hidden sm:flex flex-col items-end gap-1 text-right shrink-0">
            <p className="text-blue-200 text-[11px] font-semibold">Chief Complaint</p>
            <p className="text-white text-xs max-w-[160px] text-right leading-snug">{appt.reason}</p>
            <p className="text-blue-300 text-[11px] mt-1">🕐 {appt.appointmentTime}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Empty state ────────────────────────────────────────────────────────────────
function EmptyConsult() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-primary-50 border-2 border-primary-100 flex items-center justify-center mb-4">
        <Stethoscope className="w-8 h-8 text-primary-300" />
      </div>
      <h3 className="font-display text-lg font-semibold text-surface-600 mb-1">Select a Patient</h3>
      <p className="text-sm text-surface-400 max-w-xs">
        Choose an appointment from the left panel to begin the consultation and access the clinical record.
      </p>
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────────────────
export default function DoctorDashboard() {
  const {
    appointments, stats, notifications, unreadCount,
    markAllRead, dismissNotification,
    setStatus, saveClinicalRecord, setCareDecision,
  } = useDoctorStore();

  const [selectedAppt, setSelectedAppt] = useState(appointments.find((a) => a.status === "in_consult") ?? null);
  const [mobileShowConsult, setMobileShowConsult] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const today = new Date().toLocaleDateString("en-US", {
    weekday:"long", month:"long", day:"numeric",
  });

  const handleSelectAppt = (appt) => {
    setSelectedAppt(appt);
    setMobileShowConsult(true);
  };

  const handleStartConsult = (apptId) => {
    setStatus(apptId, "in_consult");
    const appt = appointments.find((a) => a.id === apptId);
    if (appt) handleSelectAppt(appt);
  };

  const handleSaveDiagnosis = ({ apptId, diagnosis }) => {
    saveClinicalRecord({ apptId, diagnosis, prescriptions: selectedAppt?.prescriptions ?? [], labOrders: selectedAppt?.labOrders ?? [], treatmentNotes: selectedAppt?.treatmentNotes ?? "", careDecision: selectedAppt?.careDecision ?? null });
    // Reflect in local selection
    setSelectedAppt((p) => p ? { ...p, diagnosis } : p);
  };

  const handleSaveTreatment = ({ apptId, prescriptions, labOrders, treatmentNotes }) => {
    saveClinicalRecord({ apptId, diagnosis: selectedAppt?.diagnosis ?? null, prescriptions, labOrders, treatmentNotes, careDecision: selectedAppt?.careDecision ?? null });
    setSelectedAppt((p) => p ? { ...p, prescriptions, labOrders, treatmentNotes } : p);
  };

  const handleCareDecision = (decision) => {
    if (!selectedAppt) return;
    setCareDecision(selectedAppt.id, decision);
    setSelectedAppt((p) => p ? { ...p, careDecision: decision } : p);
    if (selectedAppt.status === "in_consult") {
      setStatus(selectedAppt.id, "completed");
      setSelectedAppt((p) => p ? { ...p, status: "completed" } : p);
    }
  };

  // Keep selectedAppt in sync with store
  const liveAppt = selectedAppt
    ? (appointments.find((a) => a.id === selectedAppt.id) ?? selectedAppt)
    : null;

  return (
    <div className="flex flex-col h-full min-h-0 space-y-5">

      {/* ── Page Header ───────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 shrink-0">
        <div>
          <p className="text-xs font-semibold text-surface-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" /> {today}
          </p>
          <h1 className="font-display text-2xl font-bold text-surface-900">
            Good morning, {CURRENT_DOCTOR.name.split(" ").slice(1).join(" ")} 👋
          </h1>
          <p className="text-sm text-surface-500 mt-1">
            {CURRENT_DOCTOR.specialization} · Shift {CURRENT_DOCTOR.shiftStart}–{CURRENT_DOCTOR.shiftEnd}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <NotificationCenter
            notifications={notifications}
            unreadCount={unreadCount}
            onMarkAllRead={markAllRead}
            onDismiss={dismissNotification}
          />
        </div>
      </div>

      {/* ── KPI Strip ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-3 shrink-0">
        <StatChip icon={Users}        label="Today's Patients"  value={stats.total}       color="blue"  />
        <StatChip icon={Clock}        label="Waiting"           value={stats.waiting}      color="amber" />
        <StatChip icon={Activity}     label="In Consult"        value={stats.inConsult}    color="blue"  />
        <StatChip icon={CheckCircle2} label="Completed"         value={stats.completed}    color="green" />
        {stats.highPriority > 0 && (
          <StatChip icon={AlertTriangle} label="High Priority"  value={stats.highPriority} color="red"   />
        )}
      </div>

      {/* ── Main 2-panel layout ───────────────────────────────────────────────── */}
      <div className="flex gap-5 flex-1 min-h-0">

        {/* LEFT: Appointment list */}
        <div className={`
          shrink-0 w-full lg:w-[340px] overflow-y-auto
          ${mobileShowConsult ? "hidden lg:block" : "block"}
        `}>
          <div className="mb-3">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-surface-500">
              Today's Schedule · {appointments.length} appointments
            </h2>
          </div>
          <AppointmentList
            appointments={appointments}
            selectedId={liveAppt?.id}
            onSelect={handleSelectAppt}
            onStartConsult={handleStartConsult}
          />
        </div>

        {/* RIGHT: Consult area */}
        <div className={`
          flex-1 min-w-0 overflow-y-auto
          ${mobileShowConsult ? "block" : "hidden lg:block"}
        `}>
          {!liveAppt ? (
            <div className="h-full">
              <EmptyConsult />
            </div>
          ) : (
            <div className="space-y-5">
              {/* Patient header card */}
              <PatientHeader
                appt={liveAppt}
                onBack={() => setMobileShowConsult(false)}
              />

              {/* Clinical tabs + Care decision side by side */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

                {/* Clinical tabs (2/3 width on xl) */}
                <div className="xl:col-span-2 bg-white rounded-2xl border border-surface-200 shadow-card p-5">
                  <PatientConsultView
                    appt={liveAppt}
                    onSaveDiagnosis={handleSaveDiagnosis}
                    onSaveTreatment={handleSaveTreatment}
                  />
                </div>

                {/* Right sidebar: Care decision */}
                <div className="space-y-4">
                  <CareDecisionToggle
                    current={liveAppt.careDecision}
                    patientName={liveAppt.name}
                    onDecide={handleCareDecision}
                    disabled={liveAppt.status === "cancelled"}
                  />

                  {/* Quick patient info card */}
                  <div className="bg-white rounded-2xl border border-surface-200 shadow-card p-5 space-y-3">
                    <h3 className="text-[11px] font-bold uppercase tracking-widest text-surface-500">Patient Info</h3>
                    {[
                      { label: "Patient ID",   value: liveAppt.patientId },
                      { label: "Visit Type",   value: liveAppt.visitType },
                      { label: "Blood Type",   value: liveAppt.bloodType },
                      { label: "Allergies",    value: liveAppt.allergies.length > 0 ? liveAppt.allergies.join(", ") : "None known" },
                      { label: "Current Meds", value: liveAppt.currentMeds.length > 0 ? `${liveAppt.currentMeds.length} medications` : "None" },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between items-start gap-2">
                        <span className="text-xs text-surface-500 font-medium shrink-0">{label}</span>
                        <span className="text-xs text-surface-800 font-semibold text-right">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}