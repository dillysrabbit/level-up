import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import EmployeeForm from "./pages/EmployeeForm";
import EmployeeDetail from "./pages/EmployeeDetail";
import VisitForm from "./pages/VisitForm";
import VisitDetail from "./pages/VisitDetail";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/mitarbeiter" element={<Employees />} />
        <Route path="/mitarbeiter/neu" element={<EmployeeForm />} />
        <Route path="/mitarbeiter/:id" element={<EmployeeDetail />} />
        <Route path="/mitarbeiter/:id/bearbeiten" element={<EmployeeForm />} />
        <Route path="/visite/neu" element={<VisitForm />} />
        <Route path="/visite/neu/:employeeId" element={<VisitForm />} />
        <Route path="/visite/:id" element={<VisitDetail />} />
        <Route path="/einstellungen" element={<Settings />} />
        <Route path="*" element={<Dashboard />} />
      </Routes>
    </Layout>
  );
}
