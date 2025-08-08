/**
 * Admin Dashboard - لوحة تحكم المدير
 * Hospital Management System
 */

import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FiUsers, 
  FiUserCheck, 
  FiCalendar, 
  FiFileText,
  FiSettings,
  FiBarChart3,
  FiTrendingUp,
  FiActivity
} from 'react-icons/fi';

/**
 * Admin Dashboard Component
 */
function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              مرحباً، {user?.full_name}
            </h1>
            <p className="text-purple-100 text-lg">
              لوحة تحكم المدير - إدارة النظام والمستخدمين
            </p>
          </div>
          <div className="hidden md:block">
            <FiSettings className="w-16 h-16 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="card-body text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <FiUsers className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">1,234</h3>
            <p className="text-gray-600">إجمالي المستخدمين</p>
          </div>
        </div>

        <div className="card">
          <div className="card-body text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <FiUserCheck className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">45</h3>
            <p className="text-gray-600">الأطباء</p>
          </div>
        </div>

        <div className="card">
          <div className="card-body text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <FiCalendar className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">567</h3>
            <p className="text-gray-600">المواعيد هذا الشهر</p>
          </div>
        </div>

        <div className="card">
          <div className="card-body text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <FiActivity className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">98%</h3>
            <p className="text-gray-600">معدل النشاط</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card hover:shadow-medium transition-all duration-300 hover-lift cursor-pointer">
          <div className="card-body text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <FiUsers className="w-6 h-6 text-primary-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              إدارة المستخدمين
            </h3>
            <p className="text-gray-600 text-sm">
              إضافة وتعديل وحذف المستخدمين
            </p>
          </div>
        </div>

        <div className="card hover:shadow-medium transition-all duration-300 hover-lift cursor-pointer">
          <div className="card-body text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center">
                <FiBarChart3 className="w-6 h-6 text-success-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              التقارير والإحصائيات
            </h3>
            <p className="text-gray-600 text-sm">
              عرض تقارير النظام والإحصائيات
            </p>
          </div>
        </div>

        <div className="card hover:shadow-medium transition-all duration-300 hover-lift cursor-pointer">
          <div className="card-body text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-warning-100 rounded-full flex items-center justify-center">
                <FiSettings className="w-6 h-6 text-warning-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              إعدادات النظام
            </h3>
            <p className="text-gray-600 text-sm">
              تكوين وإعداد النظام
            </p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <FiActivity className="w-5 h-5 ml-2 text-primary-600" />
            النشاط الأخير
          </h2>
        </div>
        <div className="card-body">
          <div className="text-center py-8">
            <FiActivity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">سيتم تطوير هذا القسم قريباً</p>
            <p className="text-sm text-gray-500 mt-2">
              عرض آخر الأنشطة والعمليات في النظام
            </p>
          </div>
        </div>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <FiTrendingUp className="w-5 h-5 ml-2 text-primary-600" />
              إحصائيات الاستخدام
            </h2>
          </div>
          <div className="card-body">
            <div className="text-center py-8">
              <FiTrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">سيتم تطوير هذا القسم قريباً</p>
              <p className="text-sm text-gray-500 mt-2">
                رسوم بيانية لاستخدام النظام
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <FiFileText className="w-5 h-5 ml-2 text-primary-600" />
              التقارير السريعة
            </h2>
          </div>
          <div className="card-body">
            <div className="text-center py-8">
              <FiFileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">سيتم تطوير هذا القسم قريباً</p>
              <p className="text-sm text-gray-500 mt-2">
                تقارير سريعة عن أداء النظام
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
