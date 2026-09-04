import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CustomerRegisterPage from './pages/CustomerRegisterPage';
import CustomerLoginPage from './pages/CustomerLoginPage';
import ApplicationPage from './pages/ApplicationPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<CustomerRegisterPage />} />
      <Route path="/login" element={<CustomerLoginPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route
        path="/application"
        element={
          <ProtectedRoute role="CUSTOMER">
            <ApplicationPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute role="ADMIN">
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;