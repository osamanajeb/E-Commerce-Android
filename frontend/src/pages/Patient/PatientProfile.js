/**
 * Patient Profile Page - صفحة ملف المريض
 * Hospital Management System
 */

import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FiUser, FiEdit, FiSave, FiCalendar, FiHeart } from 'react-icons/fi';

/**
 * Patient Profile Component
 */
function PatientProfile() {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          الملف الشخصي
        </h1>
        <p className="text-lg text-gray-600">
          إدارة معلوماتك الشخصية والطبية
        </p>
      </div>

      {/* Profile Form */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <FiUser className="w-5 h-5 ml-2 text-primary-600" />
              المعلومات الشخصية
            </h2>
            <button className="btn-outline flex items-center">
              <FiEdit className="w-4 h-4 ml-2" />
              تعديل
            </button>
          </div>
        </div>
        <div className="card-body">
          <div className="text-center py-12">
            <FiUser className="w-16 h-16 text-gray-400 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              صفحة الملف الشخصي
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              سيتم تطوير هذه الصفحة قريباً لتشمل:
            </p>
            <div className="text-right max-w-md mx-auto space-y-2 text-gray-600">
              <div className="flex items-center">
                <FiUser className="w-4 h-4 ml-2 text-primary-600" />
                <span>تحديث المعلومات الشخصية</span>
              </div>
              <div className="flex items-center">
                <FiHeart className="w-4 h-4 ml-2 text-primary-600" />
                <span>إدارة التاريخ المرضي</span>
              </div>
              <div className="flex items-center">
                <FiCalendar className="w-4 h-4 ml-2 text-primary-600" />
                <span>عرض المواعيد السابقة</span>
              </div>
              <div className="flex items-center">
                <FiSave className="w-4 h-4 ml-2 text-primary-600" />
                <span>حفظ التغييرات</span>
              </div>
            </div>
            <div className="mt-8 p-4 bg-primary-50 rounded-lg">
              <p className="text-sm text-primary-700">
                <strong>المستخدم الحالي:</strong> {user?.full_name}
              </p>
              <p className="text-sm text-primary-600">
                <strong>البريد الإلكتروني:</strong> {user?.email}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientProfile;
