/**
 * Patients Routes - مسارات المرضى
 * Hospital Management System
 */

const express = require('express');
const { body, validationResult } = require('express-validator');
const { executeQuery } = require('../config/database');
const { asyncHandler } = require('../middleware/errorHandler');
const { authenticateToken, requireAdmin, checkResourceAccess } = require('../middleware/auth');

const router = express.Router();

/**
 * Get all patients - الحصول على جميع المرضى (Admin only)
 * GET /api/patients
 */
router.get('/', [authenticateToken, requireAdmin], asyncHandler(async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    
    let query = `
      SELECT 
        p.id,
        u.full_name,
        u.email,
        u.phone,
        p.birth_date,
        p.gender,
        p.blood_type,
        p.address,
        p.created_at
      FROM patients p
      JOIN users u ON p.user_id = u.id
      WHERE u.is_active = 1
    `;
    
    const params = [];
    
    // Search functionality - وظيفة البحث
    if (search) {
      query += ' AND (u.full_name LIKE ? OR u.email LIKE ? OR u.phone LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }
    
    // Add pagination - إضافة التصفح
    const offset = (page - 1) * limit;
    query += ' ORDER BY u.full_name LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
    
    const patients = await executeQuery(query, params);
    
    // Get total count for pagination - الحصول على العدد الإجمالي للتصفح
    let countQuery = `
      SELECT COUNT(*) as total
      FROM patients p
      JOIN users u ON p.user_id = u.id
      WHERE u.is_active = 1
    `;
    
    const countParams = [];
    if (search) {
      countQuery += ' AND (u.full_name LIKE ? OR u.email LIKE ? OR u.phone LIKE ?)';
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm, searchTerm);
    }
    
    const [{ total }] = await executeQuery(countQuery, countParams);
    
    res.json({
      success: true,
      data: {
        patients,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(total / limit),
          total_records: total,
          per_page: parseInt(limit)
        }
      }
    });
    
  } catch (error) {
    console.error('Get patients error:', error);
    res.status(500).json({
      error: 'خطأ في الحصول على قائمة المرضى',
      message: 'Failed to get patients'
    });
  }
}));

/**
 * Get patient by ID - الحصول على مريض بالمعرف
 * GET /api/patients/:id
 */
router.get('/:id', [
  authenticateToken,
  checkResourceAccess('patient')
], asyncHandler(async (req, res) => {
  try {
    const patientId = req.params.id;
    
    const patients = await executeQuery(`
      SELECT 
        p.*,
        u.full_name,
        u.email,
        u.phone,
        u.created_at as user_created_at
      FROM patients p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = ? AND u.is_active = 1
    `, [patientId]);
    
    if (patients.length === 0) {
      return res.status(404).json({
        error: 'المريض غير موجود',
        message: 'Patient not found'
      });
    }
    
    const patient = patients[0];
    
    // Get patient's recent appointments - الحصول على المواعيد الأخيرة للمريض
    const recentAppointments = await executeQuery(`
      SELECT 
        a.id,
        a.appointment_date,
        a.time_slot,
        a.status,
        a.reason,
        d.specialization,
        u.full_name as doctor_name
      FROM appointments a
      JOIN doctors d ON a.doctor_id = d.id
      JOIN users u ON d.user_id = u.id
      WHERE a.patient_id = ?
      ORDER BY a.appointment_date DESC, a.time_slot DESC
      LIMIT 5
    `, [patientId]);
    
    patient.recent_appointments = recentAppointments;
    
    res.json({
      success: true,
      data: { patient }
    });
    
  } catch (error) {
    console.error('Get patient error:', error);
    res.status(500).json({
      error: 'خطأ في الحصول على بيانات المريض',
      message: 'Failed to get patient'
    });
  }
}));

/**
 * Update patient profile - تحديث ملف المريض
 * PUT /api/patients/:id
 */
router.put('/:id', [
  authenticateToken,
  checkResourceAccess('patient'),
  body('birth_date').optional().isDate().withMessage('تاريخ الميلاد غير صحيح'),
  body('gender').optional().isIn(['male', 'female']).withMessage('الجنس غير صحيح'),
  body('blood_type').optional().isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).withMessage('فصيلة الدم غير صحيحة'),
  body('address').optional().trim().isLength({ max: 500 }).withMessage('العنوان طويل جداً'),
  body('emergency_contact').optional().trim().isLength({ max: 255 }).withMessage('جهة الاتصال في الطوارئ طويلة جداً'),
  body('emergency_phone').optional().isMobilePhone('ar-SA').withMessage('رقم هاتف الطوارئ غير صحيح'),
  body('medical_history').optional().trim().isLength({ max: 2000 }).withMessage('التاريخ المرضي طويل جداً'),
  body('allergies').optional().trim().isLength({ max: 1000 }).withMessage('الحساسيات طويلة جداً')
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
    const patientId = req.params.id;
    const { 
      birth_date, 
      gender, 
      blood_type, 
      address, 
      emergency_contact, 
      emergency_phone, 
      medical_history, 
      allergies 
    } = req.body;
    
    // Build update query dynamically - بناء استعلام التحديث ديناميكياً
    const updateFields = [];
    const params = [];
    
    if (birth_date !== undefined) {
      updateFields.push('birth_date = ?');
      params.push(birth_date);
    }
    
    if (gender !== undefined) {
      updateFields.push('gender = ?');
      params.push(gender);
    }
    
    if (blood_type !== undefined) {
      updateFields.push('blood_type = ?');
      params.push(blood_type);
    }
    
    if (address !== undefined) {
      updateFields.push('address = ?');
      params.push(address);
    }
    
    if (emergency_contact !== undefined) {
      updateFields.push('emergency_contact = ?');
      params.push(emergency_contact);
    }
    
    if (emergency_phone !== undefined) {
      updateFields.push('emergency_phone = ?');
      params.push(emergency_phone);
    }
    
    if (medical_history !== undefined) {
      updateFields.push('medical_history = ?');
      params.push(medical_history);
    }
    
    if (allergies !== undefined) {
      updateFields.push('allergies = ?');
      params.push(allergies);
    }
    
    if (updateFields.length === 0) {
      return res.status(400).json({
        error: 'لا توجد بيانات للتحديث',
        message: 'No data to update'
      });
    }
    
    params.push(patientId);
    
    const query = `UPDATE patients SET ${updateFields.join(', ')} WHERE id = ?`;
    await executeQuery(query, params);
    
    // Get updated patient data - الحصول على بيانات المريض المحدثة
    const updatedPatient = await executeQuery(`
      SELECT 
        p.*,
        u.full_name,
        u.email,
        u.phone
      FROM patients p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = ?
    `, [patientId]);
    
    res.json({
      success: true,
      message: 'تم تحديث ملف المريض بنجاح',
      data: { patient: updatedPatient[0] }
    });
    
  } catch (error) {
    console.error('Update patient error:', error);
    res.status(500).json({
      error: 'خطأ في تحديث ملف المريض',
      message: 'Failed to update patient profile'
    });
  }
}));

/**
 * Get patient's appointments - الحصول على مواعيد المريض
 * GET /api/patients/:id/appointments
 */
router.get('/:id/appointments', [
  authenticateToken,
  checkResourceAccess('patient')
], asyncHandler(async (req, res) => {
  try {
    const patientId = req.params.id;
    const { status, page = 1, limit = 10 } = req.query;
    
    let query = `
      SELECT 
        a.id,
        a.appointment_date,
        a.time_slot,
        a.duration_minutes,
        a.status,
        a.reason,
        a.notes,
        d.id as doctor_id,
        d.specialization,
        d.consultation_fee,
        u.full_name as doctor_name,
        u.phone as doctor_phone
      FROM appointments a
      JOIN doctors d ON a.doctor_id = d.id
      JOIN users u ON d.user_id = u.id
      WHERE a.patient_id = ?
    `;
    
    const params = [patientId];
    
    // Filter by status - تصفية حسب الحالة
    if (status) {
      query += ' AND a.status = ?';
      params.push(status);
    }
    
    // Add pagination - إضافة التصفح
    const offset = (page - 1) * limit;
    query += ' ORDER BY a.appointment_date DESC, a.time_slot DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
    
    const appointments = await executeQuery(query, params);
    
    res.json({
      success: true,
      data: { appointments }
    });
    
  } catch (error) {
    console.error('Get patient appointments error:', error);
    res.status(500).json({
      error: 'خطأ في الحصول على مواعيد المريض',
      message: 'Failed to get patient appointments'
    });
  }
}));

/**
 * Get patient's medical records - الحصول على السجلات الطبية للمريض
 * GET /api/patients/:id/medical-records
 */
router.get('/:id/medical-records', [
  authenticateToken,
  checkResourceAccess('patient')
], asyncHandler(async (req, res) => {
  try {
    const patientId = req.params.id;
    const { page = 1, limit = 10 } = req.query;
    
    const query = `
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
        d.specialization,
        u.full_name as doctor_name
      FROM medical_records mr
      JOIN doctors d ON mr.doctor_id = d.id
      JOIN users u ON d.user_id = u.id
      WHERE mr.patient_id = ?
      ORDER BY mr.visit_date DESC, mr.created_at DESC
      LIMIT ? OFFSET ?
    `;
    
    const offset = (page - 1) * limit;
    const params = [patientId, parseInt(limit), parseInt(offset)];
    
    const medicalRecords = await executeQuery(query, params);
    
    res.json({
      success: true,
      data: { medical_records: medicalRecords }
    });
    
  } catch (error) {
    console.error('Get patient medical records error:', error);
    res.status(500).json({
      error: 'خطأ في الحصول على السجلات الطبية',
      message: 'Failed to get medical records'
    });
  }
}));

module.exports = router;
