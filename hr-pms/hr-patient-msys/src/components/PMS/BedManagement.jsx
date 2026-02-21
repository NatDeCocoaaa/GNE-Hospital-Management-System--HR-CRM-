// src/components/PMS/BedManagementGrid.jsx
import { useState } from "react";
import { BedDouble, User, Clock, Stethoscope, Filter, ChevronDown } from "lucide-react";
import { WARDS, BED_STATUS_STYLES } from "../../data/pmsData";

const STATUS_FILTERS = ["all", "empty", "occupied", "reserved", "maintenance"];

function BedCell({ bed, selected, onSelect }) {
  const style  = BED_STATUS_STYLES[bed.status];
  const isClickable = bed.status === "empty";
  const isSelected  = selected?.id === bed.id;

  return (
    <button
      type="button"
      onClick={() => isClickable && onSelect(bed)}
      title={
        bed.status === "occupied"
          ? `${bed.patientName} · ${bed.doctorName}`
          : bed.status === "reserved"
          ? "Reserved"
          : bed.status === "maintenance"
          ? "Under maintenance"
          : `Bed ${bed.number} — Available`
      }
      className={`
        relative group flex flex-col items-center justify-center
        w-full aspect-square rounded-xl border-2 transition-all duration-150
        ${style.bg} ${style.border}
        ${isClickable
          ? isSelected
            ? "ring-2 ring-primary-500 ring-offset-1 border-primary-400 scale-105 shadow-md"
            : "hover:scale-105 hover:shadow-md cursor-pointer hover:border-primary-300"
          : "cursor-default"
        }
      `}
    >
      {/* Bed number */}
      <span className={`text-[10px] font-bold leading-none mb-1 ${style.text}`}>
        {bed.id}
      </span>

      {/* Icon */}
      {bed.status === "empty" ? (
        <BedDouble className={`w-5 h-5 ${style.text} opacity-60`} />
      ) : bed.status === "occupied" ? (
        <User className="w-5 h-5 text-danger-500" />
      ) : bed.status === "reserved" ? (
        <Clock className="w-5 h-5 text-warning-500" />
      ) : (
        <span className="text-base">🔧</span>
      )}

      {/* Patient name tooltip (occupied) */}
      {bed.status === "occupied" && (
        <div className="
          absolute -top-14 left-1/2 -translate-x-1/2 z-10
          hidden group-hover:flex flex-col
          bg-surface-900 text-white rounded-lg px-2.5 py-2 text-[10px] font-medium
          whitespace-nowrap shadow-xl pointer-events-none
        ">
          <span className="text-white font-semibold">{bed.patientName}</span>
          <span className="text-surface-400 flex items-center gap-1 mt-0.5">
            <Stethoscope className="w-2.5 h-2.5" />{bed.doctorName}
          </span>
          {/* Arrow */}
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-surface-900 rotate-45" />
        </div>
      )}

      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-primary-600" />
      )}
    </button>
  );
}

function WardSection({ ward, beds, selectedBed, onSelectBed, statusFilter }) {
  const [collapsed, setCollapsed] = useState(false);
  const wardBeds = beds.filter((b) => b.wardId === ward.id);
  const filtered = statusFilter === "all"
    ? wardBeds
    : wardBeds.filter((b) => b.status === statusFilter);

  const stats = {
    empty:    wardBeds.filter((b) => b.status === "empty").length,
    occupied: wardBeds.filter((b) => b.status === "occupied").length,
    total:    wardBeds.length,
  };

  const occupancyPct = Math.round((stats.occupied / stats.total) * 100);

  return (
    <div className="bg-white rounded-2xl border border-surface-200 shadow-card overflow-hidden">
      {/* Ward header */}
      <button
        type="button"
        onClick={() => setCollapsed((p) => !p)}
        className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-surface-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {/* Color swatch */}
          <span className="w-3 h-3 rounded-full shrink-0" style={{ background: ward.color }} />
          <div className="text-left">
            <p className="text-sm font-bold text-surface-900">{ward.name}</p>
            <p className="text-[11px] text-surface-500">
              {stats.occupied}/{stats.total} occupied
              {" · "}
              <span className="text-success-600 font-semibold">{stats.empty} available</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Mini occupancy bar */}
          <div className="hidden sm:block w-24">
            <div className="h-1.5 bg-surface-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${occupancyPct}%`,
                  background: occupancyPct > 80 ? "#dc2626" : occupancyPct > 50 ? "#d97706" : ward.color,
                }}
              />
            </div>
            <p className="text-[10px] text-surface-400 mt-0.5 text-right">{occupancyPct}%</p>
          </div>
          <ChevronDown className={`w-4 h-4 text-surface-400 transition-transform ${collapsed ? "-rotate-90" : ""}`} />
        </div>
      </button>

      {/* Bed grid */}
      {!collapsed && (
        <div className="px-4 pb-4">
          {filtered.length === 0 ? (
            <p className="text-xs text-surface-400 py-4 text-center">No beds match the current filter.</p>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2">
              {filtered.map((bed) => (
                <BedCell
                  key={bed.id}
                  bed={bed}
                  selected={selectedBed}
                  onSelect={onSelectBed}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function BedManagement({ beds, selectedBed, onSelectBed }) {
  const [statusFilter, setStatusFilter] = useState("all");
  const [wardFilter,   setWardFilter]   = useState("all");

  const totalStats = {
    empty:    beds.filter((b) => b.status === "empty").length,
    occupied: beds.filter((b) => b.status === "occupied").length,
    reserved: beds.filter((b) => b.status === "reserved").length,
    maintenance: beds.filter((b) => b.status === "maintenance").length,
  };

  const filteredWards = wardFilter === "all"
    ? WARDS
    : WARDS.filter((w) => w.id === wardFilter);

  return (
    <div>
      {/* Header + controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-bold text-surface-900">Bed Management</h3>
          <p className="text-[11px] text-surface-500">
            {beds.length} total · {totalStats.empty} available · {totalStats.occupied} occupied
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-surface-400 shrink-0" />
          <select
            value={wardFilter}
            onChange={(e) => setWardFilter(e.target.value)}
            className="py-2 pl-3 pr-7 rounded-xl text-xs border border-surface-200 bg-white focus:outline-none appearance-none"
          >
            <option value="all">All Wards</option>
            {WARDS.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-2 pl-3 pr-7 rounded-xl text-xs border border-surface-200 bg-white focus:outline-none appearance-none capitalize"
          >
            {STATUS_FILTERS.map((s) => (
              <option key={s} value={s} className="capitalize">{s === "all" ? "All Statuses" : s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-4">
        {[
          { key: "empty",       label: "Available",    count: totalStats.empty,       color: "bg-success-400" },
          { key: "occupied",    label: "Occupied",     count: totalStats.occupied,    color: "bg-danger-400"  },
          { key: "reserved",    label: "Reserved",     count: totalStats.reserved,    color: "bg-warning-400" },
          { key: "maintenance", label: "Maintenance",  count: totalStats.maintenance, color: "bg-surface-400" },
        ].map(({ key, label, count, color }) => (
          <button
            key={key}
            type="button"
            onClick={() => setStatusFilter(statusFilter === key ? "all" : key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all
              ${statusFilter === key ? "bg-surface-800 text-white border-surface-800" : "bg-white text-surface-600 border-surface-200 hover:border-surface-300"}`}
          >
            <span className={`w-2 h-2 rounded-sm ${color}`} />
            {label}
            <span className={`text-[10px] font-bold ${statusFilter === key ? "text-white/70" : "text-surface-400"}`}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Ward sections */}
      <div className="space-y-3">
        {filteredWards.map((ward) => (
          <WardSection
            key={ward.id}
            ward={ward}
            beds={beds}
            selectedBed={selectedBed}
            onSelectBed={onSelectBed}
            statusFilter={statusFilter}
          />
        ))}
      </div>

      {selectedBed && (
        <div className="mt-3 flex items-center gap-2 px-4 py-3 bg-primary-50 border border-primary-200 rounded-xl">
          <BedDouble className="w-4 h-4 text-primary-600 shrink-0" />
          <p className="text-xs font-semibold text-primary-700">
            Bed <strong>{selectedBed.id}</strong> selected — {selectedBed.wardName}
          </p>
        </div>
      )}
    </div>
  );
}