import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../components/feedback/ProtectedRoute.jsx';
import AppLayout from '../components/layout/AppLayout.jsx';
import AuthLayout from '../components/layout/AuthLayout.jsx';
import { useAuth } from '../features/auth/hooks/useAuth.js';
import DashboardPage from '../pages/DashboardPage.jsx';
import GamePage from '../pages/GamePage.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import ProgressPage from '../pages/ProgressPage.jsx';
import PersonalizedLearningPage from '../pages/PersonalizedLearningPage.jsx';
import ResultPage from '../pages/ResultPage.jsx';
import SignupPage from '../pages/SignupPage.jsx';

function AppRouter() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />}
      />
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Route>
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/game/:gameId" element={<GamePage />} />
        <Route path="/game/:gameId/result" element={<ResultPage />} />
        <Route path="/personalized-learning" element={<PersonalizedLearningPage />} />
        <Route path="/progress" element={<ProgressPage />} />
      </Route>
      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />}
      />
    </Routes>
  );
}

export default AppRouter;
