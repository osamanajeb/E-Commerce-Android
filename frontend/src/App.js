/**
 * Hospital Management System - Main App Component
 * نظام إدارة المستشفى - المكون الرئيسي للتطبيق
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';

// Context Providers
import { AuthProvider } from './contexts/AuthContext';

// Components
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import LoadingSpinner from './components/UI/LoadingSpinner';

// Pages
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import PatientDashboard from './pages/Patient/PatientDashboard';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AppointmentBooking from './pages/Appointments/AppointmentBooking';
import AppointmentsList from './pages/Appointments/AppointmentsList';
import DoctorsList from './pages/Doctors/DoctorsList';
import DoctorProfile from './pages/Doctors/DoctorProfile';
import PatientProfile from './pages/Patient/PatientProfile';
import MedicalRecords from './pages/MedicalRecords/MedicalRecords';
import NotFound from './pages/NotFound';

// Styles
import './index.css';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

/**
 * Main App Component - المكون الرئيسي للتطبيق
 */
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="App rtl min-h-screen bg-gray-50">
            {/* Toast notifications - إشعارات التوست */}
            <Toaster
              position="top-center"
              reverseOrder={false}
              gutter={8}
              containerClassName=""
              containerStyle={{}}
              toastOptions={{
                // Default options for all toasts
                className: '',
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                  fontFamily: 'Cairo, sans-serif',
                  direction: 'rtl',
                  textAlign: 'right',
                },
                // Success toast style
                success: {
                  duration: 3000,
                  style: {
                    background: '#10b981',
                  },
                },
                // Error toast style
                error: {
                  duration: 5000,
                  style: {
                    background: '#ef4444',
                  },
                },
                // Loading toast style
                loading: {
                  style: {
                    background: '#3b82f6',
                  },
                },
              }}
            />

            {/* Main Routes - المسارات الرئيسية */}
            <Routes>
              {/* Public Routes - المسارات العامة */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Routes with Layout - المسارات المحمية مع التخطيط */}
              <Route path="/" element={
                <Layout>
                  <Home />
                </Layout>
              } />
              
              <Route path="/doctors" element={
                <Layout>
                  <DoctorsList />
                </Layout>
              } />
              
              <Route path="/doctors/:id" element={
                <Layout>
                  <DoctorProfile />
                </Layout>
              } />

              {/* Patient Routes - مسارات المريض */}
              <Route path="/patient" element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <Layout>
                    <PatientDashboard />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/patient/profile" element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <Layout>
                    <PatientProfile />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/appointments/book" element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <Layout>
                    <AppointmentBooking />
                  </Layout>
                </ProtectedRoute>
              } />

              {/* Doctor Routes - مسارات الطبيب */}
              <Route path="/doctor" element={
                <ProtectedRoute allowedRoles={['doctor']}>
                  <Layout>
                    <DoctorDashboard />
                  </Layout>
                </ProtectedRoute>
              } />

              {/* Admin Routes - مسارات المدير */}
              <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Layout>
                    <AdminDashboard />
                  </Layout>
                </ProtectedRoute>
              } />

              {/* Shared Protected Routes - المسارات المحمية المشتركة */}
              <Route path="/appointments" element={
                <ProtectedRoute allowedRoles={['patient', 'doctor', 'admin']}>
                  <Layout>
                    <AppointmentsList />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/medical-records" element={
                <ProtectedRoute allowedRoles={['patient', 'doctor', 'admin']}>
                  <Layout>
                    <MedicalRecords />
                  </Layout>
                </ProtectedRoute>
              } />

              {/* Redirect based on user role - إعادة توجيه حسب دور المستخدم */}
              <Route path="/dashboard" element={<DashboardRedirect />} />

              {/* 404 Not Found - صفحة غير موجودة */}
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

/**
 * Dashboard Redirect Component - مكون إعادة توجيه لوحة التحكم
 * Redirects users to their appropriate dashboard based on role
 */
function DashboardRedirect() {
  const { user, loading } = React.useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect based on user role - إعادة توجيه حسب دور المستخدم
  switch (user.role) {
    case 'admin':
      return <Navigate to="/admin" replace />;
    case 'doctor':
      return <Navigate to="/doctor" replace />;
    case 'patient':
      return <Navigate to="/patient" replace />;
    default:
      return <Navigate to="/" replace />;
  }
}

export default App;
