# دليل التثبيت والإعداد - Setup Guide
## نظام إدارة المستشفى - Hospital Management System

هذا الدليل سيساعدك في تثبيت وتشغيل نظام إدارة المستشفى خطوة بخطوة.

## 📋 المتطلبات الأساسية

### البرامج المطلوبة
- **Node.js** (الإصدار 16 أو أحدث)
- **MySQL** (الإصدار 8.0 أو أحدث)
- **Git**
- **محرر نصوص** (VS Code مُوصى به)

### التحقق من التثبيت
```bash
# التحقق من Node.js
node --version
npm --version

# التحقق من MySQL
mysql --version

# التحقق من Git
git --version
```

## 🚀 خطوات التثبيت

### 1. تحميل المشروع

```bash
# استنساخ المشروع
git clone https://github.com/your-username/hospital-management.git
cd hospital-management
```

### 2. إعداد قاعدة البيانات

#### أ. تسجيل الدخول إلى MySQL
```bash
mysql -u root -p
```

#### ب. إنشاء قاعدة البيانات
```sql
-- في MySQL shell
source database/schema.sql
exit
```

#### ج. التحقق من إنشاء قاعدة البيانات
```bash
mysql -u root -p -e "USE hospital_management; SHOW TABLES;"
```

### 3. إعداد Backend (الخادم الخلفي)

#### أ. الانتقال إلى مجلد Backend
```bash
cd backend
```

#### ب. تثبيت المكتبات
```bash
npm install
```

#### ج. إنشاء ملف البيئة
```bash
cp .env.example .env
```

#### د. تحديث ملف .env
افتح ملف `.env` وحدث المتغيرات التالية:

```env
# Server Configuration
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=hospital_management
DB_USER=root
DB_PASSWORD=your_mysql_password_here

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=24h

# Security Configuration
BCRYPT_ROUNDS=12
```

#### هـ. تشغيل الخادم
```bash
# للتطوير
npm run dev

# للإنتاج
npm start
```

### 4. إعداد Frontend (واجهة المستخدم)

#### أ. فتح terminal جديد والانتقال إلى مجلد Frontend
```bash
cd frontend
```

#### ب. تثبيت المكتبات
```bash
npm install
```

#### ج. تشغيل التطبيق
```bash
npm start
```

### 5. الوصول للتطبيق

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 🔐 الحسابات التجريبية

يمكنك استخدام الحسابات التالية للاختبار:

### مدير النظام
- **البريد الإلكتروني**: admin@hospital.com
- **كلمة المرور**: password123

### طبيب
- **البريد الإلكتروني**: dr.sarah@hospital.com
- **كلمة المرور**: password123

### مريض
- **البريد الإلكتروني**: ali.patient@email.com
- **كلمة المرور**: password123

## 🛠️ إعدادات إضافية

### تخصيص المنفذ (Port)

#### Backend
```bash
# في ملف backend/.env
PORT=5001
```

#### Frontend
```bash
# إنشاء ملف frontend/.env
echo "PORT=3001" > .env
```

## 🔧 حل المشاكل الشائعة

### مشكلة الاتصال بقاعدة البيانات

```bash
# التحقق من تشغيل MySQL
sudo systemctl status mysql

# إعادة تشغيل MySQL
sudo systemctl restart mysql

# التحقق من المنفذ
netstat -tlnp | grep :3306
```

### مشكلة المنافذ المستخدمة

```bash
# العثور على العملية التي تستخدم المنفذ
lsof -i :3000
lsof -i :5000

# إيقاف العملية
kill -9 PID_NUMBER
```

## 📊 مراقبة الأداء

### عرض سجلات Backend
```bash
cd backend
npm run dev
```

### عرض سجلات Frontend
```bash
cd frontend
npm start
```

## 🧪 تشغيل الاختبارات

### اختبار Backend
```bash
cd backend
npm test
```

### اختبار Frontend
```bash
cd frontend
npm test
```

## 📦 بناء للإنتاج

### بناء Frontend
```bash
cd frontend
npm run build
```

### تشغيل Backend في وضع الإنتاج
```bash
cd backend
NODE_ENV=production npm start
```

## 🔄 التحديث

### تحديث المشروع
```bash
git pull origin main
cd backend && npm install
cd ../frontend && npm install
```

## 📞 الحصول على المساعدة

إذا واجهت أي مشاكل:

1. **تحقق من السجلات** في terminal
2. **راجع ملف .env** للتأكد من صحة الإعدادات
3. **تأكد من تشغيل MySQL** وإمكانية الوصول إليه
4. **تحقق من المنافذ** المستخدمة
5. **أنشئ issue** في GitHub مع تفاصيل المشكلة

## ✅ قائمة التحقق

- [ ] تم تثبيت Node.js و MySQL
- [ ] تم استنساخ المشروع
- [ ] تم إنشاء قاعدة البيانات
- [ ] تم تكوين ملف .env
- [ ] تم تثبيت مكتبات Backend
- [ ] تم تثبيت مكتبات Frontend
- [ ] يعمل Backend على المنفذ 5000
- [ ] يعمل Frontend على المنفذ 3000
- [ ] تم اختبار تسجيل الدخول

---

🎉 **تهانينا!** نظام إدارة المستشفى جاهز للاستخدام!
