/**
 * Appointments Routes - مسارات المواعيد
 * Hospital Management System
 */

const express = require('express');
const { body, validationResult } = require('express-validator');
const { executeQuery, executeTransaction } = require('../config/database');
const { asyncHandler } = require('../middleware/errorHandler');
const { authenticateToken, checkResourceAccess } = require('../middleware/auth');

const router = express.Router();

/**
 * Get all appointments - الحصول على جميع المواعيد
 * GET /api/appointments
 */
router.get('/', authenticateToken, asyncHandler(async (req, res) => {
  try {
    const { status, date, doctor_id, patient_id, page = 1, limit = 10 } = req.query;
    const userId = req.user.id;
    const userRole = req.user.role;
    
    let query = `
      SELECT 
        a.id,
        a.appointment_date,
        a.time_slot,
        a.duration_minutes,
        a.status,
        a.reason,
        a.notes,
        a.created_at,
        d.id as doctor_id,
        du.full_name as doctor_name,
        d.specialization,
        d.consultation_fee,
        p.id as patient_id,
        pu.full_name as patient_name,
        pu.phone as patient_phone
      FROM appointments a
      JOIN doctors d ON a.doctor_id = d.id
      JOIN users du ON d.user_id = du.id
      JOIN patients p ON a.patient_id = p.id
      JOIN users pu ON p.user_id = pu.id
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
    // Admin can see all appointments
    
    // Additional filters - مرشحات إضافية
    if (status) {
      query += ' AND a.status = ?';
      params.push(status);
    }
    
    if (date) {
      query += ' AND a.appointment_date = ?';
      params.push(date);
    }
    
    if (doctor_id) {
      query += ' AND a.doctor_id = ?';
      params.push(doctor_id);
    }
    
    if (patient_id) {
      query += ' AND a.patient_id = ?';
      params.push(patient_id);
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
    console.error('Get appointments error:', error);
    res.status(500).json({
      error: 'خطأ في الحصول على المواعيد',
      message: 'Failed to get appointments'
    });
  }
}));

/**
 * Create new appointment - إنشاء موعد جديد
 * POST /api/appointments
 */
router.post('/', [
  authenticateToken,
  body('doctor_id').isInt({ min: 1 }).withMessage('معرف الطبيب مطلوب'),
  body('appointment_date').isDate().withMessage('تاريخ الموعد غير صحيح'),
  body('time_slot').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('وقت الموعد غير صحيح'),
  body('reason').optional().trim().isLength({ max: 500 }).withMessage('سبب الزيارة طويل جداً')
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
    const { doctor_id, appointment_date, time_slot, duration_minutes = 30, reason } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;
    
    // Get patient ID for current user - الحصول على معرف المريض للمستخدم الحالي
    let patientId;
    if (userRole === 'patient') {
      const patients = await executeQuery(
        'SELECT id FROM patients WHERE user_id = ?',
        [userId]
      );
      if (patients.length === 0) {
        return res.status(400).json({
          error: 'ملف المريض غير موجود',
          message: 'Patient profile not found'
        });
      }
      patientId = patients[0].id;
    } else if (userRole === 'admin') {
      // Admin can specify patient_id in request body
      patientId = req.body.patient_id;
      if (!patientId) {
        return res.status(400).json({
          error: 'معرف المريض مطلوب',
          message: 'Patient ID required'
        });
      }
    } else {
      return res.status(403).json({
        error: 'ليس لديك صلاحية لحجز المواعيد',
        message: 'Not authorized to book appointments'
      });
    }
    
    // Check if doctor exists and is available - التحقق من وجود الطبيب وتوفره
    const doctors = await executeQuery(
      'SELECT id, is_available FROM doctors WHERE id = ?',
      [doctor_id]
    );
    
    if (doctors.length === 0) {
      return res.status(404).json({
        error: 'الطبيب غير موجود',
        message: 'Doctor not found'
      });
    }
    
    if (!doctors[0].is_available) {
      return res.status(400).json({
        error: 'الطبيب غير متاح حالياً',
        message: 'Doctor is not available'
      });
    }
    
    // Check for appointment conflicts - التحقق من تضارب المواعيد
    const conflictingAppointments = await executeQuery(
      'SELECT id FROM appointments WHERE doctor_id = ? AND appointment_date = ? AND time_slot = ? AND status IN ("scheduled", "confirmed")',
      [doctor_id, appointment_date, time_slot]
    );
    
    if (conflictingAppointments.length > 0) {
      return res.status(400).json({
        error: 'هذا الموعد محجوز مسبقاً',
        message: 'Time slot already booked'
      });
    }
    
    // Check if appointment date is in the future - التحقق من أن تاريخ الموعد في المستقبل
    const appointmentDateTime = new Date(`${appointment_date} ${time_slot}`);
    const now = new Date();
    
    if (appointmentDateTime <= now) {
      return res.status(400).json({
        error: 'لا يمكن حجز موعد في الماضي',
        message: 'Cannot book appointment in the past'
      });
    }
    
    // Create appointment - إنشاء الموعد
    const result = await executeQuery(
      'INSERT INTO appointments (doctor_id, patient_id, appointment_date, time_slot, duration_minutes, status, reason) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [doctor_id, patientId, appointment_date, time_slot, duration_minutes, 'scheduled', reason]
    );
    
    // Get created appointment with details - الحصول على الموعد المنشأ مع التفاصيل
    const newAppointment = await executeQuery(`
      SELECT 
        a.*,
        d.specialization,
        du.full_name as doctor_name,
        pu.full_name as patient_name
      FROM appointments a
      JOIN doctors d ON a.doctor_id = d.id
      JOIN users du ON d.user_id = du.id
      JOIN patients p ON a.patient_id = p.id
      JOIN users pu ON p.user_id = pu.id
      WHERE a.id = ?
    `, [result.insertId]);
    
    res.status(201).json({
      success: true,
      message: 'تم حجز الموعد بنجاح',
      data: { appointment: newAppointment[0] }
    });
    
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({
      error: 'خطأ في حجز الموعد',
      message: 'Failed to create appointment'
    });
  }
}));

/**
 * Get appointment by ID - الحصول على موعد بالمعرف
 * GET /api/appointments/:id
 */
router.get('/:id', [
  authenticateToken,
  checkResourceAccess('appointment')
], asyncHandler(async (req, res) => {
  try {
    const appointmentId = req.params.id;
    
    const appointments = await executeQuery(`
      SELECT 
        a.*,
        d.id as doctor_id,
        d.specialization,
        d.consultation_fee,
        du.full_name as doctor_name,
        du.phone as doctor_phone,
        p.id as patient_id,
        pu.full_name as patient_name,
        pu.phone as patient_phone,
        pt.birth_date,
        pt.gender
      FROM appointments a
      JOIN doctors d ON a.doctor_id = d.id
      JOIN users du ON d.user_id = du.id
      JOIN patients p ON a.patient_id = p.id
      JOIN users pu ON p.user_id = pu.id
      LEFT JOIN patients pt ON p.id = pt.id
      WHERE a.id = ?
    `, [appointmentId]);
    
    if (appointments.length === 0) {
      return res.status(404).json({
        error: 'الموعد غير موجود',
        message: 'Appointment not found'
      });
    }
    
    res.json({
      success: true,
      data: { appointment: appointments[0] }
    });
    
  } catch (error) {
    console.error('Get appointment error:', error);
    res.status(500).json({
      error: 'خطأ في الحصول على الموعد',
      message: 'Failed to get appointment'
    });
  }
}));

/**
 * Update appointment status - تحديث حالة الموعد
 * PATCH /api/appointments/:id/status
 */
router.patch('/:id/status', [
  authenticateToken,
  checkResourceAccess('appointment'),
  body('status').isIn(['scheduled', 'confirmed', 'completed', 'cancelled', 'no_show']).withMessage('حالة الموعد غير صحيحة'),
  body('notes').optional().trim().isLength({ max: 1000 }).withMessage('الملاحظات طويلة جداً')
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
    const appointmentId = req.params.id;
    const { status, notes } = req.body;
    
    // Update appointment status - تحديث حالة الموعد
    await executeQuery(
      'UPDATE appointments SET status = ?, notes = ? WHERE id = ?',
      [status, notes || null, appointmentId]
    );
    
    // Get updated appointment - الحصول على الموعد المحدث
    const updatedAppointment = await executeQuery(`
      SELECT 
        a.*,
        du.full_name as doctor_name,
        pu.full_name as patient_name
      FROM appointments a
      JOIN doctors d ON a.doctor_id = d.id
      JOIN users du ON d.user_id = du.id
      JOIN patients p ON a.patient_id = p.id
      JOIN users pu ON p.user_id = pu.id
      WHERE a.id = ?
    `, [appointmentId]);
    
    res.json({
      success: true,
      message: 'تم تحديث حالة الموعد بنجاح',
      data: { appointment: updatedAppointment[0] }
    });
    
  } catch (error) {
    console.error('Update appointment status error:', error);
    res.status(500).json({
      error: 'خطأ في تحديث حالة الموعد',
      message: 'Failed to update appointment status'
    });
  }
}));

/**
 * Cancel appointment - إلغاء الموعد
 * DELETE /api/appointments/:id
 */
router.delete('/:id', [
  authenticateToken,
  checkResourceAccess('appointment')
], asyncHandler(async (req, res) => {
  try {
    const appointmentId = req.params.id;
    
    // Check if appointment can be cancelled - التحقق من إمكانية إلغاء الموعد
    const appointments = await executeQuery(
      'SELECT status, appointment_date, time_slot FROM appointments WHERE id = ?',
      [appointmentId]
    );
    
    if (appointments.length === 0) {
      return res.status(404).json({
        error: 'الموعد غير موجود',
        message: 'Appointment not found'
      });
    }
    
    const appointment = appointments[0];
    
    if (appointment.status === 'completed') {
      return res.status(400).json({
        error: 'لا يمكن إلغاء موعد مكتمل',
        message: 'Cannot cancel completed appointment'
      });
    }
    
    // Update appointment status to cancelled - تحديث حالة الموعد إلى ملغى
    await executeQuery(
      'UPDATE appointments SET status = "cancelled" WHERE id = ?',
      [appointmentId]
    );
    
    res.json({
      success: true,
      message: 'تم إلغاء الموعد بنجاح'
    });
    
  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({
      error: 'خطأ في إلغاء الموعد',
      message: 'Failed to cancel appointment'
    });
  }
}));

module.exports = router;
