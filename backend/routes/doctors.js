/**
 * Doctors Routes - مسارات الأطباء
 * Hospital Management System
 */

const express = require('express');
const { body, validationResult } = require('express-validator');
const { executeQuery } = require('../config/database');
const { asyncHandler } = require('../middleware/errorHandler');
const { authenticateToken, requireDoctor, requireAdmin, checkResourceAccess } = require('../middleware/auth');

const router = express.Router();

/**
 * Get all doctors - الحصول على جميع الأطباء
 * GET /api/doctors
 */
router.get('/', asyncHandler(async (req, res) => {
  try {
    const { specialization, available, page = 1, limit = 10 } = req.query;
    
    let query = `
      SELECT 
        d.id,
        u.full_name,
        u.email,
        u.phone,
        d.specialization,
        d.experience_years,
        d.consultation_fee,
        d.bio,
        d.is_available,
        d.availability
      FROM doctors d
      JOIN users u ON d.user_id = u.id
      WHERE u.is_active = 1
    `;
    
    const params = [];
    
    // Filter by specialization - تصفية حسب التخصص
    if (specialization) {
      query += ' AND d.specialization = ?';
      params.push(specialization);
    }
    
    // Filter by availability - تصفية حسب التوفر
    if (available === 'true') {
      query += ' AND d.is_available = 1';
    }
    
    // Add pagination - إضافة التصفح
    const offset = (page - 1) * limit;
    query += ' ORDER BY u.full_name LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
    
    const doctors = await executeQuery(query, params);
    
    // Get total count for pagination - الحصول على العدد الإجمالي للتصفح
    let countQuery = `
      SELECT COUNT(*) as total
      FROM doctors d
      JOIN users u ON d.user_id = u.id
      WHERE u.is_active = 1
    `;
    
    const countParams = [];
    if (specialization) {
      countQuery += ' AND d.specialization = ?';
      countParams.push(specialization);
    }
    if (available === 'true') {
      countQuery += ' AND d.is_available = 1';
    }
    
    const [{ total }] = await executeQuery(countQuery, countParams);
    
    // Parse availability JSON - تحليل JSON الخاص بالتوفر
    const doctorsWithParsedAvailability = doctors.map(doctor => ({
      ...doctor,
      availability: doctor.availability ? JSON.parse(doctor.availability) : null
    }));
    
    res.json({
      success: true,
      data: {
        doctors: doctorsWithParsedAvailability,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(total / limit),
          total_records: total,
          per_page: parseInt(limit)
        }
      }
    });
    
  } catch (error) {
    console.error('Get doctors error:', error);
    res.status(500).json({
      error: 'خطأ في الحصول على قائمة الأطباء',
      message: 'Failed to get doctors'
    });
  }
}));

/**
 * Get doctor by ID - الحصول على طبيب بالمعرف
 * GET /api/doctors/:id
 */
router.get('/:id', asyncHandler(async (req, res) => {
  try {
    const doctorId = req.params.id;
    
    const doctors = await executeQuery(`
      SELECT 
        d.id,
        d.user_id,
        u.full_name,
        u.email,
        u.phone,
        d.specialization,
        d.license_number,
        d.experience_years,
        d.consultation_fee,
        d.bio,
        d.is_available,
        d.availability,
        d.created_at
      FROM doctors d
      JOIN users u ON d.user_id = u.id
      WHERE d.id = ? AND u.is_active = 1
    `, [doctorId]);
    
    if (doctors.length === 0) {
      return res.status(404).json({
        error: 'الطبيب غير موجود',
        message: 'Doctor not found'
      });
    }
    
    const doctor = doctors[0];
    
    // Parse availability JSON - تحليل JSON الخاص بالتوفر
    if (doctor.availability) {
      doctor.availability = JSON.parse(doctor.availability);
    }
    
    // Get doctor's time slots - الحصول على أوقات الطبيب
    const timeSlots = await executeQuery(`
      SELECT day_of_week, start_time, end_time, is_available
      FROM time_slots
      WHERE doctor_id = ? AND is_available = 1
      ORDER BY day_of_week, start_time
    `, [doctorId]);
    
    doctor.time_slots = timeSlots;
    
    res.json({
      success: true,
      data: { doctor }
    });
    
  } catch (error) {
    console.error('Get doctor error:', error);
    res.status(500).json({
      error: 'خطأ في الحصول على بيانات الطبيب',
      message: 'Failed to get doctor'
    });
  }
}));

/**
 * Update doctor profile - تحديث ملف الطبيب
 * PUT /api/doctors/:id
 */
router.put('/:id', [
  authenticateToken,
  checkResourceAccess('doctor'),
  body('specialization').optional().trim().isLength({ min: 2, max: 255 }),
  body('experience_years').optional().isInt({ min: 0, max: 50 }),
  body('consultation_fee').optional().isFloat({ min: 0 }),
  body('bio').optional().trim().isLength({ max: 1000 })
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
    const doctorId = req.params.id;
    const { specialization, experience_years, consultation_fee, bio, availability, is_available } = req.body;
    
    // Build update query dynamically - بناء استعلام التحديث ديناميكياً
    const updateFields = [];
    const params = [];
    
    if (specialization !== undefined) {
      updateFields.push('specialization = ?');
      params.push(specialization);
    }
    
    if (experience_years !== undefined) {
      updateFields.push('experience_years = ?');
      params.push(experience_years);
    }
    
    if (consultation_fee !== undefined) {
      updateFields.push('consultation_fee = ?');
      params.push(consultation_fee);
    }
    
    if (bio !== undefined) {
      updateFields.push('bio = ?');
      params.push(bio);
    }
    
    if (availability !== undefined) {
      updateFields.push('availability = ?');
      params.push(JSON.stringify(availability));
    }
    
    if (is_available !== undefined) {
      updateFields.push('is_available = ?');
      params.push(is_available);
    }
    
    if (updateFields.length === 0) {
      return res.status(400).json({
        error: 'لا توجد بيانات للتحديث',
        message: 'No data to update'
      });
    }
    
    params.push(doctorId);
    
    const query = `UPDATE doctors SET ${updateFields.join(', ')} WHERE id = ?`;
    await executeQuery(query, params);
    
    // Get updated doctor data - الحصول على بيانات الطبيب المحدثة
    const updatedDoctor = await executeQuery(`
      SELECT 
        d.*,
        u.full_name,
        u.email,
        u.phone
      FROM doctors d
      JOIN users u ON d.user_id = u.id
      WHERE d.id = ?
    `, [doctorId]);
    
    res.json({
      success: true,
      message: 'تم تحديث ملف الطبيب بنجاح',
      data: { doctor: updatedDoctor[0] }
    });
    
  } catch (error) {
    console.error('Update doctor error:', error);
    res.status(500).json({
      error: 'خطأ في تحديث ملف الطبيب',
      message: 'Failed to update doctor profile'
    });
  }
}));

/**
 * Get doctor's appointments - الحصول على مواعيد الطبيب
 * GET /api/doctors/:id/appointments
 */
router.get('/:id/appointments', [
  authenticateToken,
  checkResourceAccess('doctor')
], asyncHandler(async (req, res) => {
  try {
    const doctorId = req.params.id;
    const { status, date, page = 1, limit = 10 } = req.query;
    
    let query = `
      SELECT 
        a.id,
        a.appointment_date,
        a.time_slot,
        a.duration_minutes,
        a.status,
        a.reason,
        a.notes,
        p.id as patient_id,
        u.full_name as patient_name,
        u.phone as patient_phone
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN users u ON p.user_id = u.id
      WHERE a.doctor_id = ?
    `;
    
    const params = [doctorId];
    
    // Filter by status - تصفية حسب الحالة
    if (status) {
      query += ' AND a.status = ?';
      params.push(status);
    }
    
    // Filter by date - تصفية حسب التاريخ
    if (date) {
      query += ' AND a.appointment_date = ?';
      params.push(date);
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
    console.error('Get doctor appointments error:', error);
    res.status(500).json({
      error: 'خطأ في الحصول على مواعيد الطبيب',
      message: 'Failed to get doctor appointments'
    });
  }
}));

/**
 * Get available specializations - الحصول على التخصصات المتاحة
 * GET /api/doctors/specializations
 */
router.get('/meta/specializations', asyncHandler(async (req, res) => {
  try {
    const specializations = await executeQuery(`
      SELECT DISTINCT specialization
      FROM doctors d
      JOIN users u ON d.user_id = u.id
      WHERE u.is_active = 1
      ORDER BY specialization
    `);
    
    res.json({
      success: true,
      data: { specializations: specializations.map(s => s.specialization) }
    });
    
  } catch (error) {
    console.error('Get specializations error:', error);
    res.status(500).json({
      error: 'خطأ في الحصول على التخصصات',
      message: 'Failed to get specializations'
    });
  }
}));

module.exports = router;
