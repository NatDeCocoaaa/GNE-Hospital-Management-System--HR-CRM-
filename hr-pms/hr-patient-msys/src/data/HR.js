// src/data/hrData.js
// ─────────────────────────────────────────────────────────────────────────────
// Central mock data store for the HR module.
// Replace these with real API calls (fetch/axios) pointing to your PHP backend.
// ─────────────────────────────────────────────────────────────────────────────

export const DEPARTMENTS = [
  { id: "d001", name: "Internal Medicine",    head: "Dr. Emily Chen",      staffCount: 24, color: "#2563eb", icon: "🫀" },
  { id: "d002", name: "Emergency Medicine",   head: "Dr. Marcus Webb",     staffCount: 18, color: "#dc2626", icon: "🚨" },
  { id: "d003", name: "Pediatrics",           head: "Dr. Aisha Patel",     staffCount: 15, color: "#16a34a", icon: "👶" },
  { id: "d004", name: "Radiology",            head: "Dr. Lin Zhao",        staffCount: 10, color: "#9333ea", icon: "🩻" },
  { id: "d005", name: "Surgery",              head: "Dr. Robert Kim",      staffCount: 20, color: "#ea580c", icon: "🔬" },
  { id: "d006", name: "Cardiology",           head: "Dr. Fatima Hassan",   staffCount: 14, color: "#0891b2", icon: "💓" },
  { id: "d007", name: "Neurology",            head: "Dr. James Osei",      staffCount: 11, color: "#7c3aed", icon: "🧠" },
  { id: "d008", name: "Human Resources",      head: "Sarah Mitchell",      staffCount: 8,  color: "#0d9488", icon: "👥" },
  { id: "d009", name: "Patient Services",     head: "James Reyes",         staffCount: 12, color: "#d97706", icon: "🏥" },
  { id: "d010", name: "Pharmacy",             head: "Dr. Nadia Ortiz",     staffCount: 9,  color: "#be185d", icon: "💊" },
];

export const ROLES = ["Doctor", "Nurse", "HR", "FrontDesk", "Pharmacist", "Radiologist", "Technician", "Admin"];

export const SPECIALIZATIONS = [
  "Cardiologist", "Neurologist", "Pediatrician", "General Surgeon", "Orthopedic Surgeon",
  "Radiologist", "Emergency Medicine", "Internal Medicine", "Dermatologist", "Psychiatrist",
  "Ophthalmologist", "ENT Specialist", "Oncologist", "Nephrologist", "Pulmonologist",
  "Gastroenterologist", "Endocrinologist", "Rheumatologist", "Urologist", "Anesthesiologist",
];

export const SHIFT_TEMPLATES = [
  { label: "Morning",  start: "07:00", end: "15:00" },
  { label: "Afternoon",start: "15:00", end: "23:00" },
  { label: "Night",    start: "23:00", end: "07:00" },
  { label: "Day",      start: "08:00", end: "17:00" },
  { label: "Custom",   start: "",      end: "" },
];

export const STATUS_OPTIONS = ["Active", "On Leave", "Inactive", "Probation"];

// ── Seed employees ─────────────────────────────────────────────────────────────
export const INITIAL_EMPLOYEES = [
  {
    id: "e001", name: "Dr. Emily Chen",    email: "e.chen@medicore.com",
    role: "Doctor",    department: "Internal Medicine",  status: "Active",
    specialization: "Internal Medicine",   shiftStart: "08:00", shiftEnd: "17:00",
    phone: "+1 555-0101", joined: "2019-03-15", avatar: "EC",
  },
  {
    id: "e002", name: "Dr. Marcus Webb",   email: "m.webb@medicore.com",
    role: "Doctor",    department: "Emergency Medicine", status: "Active",
    specialization: "Emergency Medicine",  shiftStart: "07:00", shiftEnd: "15:00",
    phone: "+1 555-0102", joined: "2017-08-22", avatar: "MW",
  },
  {
    id: "e003", name: "Sarah Mitchell",    email: "s.mitchell@medicore.com",
    role: "HR",        department: "Human Resources",    status: "Active",
    specialization: null, shiftStart: "09:00", shiftEnd: "18:00",
    phone: "+1 555-0103", joined: "2020-01-10", avatar: "SM",
  },
  {
    id: "e004", name: "James Reyes",       email: "j.reyes@medicore.com",
    role: "FrontDesk", department: "Patient Services",   status: "Active",
    specialization: null, shiftStart: "08:00", shiftEnd: "16:00",
    phone: "+1 555-0104", joined: "2021-06-01", avatar: "JR",
  },
  {
    id: "e005", name: "Dr. Aisha Patel",   email: "a.patel@medicore.com",
    role: "Doctor",    department: "Pediatrics",         status: "On Leave",
    specialization: "Pediatrician",        shiftStart: "09:00", shiftEnd: "18:00",
    phone: "+1 555-0105", joined: "2018-11-30", avatar: "AP",
  },
  {
    id: "e006", name: "Dr. Lin Zhao",      email: "l.zhao@medicore.com",
    role: "Radiologist", department: "Radiology",        status: "Active",
    specialization: "Radiologist",         shiftStart: "08:00", shiftEnd: "16:00",
    phone: "+1 555-0106", joined: "2016-04-14", avatar: "LZ",
  },
  {
    id: "e007", name: "Maria Santos",      email: "m.santos@medicore.com",
    role: "Nurse",     department: "Surgery",            status: "Active",
    specialization: null, shiftStart: "07:00", shiftEnd: "15:00",
    phone: "+1 555-0107", joined: "2022-02-18", avatar: "MS",
  },
  {
    id: "e008", name: "Dr. Robert Kim",    email: "r.kim@medicore.com",
    role: "Doctor",    department: "Surgery",            status: "Active",
    specialization: "General Surgeon",     shiftStart: "06:00", shiftEnd: "14:00",
    phone: "+1 555-0108", joined: "2015-09-05", avatar: "RK",
  },
  {
    id: "e009", name: "Dr. Fatima Hassan", email: "f.hassan@medicore.com",
    role: "Doctor",    department: "Cardiology",         status: "Probation",
    specialization: "Cardiologist",        shiftStart: "08:00", shiftEnd: "17:00",
    phone: "+1 555-0109", joined: "2024-01-08", avatar: "FH",
  },
  {
    id: "e010", name: "Tom Bradley",       email: "t.bradley@medicore.com",
    role: "Technician", department: "Radiology",         status: "On Leave",
    specialization: null, shiftStart: "08:00", shiftEnd: "16:00",
    phone: "+1 555-0110", joined: "2023-07-22", avatar: "TB",
  },
  {
    id: "e011", name: "Dr. James Osei",    email: "j.osei@medicore.com",
    role: "Doctor",    department: "Neurology",          status: "Active",
    specialization: "Neurologist",         shiftStart: "09:00", shiftEnd: "18:00",
    phone: "+1 555-0111", joined: "2020-05-19", avatar: "JO",
  },
  {
    id: "e012", name: "Dr. Nadia Ortiz",   email: "n.ortiz@medicore.com",
    role: "Pharmacist", department: "Pharmacy",          status: "Active",
    specialization: null, shiftStart: "08:00", shiftEnd: "17:00",
    phone: "+1 555-0112", joined: "2021-11-03", avatar: "NO",
  },
];

// ── Status color map ───────────────────────────────────────────────────────────
export const STATUS_COLORS = {
  "Active":     { bg: "bg-success-100",  text: "text-success-700",  dot: "bg-success-500"  },
  "On Leave":   { bg: "bg-warning-100",  text: "text-warning-600",  dot: "bg-warning-500"  },
  "Inactive":   { bg: "bg-surface-100",  text: "text-surface-500",  dot: "bg-surface-400"  },
  "Probation":  { bg: "bg-primary-100",  text: "text-primary-700",  dot: "bg-primary-500"  },
};

// ── Role color map ─────────────────────────────────────────────────────────────
export const ROLE_COLORS = {
  "Doctor":     "bg-blue-100 text-blue-700",
  "Nurse":      "bg-pink-100 text-pink-700",
  "HR":         "bg-violet-100 text-violet-700",
  "FrontDesk":  "bg-sky-100 text-sky-700",
  "Pharmacist": "bg-emerald-100 text-emerald-700",
  "Radiologist":"bg-purple-100 text-purple-700",
  "Technician": "bg-orange-100 text-orange-700",
  "Admin":      "bg-gray-100 text-gray-700",
};