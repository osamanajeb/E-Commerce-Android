/**
 * Appointments List Page - صفحة قائمة المواعيد
 * Hospital Management System
 */

import React from 'react';
import { FiCalendar, FiClock, FiUser, FiFilter } from 'react-icons/fi';

/**
 * Appointments List Component
 */
function AppointmentsList() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          قائمة المواعيد
        </h1>
        <p className="text-lg text-gray-600">
          عرض وإدارة جميع مواعيدك الطبية
        </p>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <FiFilter className="h-5 w-5 text-gray-400" />
              </div>
              <select className="input pr-10">
                <option value="">جميع الحالات</option>
                <option value="scheduled">مجدول</option>
                <option value="confirmed">مؤكد</option>
                <option value="completed">مكتمل</option>
                <option value="cancelled">ملغى</option>
              </select>
            </div>
            <input
              type="date"
              className="input"
              placeholder="من تاريخ"
            />
            <input
              type="date"
              className="input"
              placeholder="إلى تاريخ"
            />
            <button className="btn-primary">
              تطبيق الفلتر
            </button>
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <FiCalendar className="w-5 h-5 ml-2 text-primary-600" />
            مواعيدك
          </h2>
        </div>
        <div className="card-body">
          <div className="text-center py-12">
            <FiCalendar className="w-16 h-16 text-gray-400 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              صفحة قائمة المواعيد
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              سيتم تطوير هذه الصفحة قريباً لتشمل:
            </p>
            <div className="text-right max-w-md mx-auto space-y-2 text-gray-600">
              <div className="flex items-center">
                <FiCalendar className="w-4 h-4 ml-2 text-primary-600" />
                <span>عرض جميع المواعيد</span>
              </div>
              <div className="flex items-center">
                <FiFilter className="w-4 h-4 ml-2 text-primary-600" />
                <span>تصفية المواعيد حسب الحالة والتاريخ</span>
              </div>
              <div className="flex items-center">
                <FiUser className="w-4 h-4 ml-2 text-primary-600" />
                <span>عرض تفاصيل الطبيب</span>
              </div>
              <div className="flex items-center">
                <FiClock className="w-4 h-4 ml-2 text-primary-600" />
                <span>إدارة وتعديل المواعيد</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppointmentsList;
