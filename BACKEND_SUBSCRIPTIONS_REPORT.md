# تقرير الباكند لوحدة الاشتراكات

## النطاق
هذا التقرير يغطّي الأعمال التي تم تنفيذها على الباكند فقط فيما يخص وحدة الاشتراكات، بالإضافة إلى ملف مجموعة Postman الخاصة بالاختبار.

## ما تم تنفيذه

### 1. تنفيذ API الاشتراكات العامة
تم تنفيذ ومراجعة الـ endpoints العامة التالية في [back/routes/api.php](back/routes/api.php):
- `POST /api/login`
- `GET /api/subscriptions/meta`
- `POST /api/subscriptions`
- `GET /api/subscriptions/public/{publicId}`

#### ما وظيفة `GET /api/subscriptions/meta`؟
هذا الـ endpoint مسؤول عن جلب البيانات المرجعية اللازمة قبل إنشاء أي اشتراك، ولا يقوم بإنشاء اشتراك بحد ذاته.

يعيد قوائم جاهزة للاستخدام في النماذج مثل:
- الدول `countries`
- المسارات `stacks`
- الجولات `rounds`
- الوظائف `positions`
- مجالات الشركات `company_fields`
- باقات الشركات `package_ranges`
- أوقات المقابلة المتاحة `interview_times`

الفائدة العملية:
- يضمن استخدام القيم الصحيحة (`id`) في طلبات الإنشاء
- يقلل الأخطاء الناتجة عن إدخال قيم غير موجودة
- يجعل نموذج الاشتراك ديناميكيًا ومربوطًا ببيانات قاعدة البيانات

### 2. تنفيذ قواعد إنشاء الاشتراك حسب نوع المشترك
تم تنفيذ التحقق من البيانات والحفظ في [back/app/Http/Controllers/Api/SubscriptionController.php](back/app/Http/Controllers/Api/SubscriptionController.php).

الحقول العامة المشتركة:
- `email`
- `full_name`
- `country_id`
- `accept_conditions`

حقول نوع `trainee`:
- `stack_id`
- `round_id`
- `interview_times[]`
- `cv` اختياري

حقول نوع `trainer`:
- `position_id`
- `interview_times[]`
- `cv` إجباري

حقول نوع `company`:
- `brand_name`
- `company_field_id`
- `package_range_id`
- `cr_number`
- `extra_information`
- `cr` اختياري

### 3. تنفيذ ملخص الاشتراك العام
تم تنفيذ استرجاع ملخص الاشتراك باستخدام `public_id` في:
- [back/app/Http/Controllers/Api/SubscriptionController.php](back/app/Http/Controllers/Api/SubscriptionController.php)
- [back/app/Http/Resources/SubscriptionResource.php](back/app/Http/Resources/SubscriptionResource.php)

البيانات الراجعة تشمل:
- رقم الاشتراك العام `subscription_id`
- البيانات العامة للمشترك
- التفاصيل الخاصة بنوع الاشتراك
- المواعيد المختارة للمقابلة
- بيانات الملفات المرفوعة

### 4. إرسال بريد إلكتروني بعد نجاح الاشتراك
تم تنفيذ إرسال البريد بعد نجاح إنشاء الاشتراك عن طريق Queue Job باستخدام:
- [back/app/Jobs/SendSubscriptionEmailJob.php](back/app/Jobs/SendSubscriptionEmailJob.php)
- [back/app/Mail/SubscriptionSubmittedMail.php](back/app/Mail/SubscriptionSubmittedMail.php)
- [back/resources/views/emails/subscriptions/submitted.blade.php](back/resources/views/emails/subscriptions/submitted.blade.php)
- [back/resources/views/emails/subscriptions/_details.blade.php](back/resources/views/emails/subscriptions/_details.blade.php)

البريد يحتوي على:
- رقم الاشتراك العام
- البيانات الأساسية للاشتراك
- تنبيه للمستخدم بضرورة الاحتفاظ برقم الاشتراك للرجوع إليه لاحقًا

### 5. إصلاح سلوك API ليعيد JSON بدل HTML
تمت إضافة Middleware لإجبار جميع مسارات الـ API على التفاوض بصيغة JSON، بحيث يحصل Postman أو أي مستهلك للـ API على أخطاء JSON بدل صفحات HTML.

الملفات:
- [back/app/Http/Middleware/ForceJsonResponse.php](back/app/Http/Middleware/ForceJsonResponse.php)
- [back/bootstrap/app.php](back/bootstrap/app.php)

هذا الإصلاح حل مشكلة رجوع صفحة Laravel الافتراضية عند فشل التحقق من البيانات.

### 6. إصلاح حد رفع الملفات
تم رفع حد التحقق الخاص بحجم ملفات الاشتراكات وجعله قابلًا للتعديل من متغير بيئة.

الملفات:
- [back/app/Http/Controllers/Api/SubscriptionController.php](back/app/Http/Controllers/Api/SubscriptionController.php)
- [back/.env.example](back/.env.example)

متغير البيئة:
- `SUBSCRIPTIONS_MAX_UPLOAD_KB=71680`

الحد الافتراضي الفعلي:
- `70 MB`

هذا الإصلاح حل مشكلة فشل رفع ملف `cv` بسبب الحد القديم البالغ `5 MB` فقط.

### 7. إصلاح Seeder ليصبح قابلًا لإعادة التشغيل
تم تعديل الـ seeding بحيث لا يفشل عند إعادة التنفيذ بسبب تكرار الإيميلات.

الملف:
- [back/database/seeders/DatabaseSeeder.php](back/database/seeders/DatabaseSeeder.php)

ما تم تغييره:
- استخدام `updateOrCreate` بدل `create` للمستخدمين الثابتين
- ضمان استدعاء `AdminSeeder` بشكل ثابت

### 8. إصلاح CORS
تم توسيع قائمة الـ origins المسموح بها لدعم منافذ التطوير المحلية، مع إمكانية تخصيصها من البيئة عند الحاجة.

الملف:
- [back/config/cors.php](back/config/cors.php)

المسموح افتراضيًا:
- `http://localhost:3000`
- `http://localhost:3001`
- `http://127.0.0.1:3000`
- `http://127.0.0.1:3001`

### 9. استكمال وتصحيح ملف Postman
تم تحديث وتصحيح ملف مجموعة Postman الخاصة بالباكند:
- [back/postman/subscriptions-api.collection.json](back/postman/subscriptions-api.collection.json)

ما الذي تم تحسينه:
- إضافة `Accept: application/json` للطلبات العامة
- الإبقاء على تدفق `login` و `Bearer token` للطلبات الإدارية
- إضافة test scripts لحفظ المتغيرات التالية تلقائيًا:
- `auth_token`
- `subscription_public_id`
- إصلاح أخطاء البنية في JSON داخل أحداث `event`
- التحقق من صحة الملف فعليًا باستخدام `JSON.parse`

## الملفات التي تم تعديلها
- [back/app/Http/Controllers/Api/SubscriptionController.php](back/app/Http/Controllers/Api/SubscriptionController.php)
- [back/app/Http/Middleware/ForceJsonResponse.php](back/app/Http/Middleware/ForceJsonResponse.php)
- [back/app/Jobs/SendSubscriptionEmailJob.php](back/app/Jobs/SendSubscriptionEmailJob.php)
- [back/app/Mail/SubscriptionSubmittedMail.php](back/app/Mail/SubscriptionSubmittedMail.php)
- [back/bootstrap/app.php](back/bootstrap/app.php)
- [back/config/cors.php](back/config/cors.php)
- [back/database/seeders/DatabaseSeeder.php](back/database/seeders/DatabaseSeeder.php)
- [back/postman/subscriptions-api.collection.json](back/postman/subscriptions-api.collection.json)
- [back/.env.example](back/.env.example)

## التحقق الذي تم تنفيذه

### أوامر التحقق المنفذة
- `php artisan config:clear`
- `php artisan cache:clear`
- `php artisan optimize:clear`
- `php artisan db:seed --force`
- التحقق من ملف JSON الخاص بـ Postman باستخدام `Node.js JSON.parse`

### نتائج التحقق
- نجح الـ Seeder بعد إصلاح مشكلة تكرار الإيميل
- تم تنظيف كاش Laravel بنجاح
- أصبح ملف مجموعة Postman صالحًا بعد إصلاح البنية

## طريقة تشغيل الباكند

### 1. تشغيل Laravel backend
من داخل مجلد `back/`:

```powershell
php artisan serve --host=127.0.0.1 --port=8000
```

### 2. تشغيل الـ Queue Worker للبريد
من داخل مجلد `back/`:

```powershell
php artisan queue:work
```

بدون تشغيل الـ Queue Worker قد ينجح إنشاء الاشتراك لكن لن يتم إرسال البريد الإلكتروني فعليًا.

## طريقة الاختبار باستخدام Postman

### 1. استيراد المجموعة
استورد الملف التالي:
- [back/postman/subscriptions-api.collection.json](back/postman/subscriptions-api.collection.json)

### 2. التأكد من متغيرات المجموعة
المتغيرات المطلوبة داخل المجموعة:
- `base_url = http://127.0.0.1:8000`
- `auth_token =` فارغ في البداية
- `subscription_id = 1` أو أي رقم صالح لاشتراك إداري موجود
- `subscription_public_id =` فارغ في البداية
- `reference_id = 1`

### 3. اختبار التدفق العام للمشتركين
شغّل الطلبات بهذا الترتيب:
1. `Meta`
2. `Create Trainee` أو `Create Trainer` أو `Create Company`
3. `Public Summary`

السلوك المتوقع:
- طلب الإنشاء يرجع `201` بصيغة JSON
- سكربت الاختبار يحفظ `subscription_public_id` تلقائيًا
- طلب `Public Summary` يستخدم القيمة المحفوظة تلقائيًا

### 4. ملاحظات اختبار نوع Trainer
نوع `trainer` يحتاج:
- `position_id`
- قيمة واحدة أو أكثر في `interview_times[]`
- ملف `cv`

الامتدادات المقبولة لملف `cv`:
- `pdf`
- `md`

### 5. ملاحظات اختبار نوع Trainee
نوع `trainee` يحتاج:
- `stack_id`
- `round_id`
- قيمة واحدة أو أكثر في `interview_times[]`
- `cv` اختياري

### 6. ملاحظات اختبار نوع Company
نوع `company` يحتاج:
- `brand_name`
- `company_field_id`
- `package_range_id`
- `cr_number`
- `extra_information` اختياري
- `cr` اختياري

### 7. اختبار المسارات الإدارية
شغّل الطلبات بهذا الترتيب:
1. `Login`
2. `List`
3. `Grouped`
4. `Stats`
5. `Trends`
6. `View Details`
7. `Update Status Accepted` أو `Update Status Rejected`
8. `Bulk Status`
9. `Resend Email`
10. طلبات `Admin Reference Data`

السلوك المتوقع:
- طلب `Login` يحفظ `auth_token` تلقائيًا
- الطلبات الإدارية تستخدم `Bearer token` من متغيرات المجموعة

## ملاحظات مهمة أثناء الاختبار
- إذا استمرت مشاكل رفع الملفات الكبيرة، راجع قيم PHP في `php.ini`:
- `upload_max_filesize`
- `post_max_size`
- إذا لم تصل الرسائل البريدية، تأكد أن `php artisan queue:work` يعمل.
- إذا فشل تسجيل الدخول، أعد تنفيذ `db:seed --force` واستخدم:
- `email: admin@quest.com`
- `password: password`

## الحالة النهائية
تم إكمال العمل على الباكند الخاص بالاشتراكات في الجوانب التالية:
- تنفيذ الـ API endpoints
- التحقق من البيانات
- حفظ البيانات
- استرجاع الملخص العام للاشتراك
- إرسال البريد عبر Queue
- توحيد أخطاء الـ API بصيغة JSON
- معالجة حدود رفع الملفات
- جعل الـ seeding آمنًا عند إعادة التنفيذ
- دعم CORS للاختبار المحلي
- تصحيح واعتماد ملف Postman

## خارج نطاق هذا التقرير
لا يشمل هذا التقرير أي أعمال على الفرونت، وذلك بناءً على الطلب.
