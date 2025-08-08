-- Hospital Management System Database Schema
-- نظام إدارة المستشفى - هيكل قاعدة البيانات

-- Create database
CREATE DATABASE IF NOT EXISTS hospital_management 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE hospital_management;

-- Users table - جدول المستخدمين
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(255) NOT NULL COMMENT 'الاسم الكامل',
    email VARCHAR(255) UNIQUE NOT NULL COMMENT 'البريد الإلكتروني',
    password VARCHAR(255) NOT NULL COMMENT 'كلمة المرور المشفرة',
    phone VARCHAR(20) COMMENT 'رقم الهاتف',
    role ENUM('admin', 'doctor', 'patient') NOT NULL COMMENT 'دور المستخدم',
    is_active BOOLEAN DEFAULT TRUE COMMENT 'حالة النشاط',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_active (is_active)
) ENGINE=InnoDB COMMENT='جدول المستخدمين';

-- Specializations table - جدول التخصصات
CREATE TABLE specializations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name_ar VARCHAR(255) NOT NULL COMMENT 'اسم التخصص بالعربية',
    name_en VARCHAR(255) NOT NULL COMMENT 'اسم التخصص بالإنجليزية',
    description TEXT COMMENT 'وصف التخصص',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_name_ar (name_ar),
    INDEX idx_active (is_active)
) ENGINE=InnoDB COMMENT='جدول التخصصات الطبية';

-- Doctors table - جدول الأطباء
CREATE TABLE doctors (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    specialization VARCHAR(255) NOT NULL COMMENT 'التخصص',
    license_number VARCHAR(100) UNIQUE COMMENT 'رقم الترخيص',
    experience_years INT DEFAULT 0 COMMENT 'سنوات الخبرة',
    consultation_fee DECIMAL(10,2) DEFAULT 0.00 COMMENT 'رسوم الاستشارة',
    bio TEXT COMMENT 'نبذة عن الطبيب',
    is_available BOOLEAN DEFAULT TRUE COMMENT 'متاح للحجز',
    availability JSON COMMENT 'أوقات التوفر',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_specialization (specialization),
    INDEX idx_available (is_available),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB COMMENT='جدول الأطباء';

-- Patients table - جدول المرضى
CREATE TABLE patients (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    birth_date DATE COMMENT 'تاريخ الميلاد',
    gender ENUM('male', 'female') COMMENT 'الجنس',
    blood_type ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') COMMENT 'فصيلة الدم',
    address TEXT COMMENT 'العنوان',
    emergency_contact VARCHAR(255) COMMENT 'جهة الاتصال في الطوارئ',
    emergency_phone VARCHAR(20) COMMENT 'هاتف الطوارئ',
    medical_history TEXT COMMENT 'التاريخ المرضي',
    allergies TEXT COMMENT 'الحساسيات',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_birth_date (birth_date),
    INDEX idx_blood_type (blood_type)
) ENGINE=InnoDB COMMENT='جدول المرضى';

-- Time slots table - جدول الأوقات المتاحة
CREATE TABLE time_slots (
    id INT PRIMARY KEY AUTO_INCREMENT,
    doctor_id INT NOT NULL,
    day_of_week TINYINT NOT NULL COMMENT 'يوم الأسبوع (0=الأحد, 6=السبت)',
    start_time TIME NOT NULL COMMENT 'وقت البداية',
    end_time TIME NOT NULL COMMENT 'وقت النهاية',
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
    INDEX idx_doctor_day (doctor_id, day_of_week),
    INDEX idx_available (is_available)
) ENGINE=InnoDB COMMENT='جدول الأوقات المتاحة للأطباء';

-- Appointments table - جدول المواعيد
CREATE TABLE appointments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    doctor_id INT NOT NULL,
    patient_id INT NOT NULL,
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
    INDEX idx_doctor_date (doctor_id, appointment_date),
    INDEX idx_patient_date (patient_id, appointment_date),
    INDEX idx_status (status),
    INDEX idx_appointment_datetime (appointment_date, time_slot),
    
    UNIQUE KEY unique_doctor_datetime (doctor_id, appointment_date, time_slot)
) ENGINE=InnoDB COMMENT='جدول المواعيد';

-- Medical records table - جدول السجلات الطبية
CREATE TABLE medical_records (
    id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    appointment_id INT NULL COMMENT 'معرف الموعد المرتبط',
    visit_date DATE NOT NULL COMMENT 'تاريخ الزيارة',
    chief_complaint TEXT NOT NULL COMMENT 'الشكوى الرئيسية',
    diagnosis TEXT COMMENT 'التشخيص',
    prescription TEXT COMMENT 'الوصفة الطبية',
    treatment_plan TEXT COMMENT 'خطة العلاج',
    follow_up_date DATE COMMENT 'تاريخ المتابعة',
    notes TEXT COMMENT 'ملاحظات إضافية',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE SET NULL,
    INDEX idx_patient_date (patient_id, visit_date),
    INDEX idx_doctor_date (doctor_id, visit_date),
    INDEX idx_appointment (appointment_id)
) ENGINE=InnoDB COMMENT='جدول السجلات الطبية';

-- Prescriptions table - جدول الوصفات الطبية
CREATE TABLE prescriptions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    medical_record_id INT NOT NULL,
    medication_name VARCHAR(255) NOT NULL COMMENT 'اسم الدواء',
    dosage VARCHAR(100) NOT NULL COMMENT 'الجرعة',
    frequency VARCHAR(100) NOT NULL COMMENT 'عدد مرات التناول',
    duration VARCHAR(100) COMMENT 'مدة العلاج',
    instructions TEXT COMMENT 'تعليمات الاستخدام',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (medical_record_id) REFERENCES medical_records(id) ON DELETE CASCADE,
    INDEX idx_medical_record (medical_record_id),
    INDEX idx_medication (medication_name)
) ENGINE=InnoDB COMMENT='جدول الوصفات الطبية';

-- System settings table - جدول إعدادات النظام
CREATE TABLE system_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    description TEXT COMMENT 'وصف الإعداد',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_key (setting_key)
) ENGINE=InnoDB COMMENT='جدول إعدادات النظام';

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('hospital_name', 'مستشفى الملك فهد', 'اسم المستشفى'),
('hospital_address', 'الرياض، المملكة العربية السعودية', 'عنوان المستشفى'),
('hospital_phone', '+966 11 123 4567', 'هاتف المستشفى'),
('hospital_email', 'info@hospital.com', 'بريد المستشفى الإلكتروني'),
('appointment_duration', '30', 'مدة الموعد الافتراضية بالدقائق'),
('max_appointments_per_day', '20', 'الحد الأقصى للمواعيد في اليوم'),
('working_hours_start', '08:00', 'بداية ساعات العمل'),
('working_hours_end', '18:00', 'نهاية ساعات العمل');

-- Create views for easier data access
-- عرض معلومات الأطباء مع بيانات المستخدم
CREATE VIEW doctor_details AS
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
    u.created_at
FROM doctors d
JOIN users u ON d.user_id = u.id
WHERE u.is_active = TRUE;

-- عرض معلومات المرضى مع بيانات المستخدم
CREATE VIEW patient_details AS
SELECT 
    p.id,
    p.user_id,
    u.full_name,
    u.email,
    u.phone,
    p.birth_date,
    p.gender,
    p.blood_type,
    p.address,
    p.emergency_contact,
    p.emergency_phone,
    p.medical_history,
    p.allergies,
    u.created_at
FROM patients p
JOIN users u ON p.user_id = u.id
WHERE u.is_active = TRUE;
