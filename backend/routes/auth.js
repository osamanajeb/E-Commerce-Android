/**
 * Authentication Routes - مسارات المصادقة
 * Hospital Management System
 */

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { executeQuery, executeTransaction } = require('../config/database');
const { asyncHandler } = require('../middleware/errorHandler');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

/**
 * Register new user - تسجيل مستخدم جديد
 * POST /api/auth/register
 */
router.post('/register', [
  body('full_name')
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('الاسم الكامل يجب أن يكون بين 2 و 255 حرف'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('البريد الإلكتروني غير صحيح'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
  body('phone')
    .optional()
    .isMobilePhone('ar-SA')
    .withMessage('رقم الهاتف غير صحيح'),
  body('role')
    .isIn(['patient', 'doctor'])
    .withMessage('نوع المستخدم غير صحيح')
], asyncHandler(async (req, res) => {
  // Check validation errors - فحص أخطاء التحقق
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'بيانات غير صحيحة',
      message: 'Validation failed',
      details: errors.array()
    });
  }

  const { full_name, email, password, phone, role, birth_date, gender, specialization } = req.body;

  try {
    // Check if user already exists - التحقق من وجود المستخدم
    const existingUser = await executeQuery(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({
        error: 'البريد الإلكتروني مستخدم مسبقاً',
        message: 'Email already registered'
      });
    }

    // Hash password - تشفير كلمة المرور
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user in transaction - إنشاء المستخدم في معاملة
    const result = await executeTransaction(async (connection) => {
      // Insert user - إدراج المستخدم
      const [userResult] = await connection.execute(
        'INSERT INTO users (full_name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)',
        [full_name, email, hashedPassword, phone, role]
      );

      const userId = userResult.insertId;

      // Create role-specific profile - إنشاء ملف خاص بالدور
      if (role === 'patient') {
        await connection.execute(
          'INSERT INTO patients (user_id, birth_date, gender) VALUES (?, ?, ?)',
          [userId, birth_date || null, gender || null]
        );
      } else if (role === 'doctor') {
        await connection.execute(
          'INSERT INTO doctors (user_id, specialization) VALUES (?, ?)',
          [userId, specialization || 'عام']
        );
      }

      return { userId, role };
    });

    // Generate JWT token - إنشاء رمز JWT
    const token = jwt.sign(
      { userId: result.userId, role: result.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    res.status(201).json({
      success: true,
      message: 'تم إنشاء الحساب بنجاح',
      data: {
        user: {
          id: result.userId,
          full_name,
          email,
          role
        },
        token
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'خطأ في إنشاء الحساب',
      message: 'Registration failed'
    });
  }
}));

/**
 * Login user - تسجيل دخول المستخدم
 * POST /api/auth/login
 */
router.post('/login', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('البريد الإلكتروني غير صحيح'),
  body('password')
    .notEmpty()
    .withMessage('كلمة المرور مطلوبة')
], asyncHandler(async (req, res) => {
  // Check validation errors - فحص أخطاء التحقق
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'بيانات غير صحيحة',
      message: 'Validation failed',
      details: errors.array()
    });
  }

  const { email, password } = req.body;

  try {
    // Get user from database - الحصول على المستخدم من قاعدة البيانات
    const users = await executeQuery(
      'SELECT id, full_name, email, password, role, is_active FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
        message: 'Invalid credentials'
      });
    }

    const user = users[0];

    // Check if account is active - التحقق من نشاط الحساب
    if (!user.is_active) {
      return res.status(401).json({
        error: 'الحساب غير نشط',
        message: 'Account is inactive'
      });
    }

    // Verify password - التحقق من كلمة المرور
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
        message: 'Invalid credentials'
      });
    }

    // Generate JWT token - إنشاء رمز JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    // Get role-specific data - الحصول على البيانات الخاصة بالدور
    let roleData = {};
    if (user.role === 'doctor') {
      const doctors = await executeQuery(
        'SELECT id, specialization, experience_years FROM doctors WHERE user_id = ?',
        [user.id]
      );
      roleData = doctors[0] || {};
    } else if (user.role === 'patient') {
      const patients = await executeQuery(
        'SELECT id, birth_date, gender FROM patients WHERE user_id = ?',
        [user.id]
      );
      roleData = patients[0] || {};
    }

    res.json({
      success: true,
      message: 'تم تسجيل الدخول بنجاح',
      data: {
        user: {
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          role: user.role,
          ...roleData
        },
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'خطأ في تسجيل الدخول',
      message: 'Login failed'
    });
  }
}));

/**
 * Get current user profile - الحصول على ملف المستخدم الحالي
 * GET /api/auth/profile
 */
router.get('/profile', authenticateToken, asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    // Get role-specific data - الحصول على البيانات الخاصة بالدور
    let roleData = {};
    if (userRole === 'doctor') {
      const doctors = await executeQuery(
        'SELECT id, specialization, experience_years, consultation_fee, bio FROM doctors WHERE user_id = ?',
        [userId]
      );
      roleData = doctors[0] || {};
    } else if (userRole === 'patient') {
      const patients = await executeQuery(
        'SELECT id, birth_date, gender, blood_type, address FROM patients WHERE user_id = ?',
        [userId]
      );
      roleData = patients[0] || {};
    }

    res.json({
      success: true,
      data: {
        user: {
          ...req.user,
          ...roleData
        }
      }
    });

  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({
      error: 'خطأ في الحصول على الملف الشخصي',
      message: 'Failed to get profile'
    });
  }
}));

/**
 * Logout user - تسجيل خروج المستخدم
 * POST /api/auth/logout
 */
router.post('/logout', authenticateToken, (req, res) => {
  // In a real application, you might want to blacklist the token
  // في تطبيق حقيقي، قد ترغب في إضافة الرمز لقائمة سوداء
  res.json({
    success: true,
    message: 'تم تسجيل الخروج بنجاح'
  });
});

module.exports = router;
