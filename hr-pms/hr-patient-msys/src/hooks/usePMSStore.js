// src/hooks/usePMSStore.js
// ─────────────────────────────────────────────────────────────────────────────
// In-memory state store for the Front Desk / PMS module.
// Exposes patients, beds, doctors, and all mutation functions.
// Replace with API calls (fetch/axios → PHP backend) for production.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useCallback, useMemo } from "react";
import {
  INITIAL_PATIENTS,
  INITIAL_BEDS,
  INITIAL_DOCTORS,
} from "../data/pmsData";

let _patientCounter = 100;

function generatePatientId() {
  return `p${String(++_patientCounter).padStart(3, "0")}`;
}

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0].toUpperCase())
    .slice(0, 2)
    .join("");
}

export function usePMSStore() {
  const [patients, setPatients] = useState(INITIAL_PATIENTS);
  const [beds,     setBeds]     = useState(INITIAL_BEDS);
  const [doctors,  setDoctors]  = useState(INITIAL_DOCTORS);

  // ── Derived: available doctors (role=Doctor, status=Available, currentShift=true) ──
  const availableDoctors = useMemo(
    () => doctors.filter((d) => d.status === "Available" && d.currentShift === true),
    [doctors]
  );

  // ── Derived: bed stats ─────────────────────────────────────────────────────
  const bedStats = useMemo(() => ({
    total:       beds.length,
    empty:       beds.filter((b) => b.status === "empty").length,
    occupied:    beds.filter((b) => b.status === "occupied").length,
    reserved:    beds.filter((b) => b.status === "reserved").length,
    maintenance: beds.filter((b) => b.status === "maintenance").length,
    occupancyPct: Math.round((beds.filter((b) => b.status === "occupied").length / beds.length) * 100),
  }), [beds]);

  // ── Derived: patient stats ─────────────────────────────────────────────────
  const patientStats = useMemo(() => ({
    total:      patients.length,
    admitted:   patients.filter((p) => p.status === "Admitted").length,
    waiting:    patients.filter((p) => p.status === "Waiting").length,
    discharged: patients.filter((p) => p.status === "Discharged").length,
    walkins:    patients.filter((p) => p.visitType === "Walk-in").length,
    today:      patients.filter((p) => {
      const d = new Date(p.registeredAt);
      const n = new Date();
      return d.toDateString() === n.toDateString();
    }).length,
  }), [patients]);

  // ── Register new patient ────────────────────────────────────────────────────
  const registerPatient = useCallback((formData) => {
    const id      = generatePatientId();
    const initials = getInitials(formData.name);
    const newPatient = {
      ...formData,
      id,
      initials,
      status:       "Waiting",
      registeredAt: new Date().toISOString(),
      doctorId:     null,
      bedId:        null,
    };
    setPatients((prev) => [newPatient, ...prev]);
    return id;
  }, []);

  // ── Assign patient → doctor + bed ───────────────────────────────────────────
  const assignPatient = useCallback(({ patientId, doctorId, bedId }) => {
    const doctor = doctors.find((d) => d.id === doctorId);
    const bed    = beds.find((b) => b.id === bedId);
    const patient= patients.find((p) => p.id === patientId);
    if (!doctor || !bed || !patient) throw new Error("Invalid assignment — entity not found.");
    if (bed.status !== "empty")      throw new Error(`Bed ${bedId} is not available.`);
    if (doctor.status !== "Available") throw new Error(`${doctor.name} is not available.`);

    // Update patient
    setPatients((prev) =>
      prev.map((p) =>
        p.id === patientId
          ? { ...p, doctorId, bedId, status: "Admitted" }
          : p
      )
    );

    // Mark bed as occupied
    setBeds((prev) =>
      prev.map((b) =>
        b.id === bedId
          ? {
              ...b,
              status:      "occupied",
              patientId,
              patientName: patient.name,
              doctorId,
              doctorName:  doctor.name,
              assignedAt:  new Date().toISOString(),
            }
          : b
      )
    );

    // Increment doctor patient count
    setDoctors((prev) =>
      prev.map((d) =>
        d.id === doctorId
          ? { ...d, patientCount: d.patientCount + 1 }
          : d
      )
    );

    return { patient, doctor, bed };
  }, [doctors, beds, patients]);

  // ── Discharge patient ───────────────────────────────────────────────────────
  const dischargePatient = useCallback((patientId) => {
    const patient = patients.find((p) => p.id === patientId);
    if (!patient) return;

    setPatients((prev) =>
      prev.map((p) => p.id === patientId ? { ...p, status: "Discharged" } : p)
    );

    if (patient.bedId) {
      setBeds((prev) =>
        prev.map((b) =>
          b.id === patient.bedId
            ? { ...b, status: "empty", patientId: null, patientName: null, doctorId: null, doctorName: null, assignedAt: null }
            : b
        )
      );
    }

    if (patient.doctorId) {
      setDoctors((prev) =>
        prev.map((d) =>
          d.id === patient.doctorId
            ? { ...d, patientCount: Math.max(0, d.patientCount - 1) }
            : d
        )
      );
    }
  }, [patients]);

  // ── Toggle doctor availability (for demo) ───────────────────────────────────
  const toggleDoctorStatus = useCallback((doctorId) => {
    setDoctors((prev) =>
      prev.map((d) => {
        if (d.id !== doctorId) return d;
        const next = d.status === "Available" ? "Busy" : "Available";
        return { ...d, status: next };
      })
    );
  }, []);

  // ── Update bed status manually ──────────────────────────────────────────────
  const updateBedStatus = useCallback((bedId, status) => {
    setBeds((prev) =>
      prev.map((b) => b.id === bedId ? { ...b, status } : b)
    );
  }, []);

  return {
    // State
    patients, beds, doctors,
    // Derived
    availableDoctors, bedStats, patientStats,
    // Mutations
    registerPatient, assignPatient, dischargePatient,
    toggleDoctorStatus, updateBedStatus,
  };
}