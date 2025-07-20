import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Providers and Context
import { AuthProvider } from './contexts/AuthContext';
import { DiceProvider } from './contexts/DiceContext';

// Layout Components
import Layout from './components/Layout/Layout';
import PublicLayout from './components/Layout/PublicLayout';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';

// Private Pages (Dashboard)
import Dashboard from './pages/dashboard/Dashboard';
import DiceRoller from './pages/dashboard/DiceRoller';
import History from './pages/dashboard/History';
import Analytics from './pages/dashboard/Analytics';
import APIDocumentation from './pages/dashboard/APIDocumentation';
import Profile from './pages/dashboard/Profile';
import Billing from './pages/dashboard/Billing';
import Settings from './pages/dashboard/Settings';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminSubscriptions from './pages/admin/AdminSubscriptions';
import AdminAnalytics from './pages/admin/AdminAnalytics';

// Utility Components
import ProtectedRoute from './components/Auth/ProtectedRoute';
import AdminRoute from './components/Auth/AdminRoute';
import NotFoundPage from './pages/NotFoundPage';
import LoadingSpinner from './components/UI/LoadingSpinner';

// Hooks
import { useAuth } from './hooks/useAuth';

function App() {
  const { user, loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <AuthProvider>
      <DiceProvider>
        <div className="App min-h-screen bg-gray-900">
          <AnimatePresence mode="wait">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<PublicLayout />}>
                <Route index element={<LandingPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
                <Route path="forgot-password" element={<ForgotPasswordPage />} />
                <Route path="reset-password" element={<ResetPasswordPage />} />
                <Route path="verify-email" element={<VerifyEmailPage />} />
              </Route>

              {/* Protected Dashboard Routes */}
              <Route
                path="/dashboard/*"
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="dice" element={<DiceRoller />} />
                <Route path="history" element={<History />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="docs" element={<APIDocumentation />} />
                <Route path="profile" element={<Profile />} />
                <Route path="billing" element={<Billing />} />
                <Route path="settings" element={<Settings />} />
              </Route>

              {/* Admin Routes */}
              <Route
                path="/admin/*"
                element={
                  <AdminRoute>
                    <Layout />
                  </AdminRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="subscriptions" element={<AdminSubscriptions />} />
                <Route path="analytics" element={<AdminAnalytics />} />
              </Route>

              {/* Redirects */}
              <Route
                path="/app"
                element={<Navigate to="/dashboard" replace />}
              />
              
              {/* 404 Page */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </AnimatePresence>
        </div>
      </DiceProvider>
    </AuthProvider>
  );
}

export default App;