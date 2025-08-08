/**
 * Error Handler Middleware - معالج الأخطاء
 * Hospital Management System
 */

/**
 * Global error handler - معالج الأخطاء العام
 * @param {Error} err - Error object
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error - تسجيل الخطأ
  console.error('Error:', err);

  // Mongoose bad ObjectId - معرف كائن خاطئ
  if (err.name === 'CastError') {
    const message = 'المورد غير موجود';
    error = {
      message,
      statusCode: 404,
      arabicMessage: 'المورد غير موجود',
      englishMessage: 'Resource not found'
    };
  }

  // Mongoose duplicate key - مفتاح مكرر
  if (err.code === 11000) {
    const message = 'البيانات موجودة مسبقاً';
    error = {
      message,
      statusCode: 400,
      arabicMessage: 'البيانات موجودة مسبقاً',
      englishMessage: 'Duplicate field value entered'
    };
  }

  // Mongoose validation error - خطأ في التحقق من صحة البيانات
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = {
      message,
      statusCode: 400,
      arabicMessage: 'بيانات غير صحيحة',
      englishMessage: 'Validation error'
    };
  }

  // MySQL errors - أخطاء MySQL
  if (err.code) {
    switch (err.code) {
      case 'ER_DUP_ENTRY':
        error = {
          message: 'البيانات موجودة مسبقاً',
          statusCode: 400,
          arabicMessage: 'البيانات موجودة مسبقاً',
          englishMessage: 'Duplicate entry'
        };
        break;
      
      case 'ER_NO_REFERENCED_ROW_2':
        error = {
          message: 'مرجع غير صحيح',
          statusCode: 400,
          arabicMessage: 'مرجع غير صحيح',
          englishMessage: 'Invalid reference'
        };
        break;
      
      case 'ER_ROW_IS_REFERENCED_2':
        error = {
          message: 'لا يمكن حذف هذا السجل لأنه مرتبط ببيانات أخرى',
          statusCode: 400,
          arabicMessage: 'لا يمكن حذف هذا السجل لأنه مرتبط ببيانات أخرى',
          englishMessage: 'Cannot delete record as it is referenced by other data'
        };
        break;
      
      case 'ER_DATA_TOO_LONG':
        error = {
          message: 'البيانات المدخلة طويلة جداً',
          statusCode: 400,
          arabicMessage: 'البيانات المدخلة طويلة جداً',
          englishMessage: 'Data too long for column'
        };
        break;
      
      case 'ER_BAD_NULL_ERROR':
        error = {
          message: 'حقل مطلوب مفقود',
          statusCode: 400,
          arabicMessage: 'حقل مطلوب مفقود',
          englishMessage: 'Required field is missing'
        };
        break;
      
      default:
        error = {
          message: 'خطأ في قاعدة البيانات',
          statusCode: 500,
          arabicMessage: 'خطأ في قاعدة البيانات',
          englishMessage: 'Database error'
        };
    }
  }

  // JWT errors - أخطاء JWT
  if (err.name === 'JsonWebTokenError') {
    error = {
      message: 'رمز المصادقة غير صحيح',
      statusCode: 401,
      arabicMessage: 'رمز المصادقة غير صحيح',
      englishMessage: 'Invalid token'
    };
  }

  if (err.name === 'TokenExpiredError') {
    error = {
      message: 'انتهت صلاحية رمز المصادقة',
      statusCode: 401,
      arabicMessage: 'انتهت صلاحية رمز المصادقة',
      englishMessage: 'Token expired'
    };
  }

  // File upload errors - أخطاء رفع الملفات
  if (err.code === 'LIMIT_FILE_SIZE') {
    error = {
      message: 'حجم الملف كبير جداً',
      statusCode: 400,
      arabicMessage: 'حجم الملف كبير جداً',
      englishMessage: 'File too large'
    };
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    error = {
      message: 'نوع الملف غير مدعوم',
      statusCode: 400,
      arabicMessage: 'نوع الملف غير مدعوم',
      englishMessage: 'Unsupported file type'
    };
  }

  // Default error response - استجابة الخطأ الافتراضية
  const statusCode = error.statusCode || 500;
  const message = error.message || 'خطأ في الخادم';

  res.status(statusCode).json({
    success: false,
    error: error.arabicMessage || message,
    message: error.englishMessage || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      details: err 
    })
  });
};

/**
 * Handle async errors - معالج الأخطاء غير المتزامنة
 * @param {Function} fn - Async function
 * @returns {Function} Express middleware
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Not found handler - معالج الصفحات غير الموجودة
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
const notFound = (req, res, next) => {
  const error = new Error(`الصفحة غير موجودة - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

module.exports = {
  errorHandler,
  asyncHandler,
  notFound
};
