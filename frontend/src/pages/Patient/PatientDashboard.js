/**
 * Patient Dashboard - لوحة تحكم المريض
 * Hospital Management System
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FiCalendar, 
  FiFileText, 
  FiUser, 
  FiClock, 
  FiHeart,
  FiPlus,
  FiArrowRight
} from 'react-icons/fi';

/**
 * Patient Dashboard Component
 */
function PatientDashboard() {
  const { user } = useAuth();

  // Mock data - في التطبيق الحقيقي، ستأتي هذه البيانات من API
  const upcomingAppointments = [
    {
      id: 1,
      doctor: 'د. سارة أحمد',
      specialization: 'طب القلب',
      date: '2024-01-15',
      time: '09:00',
      status: 'مؤكد'
    },
    {
      id: 2,
      doctor: 'د. محمد علي',
      specialization: 'طب الأطفال',
      date: '2024-01-20',
      time: '14:30',
      status: 'مجدول'
    }
  ];

  const recentRecords = [
    {
      id: 1,
      doctor: 'د. سارة أحمد',
      date: '2024-01-10',
      diagnosis: 'فحص دوري للقلب',
      status: 'مكتمل'
    },
    {
      id: 2,
      doctor: 'د. فاطمة حسن',
      date: '2024-01-05',
      diagnosis: 'متابعة ضغط الدم',
      status: 'مكتمل'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              مرحباً، {user?.full_name}
            </h1>
            <p className="text-primary-100 text-lg">
              نتمنى لك دوام الصحة والعافية
            </p>
          </div>
          <div className="hidden md:block">
            <FiHeart className="w-16 h-16 text-primary-200" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/appointments/book"
          className="card hover:shadow-medium transition-all duration-300 hover-lift group"
        >
          <div className="card-body text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                <FiPlus className="w-6 h-6 text-primary-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              حجز موعد جديد
            </h3>
            <p className="text-gray-600 text-sm">
              احجز موعدك مع الطبيب المناسب
            </p>
          </div>
        </Link>

        <Link
          to="/appointments"
          className="card hover:shadow-medium transition-all duration-300 hover-lift group"
        >
          <div className="card-body text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center group-hover:bg-success-200 transition-colors">
                <FiCalendar className="w-6 h-6 text-success-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              مواعيدي
            </h3>
            <p className="text-gray-600 text-sm">
              عرض وإدارة مواعيدك
            </p>
          </div>
        </Link>

        <Link
          to="/medical-records"
          className="card hover:shadow-medium transition-all duration-300 hover-lift group"
        >
          <div className="card-body text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-warning-100 rounded-full flex items-center justify-center group-hover:bg-warning-200 transition-colors">
                <FiFileText className="w-6 h-6 text-warning-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              السجلات الطبية
            </h3>
            <p className="text-gray-600 text-sm">
              اطلع على تاريخك الطبي
            </p>
          </div>
        </Link>
      </div>

      {/* Upcoming Appointments */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <FiClock className="w-5 h-5 ml-2 text-primary-600" />
              المواعيد القادمة
            </h2>
            <Link
              to="/appointments"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
            >
              عرض الكل
              <FiArrowRight className="w-4 h-4 mr-1" />
            </Link>
          </div>
        </div>
        <div className="card-body">
          {upcomingAppointments.length > 0 ? (
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <FiUser className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {appointment.doctor}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {appointment.specialization}
                      </p>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">
                      {appointment.date}
                    </p>
                    <p className="text-sm text-gray-600">
                      {appointment.time}
                    </p>
                  </div>
                  <span className={`badge ${
                    appointment.status === 'مؤكد' ? 'badge-success' : 'badge-warning'
                  }`}>
                    {appointment.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FiCalendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">لا توجد مواعيد قادمة</p>
              <Link
                to="/appointments/book"
                className="btn-primary mt-4 inline-flex items-center"
              >
                احجز موعد جديد
                <FiPlus className="w-4 h-4 mr-2" />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Recent Medical Records */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <FiFileText className="w-5 h-5 ml-2 text-primary-600" />
              السجلات الطبية الأخيرة
            </h2>
            <Link
              to="/medical-records"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
            >
              عرض الكل
              <FiArrowRight className="w-4 h-4 mr-1" />
            </Link>
          </div>
        </div>
        <div className="card-body">
          {recentRecords.length > 0 ? (
            <div className="space-y-4">
              {recentRecords.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <div className="w-10 h-10 bg-success-100 rounded-full flex items-center justify-center">
                      <FiFileText className="w-5 h-5 text-success-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {record.diagnosis}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {record.doctor}
                      </p>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">
                      {record.date}
                    </p>
                    <span className="badge badge-success">
                      {record.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FiFileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">لا توجد سجلات طبية</p>
            </div>
          )}
        </div>
      </div>

      {/* Profile Quick Access */}
      <div className="card">
        <div className="card-body">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                الملف الشخصي
              </h3>
              <p className="text-gray-600">
                تحديث معلوماتك الشخصية والطبية
              </p>
            </div>
            <Link
              to="/patient/profile"
              className="btn-outline flex items-center"
            >
              تحديث الملف
              <FiUser className="w-4 h-4 mr-2" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientDashboard;
