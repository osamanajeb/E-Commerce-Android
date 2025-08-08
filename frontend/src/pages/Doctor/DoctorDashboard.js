/**
 * Doctor Dashboard - لوحة تحكم الطبيب
 * Hospital Management System
 */

import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FiCalendar, 
  FiUsers, 
  FiFileText, 
  FiActivity,
  FiClock,
  FiTrendingUp
} from 'react-icons/fi';

/**
 * Doctor Dashboard Component
 */
function DoctorDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-success-600 to-success-700 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              مرحباً، د. {user?.full_name}
            </h1>
            <p className="text-success-100 text-lg">
              لوحة تحكم الطبيب - إدارة المواعيد والمرضى
            </p>
          </div>
          <div className="hidden md:block">
            <FiActivity className="w-16 h-16 text-success-200" />
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="card-body text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <FiCalendar className="w-6 h-6 text-primary-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">12</h3>
            <p className="text-gray-600">مواعيد اليوم</p>
          </div>
        </div>

        <div className="card">
          <div className="card-body text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center">
                <FiUsers className="w-6 h-6 text-success-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">156</h3>
            <p className="text-gray-600">إجمالي المرضى</p>
          </div>
        </div>

        <div className="card">
          <div className="card-body text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-warning-100 rounded-full flex items-center justify-center">
                <FiFileText className="w-6 h-6 text-warning-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">89</h3>
            <p className="text-gray-600">السجلات الطبية</p>
          </div>
        </div>

        <div className="card">
          <div className="card-body text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-danger-100 rounded-full flex items-center justify-center">
                <FiTrendingUp className="w-6 h-6 text-danger-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">4.8</h3>
            <p className="text-gray-600">تقييم الطبيب</p>
          </div>
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <FiClock className="w-5 h-5 ml-2 text-primary-600" />
            جدول اليوم
          </h2>
        </div>
        <div className="card-body">
          <div className="text-center py-8">
            <FiCalendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">سيتم تطوير هذا القسم قريباً</p>
            <p className="text-sm text-gray-500 mt-2">
              عرض مواعيد اليوم والمرضى المنتظرين
            </p>
          </div>
        </div>
      </div>

      {/* Recent Patients */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <FiUsers className="w-5 h-5 ml-2 text-primary-600" />
            المرضى الأخيرون
          </h2>
        </div>
        <div className="card-body">
          <div className="text-center py-8">
            <FiUsers className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">سيتم تطوير هذا القسم قريباً</p>
            <p className="text-sm text-gray-500 mt-2">
              عرض قائمة بآخر المرضى الذين تمت معاينتهم
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorDashboard;
