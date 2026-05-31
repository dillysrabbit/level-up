import { useNavigate } from "react-router-dom";
import type { ReactNode } from "react";
import { initials } from "../lib/format";

export function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: "h-9 w-9 text-sm",
    md: "h-11 w-11 text-base",
    lg: "h-16 w-16 text-2xl",
  };
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-brand-100 font-bold text-brand-700 ${sizes[size]}`}
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
    <div className="mb-4">
      {back && (
        <button onClick={() => navigate(-1)} className="btn-ghost mb-2 -ml-2 px-2 py-1 text-sm">
          ← Zurück
        </button>
      )}
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
          {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
        </div>
        {action}
      </div>
    </div>
  );
}

export function EmptyState({
  icon = "✨",
  title,
  hint,
  action,
}: {
  icon?: string;
  title: string;
  hint?: string;
  action?: ReactNode;
}) {
  return (
    <div className="card flex flex-col items-center gap-2 px-6 py-10 text-center">
      <span className="text-4xl">{icon}</span>
      <p className="font-semibold text-slate-700">{title}</p>
      {hint && <p className="max-w-sm text-sm text-slate-500">{hint}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

const statusStyles: Record<string, string> = {
  offen: "bg-slate-100 text-slate-600",
  in_arbeit: "bg-amber-100 text-amber-700",
  erreicht: "bg-emerald-100 text-emerald-700",
};
const statusLabels: Record<string, string> = {
  offen: "Offen",
  in_arbeit: "In Arbeit",
  erreicht: "Erreicht",
};

export function StatusChip({ status }: { status: string }) {
  return <span className={`chip ${statusStyles[status] ?? statusStyles.offen}`}>{statusLabels[status] ?? status}</span>;
}
