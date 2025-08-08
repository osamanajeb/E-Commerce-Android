/**
 * Specializations Routes - مسارات التخصصات
 * Hospital Management System
 */

const express = require('express');
const { body, validationResult } = require('express-validator');
const { executeQuery } = require('../config/database');
const { asyncHandler } = require('../middleware/errorHandler');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

/**
 * Get all specializations - الحصول على جميع التخصصات
 * GET /api/specializations
 */
router.get('/', asyncHandler(async (req, res) => {
  try {
    const { active = true } = req.query;
    
    let query = 'SELECT * FROM specializations';
    const params = [];
    
    if (active !== undefined) {
      query += ' WHERE is_active = ?';
      params.push(active === 'true' ? 1 : 0);
    }
    
    query += ' ORDER BY name_ar';
    
    const specializations = await executeQuery(query, params);
    
    res.json({
      success: true,
      data: { specializations }
    });
    
  } catch (error) {
    console.error('Get specializations error:', error);
    res.status(500).json({
      error: 'خطأ في الحصول على التخصصات',
      message: 'Failed to get specializations'
    });
  }
}));

/**
 * Create new specialization - إنشاء تخصص جديد
 * POST /api/specializations
 */
router.post('/', [
  authenticateToken,
  requireAdmin,
  body('name_ar').trim().isLength({ min: 2, max: 255 }).withMessage('اسم التخصص بالعربية مطلوب'),
  body('name_en').trim().isLength({ min: 2, max: 255 }).withMessage('اسم التخصص بالإنجليزية مطلوب'),
  body('description').optional().trim().isLength({ max: 1000 }).withMessage('الوصف طويل جداً')
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
    const { name_ar, name_en, description } = req.body;
    
    // Check if specialization already exists - التحقق من عدم وجود التخصص مسبقاً
    const existing = await executeQuery(
      'SELECT id FROM specializations WHERE name_ar = ? OR name_en = ?',
      [name_ar, name_en]
    );
    
    if (existing.length > 0) {
      return res.status(400).json({
        error: 'التخصص موجود مسبقاً',
        message: 'Specialization already exists'
      });
    }
    
    // Create specialization - إنشاء التخصص
    const result = await executeQuery(
      'INSERT INTO specializations (name_ar, name_en, description) VALUES (?, ?, ?)',
      [name_ar, name_en, description || null]
    );
    
    // Get created specialization - الحصول على التخصص المنشأ
    const newSpecialization = await executeQuery(
      'SELECT * FROM specializations WHERE id = ?',
      [result.insertId]
    );
    
    res.status(201).json({
      success: true,
      message: 'تم إنشاء التخصص بنجاح',
      data: { specialization: newSpecialization[0] }
    });
    
  } catch (error) {
    console.error('Create specialization error:', error);
    res.status(500).json({
      error: 'خطأ في إنشاء التخصص',
      message: 'Failed to create specialization'
    });
  }
}));

module.exports = router;
