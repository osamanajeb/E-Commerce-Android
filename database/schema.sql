-- Hospital Management System Database Schema
-- نظام إدارة المستشفى - قاعدة البيانات

-- Create database
CREATE DATABASE IF NOT EXISTS hospital_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE hospital_management;

-- Users table - جدول المستخدمين
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(255) NOT NULL COMMENT 'الاسم الكامل',
    email VARCHAR(255) UNIQUE NOT NULL COMMENT 'البريد الإلكتروني',
    password VARCHAR(255) NOT NULL COMMENT 'كلمة المرور المشفرة',
    phone VARCHAR(20) COMMENT 'رقم الهاتف',
    role ENUM('doctor', 'patient', 'admin') NOT NULL DEFAULT 'patient' COMMENT 'دور المستخدم',
    is_active BOOLEAN DEFAULT TRUE COMMENT 'حالة النشاط',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'تاريخ الإنشاء',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'تاريخ التحديث'
);

-- Doctors table - جدول الأطباء
CREATE TABLE doctors (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL COMMENT 'معرف المستخدم',
    specialization VARCHAR(255) NOT NULL COMMENT 'التخصص',
    license_number VARCHAR(100) UNIQUE COMMENT 'رقم الترخيص',
    experience_years INT DEFAULT 0 COMMENT 'سنوات الخبرة',
    consultation_fee DECIMAL(10,2) DEFAULT 0.00 COMMENT 'رسوم الاستشارة',
    bio TEXT COMMENT 'نبذة عن الطبيب',
    availability JSON COMMENT 'أوقات التوفر',
    is_available BOOLEAN DEFAULT TRUE COMMENT 'متاح للحجز',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Patients table - جدول المرضى
CREATE TABLE patients (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL COMMENT 'معرف المستخدم',
    birth_date DATE COMMENT 'تاريخ الميلاد',
    gender ENUM('male', 'female') COMMENT 'الجنس',
    blood_type VARCHAR(5) COMMENT 'فصيلة الدم',
    address TEXT COMMENT 'العنوان',
    emergency_contact VARCHAR(255) COMMENT 'جهة الاتصال في الطوارئ',
    emergency_phone VARCHAR(20) COMMENT 'هاتف الطوارئ',
    medical_history TEXT COMMENT 'التاريخ المرضي',
    allergies TEXT COMMENT 'الحساسيات',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Appointments table - جدول المواعيد
CREATE TABLE appointments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    doctor_id INT NOT NULL COMMENT 'معرف الطبيب',
    patient_id INT NOT NULL COMMENT 'معرف المريض',
    appointment_date DATE NOT NULL COMMENT 'تاريخ الموعد',
    time_slot TIME NOT NULL COMMENT 'وقت الموعد',
    duration_minutes INT DEFAULT 30 COMMENT 'مدة الموعد بالدقائق',
    status ENUM('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show') DEFAULT 'scheduled' COMMENT 'حالة الموعد',
    reason TEXT COMMENT 'سبب الزيارة',
    notes TEXT COMMENT 'ملاحظات',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    UNIQUE KEY unique_appointment (doctor_id, appointment_date, time_slot)
);

-- Medical Records table - جدول السجلات الطبية
CREATE TABLE medical_records (
    id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id INT NOT NULL COMMENT 'معرف المريض',
    doctor_id INT NOT NULL COMMENT 'معرف الطبيب',
    appointment_id INT COMMENT 'معرف الموعد',
    visit_date DATE NOT NULL COMMENT 'تاريخ الزيارة',
    chief_complaint TEXT COMMENT 'الشكوى الرئيسية',
    diagnosis TEXT COMMENT 'التشخيص',
    prescription TEXT COMMENT 'الوصفة الطبية',
    treatment_plan TEXT COMMENT 'خطة العلاج',
    follow_up_date DATE COMMENT 'تاريخ المتابعة',
    notes TEXT COMMENT 'ملاحظات إضافية',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE SET NULL
);

-- Specializations table - جدول التخصصات
CREATE TABLE specializations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name_ar VARCHAR(255) NOT NULL COMMENT 'اسم التخصص بالعربية',
    name_en VARCHAR(255) NOT NULL COMMENT 'اسم التخصص بالإنجليزية',
    description TEXT COMMENT 'وصف التخصص',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Time Slots table - جدول الأوقات المتاحة
CREATE TABLE time_slots (
    id INT PRIMARY KEY AUTO_INCREMENT,
    doctor_id INT NOT NULL,
    day_of_week TINYINT NOT NULL COMMENT '0=الأحد, 1=الاثنين, ..., 6=السبت',
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_medical_records_patient ON medical_records(patient_id);
CREATE INDEX idx_medical_records_doctor ON medical_records(doctor_id);
CREATE INDEX idx_medical_records_date ON medical_records(visit_date);
