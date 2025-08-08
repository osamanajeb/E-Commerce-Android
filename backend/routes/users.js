/**
 * Users Routes - مسارات المستخدمين
 * Hospital Management System
 */

const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const { executeQuery } = require('../config/database');
const { asyncHandler } = require('../middleware/errorHandler');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

/**
 * Get all users - الحصول على جميع المستخدمين (Admin only)
 * GET /api/users
 */
router.get('/', requireAdmin, asyncHandler(async (req, res) => {
  try {
    const { role, active, page = 1, limit = 10, search } = req.query;
    
    let query = `
      SELECT 
        u.id,
        u.full_name,
        u.email,
        u.phone,
        u.role,
        u.is_active,
        u.created_at
      FROM users u
      WHERE 1=1
    `;
    
    const params = [];
    
    // Filter by role - تصفية حسب الدور
    if (role) {
      query += ' AND u.role = ?';
      params.push(role);
    }
    
    // Filter by active status - تصفية حسب حالة النشاط
    if (active !== undefined) {
      query += ' AND u.is_active = ?';
      params.push(active === 'true' ? 1 : 0);
    }
    
    // Search functionality - وظيفة البحث
    if (search) {
      query += ' AND (u.full_name LIKE ? OR u.email LIKE ? OR u.phone LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }
    
    // Add pagination - إضافة التصفح
    const offset = (page - 1) * limit;
    query += ' ORDER BY u.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
    
    const users = await executeQuery(query, params);
    
    // Get total count for pagination - الحصول على العدد الإجمالي للتصفح
    let countQuery = 'SELECT COUNT(*) as total FROM users u WHERE 1=1';
    const countParams = [];
    
    if (role) {
      countQuery += ' AND u.role = ?';
      countParams.push(role);
    }
    
    if (active !== undefined) {
      countQuery += ' AND u.is_active = ?';
      countParams.push(active === 'true' ? 1 : 0);
    }
    
    if (search) {
      countQuery += ' AND (u.full_name LIKE ? OR u.email LIKE ? OR u.phone LIKE ?)';
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm, searchTerm);
    }
    
    const [{ total }] = await executeQuery(countQuery, countParams);
    
    res.json({
      success: true,
      data: {
        users,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(total / limit),
          total_records: total,
          per_page: parseInt(limit)
        }
      }
    });
    
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      error: 'خطأ في الحصول على قائمة المستخدمين',
      message: 'Failed to get users'
    });
  }
}));

/**
 * Get user by ID - الحصول على مستخدم بالمعرف
 * GET /api/users/:id
 */
router.get('/:id', requireAdmin, asyncHandler(async (req, res) => {
  try {
    const userId = req.params.id;
    
    const users = await executeQuery(`
      SELECT 
        u.id,
        u.full_name,
        u.email,
        u.phone,
        u.role,
        u.is_active,
        u.created_at,
        u.updated_at
      FROM users u
      WHERE u.id = ?
    `, [userId]);
    
    if (users.length === 0) {
      return res.status(404).json({
        error: 'المستخدم غير موجود',
        message: 'User not found'
      });
    }
    
    const user = users[0];
    
    // Get role-specific data - الحصول على البيانات الخاصة بالدور
    let roleData = {};
    if (user.role === 'doctor') {
      const doctors = await executeQuery(
        'SELECT * FROM doctors WHERE user_id = ?',
        [userId]
      );
      roleData = doctors[0] || {};
    } else if (user.role === 'patient') {
      const patients = await executeQuery(
        'SELECT * FROM patients WHERE user_id = ?',
        [userId]
      );
      roleData = patients[0] || {};
    }
    
    res.json({
      success: true,
      data: { 
        user: {
          ...user,
          ...roleData
        }
      }
    });
    
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      error: 'خطأ في الحصول على بيانات المستخدم',
      message: 'Failed to get user'
    });
  }
}));

/**
 * Update user - تحديث المستخدم
 * PUT /api/users/:id
 */
router.put('/:id', [
  requireAdmin,
  body('full_name').optional().trim().isLength({ min: 2, max: 255 }),
  body('email').optional().isEmail().normalizeEmail(),
  body('phone').optional().isMobilePhone('ar-SA'),
  body('is_active').optional().isBoolean()
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
  
  try {
    const userId = req.params.id;
    const { full_name, email, phone, is_active } = req.body;
    
    // Check if user exists - التحقق من وجود المستخدم
    const existingUsers = await executeQuery(
      'SELECT id FROM users WHERE id = ?',
      [userId]
    );
    
    if (existingUsers.length === 0) {
      return res.status(404).json({
        error: 'المستخدم غير موجود',
        message: 'User not found'
      });
    }
    
    // Check if email is already taken by another user - التحقق من عدم استخدام البريد الإلكتروني
    if (email) {
      const emailUsers = await executeQuery(
        'SELECT id FROM users WHERE email = ? AND id != ?',
        [email, userId]
      );
      
      if (emailUsers.length > 0) {
        return res.status(400).json({
          error: 'البريد الإلكتروني مستخدم مسبقاً',
          message: 'Email already taken'
        });
      }
    }
    
    // Build update query dynamically - بناء استعلام التحديث ديناميكياً
    const updateFields = [];
    const params = [];
    
    if (full_name !== undefined) {
      updateFields.push('full_name = ?');
      params.push(full_name);
    }
    
    if (email !== undefined) {
      updateFields.push('email = ?');
      params.push(email);
    }
    
    if (phone !== undefined) {
      updateFields.push('phone = ?');
      params.push(phone);
    }
    
    if (is_active !== undefined) {
      updateFields.push('is_active = ?');
      params.push(is_active);
    }
    
    if (updateFields.length === 0) {
      return res.status(400).json({
        error: 'لا توجد بيانات للتحديث',
        message: 'No data to update'
      });
    }
    
    params.push(userId);
    
    const query = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;
    await executeQuery(query, params);
    
    // Get updated user data - الحصول على بيانات المستخدم المحدثة
    const updatedUser = await executeQuery(
      'SELECT id, full_name, email, phone, role, is_active, created_at, updated_at FROM users WHERE id = ?',
      [userId]
    );
    
    res.json({
      success: true,
      message: 'تم تحديث المستخدم بنجاح',
      data: { user: updatedUser[0] }
    });
    
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      error: 'خطأ في تحديث المستخدم',
      message: 'Failed to update user'
    });
  }
}));

/**
 * Change user password - تغيير كلمة مرور المستخدم
 * PATCH /api/users/:id/password
 */
router.patch('/:id/password', [
  requireAdmin,
  body('new_password').isLength({ min: 6 }).withMessage('كلمة المرور يجب أن تكون 6 أحرف على الأقل')
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
  
  try {
    const userId = req.params.id;
    const { new_password } = req.body;
    
    // Check if user exists - التحقق من وجود المستخدم
    const users = await executeQuery(
      'SELECT id FROM users WHERE id = ?',
      [userId]
    );
    
    if (users.length === 0) {
      return res.status(404).json({
        error: 'المستخدم غير موجود',
        message: 'User not found'
      });
    }
    
    // Hash new password - تشفير كلمة المرور الجديدة
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    const hashedPassword = await bcrypt.hash(new_password, saltRounds);
    
    // Update password - تحديث كلمة المرور
    await executeQuery(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, userId]
    );
    
    res.json({
      success: true,
      message: 'تم تغيير كلمة المرور بنجاح'
    });
    
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      error: 'خطأ في تغيير كلمة المرور',
      message: 'Failed to change password'
    });
  }
}));

/**
 * Delete user - حذف المستخدم (Soft delete)
 * DELETE /api/users/:id
 */
router.delete('/:id', requireAdmin, asyncHandler(async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Check if user exists - التحقق من وجود المستخدم
    const users = await executeQuery(
      'SELECT id, role FROM users WHERE id = ?',
      [userId]
    );
    
    if (users.length === 0) {
      return res.status(404).json({
        error: 'المستخدم غير موجود',
        message: 'User not found'
      });
    }
    
    // Soft delete by setting is_active to false - حذف ناعم بتعيين is_active إلى false
    await executeQuery(
      'UPDATE users SET is_active = 0 WHERE id = ?',
      [userId]
    );
    
    res.json({
      success: true,
      message: 'تم حذف المستخدم بنجاح'
    });
    
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      error: 'خطأ في حذف المستخدم',
      message: 'Failed to delete user'
    });
  }
}));

/**
 * Get user statistics - الحصول على إحصائيات المستخدمين
 * GET /api/users/stats
 */
router.get('/meta/stats', requireAdmin, asyncHandler(async (req, res) => {
  try {
    // Get user counts by role - الحصول على عدد المستخدمين حسب الدور
    const roleStats = await executeQuery(`
      SELECT 
        role,
        COUNT(*) as count,
        SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active_count
      FROM users
      GROUP BY role
    `);
    
    // Get recent registrations - الحصول على التسجيلات الأخيرة
    const recentRegistrations = await executeQuery(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as count
      FROM users
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `);
    
    res.json({
      success: true,
      data: {
        role_statistics: roleStats,
        recent_registrations: recentRegistrations
      }
    });
    
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      error: 'خطأ في الحصول على الإحصائيات',
      message: 'Failed to get user statistics'
    });
  }
}));

module.exports = router;
