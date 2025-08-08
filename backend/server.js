/**
 * Hospital Management System - Main Server File
 * نظام إدارة المستشفى - ملف الخادم الرئيسي
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const doctorRoutes = require('./routes/doctors');
const patientRoutes = require('./routes/patients');
const appointmentRoutes = require('./routes/appointments');
const medicalRecordRoutes = require('./routes/medicalRecords');
const specializationRoutes = require('./routes/specializations');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const { authenticateToken } = require('./middleware/auth');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// Rate limiting - حد معدل الطلبات
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'تم تجاوز الحد المسموح من الطلبات، يرجى المحاولة لاحقاً',
    message: 'Too many requests from this IP, please try again later.'
  }
});
app.use(limiter);

// CORS configuration - إعدادات CORS
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint - نقطة فحص صحة الخادم
app.get('/api/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'الخادم يعمل بشكل طبيعي',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API Routes - مسارات API
app.use('/api/auth', authRoutes);
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/patients', authenticateToken, patientRoutes);
app.use('/api/appointments', authenticateToken, appointmentRoutes);
app.use('/api/medical-records', authenticateToken, medicalRecordRoutes);
app.use('/api/specializations', specializationRoutes);

// Welcome endpoint - نقطة الترحيب
app.get('/api', (req, res) => {
  res.json({
    message: 'مرحباً بك في نظام إدارة المستشفى',
    welcomeMessage: 'Welcome to Hospital Management System API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      doctors: '/api/doctors',
      patients: '/api/patients',
      appointments: '/api/appointments',
      medicalRecords: '/api/medical-records',
      specializations: '/api/specializations'
    }
  });
});

// 404 handler - معالج الصفحات غير الموجودة
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'الصفحة المطلوبة غير موجودة',
    message: 'Endpoint not found',
    path: req.originalUrl
  });
});

// Error handling middleware - معالج الأخطاء
app.use(errorHandler);

// Start server - بدء تشغيل الخادم
app.listen(PORT, () => {
  console.log(`
🏥 نظام إدارة المستشفى
🚀 الخادم يعمل على المنفذ ${PORT}
🌐 الرابط: http://localhost:${PORT}
📚 API Documentation: http://localhost:${PORT}/api
⚡ البيئة: ${process.env.NODE_ENV || 'development'}
  `);
});

// Graceful shutdown - إيقاف تشغيل آمن
process.on('SIGTERM', () => {
  console.log('تم استلام إشارة SIGTERM، جاري إيقاف الخادم بأمان...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('تم استلام إشارة SIGINT، جاري إيقاف الخادم بأمان...');
  process.exit(0);
});

module.exports = app;
