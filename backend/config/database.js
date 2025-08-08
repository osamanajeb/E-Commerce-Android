/**
 * Database Configuration - إعدادات قاعدة البيانات
 * Hospital Management System
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

// Database connection configuration - إعدادات الاتصال بقاعدة البيانات
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'hospital_management',
  charset: 'utf8mb4',
  timezone: '+03:00', // Saudi Arabia timezone
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create connection pool - إنشاء مجموعة الاتصالات
const pool = mysql.createPool(dbConfig);

/**
 * Test database connection - اختبار الاتصال بقاعدة البيانات
 */
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ تم الاتصال بقاعدة البيانات بنجاح');
    console.log('✅ Database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ خطأ في الاتصال بقاعدة البيانات:', error.message);
    console.error('❌ Database connection error:', error.message);
    return false;
  }
}

/**
 * Execute query with error handling - تنفيذ الاستعلام مع معالجة الأخطاء
 * @param {string} query - SQL query
 * @param {Array} params - Query parameters
 * @returns {Promise} Query result
 */
async function executeQuery(query, params = []) {
  try {
    const [rows] = await pool.execute(query, params);
    return rows;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

/**
 * Execute transaction - تنفيذ معاملة قاعدة البيانات
 * @param {Function} callback - Transaction callback function
 * @returns {Promise} Transaction result
 */
async function executeTransaction(callback) {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

/**
 * Get database statistics - الحصول على إحصائيات قاعدة البيانات
 */
async function getDatabaseStats() {
  try {
    const stats = {};
    
    // Get table counts - الحصول على عدد السجلات في كل جدول
    const tables = ['users', 'doctors', 'patients', 'appointments', 'medical_records'];
    
    for (const table of tables) {
      const [result] = await pool.execute(`SELECT COUNT(*) as count FROM ${table}`);
      stats[table] = result[0].count;
    }
    
    return stats;
  } catch (error) {
    console.error('Error getting database stats:', error);
    return null;
  }
}

/**
 * Close database connection - إغلاق الاتصال بقاعدة البيانات
 */
async function closeConnection() {
  try {
    await pool.end();
    console.log('🔌 تم إغلاق الاتصال بقاعدة البيانات');
    console.log('🔌 Database connection closed');
  } catch (error) {
    console.error('Error closing database connection:', error);
  }
}

// Test connection on module load - اختبار الاتصال عند تحميل الوحدة
testConnection();

module.exports = {
  pool,
  executeQuery,
  executeTransaction,
  testConnection,
  getDatabaseStats,
  closeConnection
};
