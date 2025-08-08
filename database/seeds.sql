-- Hospital Management System Sample Data
-- بيانات تجريبية لنظام إدارة المستشفى

USE hospital_management;

-- Insert specializations - إدراج التخصصات
INSERT INTO specializations (name_ar, name_en, description) VALUES
('طب القلب', 'Cardiology', 'تخصص في أمراض القلب والأوعية الدموية'),
('طب الأطفال', 'Pediatrics', 'تخصص في طب الأطفال والرضع'),
('طب النساء والولادة', 'Gynecology & Obstetrics', 'تخصص في صحة المرأة والولادة'),
('طب العظام', 'Orthopedics', 'تخصص في أمراض العظام والمفاصل'),
('طب الأعصاب', 'Neurology', 'تخصص في أمراض الجهاز العصبي'),
('طب العيون', 'Ophthalmology', 'تخصص في أمراض العيون'),
('طب الأنف والأذن والحنجرة', 'ENT', 'تخصص في أمراض الأنف والأذن والحنجرة'),
('طب الجلدية', 'Dermatology', 'تخصص في أمراض الجلد'),
('الطب النفسي', 'Psychiatry', 'تخصص في الصحة النفسية'),
('طب الطوارئ', 'Emergency Medicine', 'تخصص في طب الطوارئ والإسعاف');

-- Insert admin user - إدراج مستخدم الإدارة
INSERT INTO users (full_name, email, password, phone, role) VALUES
('أحمد محمد الإداري', 'admin@hospital.com', '$2b$10$rQZ8kHWKtGkVQ7K5vJ9XuOGKjU5Zx3YvN2mP8qR7sT1uV6wX9yA0B', '+966501234567', 'admin');

-- Insert sample doctors - إدراج أطباء تجريبيين
INSERT INTO users (full_name, email, password, phone, role) VALUES
('د. سارة أحمد الطبيبة', 'dr.sarah@hospital.com', '$2b$10$rQZ8kHWKtGkVQ7K5vJ9XuOGKjU5Zx3YvN2mP8qR7sT1uV6wX9yA0B', '+966501234568', 'doctor'),
('د. محمد علي الكردي', 'dr.mohammed@hospital.com', '$2b$10$rQZ8kHWKtGkVQ7K5vJ9XuOGKjU5Zx3YvN2mP8qR7sT1uV6wX9yA0B', '+966501234569', 'doctor'),
('د. فاطمة حسن النجار', 'dr.fatima@hospital.com', '$2b$10$rQZ8kHWKtGkVQ7K5vJ9XuOGKjU5Zx3YvN2mP8qR7sT1uV6wX9yA0B', '+966501234570', 'doctor'),
('د. عبدالله سالم الأحمد', 'dr.abdullah@hospital.com', '$2b$10$rQZ8kHWKtGkVQ7K5vJ9XuOGKjU5Zx3YvN2mP8qR7sT1uV6wX9yA0B', '+966501234571', 'doctor'),
('د. نورا خالد العتيبي', 'dr.nora@hospital.com', '$2b$10$rQZ8kHWKtGkVQ7K5vJ9XuOGKjU5Zx3YvN2mP8qR7sT1uV6wX9yA0B', '+966501234572', 'doctor');

-- Insert sample patients - إدراج مرضى تجريبيين
INSERT INTO users (full_name, email, password, phone, role) VALUES
('علي محمد السعيد', 'ali.patient@email.com', '$2b$10$rQZ8kHWKtGkVQ7K5vJ9XuOGKjU5Zx3YvN2mP8qR7sT1uV6wX9yA0B', '+966501234573', 'patient'),
('مريم أحمد الزهراني', 'mariam.patient@email.com', '$2b$10$rQZ8kHWKtGkVQ7K5vJ9XuOGKjU5Zx3YvN2mP8qR7sT1uV6wX9yA0B', '+966501234574', 'patient'),
('خالد عبدالرحمن القحطاني', 'khalid.patient@email.com', '$2b$10$rQZ8kHWKtGkVQ7K5vJ9XuOGKjU5Zx3YvN2mP8qR7sT1uV6wX9yA0B', '+966501234575', 'patient'),
('نوال سعد الغامدي', 'nawal.patient@email.com', '$2b$10$rQZ8kHWKtGkVQ7K5vJ9XuOGKjU5Zx3YvN2mP8qR7sT1uV6wX9yA0B', '+966501234576', 'patient');

-- Insert doctor profiles - إدراج ملفات الأطباء
INSERT INTO doctors (user_id, specialization, license_number, experience_years, consultation_fee, bio, availability) VALUES
(2, 'طب القلب', 'DOC001', 10, 300.00, 'طبيبة قلب متخصصة مع خبرة 10 سنوات في علاج أمراض القلب والأوعية الدموية', '{"saturday": ["09:00-12:00", "14:00-17:00"], "sunday": ["09:00-12:00"], "monday": ["09:00-12:00", "14:00-17:00"], "tuesday": ["09:00-12:00", "14:00-17:00"], "wednesday": ["09:00-12:00"], "thursday": ["09:00-12:00", "14:00-17:00"]}'),
(3, 'طب الأطفال', 'DOC002', 8, 250.00, 'طبيب أطفال متخصص في علاج الأطفال والرضع مع خبرة واسعة', '{"saturday": ["08:00-12:00", "15:00-18:00"], "sunday": ["08:00-12:00"], "monday": ["08:00-12:00", "15:00-18:00"], "tuesday": ["08:00-12:00", "15:00-18:00"], "wednesday": ["08:00-12:00"], "thursday": ["08:00-12:00", "15:00-18:00"]}'),
(4, 'طب النساء والولادة', 'DOC003', 12, 350.00, 'طبيبة نساء وولادة مع خبرة 12 سنة في متابعة الحمل والولادة', '{"saturday": ["10:00-13:00", "16:00-19:00"], "sunday": ["10:00-13:00"], "monday": ["10:00-13:00", "16:00-19:00"], "tuesday": ["10:00-13:00", "16:00-19:00"], "wednesday": ["10:00-13:00"], "thursday": ["10:00-13:00", "16:00-19:00"]}'),
(5, 'طب العظام', 'DOC004', 15, 400.00, 'طبيب عظام متخصص في جراحة العظام والمفاصل', '{"saturday": ["09:00-12:00", "14:00-17:00"], "sunday": ["09:00-12:00"], "monday": ["09:00-12:00", "14:00-17:00"], "tuesday": ["09:00-12:00", "14:00-17:00"], "wednesday": ["09:00-12:00"], "thursday": ["09:00-12:00", "14:00-17:00"]}'),
(6, 'طب العيون', 'DOC005', 7, 280.00, 'طبيبة عيون متخصصة في علاج أمراض العيون وجراحة الليزر', '{"saturday": ["08:30-12:30", "15:30-18:30"], "sunday": ["08:30-12:30"], "monday": ["08:30-12:30", "15:30-18:30"], "tuesday": ["08:30-12:30", "15:30-18:30"], "wednesday": ["08:30-12:30"], "thursday": ["08:30-12:30", "15:30-18:30"]}');

-- Insert patient profiles - إدراج ملفات المرضى
INSERT INTO patients (user_id, birth_date, gender, blood_type, address, emergency_contact, emergency_phone, medical_history, allergies) VALUES
(7, '1985-03-15', 'male', 'O+', 'الرياض، حي النخيل، شارع الملك فهد', 'زوجة المريض - فاطمة علي', '+966501234580', 'لا يوجد تاريخ مرضي مهم', 'حساسية من البنسلين'),
(8, '1990-07-22', 'female', 'A+', 'جدة، حي الصفا، شارع التحلية', 'زوج المريضة - أحمد مريم', '+966501234581', 'ضغط دم مرتفع', 'لا توجد حساسيات معروفة'),
(9, '1978-11-08', 'male', 'B+', 'الدمام، حي الفيصلية، شارع الأمير محمد', 'أخ المريض - عبدالرحمن خالد', '+966501234582', 'مرض السكري النوع الثاني', 'حساسية من الأسبرين'),
(10, '1995-05-30', 'female', 'AB+', 'مكة المكرمة، حي العزيزية، شارع إبراهيم الخليل', 'والدة المريضة - سعاد نوال', '+966501234583', 'لا يوجد تاريخ مرضي', 'حساسية من المكسرات');

-- Insert sample appointments - إدراج مواعيد تجريبية
INSERT INTO appointments (doctor_id, patient_id, appointment_date, time_slot, status, reason, notes) VALUES
(1, 1, '2024-01-15', '09:00:00', 'scheduled', 'فحص دوري للقلب', 'المريض يشكو من ألم في الصدر'),
(2, 2, '2024-01-16', '10:00:00', 'confirmed', 'فحص طفل', 'فحص دوري للطفل'),
(3, 3, '2024-01-17', '11:00:00', 'scheduled', 'متابعة حمل', 'متابعة الحمل في الشهر السادس'),
(1, 4, '2024-01-18', '14:00:00', 'scheduled', 'استشارة قلب', 'ألم في الصدر وضيق تنفس'),
(4, 1, '2024-01-19', '09:30:00', 'scheduled', 'ألم في الركبة', 'ألم مستمر في الركبة اليمنى');

-- Insert sample medical records - إدراج سجلات طبية تجريبية
INSERT INTO medical_records (patient_id, doctor_id, appointment_id, visit_date, chief_complaint, diagnosis, prescription, treatment_plan, notes) VALUES
(1, 1, 1, '2024-01-10', 'ألم في الصدر وضيق تنفس', 'ارتفاع ضغط الدم', 'أملوديبين 5 مجم مرة واحدة يومياً', 'متابعة ضغط الدم أسبوعياً، تقليل الملح في الطعام', 'المريض بحاجة لمتابعة دورية'),
(2, 2, 2, '2024-01-11', 'حمى وسعال', 'التهاب في الجهاز التنفسي العلوي', 'باراسيتامول 500 مجم كل 6 ساعات، مضاد حيوي', 'راحة في المنزل، شرب السوائل', 'تحسن حالة المريضة'),
(3, 3, 3, '2024-01-12', 'متابعة حمل روتينية', 'حمل طبيعي في الأسبوع 24', 'فيتامينات الحمل، حمض الفوليك', 'متابعة شهرية، فحوصات دورية', 'الحمل يسير بشكل طبيعي');

-- Insert time slots for doctors - إدراج الأوقات المتاحة للأطباء
INSERT INTO time_slots (doctor_id, day_of_week, start_time, end_time) VALUES
-- د. سارة أحمد (طب القلب)
(1, 6, '09:00:00', '12:00:00'), -- السبت صباحاً
(1, 6, '14:00:00', '17:00:00'), -- السبت مساءً
(1, 0, '09:00:00', '12:00:00'), -- الأحد صباحاً
(1, 1, '09:00:00', '12:00:00'), -- الاثنين صباحاً
(1, 1, '14:00:00', '17:00:00'), -- الاثنين مساءً

-- د. محمد علي (طب الأطفال)
(2, 6, '08:00:00', '12:00:00'), -- السبت صباحاً
(2, 6, '15:00:00', '18:00:00'), -- السبت مساءً
(2, 0, '08:00:00', '12:00:00'), -- الأحد صباحاً
(2, 1, '08:00:00', '12:00:00'), -- الاثنين صباحاً
(2, 1, '15:00:00', '18:00:00'); -- الاثنين مساءً
