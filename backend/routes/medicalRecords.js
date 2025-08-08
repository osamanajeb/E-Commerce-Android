/**
 * Medical Records Routes - مسارات السجلات الطبية
 * Hospital Management System
 */

const express = require('express');
const { body, validationResult } = require('express-validator');
const { executeQuery } = require('../config/database');
const { asyncHandler } = require('../middleware/errorHandler');
const { authenticateToken, requireDoctor, checkResourceAccess } = require('../middleware/auth');

const router = express.Router();

/**
 * Get all medical records - الحصول على جميع السجلات الطبية
 * GET /api/medical-records
 */
router.get('/', authenticateToken, asyncHandler(async (req, res) => {
  try {
    const { patient_id, doctor_id, page = 1, limit = 10 } = req.query;
    const userId = req.user.id;
    const userRole = req.user.role;
    
    let query = `
      SELECT 
        mr.id,
        mr.visit_date,
        mr.chief_complaint,
        mr.diagnosis,
        mr.prescription,
        mr.treatment_plan,
        mr.follow_up_date,
        mr.notes,
        mr.created_at,
        p.id as patient_id,
        pu.full_name as patient_name,
        d.id as doctor_id,
        d.specialization,
        du.full_name as doctor_name
      FROM medical_records mr
      JOIN patients p ON mr.patient_id = p.id
      JOIN users pu ON p.user_id = pu.id
      JOIN doctors d ON mr.doctor_id = d.id
      JOIN users du ON d.user_id = du.id
      WHERE 1=1
    `;
    
    const params = [];
    
    // Filter based on user role - تصفية حسب دور المستخدم
    if (userRole === 'doctor') {
      query += ' AND d.user_id = ?';
      params.push(userId);
    } else if (userRole === 'patient') {
      query += ' AND p.user_id = ?';
      params.push(userId);
    }
    // Admin can see all records
    
    // Additional filters - مرشحات إضافية
    if (patient_id) {
      query += ' AND mr.patient_id = ?';
      params.push(patient_id);
    }
    
    if (doctor_id) {
      query += ' AND mr.doctor_id = ?';
      params.push(doctor_id);
    }
    
    // Add pagination - إضافة التصفح
    const offset = (page - 1) * limit;
    query += ' ORDER BY mr.visit_date DESC, mr.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
    
    const medicalRecords = await executeQuery(query, params);
    
    res.json({
      success: true,
      data: { medical_records: medicalRecords }
    });
    
  } catch (error) {
    console.error('Get medical records error:', error);
    res.status(500).json({
      error: 'خطأ في الحصول على السجلات الطبية',
      message: 'Failed to get medical records'
    });
  }
}));

/**
 * Create new medical record - إنشاء سجل طبي جديد
 * POST /api/medical-records
 */
router.post('/', [
  authenticateToken,
  requireDoctor,
  body('patient_id').isInt({ min: 1 }).withMessage('معرف المريض مطلوب'),
  body('visit_date').isDate().withMessage('تاريخ الزيارة غير صحيح'),
  body('chief_complaint').trim().isLength({ min: 1, max: 1000 }).withMessage('الشكوى الرئيسية مطلوبة'),
  body('diagnosis').optional().trim().isLength({ max: 1000 }).withMessage('التشخيص طويل جداً'),
  body('prescription').optional().trim().isLength({ max: 2000 }).withMessage('الوصفة الطبية طويلة جداً'),
  body('treatment_plan').optional().trim().isLength({ max: 2000 }).withMessage('خطة العلاج طويلة جداً'),
  body('follow_up_date').optional().isDate().withMessage('تاريخ المتابعة غير صحيح'),
  body('notes').optional().trim().isLength({ max: 2000 }).withMessage('الملاحظات طويلة جداً')
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
    const {
      patient_id,
      appointment_id,
      visit_date,
      chief_complaint,
      diagnosis,
      prescription,
      treatment_plan,
      follow_up_date,
      notes
    } = req.body;
    
    const userId = req.user.id;
    
    // Get doctor ID for current user - الحصول على معرف الطبيب للمستخدم الحالي
    const doctors = await executeQuery(
      'SELECT id FROM doctors WHERE user_id = ?',
      [userId]
    );
    
    if (doctors.length === 0) {
      return res.status(400).json({
        error: 'ملف الطبيب غير موجود',
        message: 'Doctor profile not found'
      });
    }
    
    const doctorId = doctors[0].id;
    
    // Verify patient exists - التحقق من وجود المريض
    const patients = await executeQuery(
      'SELECT id FROM patients WHERE id = ?',
      [patient_id]
    );
    
    if (patients.length === 0) {
      return res.status(404).json({
        error: 'المريض غير موجود',
        message: 'Patient not found'
      });
    }
    
    // Verify appointment if provided - التحقق من الموعد إذا تم توفيره
    if (appointment_id) {
      const appointments = await executeQuery(
        'SELECT id FROM appointments WHERE id = ? AND doctor_id = ? AND patient_id = ?',
        [appointment_id, doctorId, patient_id]
      );
      
      if (appointments.length === 0) {
        return res.status(400).json({
          error: 'الموعد غير صحيح',
          message: 'Invalid appointment'
        });
      }
    }
    
    // Create medical record - إنشاء السجل الطبي
    const result = await executeQuery(
      `INSERT INTO medical_records 
       (patient_id, doctor_id, appointment_id, visit_date, chief_complaint, diagnosis, prescription, treatment_plan, follow_up_date, notes) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        patient_id,
        doctorId,
        appointment_id || null,
        visit_date,
        chief_complaint,
        diagnosis || null,
        prescription || null,
        treatment_plan || null,
        follow_up_date || null,
        notes || null
      ]
    );
    
    // Get created medical record with details - الحصول على السجل الطبي المنشأ مع التفاصيل
    const newRecord = await executeQuery(`
      SELECT 
        mr.*,
        pu.full_name as patient_name,
        du.full_name as doctor_name,
        d.specialization
      FROM medical_records mr
      JOIN patients p ON mr.patient_id = p.id
      JOIN users pu ON p.user_id = pu.id
      JOIN doctors d ON mr.doctor_id = d.id
      JOIN users du ON d.user_id = du.id
      WHERE mr.id = ?
    `, [result.insertId]);
    
    res.status(201).json({
      success: true,
      message: 'تم إنشاء السجل الطبي بنجاح',
      data: { medical_record: newRecord[0] }
    });
    
  } catch (error) {
    console.error('Create medical record error:', error);
    res.status(500).json({
      error: 'خطأ في إنشاء السجل الطبي',
      message: 'Failed to create medical record'
    });
  }
}));

/**
 * Get medical record by ID - الحصول على سجل طبي بالمعرف
 * GET /api/medical-records/:id
 */
router.get('/:id', authenticateToken, asyncHandler(async (req, res) => {
  try {
    const recordId = req.params.id;
    const userId = req.user.id;
    const userRole = req.user.role;
    
    let query = `
      SELECT 
        mr.*,
        p.id as patient_id,
        pu.full_name as patient_name,
        pu.phone as patient_phone,
        pt.birth_date,
        pt.gender,
        pt.blood_type,
        d.id as doctor_id,
        d.specialization,
        du.full_name as doctor_name,
        du.phone as doctor_phone
      FROM medical_records mr
      JOIN patients p ON mr.patient_id = p.id
      JOIN users pu ON p.user_id = pu.id
      LEFT JOIN patients pt ON p.id = pt.id
      JOIN doctors d ON mr.doctor_id = d.id
      JOIN users du ON d.user_id = du.id
      WHERE mr.id = ?
    `;
    
    const params = [recordId];
    
    // Add access control based on user role - إضافة التحكم في الوصول حسب دور المستخدم
    if (userRole === 'doctor') {
      query += ' AND d.user_id = ?';
      params.push(userId);
    } else if (userRole === 'patient') {
      query += ' AND p.user_id = ?';
      params.push(userId);
    }
    // Admin can access all records
    
    const records = await executeQuery(query, params);
    
    if (records.length === 0) {
      return res.status(404).json({
        error: 'السجل الطبي غير موجود',
        message: 'Medical record not found'
      });
    }
    
    res.json({
      success: true,
      data: { medical_record: records[0] }
    });
    
  } catch (error) {
    console.error('Get medical record error:', error);
    res.status(500).json({
      error: 'خطأ في الحصول على السجل الطبي',
      message: 'Failed to get medical record'
    });
  }
}));

/**
 * Update medical record - تحديث السجل الطبي
 * PUT /api/medical-records/:id
 */
router.put('/:id', [
  authenticateToken,
  requireDoctor,
  body('chief_complaint').optional().trim().isLength({ min: 1, max: 1000 }),
  body('diagnosis').optional().trim().isLength({ max: 1000 }),
  body('prescription').optional().trim().isLength({ max: 2000 }),
  body('treatment_plan').optional().trim().isLength({ max: 2000 }),
  body('follow_up_date').optional().isDate(),
  body('notes').optional().trim().isLength({ max: 2000 })
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
    const recordId = req.params.id;
    const userId = req.user.id;
    const {
      chief_complaint,
      diagnosis,
      prescription,
      treatment_plan,
      follow_up_date,
      notes
    } = req.body;
    
    // Get doctor ID for current user - الحصول على معرف الطبيب للمستخدم الحالي
    const doctors = await executeQuery(
      'SELECT id FROM doctors WHERE user_id = ?',
      [userId]
    );
    
    if (doctors.length === 0) {
      return res.status(400).json({
        error: 'ملف الطبيب غير موجود',
        message: 'Doctor profile not found'
      });
    }
    
    const doctorId = doctors[0].id;
    
    // Check if record exists and belongs to this doctor - التحقق من وجود السجل وانتمائه لهذا الطبيب
    const records = await executeQuery(
      'SELECT id FROM medical_records WHERE id = ? AND doctor_id = ?',
      [recordId, doctorId]
    );
    
    if (records.length === 0) {
      return res.status(404).json({
        error: 'السجل الطبي غير موجود أو ليس لديك صلاحية لتعديله',
        message: 'Medical record not found or access denied'
      });
    }
    
    // Build update query dynamically - بناء استعلام التحديث ديناميكياً
    const updateFields = [];
    const params = [];
    
    if (chief_complaint !== undefined) {
      updateFields.push('chief_complaint = ?');
      params.push(chief_complaint);
    }
    
    if (diagnosis !== undefined) {
      updateFields.push('diagnosis = ?');
      params.push(diagnosis);
    }
    
    if (prescription !== undefined) {
      updateFields.push('prescription = ?');
      params.push(prescription);
    }
    
    if (treatment_plan !== undefined) {
      updateFields.push('treatment_plan = ?');
      params.push(treatment_plan);
    }
    
    if (follow_up_date !== undefined) {
      updateFields.push('follow_up_date = ?');
      params.push(follow_up_date);
    }
    
    if (notes !== undefined) {
      updateFields.push('notes = ?');
      params.push(notes);
    }
    
    if (updateFields.length === 0) {
      return res.status(400).json({
        error: 'لا توجد بيانات للتحديث',
        message: 'No data to update'
      });
    }
    
    params.push(recordId);
    
    const query = `UPDATE medical_records SET ${updateFields.join(', ')} WHERE id = ?`;
    await executeQuery(query, params);
    
    // Get updated record - الحصول على السجل المحدث
    const updatedRecord = await executeQuery(`
      SELECT 
        mr.*,
        pu.full_name as patient_name,
        du.full_name as doctor_name
      FROM medical_records mr
      JOIN patients p ON mr.patient_id = p.id
      JOIN users pu ON p.user_id = pu.id
      JOIN doctors d ON mr.doctor_id = d.id
      JOIN users du ON d.user_id = du.id
      WHERE mr.id = ?
    `, [recordId]);
    
    res.json({
      success: true,
      message: 'تم تحديث السجل الطبي بنجاح',
      data: { medical_record: updatedRecord[0] }
    });
    
  } catch (error) {
    console.error('Update medical record error:', error);
    res.status(500).json({
      error: 'خطأ في تحديث السجل الطبي',
      message: 'Failed to update medical record'
    });
  }
}));

module.exports = router;
