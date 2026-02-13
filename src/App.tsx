import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import AdvancedCourseLP from './pages/AdvancedCourseLP';
import BasicMechanicsLP from './pages/BasicMechanicsLP';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import AdminLogin from './components/admin/AdminLogin';
import AdminLayout from './components/admin/AdminLayout';
import CourseLandingPage from './components/CourseLandingPage';
import AdminDashboard from './components/admin/AdminDashboard';
import KanbanBoard from './components/admin/CRM/Kanban';
import CourseManagement from './components/admin/Courses/CourseManagement';
import WorkshopManagement from './components/admin/Workshop/WorkshopManagement';
import FinancialDashboard from './components/admin/Financial/FinancialDashboard';
import RegistrationStatus from './pages/RegistrationStatus';
import SettingsPage from './components/admin/Settings/SettingsPage';
import LPProRidersLisboa from '@/pages/LPProRidersLisboa';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token, isLoading } = useAuth();

  if (isLoading) return <div className="min-h-screen bg-brand-dark flex items-center justify-center underline">Carregando...</div>;
  if (!token) return <Navigate to="/admin/login" />;

  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cursos/:slug" element={<CourseLandingPage />} />
          <Route path="/inscricao/lisboa-2026" element={<LPProRidersLisboa />} />
          <Route path="/status/:id" element={<RegistrationStatus />} />
          <Route path="/curso-revisao-avancada" element={<AdvancedCourseLP />} />
          <Route path="/curso-mecanica-basica-e-ergonomia" element={<BasicMechanicsLP />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <Routes>
                    <Route index element={<AdminDashboard />} />
                    <Route path="crm" element={<KanbanBoard />} />
                    <Route path="courses" element={<CourseManagement />} />
                    <Route path="workshop" element={<WorkshopManagement />} />
                    <Route path="financial" element={<FinancialDashboard />} />
                    <Route path="settings" element={<SettingsPage />} />
                  </Routes>
                </AdminLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
