import { useNavigate } from "react-router-dom";
import type { ReactNode } from "react";
import { initials } from "../lib/format";
import { BackIcon } from "./icons";

export function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: "h-9 w-9 text-xs",
    md: "h-11 w-11 text-sm",
    lg: "h-16 w-16 text-xl",
  };
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 font-semibold text-white shadow-sm ${sizes[size]}`}
    >
      {initials(name) || "?"}
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
  back = true,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  back?: boolean;
}) {
  const navigate = useNavigate();
  return (
    <div className="mb-5">
      {back && (
        <button
          onClick={() => navigate(-1)}
          className="mb-3 inline-flex items-center gap-1 text-sm font-medium text-slate-500 transition hover:text-slate-800"
        >
          <BackIcon size={16} strokeWidth={2} />
          Zurück
        </button>
      )}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-[1.7rem] font-bold leading-tight text-slate-900">{title}</h2>
          {subtitle && <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>}
        </div>
        {action && <div className="shrink-0 pt-1">{action}</div>}
      </div>
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  hint,
  action,
}: {
  icon?: ReactNode;
  title: string;
  hint?: string;
  action?: ReactNode;
}) {
  return (
    <div className="card flex flex-col items-center gap-3 px-6 py-12 text-center">
      {icon && (
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
          {icon}
        </div>
      )}
      <p className="font-semibold text-slate-800">{title}</p>
      {hint && <p className="max-w-sm text-sm leading-relaxed text-slate-500">{hint}</p>}
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}

const statusStyles: Record<string, string> = {
  offen: "bg-slate-100 text-slate-600",
  in_arbeit: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",
  erreicht: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200",
};
const statusLabels: Record<string, string> = {
  offen: "Offen",
  in_arbeit: "In Arbeit",
  erreicht: "Erreicht",
};

export function StatusChip({ status }: { status: string }) {
  return (
    <span className={`chip ${statusStyles[status] ?? statusStyles.offen}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
      {statusLabels[status] ?? status}
    </span>
  );
}
