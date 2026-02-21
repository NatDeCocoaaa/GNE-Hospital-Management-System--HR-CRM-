// src/hooks/useDoctorStore.js
import { useState, useCallback, useMemo } from "react";
import { INITIAL_APPOINTMENTS } from "../data/doctorData";

let _notifId = 0;

export function useDoctorStore() {
  const [appointments,  setAppointments]  = useState(INITIAL_APPOINTMENTS);
  const [notifications, setNotifications] = useState([
    {
      id: "n_init_1",
      type: "inpatient_request",
      title: "Inpatient Admission — Carlos Rivera",
      body:  "Dr. Emily Chen has requested bed assignment for GW-01.",
      timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
      read: false,
      patientName: "Carlos Rivera",
      doctorName: "Dr. Emily Chen",
    },
  ]);

  // ── Derived stats ─────────────────────────────────────────────────────────
  const stats = useMemo(() => ({
    total:      appointments.length,
    waiting:    appointments.filter((a) => a.status === "waiting").length,
    inConsult:  appointments.filter((a) => a.status === "in_consult").length,
    completed:  appointments.filter((a) => a.status === "completed").length,
    highPriority: appointments.filter((a) => a.priority === "high" && a.status !== "completed").length,
  }), [appointments]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  // ── Push a notification (e.g. to Front Desk) ─────────────────────────────
  const pushNotification = useCallback((notif) => {
    const id = `n_${++_notifId}_${Date.now()}`;
    setNotifications((prev) => [
      { id, ...notif, timestamp: new Date().toISOString(), read: false },
      ...prev,
    ]);
    return id;
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const dismissNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // ── Update appointment status ─────────────────────────────────────────────
  const setStatus = useCallback((apptId, status) => {
    setAppointments((prev) =>
      prev.map((a) => a.id === apptId ? { ...a, status } : a)
    );
  }, []);

  // ── Save full clinical record ─────────────────────────────────────────────
  const saveClinicalRecord = useCallback(({ apptId, diagnosis, prescriptions, labOrders, treatmentNotes, careDecision }) => {
    setAppointments((prev) =>
      prev.map((a) => {
        if (a.id !== apptId) return a;
        return { ...a, diagnosis, prescriptions, labOrders, treatmentNotes, careDecision };
      })
    );
  }, []);

  // ── Set care decision + trigger notification if inpatient ─────────────────
  const setCareDecision = useCallback((apptId, decision) => {
    setAppointments((prev) => {
      const appt = prev.find((a) => a.id === apptId);
      if (!appt) return prev;

      if (decision === "inpatient") {
        pushNotification({
          type:        "inpatient_request",
          title:       `Inpatient Admission — ${appt.name}`,
          body:        `Dr. Chen has marked ${appt.name} for admission. Please assign a bed.`,
          patientName: appt.name,
          doctorName:  "Dr. Emily Chen",
          patientId:   appt.patientId,
          priority:    appt.priority,
        });
      } else if (decision === "outpatient") {
        pushNotification({
          type:        "discharge_ready",
          title:       `Discharge Ready — ${appt.name}`,
          body:        `${appt.name} has been cleared for discharge by Dr. Chen.`,
          patientName: appt.name,
          doctorName:  "Dr. Emily Chen",
        });
      }

      return prev.map((a) =>
        a.id === apptId ? { ...a, careDecision: decision } : a
      );
    });
  }, [pushNotification]);

  return {
    appointments, stats, notifications, unreadCount,
    pushNotification, markAllRead, dismissNotification,
    setStatus, saveClinicalRecord, setCareDecision,
  };
}