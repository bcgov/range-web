import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import LoginPage from './routes/LoginPage';
import ReturnPage from './routes/ReturnPage';
import Layout from './routes/Layout';
import Dashboard from './routes/Dashboard';
import AgreementsPage from './routes/AgreementsPage';
import AgreementDetail from './routes/AgreementDetail';
import PlansPage from './routes/PlansPage';
import PlanDetail from './routes/PlanDetail';
import ClientsPage from './routes/ClientsPage';
import LoadingScreen from './routes/LoadingScreen';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={isAuthenticated && !isLoading ? <Navigate to="/" replace /> : <LoginPage />} />
        <Route path="/return-page" element={<ReturnPage />} />
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="agreements" element={<AgreementsPage />} />
          <Route path="agreements/:forestFileId" element={<AgreementDetail />} />
          <Route path="plans" element={<PlansPage />} />
          <Route path="plans/:planId" element={<PlanDetail />} />
          <Route path="clients" element={<ClientsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
