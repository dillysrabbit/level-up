import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import EmployeeForm from "./pages/EmployeeForm";
import EmployeeDetail from "./pages/EmployeeDetail";
import VisitForm from "./pages/VisitForm";
import VisitDetail from "./pages/VisitDetail";
import NoteForm from "./pages/NoteForm";
import Settings from "./pages/Settings";
import { useStore } from "./store/store";

export default function App() {
  const { loading, error } = useStore();

  return (
    <Layout>
      {error && (
        <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          Verbindungsproblem: {error}
        </div>
      )}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-brand-600" />
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/mitarbeiter" element={<Employees />} />
          <Route path="/mitarbeiter/neu" element={<EmployeeForm />} />
          <Route path="/mitarbeiter/:id" element={<EmployeeDetail />} />
          <Route path="/mitarbeiter/:id/bearbeiten" element={<EmployeeForm />} />
          <Route path="/visite/neu" element={<VisitForm />} />
          <Route path="/visite/neu/:employeeId" element={<VisitForm />} />
          <Route path="/visite/:id" element={<VisitDetail />} />
          <Route path="/notiz/neu" element={<NoteForm />} />
          <Route path="/notiz/neu/:employeeId" element={<NoteForm />} />
          <Route path="/einstellungen" element={<Settings />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      )}
    </Layout>
  );
}
