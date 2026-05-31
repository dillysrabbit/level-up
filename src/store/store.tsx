import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AppData, Employee, Goal, Visit } from "../types";
import { emptyData, uid } from "./storage";
import { supabase } from "../lib/supabase";

interface StoreContextValue {
  data: AppData;
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;

  // Mitarbeiter
  addEmployee: (input: Omit<Employee, "id" | "createdAt">) => Employee;
  updateEmployee: (id: string, patch: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  getEmployee: (id: string) => Employee | undefined;

  // Visiten
  addVisit: (input: Omit<Visit, "id" | "createdAt">) => Visit;
  updateVisit: (id: string, patch: Partial<Visit>) => void;
  deleteVisit: (id: string) => void;
  visitsOf: (employeeId: string) => Visit[];

  // Ziele
  addGoal: (input: Omit<Goal, "id" | "createdAt">) => Goal;
  updateGoal: (id: string, patch: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  goalsOf: (employeeId: string) => Goal[];

  // Verwaltung
  replaceAll: (data: AppData) => Promise<void>;
  resetAll: () => Promise<void>;
}

const StoreContext = createContext<StoreContextValue | null>(null);

/* ---------- Mapping DB (snake_case) <-> App (camelCase) ---------- */

type Row = Record<string, unknown>;

const toEmployee = (r: Row): Employee => ({
  id: r.id as string,
  name: r.name as string,
  role: (r.role as string) ?? "",
  area: (r.area as string) ?? "",
  notes: (r.notes as string) ?? "",
  createdAt: r.created_at as string,
});

const toVisit = (r: Row): Visit => ({
  id: r.id as string,
  employeeId: r.employee_id as string,
  visitType: (r.visit_type as Visit["visitType"]) ?? "fachkraft",
  date: r.date as string,
  location: (r.location as string) ?? "",
  occasion: (r.occasion as Visit["occasion"]) ?? "routine",
  observations: (r.observations as string) ?? "",
  strengths: (r.strengths as string) ?? "",
  developmentAreas: (r.development_areas as string) ?? "",
  ratings: (r.ratings as Visit["ratings"]) ?? [],
  summary: (r.summary as string) ?? "",
  createdAt: r.created_at as string,
});

const toGoal = (r: Row): Goal => ({
  id: r.id as string,
  employeeId: r.employee_id as string,
  visitId: (r.visit_id as string) ?? undefined,
  title: r.title as string,
  category: (r.category as string) ?? "",
  measures: (r.measures as string) ?? "",
  dueDate: (r.due_date as string) ?? undefined,
  status: (r.status as Goal["status"]) ?? "offen",
  progress: (r.progress as number) ?? 0,
  createdAt: r.created_at as string,
});

const employeeRow = (e: Employee) => ({
  id: e.id,
  name: e.name,
  role: e.role,
  area: e.area,
  notes: e.notes ?? "",
  created_at: e.createdAt,
});

const visitRow = (v: Visit) => ({
  id: v.id,
  employee_id: v.employeeId,
  visit_type: v.visitType,
  date: v.date,
  location: v.location,
  occasion: v.occasion,
  observations: v.observations,
  strengths: v.strengths,
  development_areas: v.developmentAreas,
  ratings: v.ratings,
  summary: v.summary,
  created_at: v.createdAt,
});

const goalRow = (g: Goal) => ({
  id: g.id,
  employee_id: g.employeeId,
  visit_id: g.visitId ?? null,
  title: g.title,
  category: g.category,
  measures: g.measures,
  due_date: g.dueDate || null,
  status: g.status,
  progress: g.progress,
  created_at: g.createdAt,
});

// camelCase-Patch -> snake_case-Spalten (nur für Updates relevante Felder)
const COLUMN_MAP: Record<string, string> = {
  employeeId: "employee_id",
  visitId: "visit_id",
  visitType: "visit_type",
  developmentAreas: "development_areas",
  dueDate: "due_date",
  createdAt: "created_at",
};
function patchToRow(patch: Record<string, unknown>): Row {
  const row: Row = {};
  for (const [k, v] of Object.entries(patch)) {
    const col = COLUMN_MAP[k] ?? k;
    row[col] = col === "due_date" ? (v || null) : v;
  }
  return row;
}

/* ---------- Provider ---------- */

export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>({ ...emptyData });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    const [emp, vis, gol] = await Promise.all([
      supabase.from("employees").select("*"),
      supabase.from("visits").select("*"),
      supabase.from("goals").select("*"),
    ]);
    const firstError = emp.error || vis.error || gol.error;
    if (firstError) {
      setError(firstError.message);
      setLoading(false);
      return;
    }
    setData({
      version: 1,
      employees: (emp.data ?? []).map(toEmployee),
      visits: (vis.data ?? []).map(toVisit),
      goals: (gol.data ?? []).map(toGoal),
    });
    setLoading(false);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const fail = (ctx: string) => (res: { error: { message: string } | null }) => {
    if (res.error) {
      console.error(`LevelUp: ${ctx} fehlgeschlagen.`, res.error);
      setError(res.error.message);
      reload(); // Zustand mit DB resynchronisieren
    }
  };

  /* Mitarbeiter */
  const addEmployee = useCallback((input: Omit<Employee, "id" | "createdAt">) => {
    const employee: Employee = { ...input, id: uid(), createdAt: new Date().toISOString() };
    setData((d) => ({ ...d, employees: [...d.employees, employee] }));
    supabase.from("employees").insert(employeeRow(employee)).then(fail("Mitarbeiter anlegen"));
    return employee;
  }, []);

  const updateEmployee = useCallback((id: string, patch: Partial<Employee>) => {
    setData((d) => ({
      ...d,
      employees: d.employees.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    }));
    supabase.from("employees").update(patchToRow(patch)).eq("id", id).then(fail("Mitarbeiter aktualisieren"));
  }, []);

  const deleteEmployee = useCallback((id: string) => {
    setData((d) => ({
      ...d,
      employees: d.employees.filter((e) => e.id !== id),
      visits: d.visits.filter((v) => v.employeeId !== id),
      goals: d.goals.filter((g) => g.employeeId !== id),
    }));
    // visits/goals werden per ON DELETE CASCADE in der DB mitgelöscht
    supabase.from("employees").delete().eq("id", id).then(fail("Mitarbeiter löschen"));
  }, []);

  /* Visiten */
  const addVisit = useCallback((input: Omit<Visit, "id" | "createdAt">) => {
    const visit: Visit = { ...input, id: uid(), createdAt: new Date().toISOString() };
    setData((d) => ({ ...d, visits: [...d.visits, visit] }));
    supabase.from("visits").insert(visitRow(visit)).then(fail("Visite speichern"));
    return visit;
  }, []);

  const updateVisit = useCallback((id: string, patch: Partial<Visit>) => {
    setData((d) => ({ ...d, visits: d.visits.map((v) => (v.id === id ? { ...v, ...patch } : v)) }));
    supabase.from("visits").update(patchToRow(patch)).eq("id", id).then(fail("Visite aktualisieren"));
  }, []);

  const deleteVisit = useCallback((id: string) => {
    setData((d) => ({ ...d, visits: d.visits.filter((v) => v.id !== id) }));
    supabase.from("visits").delete().eq("id", id).then(fail("Visite löschen"));
  }, []);

  /* Ziele */
  const addGoal = useCallback((input: Omit<Goal, "id" | "createdAt">) => {
    const goal: Goal = { ...input, id: uid(), createdAt: new Date().toISOString() };
    setData((d) => ({ ...d, goals: [...d.goals, goal] }));
    supabase.from("goals").insert(goalRow(goal)).then(fail("Ziel anlegen"));
    return goal;
  }, []);

  const updateGoal = useCallback((id: string, patch: Partial<Goal>) => {
    setData((d) => ({ ...d, goals: d.goals.map((g) => (g.id === id ? { ...g, ...patch } : g)) }));
    supabase.from("goals").update(patchToRow(patch)).eq("id", id).then(fail("Ziel aktualisieren"));
  }, []);

  const deleteGoal = useCallback((id: string) => {
    setData((d) => ({ ...d, goals: d.goals.filter((g) => g.id !== id) }));
    supabase.from("goals").delete().eq("id", id).then(fail("Ziel löschen"));
  }, []);

  const replaceAll = useCallback(
    async (next: AppData) => {
      // Backup-Import: vorhandene Daten ersetzen
      await supabase.from("goals").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      await supabase.from("visits").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      await supabase.from("employees").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      if (next.employees.length)
        await supabase.from("employees").insert(next.employees.map(employeeRow));
      if (next.visits.length) await supabase.from("visits").insert(next.visits.map(visitRow));
      if (next.goals.length) await supabase.from("goals").insert(next.goals.map(goalRow));
      await reload();
    },
    [reload],
  );

  const resetAll = useCallback(async () => {
    await supabase.from("goals").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    await supabase.from("visits").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    await supabase.from("employees").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    await reload();
  }, [reload]);

  const value = useMemo<StoreContextValue>(
    () => ({
      data,
      loading,
      error,
      reload,
      addEmployee,
      updateEmployee,
      deleteEmployee,
      getEmployee: (id) => data.employees.find((e) => e.id === id),
      addVisit,
      updateVisit,
      deleteVisit,
      visitsOf: (employeeId) =>
        data.visits
          .filter((v) => v.employeeId === employeeId)
          .sort((a, b) => b.date.localeCompare(a.date)),
      addGoal,
      updateGoal,
      deleteGoal,
      goalsOf: (employeeId) =>
        data.goals
          .filter((g) => g.employeeId === employeeId)
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
      replaceAll,
      resetAll,
    }),
    [
      data,
      loading,
      error,
      reload,
      addEmployee,
      updateEmployee,
      deleteEmployee,
      addVisit,
      updateVisit,
      deleteVisit,
      addGoal,
      updateGoal,
      deleteGoal,
      replaceAll,
      resetAll,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore muss innerhalb von <StoreProvider> verwendet werden.");
  return ctx;
}
