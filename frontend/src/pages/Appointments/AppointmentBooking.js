/**
 * Appointment Booking Page - صفحة حجز المواعيد
 * Hospital Management System
 */

import React from 'react';
import { FiCalendar, FiClock, FiUser, FiFileText } from 'react-icons/fi';

/**
 * Appointment Booking Component
 */
function AppointmentBooking() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          حجز موعد جديد
        </h1>
        <p className="text-lg text-gray-600">
          احجز موعدك مع الطبيب المناسب في الوقت المناسب لك
        </p>
      </div>

      {/* Booking Form */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <FiCalendar className="w-5 h-5 ml-2 text-primary-600" />
            تفاصيل الموعد
          </h2>
        </div>
        <div className="card-body">
          <div className="text-center py-12">
            <FiCalendar className="w-16 h-16 text-gray-400 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              صفحة حجز المواعيد
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              سيتم تطوير هذه الصفحة قريباً لتشمل:
            </p>
            <div className="text-right max-w-md mx-auto space-y-2 text-gray-600">
              <div className="flex items-center">
                <FiUser className="w-4 h-4 ml-2 text-primary-600" />
                <span>اختيار الطبيب والتخصص</span>
              </div>
              <div className="flex items-center">
                <FiCalendar className="w-4 h-4 ml-2 text-primary-600" />
                <span>اختيار التاريخ والوقت المناسب</span>
              </div>
              <div className="flex items-center">
                <FiClock className="w-4 h-4 ml-2 text-primary-600" />
                <span>عرض الأوقات المتاحة</span>
              </div>
              <div className="flex items-center">
                <FiFileText className="w-4 h-4 ml-2 text-primary-600" />
                <span>إدخال سبب الزيارة</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-body text-center">
            <FiUser className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              اختيار طبيب
            </h3>
            <p className="text-gray-600 mb-4">
              تصفح قائمة الأطباء واختر المناسب لك
            </p>
            <button className="btn-primary">
              عرض الأطباء
            </button>
          </div>
        </div>

        <div className="card">
          <div className="card-body text-center">
            <FiCalendar className="w-12 h-12 text-success-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              مواعيدي
            </h3>
            <p className="text-gray-600 mb-4">
              عرض وإدارة مواعيدك الحالية
            </p>
            <button className="btn-outline">
              عرض المواعيد
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppointmentBooking;
