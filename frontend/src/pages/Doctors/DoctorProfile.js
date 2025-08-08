/**
 * Doctor Profile Page - صفحة ملف الطبيب
 * Hospital Management System
 */

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  FiUser, 
  FiStar, 
  FiCalendar, 
  FiClock,
  FiMapPin,
  FiPhone,
  FiMail,
  FiAward
} from 'react-icons/fi';

/**
 * Doctor Profile Component
 */
function DoctorProfile() {
  const { id } = useParams();

  // Mock data - في التطبيق الحقيقي، ستأتي هذه البيانات من API
  const doctor = {
    id: 1,
    name: 'د. سارة أحمد الطبيبة',
    specialization: 'طب القلب',
    experience: '10 سنوات',
    rating: 4.8,
    consultationFee: 300,
    bio: 'طبيبة قلب متخصصة مع خبرة 10 سنوات في علاج أمراض القلب والأوعية الدموية. حاصلة على شهادة البورد الأمريكي في طب القلب.',
    education: [
      'بكالوريوس الطب والجراحة - جامعة الملك سعود',
      'ماجستير طب القلب - جامعة هارفارد',
      'البورد الأمريكي في طب القلب'
    ],
    languages: ['العربية', 'الإنجليزية'],
    workingHours: {
      saturday: '9:00 ص - 5:00 م',
      sunday: '9:00 ص - 12:00 م',
      monday: '9:00 ص - 5:00 م',
      tuesday: '9:00 ص - 5:00 م',
      wednesday: '9:00 ص - 12:00 م',
      thursday: '9:00 ص - 5:00 م'
    },
    isAvailable: true
  };

  return (
    <div className="space-y-8">
      {/* Doctor Header */}
      <div className="card">
        <div className="card-body">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8 md:space-x-reverse">
            {/* Doctor Avatar */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-primary-100 rounded-full flex items-center justify-center">
                <FiUser className="w-16 h-16 text-primary-600" />
              </div>
            </div>

            {/* Doctor Info */}
            <div className="flex-1 text-center md:text-right">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {doctor.name}
              </h1>
              <p className="text-xl text-primary-600 font-medium mb-4">
                {doctor.specialization}
              </p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-4">
                <div className="flex items-center">
                  <FiAward className="w-5 h-5 text-gray-500 ml-2" />
                  <span className="text-gray-700">خبرة {doctor.experience}</span>
                </div>
                <div className="flex items-center">
                  <FiStar className="w-5 h-5 text-yellow-400 fill-current ml-2" />
                  <span className="text-gray-700">{doctor.rating} تقييم</span>
                </div>
              </div>

              <div className="flex justify-center md:justify-start mb-6">
                <span className={`badge ${
                  doctor.isAvailable ? 'badge-success' : 'badge-warning'
                } text-lg px-4 py-2`}>
                  {doctor.isAvailable ? 'متاح للحجز' : 'غير متاح'}
                </span>
              </div>

              <div className="text-2xl font-bold text-gray-900 mb-6">
                رسوم الاستشارة: {doctor.consultationFee} ريال
              </div>

              {doctor.isAvailable && (
                <Link
                  to="/appointments/book"
                  state={{ doctorId: doctor.id }}
                  className="btn-primary px-8 py-3 text-lg"
                >
                  حجز موعد
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* About */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-xl font-semibold text-gray-900">
                نبذة عن الطبيب
              </h2>
            </div>
            <div className="card-body">
              <p className="text-gray-700 leading-relaxed">
                {doctor.bio}
              </p>
            </div>
          </div>

          {/* Education */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-xl font-semibold text-gray-900">
                المؤهلات العلمية
              </h2>
            </div>
            <div className="card-body">
              <ul className="space-y-3">
                {doctor.education.map((edu, index) => (
                  <li key={index} className="flex items-start">
                    <FiAward className="w-5 h-5 text-primary-600 ml-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{edu}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Languages */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-xl font-semibold text-gray-900">
                اللغات
              </h2>
            </div>
            <div className="card-body">
              <div className="flex flex-wrap gap-2">
                {doctor.languages.map((language, index) => (
                  <span key={index} className="badge badge-primary">
                    {language}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Working Hours */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <FiClock className="w-5 h-5 ml-2 text-primary-600" />
                أوقات العمل
              </h3>
            </div>
            <div className="card-body">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">السبت</span>
                  <span className="text-gray-900 font-medium">{doctor.workingHours.saturday}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">الأحد</span>
                  <span className="text-gray-900 font-medium">{doctor.workingHours.sunday}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">الاثنين</span>
                  <span className="text-gray-900 font-medium">{doctor.workingHours.monday}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">الثلاثاء</span>
                  <span className="text-gray-900 font-medium">{doctor.workingHours.tuesday}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">الأربعاء</span>
                  <span className="text-gray-900 font-medium">{doctor.workingHours.wednesday}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">الخميس</span>
                  <span className="text-gray-900 font-medium">{doctor.workingHours.thursday}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">الجمعة</span>
                  <span className="text-gray-900 font-medium">مغلق</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">
                معلومات التواصل
              </h3>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                <div className="flex items-center">
                  <FiPhone className="w-5 h-5 text-gray-500 ml-3" />
                  <span className="text-gray-700">+966 11 123 4567</span>
                </div>
                <div className="flex items-center">
                  <FiMail className="w-5 h-5 text-gray-500 ml-3" />
                  <span className="text-gray-700">dr.sarah@hospital.com</span>
                </div>
                <div className="flex items-center">
                  <FiMapPin className="w-5 h-5 text-gray-500 ml-3" />
                  <span className="text-gray-700">مستشفى الملك فهد، الرياض</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <div className="card-body">
              <div className="space-y-3">
                {doctor.isAvailable && (
                  <Link
                    to="/appointments/book"
                    state={{ doctorId: doctor.id }}
                    className="btn-primary w-full flex items-center justify-center"
                  >
                    <FiCalendar className="w-4 h-4 ml-2" />
                    حجز موعد
                  </Link>
                )}
                <Link
                  to="/doctors"
                  className="btn-outline w-full text-center"
                >
                  العودة إلى قائمة الأطباء
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorProfile;
