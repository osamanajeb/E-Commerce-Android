/**
 * Main Layout Component - مكون التخطيط الرئيسي
 * Hospital Management System
 */

import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FiHome, 
  FiCalendar, 
  FiUsers, 
  FiUser, 
  FiFileText, 
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
  FiHeart,
  FiActivity
} from 'react-icons/fi';

/**
 * Layout Component
 * Provides the main layout structure with navigation
 */
function Layout({ children }) {
  const { user, logout, getUserDisplayName, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle logout
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Navigation items based on user role
  const getNavigationItems = () => {
    const commonItems = [
      { name: 'الرئيسية', href: '/', icon: FiHome },
      { name: 'الأطباء', href: '/doctors', icon: FiUsers }
    ];

    if (!isAuthenticated) {
      return commonItems;
    }

    const roleBasedItems = {
      patient: [
        ...commonItems,
        { name: 'لوحة المريض', href: '/patient', icon: FiUser },
        { name: 'حجز موعد', href: '/appointments/book', icon: FiCalendar },
        { name: 'مواعيدي', href: '/appointments', icon: FiCalendar },
        { name: 'السجلات الطبية', href: '/medical-records', icon: FiFileText }
      ],
      doctor: [
        ...commonItems,
        { name: 'لوحة الطبيب', href: '/doctor', icon: FiActivity },
        { name: 'المواعيد', href: '/appointments', icon: FiCalendar },
        { name: 'السجلات الطبية', href: '/medical-records', icon: FiFileText }
      ],
      admin: [
        ...commonItems,
        { name: 'لوحة الإدارة', href: '/admin', icon: FiSettings },
        { name: 'المواعيد', href: '/appointments', icon: FiCalendar },
        { name: 'السجلات الطبية', href: '/medical-records', icon: FiFileText }
      ]
    };

    return roleBasedItems[user?.role] || commonItems;
  };

  const navigationItems = getNavigationItems();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Title */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-3 space-x-reverse">
                <div className="flex items-center justify-center w-10 h-10 bg-primary-600 rounded-lg">
                  <FiHeart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    نظام إدارة المستشفى
                  </h1>
                  <p className="text-sm text-gray-500">
                    Hospital Management System
                  </p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8 space-x-reverse">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 space-x-reverse px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-4 space-x-reverse">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4 space-x-reverse">
                  {/* User Info */}
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {getUserDisplayName()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user?.role === 'doctor' && 'طبيب'}
                      {user?.role === 'patient' && 'مريض'}
                      {user?.role === 'admin' && 'مدير'}
                    </p>
                  </div>

                  {/* Profile Link */}
                  <Link
                    to={user?.role === 'patient' ? '/patient/profile' : `/${user?.role}`}
                    className="flex items-center justify-center w-8 h-8 bg-primary-100 text-primary-600 rounded-full hover:bg-primary-200 transition-colors duration-200"
                  >
                    <FiUser className="w-4 h-4" />
                  </Link>

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors duration-200"
                    title="تسجيل الخروج"
                  >
                    <FiLogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4 space-x-reverse">
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg text-sm font-medium"
                  >
                    تسجيل الدخول
                  </Link>
                  <Link
                    to="/register"
                    className="bg-primary-600 text-white hover:bg-primary-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                  >
                    إنشاء حساب
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className="md:hidden flex items-center justify-center w-8 h-8 text-gray-600 hover:text-gray-900"
              >
                {isMobileMenuOpen ? (
                  <FiX className="w-5 h-5" />
                ) : (
                  <FiMenu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-2 space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 space-x-reverse px-3 py-2 rounded-lg text-sm font-medium ${
                      isActive
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>© 2024 نظام إدارة المستشفى. جميع الحقوق محفوظة.</p>
            <p className="mt-1">Hospital Management System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
