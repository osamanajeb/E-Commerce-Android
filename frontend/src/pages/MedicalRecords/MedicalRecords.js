/**
 * Medical Records Page - صفحة السجلات الطبية
 * Hospital Management System
 */

import React from 'react';
import { FiFileText, FiUser, FiCalendar, FiFilter, FiDownload } from 'react-icons/fi';

/**
 * Medical Records Component
 */
function MedicalRecords() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          السجلات الطبية
        </h1>
        <p className="text-lg text-gray-600">
          عرض وإدارة تاريخك الطبي والتشخيصات
        </p>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <FiUser className="h-5 w-5 text-gray-400" />
              </div>
              <select className="input pr-10">
                <option value="">جميع الأطباء</option>
                <option value="1">د. سارة أحمد</option>
                <option value="2">د. محمد علي</option>
                <option value="3">د. فاطمة حسن</option>
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
            <button className="btn-primary flex items-center justify-center">
              <FiFilter className="w-4 h-4 ml-2" />
              تطبيق الفلتر
            </button>
          </div>
        </div>
      </div>

      {/* Medical Records List */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <FiFileText className="w-5 h-5 ml-2 text-primary-600" />
              سجلاتك الطبية
            </h2>
            <button className="btn-outline flex items-center">
              <FiDownload className="w-4 h-4 ml-2" />
              تصدير التقرير
            </button>
          </div>
        </div>
        <div className="card-body">
          <div className="text-center py-12">
            <FiFileText className="w-16 h-16 text-gray-400 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              صفحة السجلات الطبية
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              سيتم تطوير هذه الصفحة قريباً لتشمل:
            </p>
            <div className="text-right max-w-md mx-auto space-y-2 text-gray-600">
              <div className="flex items-center">
                <FiFileText className="w-4 h-4 ml-2 text-primary-600" />
                <span>عرض جميع السجلات الطبية</span>
              </div>
              <div className="flex items-center">
                <FiUser className="w-4 h-4 ml-2 text-primary-600" />
                <span>تصفية حسب الطبيب</span>
              </div>
              <div className="flex items-center">
                <FiCalendar className="w-4 h-4 ml-2 text-primary-600" />
                <span>تصفية حسب التاريخ</span>
              </div>
              <div className="flex items-center">
                <FiDownload className="w-4 h-4 ml-2 text-primary-600" />
                <span>تصدير التقارير الطبية</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="card-body text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <FiFileText className="w-6 h-6 text-primary-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">0</h3>
            <p className="text-gray-600">إجمالي السجلات</p>
          </div>
        </div>

        <div className="card">
          <div className="card-body text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center">
                <FiUser className="w-6 h-6 text-success-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">0</h3>
            <p className="text-gray-600">الأطباء المعالجون</p>
          </div>
        </div>

        <div className="card">
          <div className="card-body text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-warning-100 rounded-full flex items-center justify-center">
                <FiCalendar className="w-6 h-6 text-warning-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">0</h3>
            <p className="text-gray-600">آخر زيارة</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MedicalRecords;
