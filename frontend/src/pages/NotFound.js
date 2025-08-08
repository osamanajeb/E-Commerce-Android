/**
 * 404 Not Found Page - صفحة غير موجودة
 * Hospital Management System
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiArrowLeft, FiAlertCircle } from 'react-icons/fi';

/**
 * NotFound Page Component
 */
function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        {/* 404 Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 bg-danger-100 rounded-full flex items-center justify-center">
            <FiAlertCircle className="w-12 h-12 text-danger-600" />
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          الصفحة غير موجودة
        </h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها إلى موقع آخر.
        </p>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link
            to="/"
            className="btn-primary w-full py-3 text-base font-semibold inline-flex items-center justify-center"
          >
            <FiHome className="ml-2 w-5 h-5" />
            العودة إلى الصفحة الرئيسية
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="btn-outline w-full py-3 text-base font-semibold inline-flex items-center justify-center"
          >
            <FiArrowLeft className="ml-2 w-5 h-5" />
            العودة إلى الصفحة السابقة
          </button>
        </div>

        {/* Help Text */}
        <div className="mt-8 text-sm text-gray-500">
          <p>إذا كنت تعتقد أن هذا خطأ، يرجى التواصل مع الدعم الفني.</p>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
