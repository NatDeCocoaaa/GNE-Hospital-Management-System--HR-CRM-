// src/components/HR/AddEmployeeModal.jsx
// Multi-step form: Step 1 = Personal Info, Step 2 = Role & Schedule, Step 3 = Review
import { useState } from "react";
import {
  X, User, Mail, Phone, Building2, Briefcase, Clock,
  ChevronRight, ChevronLeft, CheckCircle2, Stethoscope,
  Calendar, AlertCircle,
} from "lucide-react";
import {
  DEPARTMENTS, ROLES, SPECIALIZATIONS, SHIFT_TEMPLATES, STATUS_OPTIONS,
} from "../src/data/hrData";

const STEPS = [
  { id: 1, label: "Personal Info",   icon: User },
  { id: 2, label: "Role & Schedule", icon: Briefcase },
  { id: 3, label: "Review",          icon: CheckCircle2 },
];

const EMPTY_FORM = {
  name: "", email: "", phone: "",
  role: "Doctor", department: "Internal Medicine", status: "Active",
  specialization: "", shiftStart: "08:00", shiftEnd: "17:00",
};

function StepIndicator({ current }) {
  return (
    <div className="flex items-center gap-0">
      {STEPS.map((step, i) => {
        const Icon = step.icon;
        const done    = step.id < current;
        const active  = step.id === current;
        return (
          <div key={step.id} className="flex items-center">
            <div className={`
              flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all
              ${active ? "bg-primary-600 text-white shadow-md shadow-primary-200" : ""}
              ${done   ? "bg-success-100 text-success-700" : ""}
              ${!active && !done ? "text-surface-400" : ""}
            `}>
              <span className={`
                flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold
                ${active ? "bg-white text-primary-600" : ""}
                ${done   ? "bg-success-500 text-white" : ""}
                ${!active && !done ? "bg-surface-200 text-surface-500" : ""}
              `}>
                {done ? "✓" : step.id}
              </span>
              <span className="hidden sm:block">{step.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-8 h-0.5 mx-1 transition-colors ${done ? "bg-success-400" : "bg-surface-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function FieldGroup({ label, required, children, hint }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-surface-600 uppercase tracking-wide mb-1.5">
        {label}{required && <span className="text-danger-500 ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="mt-1 text-[11px] text-surface-400">{hint}</p>}
    </div>
  );
}

const inputCls = `
  w-full px-3.5 py-2.5 rounded-xl text-sm text-surface-800 bg-white
  border border-surface-200 placeholder:text-surface-400
  focus:outline-none focus:ring-2 focus:ring-primary-500/25 focus:border-primary-500
  transition-colors shadow-sm
`;

// ----- Personal Info ------
function Step1({ form, onChange, errors }) {
  return (
    <div className="space-y-4">
      <FieldGroup label="Full Name" required>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input
            className={`${inputCls} pl-10 ${errors.name ? "border-danger-400 ring-2 ring-danger-200" : ""}`}
            placeholder="e.g. Dr. John Smith"
            value={form.name}
            onChange={(e) => onChange("name", e.target.value)}
          />
        </div>
        {errors.name && <p className="mt-1 text-[11px] text-danger-600 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.name}</p>}
      </FieldGroup>

      <FieldGroup label="Email Address" required>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input
            type="email"
            className={`${inputCls} pl-10 ${errors.email ? "border-danger-400 ring-2 ring-danger-200" : ""}`}
            placeholder="john.smith@gmail.com"
            value={form.email}
            onChange={(e) => onChange("email", e.target.value)}
          />
        </div>
        {errors.email && <p className="mt-1 text-[11px] text-danger-600 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.email}</p>}
      </FieldGroup>

      <FieldGroup label="Phone Number">
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input
            className={`${inputCls} pl-10`}
            placeholder="+1 555-0000"
            value={form.phone}
            onChange={(e) => onChange("phone", e.target.value)}
          />
        </div>
      </FieldGroup>

      <div className="grid grid-cols-2 gap-4">
        <FieldGroup label="Department" required>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 pointer-events-none" />
            <select
              className={`${inputCls} pl-10 appearance-none`}
              value={form.department}
              onChange={(e) => onChange("department", e.target.value)}
            >
              {DEPARTMENTS.map((d) => (
                <option key={d.id} value={d.name}>{d.name}</option>
              ))}
            </select>
          </div>
        </FieldGroup>

        <FieldGroup label="Status">
          <select
            className={`${inputCls} appearance-none`}
            value={form.status}
            onChange={(e) => onChange("status", e.target.value)}
          >
            {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
          </select>
        </FieldGroup>
      </div>
    </div>
  );
}

// ── Step 2: Role & Schedule ───────
function Step2({ form, onChange }) {
  const isDoctor = form.role === "Doctor";

  const applyShiftTemplate = (tpl) => {
    if (tpl.start) { onChange("shiftStart", tpl.start); onChange("shiftEnd", tpl.end); }
  };

  return (
    <div className="space-y-4">
      <FieldGroup label="Role" required>
        <div className="grid grid-cols-4 gap-2">
          {ROLES.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => onChange("role", r)}
              className={`
                py-2 px-3 rounded-xl text-xs font-semibold border-2 transition-all text-center
                ${form.role === r
                  ? "bg-primary-600 border-primary-600 text-white shadow-md shadow-primary-200"
                  : "bg-white border-surface-200 text-surface-600 hover:border-primary-300 hover:text-primary-600"
                }
              `}
            >
              {r}
            </button>
          ))}
        </div>
      </FieldGroup>

      {/* Doctor-specific: Specialization */}
      {isDoctor && (
        <FieldGroup
          label="Specialization"
          required
          hint="Required for all Doctors. Used for appointment routing."
        >
          <div className="relative">
            <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 pointer-events-none" />
            <select
              className={`${inputCls} pl-10 appearance-none`}
              value={form.specialization}
              onChange={(e) => onChange("specialization", e.target.value)}
            >
              <option value="">Select specialization…</option>
              {SPECIALIZATIONS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        </FieldGroup>
      )}

      {/* Shift Schedule */}
      <FieldGroup label="Shift Schedule" hint="Set the regular working hours for this staff member.">
        {/* Quick templates */}
        <div className="flex flex-wrap gap-2 mb-3">
          {SHIFT_TEMPLATES.filter((t) => t.label !== "Custom").map((tpl) => (
            <button
              key={tpl.label}
              type="button"
              onClick={() => applyShiftTemplate(tpl)}
              className={`
                px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all
                ${form.shiftStart === tpl.start && form.shiftEnd === tpl.end
                  ? "bg-primary-600 text-white border-primary-600"
                  : "bg-surface-50 text-surface-600 border-surface-200 hover:border-primary-300"
                }
              `}
            >
              {tpl.label} <span className="opacity-70">{tpl.start}–{tpl.end}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-medium text-surface-500 mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3 h-3" /> Start Time
            </label>
            <input
              type="time"
              className={inputCls}
              value={form.shiftStart}
              onChange={(e) => onChange("shiftStart", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-surface-500 mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3 h-3" /> End Time
            </label>
            <input
              type="time"
              className={inputCls}
              value={form.shiftEnd}
              onChange={(e) => onChange("shiftEnd", e.target.value)}
            />
          </div>
        </div>
      </FieldGroup>
    </div>
  );
}

// ── Step 3: Review ─────────────────────────────────────────────────────────────
function Step3({ form }) {
  const fields = [
    { label: "Full Name",       value: form.name },
    { label: "Email",           value: form.email },
    { label: "Phone",           value: form.phone || "—" },
    { label: "Department",      value: form.department },
    { label: "Role",            value: form.role },
    { label: "Status",          value: form.status },
    ...(form.role === "Doctor" ? [{ label: "Specialization", value: form.specialization || "—" }] : []),
    { label: "Shift",           value: `${form.shiftStart} – ${form.shiftEnd}` },
  ];

  return (
    <div>
      <div className="rounded-xl border border-surface-200 overflow-hidden">
        <div className="bg-primary-600 px-5 py-3">
          <p className="text-white text-sm font-semibold">Review Employee Details</p>
          <p className="text-primary-200 text-xs">Please confirm before submitting.</p>
        </div>
        <div className="divide-y divide-surface-100">
          {fields.map(({ label, value }) => (
            <div key={label} className="flex justify-between items-center px-5 py-3">
              <span className="text-xs font-semibold text-surface-500 uppercase tracking-wide">{label}</span>
              <span className="text-sm font-medium text-surface-800">{value}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 flex items-start gap-2.5 p-3.5 bg-success-50 border border-success-100 rounded-xl">
        <CheckCircle2 className="w-4 h-4 text-success-600 mt-0.5 shrink-0" />
        <p className="text-xs text-success-700 font-medium">
          An onboarding email will be sent to <strong>{form.email}</strong> with their login credentials.
        </p>
      </div>
    </div>
  );
}

// ── Main Modal ─────────────────────────────────────────────────────────────────
export default function AddEmployeeModal({ onClose, onSave }) {
  const [step,   setStep]   = useState(1);
  const [form,   setForm]   = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [done,   setDone]   = useState(false);

  const onChange = (field, value) => {
    setForm((p) => ({ ...p, [field]: value }));
    setErrors((p) => ({ ...p, [field]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())  e.name  = "Full name is required.";
    if (!form.email.trim()) e.email = "Email address is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (step === 1 && !validate()) return;
    setStep((s) => Math.min(s + 1, 3));
  };

  const back = () => setStep((s) => Math.max(s - 1, 1));

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    onSave(form);
    setSaving(false);
    setDone(true);
    setTimeout(onClose, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-surface-900/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-200">
          <div>
            <h2 className="font-display text-lg font-bold text-surface-900">Add New Employee</h2>
            <p className="text-xs text-surface-500 mt-0.5">Fill in staff details across 3 steps</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-surface-100 text-surface-400 hover:text-surface-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step indicator */}
        <div className="px-6 py-3 bg-surface-50 border-b border-surface-200">
          <StepIndicator current={step} />
        </div>

        {/* Form body */}
        <div className="px-6 py-5 max-h-[60vh] overflow-y-auto">
          {done ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-16 h-16 rounded-full bg-success-100 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-success-600" />
              </div>
              <h3 className="font-display text-xl font-bold text-surface-900 mb-1">Employee Added!</h3>
              <p className="text-sm text-surface-500">
                <strong>{form.name}</strong> has been successfully onboarded.
              </p>
            </div>
          ) : (
            <>
              {step === 1 && <Step1 form={form} onChange={onChange} errors={errors} />}
              {step === 2 && <Step2 form={form} onChange={onChange} />}
              {step === 3 && <Step3 form={form} />}
            </>
          )}
        </div>

        {/* Footer */}
        {!done && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-surface-200 bg-surface-50">
            <button
              onClick={back}
              disabled={step === 1}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-surface-600 hover:bg-surface-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>

            <div className="flex items-center gap-1.5">
              {STEPS.map((s) => (
                <div key={s.id} className={`w-2 h-2 rounded-full transition-all ${s.id === step ? "bg-primary-600 w-5" : s.id < step ? "bg-success-400" : "bg-surface-300"}`} />
              ))}
            </div>

            {step < 3 ? (
              <button
                onClick={next}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-semibold bg-primary-600 hover:bg-primary-700 text-white shadow-sm transition-colors"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-semibold bg-success-600 hover:bg-success-700 text-white shadow-sm transition-colors disabled:opacity-70"
              >
                {saving ? (
                  <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Saving…</>
                ) : (
                  <><CheckCircle2 className="w-4 h-4" />Confirm & Add</>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}