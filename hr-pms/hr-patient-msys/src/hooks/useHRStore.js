// ─────────────────────────────────────────────────────────────────────────────
// Lightweight in-memory store for the HR module using useState + useCallback.
// Swap the mock arrays for real API calls when connecting to your PHP backend.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useCallback } from "react";
import { INITIAL_EMPLOYEES, DEPARTMENTS } from "src/data/hrData";

let _empId  = 100; // auto-increment mock IDs
let _deptId = 20;

export function useHRStore() {
  const [employees,   setEmployees]   = useState(INITIAL_EMPLOYEES);
  const [departments, setDepartments] = useState(DEPARTMENTS);

  // ── Employee CRUD ─────────────────────────────────────────────────────────
  const addEmployee = useCallback((data) => {
    const id = `e${String(++_empId).padStart(3, "0")}`;
    const initials = data.name
      .split(" ")
      .filter(Boolean)
      .map((w) => w[0].toUpperCase())
      .slice(0, 2)
      .join("");
    setEmployees((prev) => [
      { ...data, id, avatar: initials, joined: new Date().toISOString().split("T")[0] },
      ...prev,
    ]);
    return id;
  }, []);

  const updateEmployee = useCallback((id, patch) => {
    setEmployees((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...patch } : e))
    );
  }, []);

  const deleteEmployee = useCallback((id) => {
    setEmployees((prev) => prev.filter((e) => e.id !== id));
  }, []);

  // ── Department CRUD ────
  const addDepartment = useCallback((data) => {
    const id = `d${String(++_deptId).padStart(3, "0")}`;
    setDepartments((prev) => [...prev, { ...data, id, staffCount: 0 }]);
    return id;
  }, []);

  const updateDepartment = useCallback((id, patch) => {
    setDepartments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...patch } : d))
    );
  }, []);

  const deleteDepartment = useCallback((id) => {
    setDepartments((prev) => prev.filter((d) => d.id !== id));
  }, []);

  // ── Derived stats ───
  const stats = {
    total:       employees.length,
    active:      employees.filter((e) => e.status === "Active").length,
    onLeave:     employees.filter((e) => e.status === "On Leave").length,
    doctors:     employees.filter((e) => e.role === "Doctor").length,
    departments: departments.length,
    newThisMonth: employees.filter((e) => {
      const joined = new Date(e.joined);
      const now    = new Date();
      return joined.getMonth() === now.getMonth() && joined.getFullYear() === now.getFullYear();
    }).length,
  };

  return {
    employees, departments, stats,
    addEmployee, updateEmployee, deleteEmployee,
    addDepartment, updateDepartment, deleteDepartment,
  };
}