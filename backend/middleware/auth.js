/**
 * Authentication Middleware - وسطاء المصادقة
 * Hospital Management System
 */

const jwt = require('jsonwebtoken');
const { executeQuery } = require('../config/database');

/**
 * Authenticate JWT Token - التحقق من رمز JWT
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        error: 'مطلوب رمز المصادقة',
        message: 'Access token required'
      });
    }

    // Verify token - التحقق من الرمز
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database - الحصول على المستخدم من قاعدة البيانات
    const user = await executeQuery(
      'SELECT id, full_name, email, role, is_active FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (!user || user.length === 0) {
      return res.status(401).json({
        error: 'المستخدم غير موجود',
        message: 'User not found'
      });
    }

    if (!user[0].is_active) {
      return res.status(401).json({
        error: 'الحساب غير نشط',
        message: 'Account is inactive'
      });
    }

    // Add user info to request object - إضافة معلومات المستخدم لكائن الطلب
    req.user = user[0];
    next();

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({
        error: 'رمز المصادقة غير صحيح',
        message: 'Invalid token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({
        error: 'انتهت صلاحية رمز المصادقة',
        message: 'Token expired'
      });
    }

    console.error('Authentication error:', error);
    return res.status(500).json({
      error: 'خطأ في المصادقة',
      message: 'Authentication error'
    });
  }
};

/**
 * Authorize user roles - التحقق من صلاحيات المستخدم
 * @param {Array} roles - Allowed roles
 * @returns {Function} Middleware function
 */
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'مطلوب تسجيل الدخول',
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'ليس لديك صلاحية للوصول لهذا المورد',
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

/**
 * Check if user is doctor - التحقق من كون المستخدم طبيب
 */
const requireDoctor = authorizeRoles('doctor', 'admin');

/**
 * Check if user is patient - التحقق من كون المستخدم مريض
 */
const requirePatient = authorizeRoles('patient', 'admin');

/**
 * Check if user is admin - التحقق من كون المستخدم مدير
 */
const requireAdmin = authorizeRoles('admin');

/**
 * Check if user can access resource - التحقق من إمكانية الوصول للمورد
 * @param {string} resourceType - Type of resource (patient, doctor, appointment)
 * @param {string} resourceIdParam - Parameter name for resource ID
 */
const checkResourceAccess = (resourceType, resourceIdParam = 'id') => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params[resourceIdParam];
      const userId = req.user.id;
      const userRole = req.user.role;

      // Admin can access everything - المدير يمكنه الوصول لكل شيء
      if (userRole === 'admin') {
        return next();
      }

      let hasAccess = false;

      switch (resourceType) {
        case 'patient':
          if (userRole === 'patient') {
            // Patient can only access their own data - المريض يمكنه الوصول لبياناته فقط
            const patient = await executeQuery(
              'SELECT id FROM patients WHERE id = ? AND user_id = ?',
              [resourceId, userId]
            );
            hasAccess = patient.length > 0;
          } else if (userRole === 'doctor') {
            // Doctor can access patients they have appointments with
            const appointment = await executeQuery(
              'SELECT a.id FROM appointments a JOIN doctors d ON a.doctor_id = d.id WHERE a.patient_id = ? AND d.user_id = ?',
              [resourceId, userId]
            );
            hasAccess = appointment.length > 0;
          }
          break;

        case 'doctor':
          if (userRole === 'doctor') {
            // Doctor can only access their own data - الطبيب يمكنه الوصول لبياناته فقط
            const doctor = await executeQuery(
              'SELECT id FROM doctors WHERE id = ? AND user_id = ?',
              [resourceId, userId]
            );
            hasAccess = doctor.length > 0;
          }
          break;

        case 'appointment':
          // Users can access appointments they are involved in
          const appointment = await executeQuery(
            `SELECT a.id FROM appointments a 
             JOIN doctors d ON a.doctor_id = d.id 
             JOIN patients p ON a.patient_id = p.id 
             WHERE a.id = ? AND (d.user_id = ? OR p.user_id = ?)`,
            [resourceId, userId, userId]
          );
          hasAccess = appointment.length > 0;
          break;

        default:
          hasAccess = false;
      }

      if (!hasAccess) {
        return res.status(403).json({
          error: 'ليس لديك صلاحية للوصول لهذا المورد',
          message: 'Access denied to this resource'
        });
      }

      next();

    } catch (error) {
      console.error('Resource access check error:', error);
      return res.status(500).json({
        error: 'خطأ في التحقق من الصلاحيات',
        message: 'Error checking resource access'
      });
    }
  };
};

module.exports = {
  authenticateToken,
  authorizeRoles,
  requireDoctor,
  requirePatient,
  requireAdmin,
  checkResourceAccess
};
