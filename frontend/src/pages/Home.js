/**
 * Home Page - الصفحة الرئيسية
 * Hospital Management System
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  FiCalendar, 
  FiUsers, 
  FiHeart, 
  FiShield, 
  FiClock, 
  FiStar,
  FiArrowLeft,
  FiPhone,
  FiMail,
  FiMapPin
} from 'react-icons/fi';

/**
 * Home Page Component
 */
function Home() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 rounded-3xl overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative px-8 py-16 sm:py-24 text-center text-white">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              مرحباً بك في نظام إدارة المستشفى
            </h1>
            <p className="text-xl sm:text-2xl mb-8 opacity-90 leading-relaxed">
              نظام متكامل لإدارة المواعيد والسجلات الطبية بكفاءة وأمان
            </p>
            <p className="text-lg mb-12 opacity-80">
              Hospital Management System - Comprehensive healthcare management solution
            </p>
            
            {!isAuthenticated ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="btn bg-white text-primary-700 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  إنشاء حساب جديد
                  <FiArrowLeft className="mr-2 w-5 h-5" />
                </Link>
                <Link
                  to="/login"
                  className="btn bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-700 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300"
                >
                  تسجيل الدخول
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xl">
                  أهلاً وسهلاً، {user?.full_name}
                </p>
                <Link
                  to="/dashboard"
                  className="btn bg-white text-primary-700 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center"
                >
                  الذهاب إلى لوحة التحكم
                  <FiArrowLeft className="mr-2 w-5 h-5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            مميزات النظام
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            نوفر لك أفضل الخدمات الطبية مع نظام إدارة متطور وسهل الاستخدام
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="card hover:shadow-medium transition-shadow duration-300 hover-lift">
            <div className="card-body text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                  <FiCalendar className="w-8 h-8 text-primary-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                حجز المواعيد
              </h3>
              <p className="text-gray-600 leading-relaxed">
                احجز موعدك مع الطبيب المناسب بسهولة ويسر من خلال النظام الإلكتروني
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="card hover:shadow-medium transition-shadow duration-300 hover-lift">
            <div className="card-body text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center">
                  <FiUsers className="w-8 h-8 text-success-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                أطباء متخصصون
              </h3>
              <p className="text-gray-600 leading-relaxed">
                فريق من الأطباء المتخصصين في جميع المجالات الطبية لخدمتك على مدار الساعة
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="card hover:shadow-medium transition-shadow duration-300 hover-lift">
            <div className="card-body text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-warning-100 rounded-full flex items-center justify-center">
                  <FiHeart className="w-8 h-8 text-warning-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                رعاية شاملة
              </h3>
              <p className="text-gray-600 leading-relaxed">
                نقدم رعاية طبية شاملة ومتكاملة لجميع أفراد العائلة
              </p>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="card hover:shadow-medium transition-shadow duration-300 hover-lift">
            <div className="card-body text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-danger-100 rounded-full flex items-center justify-center">
                  <FiShield className="w-8 h-8 text-danger-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                أمان البيانات
              </h3>
              <p className="text-gray-600 leading-relaxed">
                نضمن حماية وسرية جميع بياناتك الطبية بأعلى معايير الأمان
              </p>
            </div>
          </div>

          {/* Feature 5 */}
          <div className="card hover:shadow-medium transition-shadow duration-300 hover-lift">
            <div className="card-body text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                  <FiClock className="w-8 h-8 text-purple-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                متاح 24/7
              </h3>
              <p className="text-gray-600 leading-relaxed">
                النظام متاح على مدار الساعة لخدمتك في أي وقت تحتاجه
              </p>
            </div>
          </div>

          {/* Feature 6 */}
          <div className="card hover:shadow-medium transition-shadow duration-300 hover-lift">
            <div className="card-body text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                  <FiStar className="w-8 h-8 text-indigo-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                خدمة متميزة
              </h3>
              <p className="text-gray-600 leading-relaxed">
                نسعى لتقديم أفضل خدمة طبية بجودة عالية ورضا تام للمرضى
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions Section */}
      {!isAuthenticated && (
        <section className="bg-gray-100 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ابدأ رحلتك معنا
            </h2>
            <p className="text-lg text-gray-600">
              انضم إلى آلاف المرضى الذين يثقون بخدماتنا الطبية المتميزة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Link
              to="/register"
              className="card hover:shadow-medium transition-all duration-300 hover-lift group"
            >
              <div className="card-body text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                  للمرضى الجدد
                </h3>
                <p className="text-gray-600 mb-4">
                  أنشئ حسابك الآن واحجز أول موعد لك
                </p>
                <span className="btn-primary inline-flex items-center">
                  إنشاء حساب مريض
                  <FiArrowLeft className="mr-2 w-4 h-4" />
                </span>
              </div>
            </Link>

            <Link
              to="/doctors"
              className="card hover:shadow-medium transition-all duration-300 hover-lift group"
            >
              <div className="card-body text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                  تصفح الأطباء
                </h3>
                <p className="text-gray-600 mb-4">
                  اطلع على قائمة الأطباء المتخصصين
                </p>
                <span className="btn-outline inline-flex items-center">
                  عرض الأطباء
                  <FiArrowLeft className="mr-2 w-4 h-4" />
                </span>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section className="bg-white rounded-2xl p-8 shadow-soft">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            تواصل معنا
          </h2>
          <p className="text-lg text-gray-600">
            نحن هنا لخدمتك، لا تتردد في التواصل معنا
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <FiPhone className="w-6 h-6 text-primary-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">الهاتف</h3>
            <p className="text-gray-600">+966 11 123 4567</p>
          </div>

          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <FiMail className="w-6 h-6 text-primary-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">البريد الإلكتروني</h3>
            <p className="text-gray-600">info@hospital.com</p>
          </div>

          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <FiMapPin className="w-6 h-6 text-primary-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">العنوان</h3>
            <p className="text-gray-600">الرياض، المملكة العربية السعودية</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
