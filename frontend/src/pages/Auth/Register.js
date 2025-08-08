/**
 * Register Page - صفحة إنشاء الحساب
 * Hospital Management System
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FiUser, 
  FiMail, 
  FiLock, 
  FiPhone, 
  FiEye, 
  FiEyeOff, 
  FiHeart, 
  FiArrowLeft,
  FiCalendar,
  FiUserCheck
} from 'react-icons/fi';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

/**
 * Register Page Component
 */
function Register() {
  const { register: registerUser, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch
  } = useForm();

  const watchRole = watch('role', 'patient');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  // Handle form submission
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      const result = await registerUser(data);
      
      if (result.success) {
        navigate('/dashboard', { replace: true });
      } else {
        setError('root', {
          type: 'manual',
          message: result.error
        });
      }
    } catch (error) {
      setError('root', {
        type: 'manual',
        message: 'حدث خطأ غير متوقع'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" text="جاري التحقق..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-6 hover:bg-primary-700 transition-colors duration-200">
            <FiHeart className="w-8 h-8 text-white" />
          </Link>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            إنشاء حساب جديد
          </h2>
          <p className="text-gray-600">
            أنشئ حسابك للاستفادة من خدماتنا الطبية
          </p>
        </div>

        {/* Register Form */}
        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Full Name Field */}
              <div>
                <label htmlFor="full_name" className="label">
                  الاسم الكامل
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <FiUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="full_name"
                    type="text"
                    autoComplete="name"
                    className={`input pr-10 ${errors.full_name ? 'input-error' : ''}`}
                    placeholder="أدخل اسمك الكامل"
                    {...register('full_name', {
                      required: 'الاسم الكامل مطلوب',
                      minLength: {
                        value: 2,
                        message: 'الاسم يجب أن يكون حرفين على الأقل'
                      }
                    })}
                  />
                </div>
                {errors.full_name && (
                  <p className="mt-1 text-sm text-danger-600">
                    {errors.full_name.message}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="label">
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    className={`input pr-10 ${errors.email ? 'input-error' : ''}`}
                    placeholder="أدخل بريدك الإلكتروني"
                    {...register('email', {
                      required: 'البريد الإلكتروني مطلوب',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'البريد الإلكتروني غير صحيح'
                      }
                    })}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-danger-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Phone Field */}
              <div>
                <label htmlFor="phone" className="label">
                  رقم الهاتف
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <FiPhone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    className={`input pr-10 ${errors.phone ? 'input-error' : ''}`}
                    placeholder="05xxxxxxxx"
                    {...register('phone', {
                      required: 'رقم الهاتف مطلوب',
                      pattern: {
                        value: /^(\+966|0)?5[0-9]{8}$/,
                        message: 'رقم الهاتف غير صحيح'
                      }
                    })}
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-danger-600">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Role Selection */}
              <div>
                <label htmlFor="role" className="label">
                  نوع الحساب
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <FiUserCheck className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="role"
                    className={`input pr-10 ${errors.role ? 'input-error' : ''}`}
                    {...register('role', {
                      required: 'نوع الحساب مطلوب'
                    })}
                  >
                    <option value="patient">مريض</option>
                    <option value="doctor">طبيب</option>
                  </select>
                </div>
                {errors.role && (
                  <p className="mt-1 text-sm text-danger-600">
                    {errors.role.message}
                  </p>
                )}
              </div>

              {/* Additional Fields for Patient */}
              {watchRole === 'patient' && (
                <>
                  <div>
                    <label htmlFor="birth_date" className="label">
                      تاريخ الميلاد
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <FiCalendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="birth_date"
                        type="date"
                        className={`input pr-10 ${errors.birth_date ? 'input-error' : ''}`}
                        {...register('birth_date')}
                      />
                    </div>
                    {errors.birth_date && (
                      <p className="mt-1 text-sm text-danger-600">
                        {errors.birth_date.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="gender" className="label">
                      الجنس
                    </label>
                    <select
                      id="gender"
                      className={`input ${errors.gender ? 'input-error' : ''}`}
                      {...register('gender')}
                    >
                      <option value="">اختر الجنس</option>
                      <option value="male">ذكر</option>
                      <option value="female">أنثى</option>
                    </select>
                    {errors.gender && (
                      <p className="mt-1 text-sm text-danger-600">
                        {errors.gender.message}
                      </p>
                    )}
                  </div>
                </>
              )}

              {/* Additional Fields for Doctor */}
              {watchRole === 'doctor' && (
                <div>
                  <label htmlFor="specialization" className="label">
                    التخصص
                  </label>
                  <input
                    id="specialization"
                    type="text"
                    className={`input ${errors.specialization ? 'input-error' : ''}`}
                    placeholder="أدخل تخصصك الطبي"
                    {...register('specialization', {
                      required: watchRole === 'doctor' ? 'التخصص مطلوب للأطباء' : false
                    })}
                  />
                  {errors.specialization && (
                    <p className="mt-1 text-sm text-danger-600">
                      {errors.specialization.message}
                    </p>
                  )}
                </div>
              )}

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="label">
                  كلمة المرور
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    className={`input pr-10 pl-10 ${errors.password ? 'input-error' : ''}`}
                    placeholder="أدخل كلمة المرور"
                    {...register('password', {
                      required: 'كلمة المرور مطلوبة',
                      minLength: {
                        value: 6,
                        message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'
                      }
                    })}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 left-0 pl-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-danger-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Form Error */}
              {errors.root && (
                <div className="alert-danger">
                  <p className="text-sm">{errors.root.message}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full py-3 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <LoadingSpinner size="sm" color="white" />
                    <span className="mr-2">جاري إنشاء الحساب...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <span>إنشاء الحساب</span>
                    <FiArrowLeft className="mr-2 w-4 h-4" />
                  </div>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Footer Links */}
        <div className="text-center space-y-4">
          <p className="text-sm text-gray-600">
            لديك حساب بالفعل؟{' '}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500 transition-colors duration-200"
            >
              تسجيل الدخول
            </Link>
          </p>
          
          <Link
            to="/"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            <span>العودة إلى الصفحة الرئيسية</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
