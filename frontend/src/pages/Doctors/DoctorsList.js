/**
 * Doctors List Page - صفحة قائمة الأطباء
 * Hospital Management System
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FiUser, 
  FiStar, 
  FiMapPin, 
  FiPhone,
  FiSearch,
  FiFilter
} from 'react-icons/fi';

/**
 * Doctors List Component
 */
function DoctorsList() {
  // Mock data - في التطبيق الحقيقي، ستأتي هذه البيانات من API
  const doctors = [
    {
      id: 1,
      name: 'د. سارة أحمد الطبيبة',
      specialization: 'طب القلب',
      experience: '10 سنوات',
      rating: 4.8,
      consultationFee: 300,
      image: null,
      isAvailable: true
    },
    {
      id: 2,
      name: 'د. محمد علي الكردي',
      specialization: 'طب الأطفال',
      experience: '8 سنوات',
      rating: 4.7,
      consultationFee: 250,
      image: null,
      isAvailable: true
    },
    {
      id: 3,
      name: 'د. فاطمة حسن النجار',
      specialization: 'طب النساء والولادة',
      experience: '12 سنة',
      rating: 4.9,
      consultationFee: 350,
      image: null,
      isAvailable: false
    },
    {
      id: 4,
      name: 'د. عبدالله سالم الأحمد',
      specialization: 'طب العظام',
      experience: '15 سنة',
      rating: 4.6,
      consultationFee: 400,
      image: null,
      isAvailable: true
    }
  ];

  const specializations = [
    'جميع التخصصات',
    'طب القلب',
    'طب الأطفال',
    'طب النساء والولادة',
    'طب العظام',
    'طب العيون',
    'طب الأنف والأذن والحنجرة'
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          قائمة الأطباء
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          اختر الطبيب المناسب من فريقنا المتخصص من الأطباء ذوي الخبرة
        </p>
      </div>

      {/* Search and Filter */}
      <div className="card">
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="input pr-10"
                placeholder="البحث عن طبيب..."
              />
            </div>

            {/* Specialization Filter */}
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <FiFilter className="h-5 w-5 text-gray-400" />
              </div>
              <select className="input pr-10">
                {specializations.map((spec, index) => (
                  <option key={index} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>

            {/* Availability Filter */}
            <div>
              <select className="input">
                <option value="">جميع الأطباء</option>
                <option value="available">متاح الآن</option>
                <option value="busy">مشغول</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doctor) => (
          <div key={doctor.id} className="card hover:shadow-medium transition-all duration-300 hover-lift">
            <div className="card-body">
              {/* Doctor Avatar */}
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
                  <FiUser className="w-10 h-10 text-primary-600" />
                </div>
              </div>

              {/* Doctor Info */}
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {doctor.name}
                </h3>
                <p className="text-primary-600 font-medium mb-2">
                  {doctor.specialization}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  خبرة {doctor.experience}
                </p>

                {/* Rating */}
                <div className="flex items-center justify-center mb-2">
                  <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium text-gray-700 mr-1">
                    {doctor.rating}
                  </span>
                </div>

                {/* Consultation Fee */}
                <p className="text-lg font-bold text-gray-900">
                  {doctor.consultationFee} ريال
                </p>
              </div>

              {/* Availability Status */}
              <div className="flex justify-center mb-4">
                <span className={`badge ${
                  doctor.isAvailable ? 'badge-success' : 'badge-warning'
                }`}>
                  {doctor.isAvailable ? 'متاح' : 'مشغول'}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Link
                  to={`/doctors/${doctor.id}`}
                  className="btn-outline w-full text-center"
                >
                  عرض الملف الشخصي
                </Link>
                {doctor.isAvailable && (
                  <Link
                    to="/appointments/book"
                    state={{ doctorId: doctor.id }}
                    className="btn-primary w-full text-center"
                  >
                    حجز موعد
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <button className="btn-outline px-8 py-3">
          تحميل المزيد من الأطباء
        </button>
      </div>

      {/* Contact Info */}
      <div className="card bg-primary-50">
        <div className="card-body text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            هل تحتاج مساعدة في اختيار الطبيب المناسب؟
          </h3>
          <p className="text-gray-600 mb-6">
            تواصل معنا وسنساعدك في اختيار الطبيب الأنسب لحالتك
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="flex items-center justify-center">
              <FiPhone className="w-5 h-5 text-primary-600 ml-2" />
              <span className="text-gray-700">+966 11 123 4567</span>
            </div>
            <div className="flex items-center justify-center">
              <FiMapPin className="w-5 h-5 text-primary-600 ml-2" />
              <span className="text-gray-700">الرياض، المملكة العربية السعودية</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorsList;
