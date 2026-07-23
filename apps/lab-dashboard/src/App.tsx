import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Tests from './pages/Tests';
import Results from './pages/Results';
import Pricing from './pages/Pricing';
import Packages from './pages/Packages';
import News from './pages/News';
import Reports from './pages/Reports';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token);
  return token ? <>{children}</> : <Navigate to="/login" />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="patients" element={<Patients />} />
        <Route path="tests" element={<Tests />} />
        <Route path="results" element={<Results />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="packages" element={<Packages />} />
        <Route path="news" element={<News />} />
        <Route path="reports" element={<Reports />} />
      </Route>
    </Routes>
  );
}