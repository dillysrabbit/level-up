import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { AppData, Employee, Goal, Note, SmokeBreak, Visit } from "../types";
import { emptyData, uid } from "./storage";
import { loadPersisted, persist } from "./persistence";

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

  // Notizen
  addNote: (input: Omit<Note, "id" | "createdAt">) => Note;
  updateNote: (id: string, patch: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  notesOf: (employeeId: string) => Note[];

  // Raucherpausen
  addSmokeBreak: (employeeId: string) => SmokeBreak;
  deleteSmokeBreak: (id: string) => void;
  smokeBreaksOf: (employeeId: string) => SmokeBreak[];

  // Verwaltung
  replaceAll: (data: AppData) => Promise<void>;
  resetAll: () => Promise<void>;
}

const StoreContext = createContext<StoreContextValue | null>(null);

/* ---------- Provider ---------- */

export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>({ ...emptyData });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Erst nach dem initialen Laden speichern, sonst würde ein leerer Zustand
  // den vorhandenen Datenbestand überschreiben.
  const readyRef = useRef(false);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    readyRef.current = false;
    try {
      setData(await loadPersisted());
    } catch (err) {
      console.error("LevelUp: Daten konnten nicht geladen werden.", err);
      setError("Daten konnten nicht geladen werden.");
    }
    readyRef.current = true;
    setLoading(false);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  // Jede Änderung landet direkt auf dem Gerät.
  useEffect(() => {
    if (!readyRef.current) return;
    persist(data).catch((err) => {
      console.error("LevelUp: Daten konnten nicht gespeichert werden.", err);
      setError("Daten konnten nicht gespeichert werden – Speicherplatz prüfen.");
    });
  }, [data]);

  /* Mitarbeiter */
  const addEmployee = useCallback((input: Omit<Employee, "id" | "createdAt">) => {
    const employee: Employee = { ...input, id: uid(), createdAt: new Date().toISOString() };
    setData((d) => ({ ...d, employees: [...d.employees, employee] }));
    return employee;
  }, []);

  const updateEmployee = useCallback((id: string, patch: Partial<Employee>) => {
    setData((d) => ({
      ...d,
      employees: d.employees.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    }));
  }, []);

  const deleteEmployee = useCallback((id: string) => {
    setData((d) => ({
      ...d,
      employees: d.employees.filter((e) => e.id !== id),
      visits: d.visits.filter((v) => v.employeeId !== id),
      goals: d.goals.filter((g) => g.employeeId !== id),
      notes: d.notes.filter((n) => n.employeeId !== id),
      smokeBreaks: d.smokeBreaks.filter((s) => s.employeeId !== id),
    }));
  }, []);

  /* Visiten */
  const addVisit = useCallback((input: Omit<Visit, "id" | "createdAt">) => {
    const visit: Visit = { ...input, id: uid(), createdAt: new Date().toISOString() };
    setData((d) => ({ ...d, visits: [...d.visits, visit] }));
    return visit;
  }, []);

  const updateVisit = useCallback((id: string, patch: Partial<Visit>) => {
    setData((d) => ({ ...d, visits: d.visits.map((v) => (v.id === id ? { ...v, ...patch } : v)) }));
  }, []);

  const deleteVisit = useCallback((id: string) => {
    setData((d) => ({ ...d, visits: d.visits.filter((v) => v.id !== id) }));
  }, []);

  /* Ziele */
  const addGoal = useCallback((input: Omit<Goal, "id" | "createdAt">) => {
    const goal: Goal = { ...input, id: uid(), createdAt: new Date().toISOString() };
    setData((d) => ({ ...d, goals: [...d.goals, goal] }));
    return goal;
  }, []);

  const updateGoal = useCallback((id: string, patch: Partial<Goal>) => {
    setData((d) => ({ ...d, goals: d.goals.map((g) => (g.id === id ? { ...g, ...patch } : g)) }));
  }, []);

  const deleteGoal = useCallback((id: string) => {
    setData((d) => ({ ...d, goals: d.goals.filter((g) => g.id !== id) }));
  }, []);

  /* Notizen */
  const addNote = useCallback((input: Omit<Note, "id" | "createdAt">) => {
    const note: Note = { ...input, id: uid(), createdAt: new Date().toISOString() };
    setData((d) => ({ ...d, notes: [...d.notes, note] }));
    return note;
  }, []);

  const updateNote = useCallback((id: string, patch: Partial<Note>) => {
    setData((d) => ({ ...d, notes: d.notes.map((n) => (n.id === id ? { ...n, ...patch } : n)) }));
  }, []);

  const deleteNote = useCallback((id: string) => {
    setData((d) => ({ ...d, notes: d.notes.filter((n) => n.id !== id) }));
  }, []);

  /* Raucherpausen */
  const addSmokeBreak = useCallback((employeeId: string) => {
    const entry: SmokeBreak = { id: uid(), employeeId, createdAt: new Date().toISOString() };
    setData((d) => ({ ...d, smokeBreaks: [...d.smokeBreaks, entry] }));
    return entry;
  }, []);

  const deleteSmokeBreak = useCallback((id: string) => {
    setData((d) => ({ ...d, smokeBreaks: d.smokeBreaks.filter((s) => s.id !== id) }));
  }, []);

  /* Verwaltung (Backup-Import / Zurücksetzen) */
  const replaceAll = useCallback(async (next: AppData) => {
    setData({ ...next });
    await persist(next);
  }, []);

  const resetAll = useCallback(async () => {
    setData({ ...emptyData });
    await persist({ ...emptyData });
  }, []);

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
      addNote,
      updateNote,
      deleteNote,
      notesOf: (employeeId) =>
        data.notes
          .filter((n) => n.employeeId === employeeId)
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
      addSmokeBreak,
      deleteSmokeBreak,
      smokeBreaksOf: (employeeId) =>
        data.smokeBreaks
          .filter((s) => s.employeeId === employeeId)
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
      addNote,
      updateNote,
      deleteNote,
      addSmokeBreak,
      deleteSmokeBreak,
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
