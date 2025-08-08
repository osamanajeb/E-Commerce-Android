# نظام إدارة المستشفى - Hospital Management System

نظام إدارة مستشفى حديث ومتجاوب مع واجهة مستخدم عربية كاملة وقاعدة بيانات SQL.

## 🏥 المميزات الرئيسية

- **واجهة مستخدم عربية كاملة** مع دعم RTL
- **تصميم متجاوب** يدعم الهاتف المحمول والكمبيوتر اللوحي وسطح المكتب
- **لوحات تحكم متعددة** للأطباء والمرضى والإدارة
- **نظام حجز المواعيد** المتقدم
- **إدارة السجلات الطبية**
- **نظام مصادقة آمن** باستخدام JWT
- **تصميم حديث** مع Tailwind CSS
- **أمان عالي** مع تشفير البيانات

## 🛠️ التقنيات المستخدمة

### Frontend
- **React.js 18** - مكتبة واجهة المستخدم
- **Tailwind CSS** - إطار عمل CSS مع دعم RTL
- **React Router** - التنقل بين الصفحات
- **React Query** - إدارة حالة الخادم
- **React Hook Form** - إدارة النماذج
- **React Hot Toast** - الإشعارات
- **React Icons** - الأيقونات

### Backend
- **Node.js** - بيئة تشغيل JavaScript
- **Express.js** - إطار عمل الخادم
- **MySQL2** - قاعدة البيانات
- **JWT** - المصادقة والتوثيق
- **bcryptjs** - تشفير كلمات المرور
- **Express Validator** - التحقق من صحة البيانات
- **CORS** - مشاركة الموارد
- **Helmet** - الأمان

### Database
- **MySQL** - قاعدة البيانات الرئيسية
- **RESTful API** - واجهة برمجة التطبيقات

## 📁 هيكل المشروع

```
hospital-management/
├── 📁 frontend/              # واجهة المستخدم (React)
│   ├── 📁 public/            # الملفات العامة
│   ├── 📁 src/
│   │   ├── 📁 components/    # المكونات القابلة لإعادة الاستخدام
│   │   ├── 📁 pages/         # صفحات التطبيق
│   │   ├── 📁 contexts/      # سياقات React
│   │   └── 📁 styles/        # ملفات التنسيق
│   ├── package.json
│   └── tailwind.config.js
├── 📁 backend/               # الخادم الخلفي (Node.js)
│   ├── 📁 routes/           # مسارات API
│   ├── 📁 controllers/      # منطق الأعمال
│   ├── 📁 middleware/       # الوسطاء
│   ├── 📁 config/          # إعدادات قاعدة البيانات
│   ├── package.json
│   └── server.js
├── 📁 database/             # قاعدة البيانات
│   ├── schema.sql          # هيكل قاعدة البيانات
│   └── seeds.sql           # البيانات التجريبية
└── 📄 README.md
```

## 🌟 الصفحات المتاحة

### 🏠 الصفحات العامة
- **الصفحة الرئيسية** - عرض المميزات والخدمات
- **قائمة الأطباء** - تصفح الأطباء والتخصصات
- **تسجيل الدخول** - دخول المستخدمين
- **إنشاء حساب** - تسجيل مستخدمين جدد

### 👨‍⚕️ لوحة الطبيب
- **لوحة التحكم** - إحصائيات ونظرة عامة
- **إدارة المواعيد** - عرض وإدارة المواعيد
- **السجلات الطبية** - إنشاء وتحديث السجلات
- **ملف الطبيب** - إدارة المعلومات الشخصية

### 🧑‍🦱 لوحة المريض
- **لوحة التحكم** - المواعيد القادمة والسجلات
- **حجز المواعيد** - حجز مواعيد جديدة
- **مواعيدي** - عرض وإدارة المواعيد
- **السجلات الطبية** - عرض التاريخ الطبي
- **الملف الشخصي** - تحديث المعلومات

### 👨‍💼 لوحة الإدارة
- **لوحة التحكم** - إحصائيات النظام
- **إدارة المستخدمين** - إضافة وتعديل المستخدمين
- **التقارير** - تقارير شاملة عن النظام
- **إعدادات النظام** - تكوين النظام

## 🚀 التثبيت والتشغيل

### متطلبات النظام
- **Node.js** (v16 أو أحدث)
- **MySQL** (v8.0 أو أحدث)
- **npm** أو **yarn**
- **Git**

### خطوات التثبيت السريع

1. **استنساخ المشروع**
```bash
git clone https://github.com/your-username/hospital-management.git
cd hospital-management
```

2. **إعداد قاعدة البيانات**
```bash
# تسجيل الدخول إلى MySQL
mysql -u root -p

# إنشاء قاعدة البيانات
mysql> source database/schema.sql
mysql> source database/seeds.sql
mysql> exit
```

3. **إعداد Backend**
```bash
cd backend
npm install

# إنشاء ملف البيئة
cp .env.example .env
# تحديث متغيرات قاعدة البيانات في .env

# تشغيل الخادم
npm run dev
```

4. **إعداد Frontend**
```bash
cd frontend
npm install

# تشغيل التطبيق
npm start
```

5. **الوصول للتطبيق**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🔐 حسابات تجريبية

للاختبار، يمكنك استخدام الحسابات التالية:

| الدور | البريد الإلكتروني | كلمة المرور |
|-------|------------------|-------------|
| مدير | admin@hospital.com | password123 |
| طبيب | dr.sarah@hospital.com | password123 |
| مريض | ali.patient@email.com | password123 |

## 🔒 الأمان

- **تشفير كلمات المرور** باستخدام bcrypt مع 12 rounds
- **مصادقة JWT** للجلسات الآمنة
- **تنظيف المدخلات** لمنع SQL Injection
- **التحقق من صحة البيانات** في Frontend و Backend
- **CORS** محدود للنطاقات المسموحة
- **Helmet** لحماية HTTP headers
- **Rate Limiting** لمنع الهجمات

## 🌐 API Documentation

### Authentication Endpoints
```
POST /api/auth/login      # تسجيل الدخول
POST /api/auth/register   # إنشاء حساب
GET  /api/auth/profile    # الملف الشخصي
POST /api/auth/logout     # تسجيل الخروج
```

### Users Endpoints
```
GET    /api/users         # قائمة المستخدمين (Admin)
GET    /api/users/:id     # مستخدم محدد
PUT    /api/users/:id     # تحديث مستخدم
DELETE /api/users/:id     # حذف مستخدم
```

### Doctors Endpoints
```
GET /api/doctors          # قائمة الأطباء
GET /api/doctors/:id      # طبيب محدد
PUT /api/doctors/:id      # تحديث ملف الطبيب
```

### Appointments Endpoints
```
GET    /api/appointments     # قائمة المواعيد
POST   /api/appointments     # إنشاء موعد
GET    /api/appointments/:id # موعد محدد
PATCH  /api/appointments/:id/status # تحديث حالة الموعد
DELETE /api/appointments/:id # إلغاء موعد
```

## 🎨 التخصيص

### تخصيص الألوان
يمكنك تخصيص ألوان النظام من خلال تعديل ملف `frontend/tailwind.config.js`:

```javascript
colors: {
  primary: {
    // ألوانك المخصصة هنا
  }
}
```

### إضافة لغات جديدة
النظام مصمم لدعم اللغة العربية، ولكن يمكن إضافة لغات أخرى بسهولة.

## 🧪 الاختبار

```bash
# اختبار Backend
cd backend
npm test

# اختبار Frontend
cd frontend
npm test
```

## 📱 الاستجابة للأجهزة

النظام مصمم ليكون متجاوباً مع جميع أحجام الشاشات:
- **الهواتف المحمولة** (320px+)
- **الأجهزة اللوحية** (768px+)
- **أجهزة سطح المكتب** (1024px+)
- **الشاشات الكبيرة** (1440px+)

## 🤝 المساهمة

نرحب بالمساهمات! يرجى اتباع الخطوات التالية:

1. Fork المشروع
2. إنشاء branch جديد (`git checkout -b feature/amazing-feature`)
3. Commit التغييرات (`git commit -m 'Add amazing feature'`)
4. Push إلى Branch (`git push origin feature/amazing-feature`)
5. فتح Pull Request

## 📝 الترخيص

هذا المشروع مرخص تحت رخصة MIT. راجع ملف `LICENSE` للمزيد من التفاصيل.

## 📞 الدعم والتواصل

- **GitHub Issues**: لتقارير الأخطاء والاقتراحات
- **Email**: support@hospital-system.com
- **Documentation**: راجع مجلد `docs/` للمزيد من التفاصيل

## 🔄 التحديثات المستقبلية

- [ ] نظام الدفع الإلكتروني
- [ ] تطبيق الهاتف المحمول
- [ ] نظام الإشعارات المتقدم
- [ ] تقارير متقدمة وتحليلات
- [ ] دعم متعدد اللغات
- [ ] نظام المراسلة الداخلية

---

**ملاحظة**: جميع النصوص والتسميات في هذا النظام باللغة العربية مع دعم كامل لاتجاه النص من اليمين إلى اليسار (RTL).
