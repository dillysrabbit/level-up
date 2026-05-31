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
import { emptyData, loadData, saveData, uid } from "./storage";

interface StoreContextValue {
  data: AppData;

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
  replaceAll: (data: AppData) => void;
  resetAll: () => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(() => loadData());

  // Persistiert jede Änderung automatisch lokal.
  useEffect(() => {
    saveData(data);
  }, [data]);

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
    }));
  }, []);

  const addVisit = useCallback((input: Omit<Visit, "id" | "createdAt">) => {
    const visit: Visit = { ...input, id: uid(), createdAt: new Date().toISOString() };
    setData((d) => ({ ...d, visits: [...d.visits, visit] }));
    return visit;
  }, []);

  const updateVisit = useCallback((id: string, patch: Partial<Visit>) => {
    setData((d) => ({
      ...d,
      visits: d.visits.map((v) => (v.id === id ? { ...v, ...patch } : v)),
    }));
  }, []);

  const deleteVisit = useCallback((id: string) => {
    setData((d) => ({ ...d, visits: d.visits.filter((v) => v.id !== id) }));
  }, []);

  const addGoal = useCallback((input: Omit<Goal, "id" | "createdAt">) => {
    const goal: Goal = { ...input, id: uid(), createdAt: new Date().toISOString() };
    setData((d) => ({ ...d, goals: [...d.goals, goal] }));
    return goal;
  }, []);

  const updateGoal = useCallback((id: string, patch: Partial<Goal>) => {
    setData((d) => ({
      ...d,
      goals: d.goals.map((g) => (g.id === id ? { ...g, ...patch } : g)),
    }));
  }, []);

  const deleteGoal = useCallback((id: string) => {
    setData((d) => ({ ...d, goals: d.goals.filter((g) => g.id !== id) }));
  }, []);

  const value = useMemo<StoreContextValue>(
    () => ({
      data,
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
      replaceAll: (next) => setData(next),
      resetAll: () => setData({ ...emptyData }),
    }),
    [
      data,
      addEmployee,
      updateEmployee,
      deleteEmployee,
      addVisit,
      updateVisit,
      deleteVisit,
      addGoal,
      updateGoal,
      deleteGoal,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore muss innerhalb von <StoreProvider> verwendet werden.");
  return ctx;
}
