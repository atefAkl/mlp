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
- [back/resources/views/emails/subscriptions/\_details.blade.php](back/resources/views/emails/subscriptions/_details.blade.php)

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
- إضافة متغير `subscriber_type` لاختبار تفاصيل الأنواع الثلاثة ديناميكيًا
- إضافة طلب `List (All Filters Example)` لتغطية الفلاتر مجتمعة في نفس الطلب
- إضافة طلبات مستقلة لـ `Update Status Maybe` و `Bulk Status Rejected`
- إضافة أمثلة `Selection Helper - Select All` و `Selection Helper - Select None`
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
3. `List (All Filters Example)`
4. `Grouped`
5. `Selection Helper` + `Selection Helper - Select All` + `Selection Helper - Select None`
6. `Stats`
7. `Trends`
8. `View Details` (مع ضبط `subscriber_type`)
9. `Update Status Accepted` أو `Update Status Rejected` أو `Update Status Maybe`
10. `Bulk Status Maybe` أو `Bulk Status Rejected`
11. `Resend Email`
12. طلبات `Admin Reference Data`

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

## تقرير الجزء الثاني: إدارة المشتركين (Admin Subscribers)

### ملخص التنفيذ

تم تنفيذ متطلبات الجزء الثاني على مستوى الباكند عبر مسارات الإدارة في:

- [back/routes/api.php](back/routes/api.php)
- [back/app/Http/Controllers/Api/AdminSubscriberController.php](back/app/Http/Controllers/Api/AdminSubscriberController.php)

### مطابقة المتطلبات (Backend Coverage)

#### 1) عرض قائمة المشتركين مجمعة حسب النوع

المتوفر:

- `GET /api/admin/subscribers` لعرض القائمة مع Pagination
- `GET /api/admin/subscribers/grouped` لعرض القائمة مجمعة حسب النوع (`trainee`, `trainer`, `company`)

#### 2) بيانات العرض والتحليل (Data & Visualization)

المتوفر في الباكند:

- القائمة (Table/Cards data source): عبر `index` و `grouped`
- الفلاتر: عبر Query Params
- Pagination: عبر `per_page` في `index`
- Bulk helper: عبر `POST /api/admin/subscribers/selection`
- Stats cards source: عبر `GET /api/admin/subscribers/stats`
- Trends source: عبر `GET /api/admin/subscribers/trends`

#### 3) فلاتر الإدارة المطلوبة

المتوفر:

- النوع `type`
- الجولة `round_id` (على نوع Trainee)
- التاريخ `date`
- الاسم `name`
- الحالة `status` (`accepted`, `rejected`, `maybe`, بالإضافة إلى `pending` داخليًا)

#### 4) إجراءات كل مشترك

المتوفر:

- العرض: `GET /api/admin/subscribers/{type}/{subscription}`
- تحديث الحالة (قبول/رفض/ربما): `PATCH /api/admin/subscribers/{subscription}/status`

تفاصيل التنفيذ:

- عند `accepted`:
  - `scheduled_at` إجباري (موعد مقابلة/ديمو)
- عند `rejected` أو `maybe`:
  - `reason` إجباري (سبب الرفض/النواقص)
- عند كل عملية تحديث حالة:
  - يتم تسجيل سجل حالة (Status Log)
  - يتم إرسال بريد عبر Queue Job حسب الحالة

#### 5) إجراءات Bulk

المتوفر:

- `POST /api/admin/subscribers/selection`
  - `select_all`
  - `select_none`
  - `invert`
- `PATCH /api/admin/subscribers/bulk-status`
  - يدعم `rejected` و `maybe` مع `reason` إجباري

#### 6) إعادة إرسال البريد عند الحاجة

المتوفر:

- `POST /api/admin/subscribers/{subscription}/resend-email`
  - يدعم `event_type` اختياريًا (`submitted|accepted|rejected|maybe`)

### المصفوفة التشغيلية للجزء الثاني (API Checklist)

1. تسجيل الدخول (Admin)

- Request: `POST /api/login`
- نتيجة متوقعة: Token صالح للإدارة

2. عرض القائمة مع فلاتر

- Request: `GET /api/admin/subscribers?type=trainee&status=pending&name=ahmed&date=2026-05-19&round_id=1&per_page=15`
- نتيجة متوقعة: بيانات paginated مطابقة للفلاتر

3. العرض المجمع حسب النوع

- Request: `GET /api/admin/subscribers/grouped?per_type_limit=20`
- نتيجة متوقعة: `groups.trainee/groups.trainer/groups.company`

4. الإحصائيات

- Request: `GET /api/admin/subscribers/stats`
- نتيجة متوقعة: `total_subscribers`, `totals_by_type`, `totals_by_status`

5. الاتجاهات

- Request: `GET /api/admin/subscribers/trends?interval=daily&days=30&type=company&status=accepted`
- نتيجة متوقعة: سلاسل زمنية جاهزة للرسم

6. تفاصيل مشترك

- Request: `GET /api/admin/subscribers/{type}/{subscription}`
- نتيجة متوقعة: تفاصيل كاملة + ملفات + time slots

7. قبول مشترك

- Request: `PATCH /api/admin/subscribers/{subscription}/status`
- Payload:
  - `status=accepted`
  - `scheduled_at=YYYY-MM-DD HH:MM:SS`
- نتيجة متوقعة: تحديث الحالة + جدولة بريد القبول

8. رفض أو ربما

- Request: `PATCH /api/admin/subscribers/{subscription}/status`
- Payload:
  - `status=rejected` أو `status=maybe`
  - `reason=...`
- نتيجة متوقعة: تحديث الحالة + جدولة بريد السبب

9. عمليات تحديد Bulk

- Request: `POST /api/admin/subscribers/selection`
- Payload: `action=select_all|select_none|invert` مع فلاتر اختيارية
- نتيجة متوقعة: `selected_ids` محسوبة من السيرفر

10. تحديث جماعي للحالة

- Request: `PATCH /api/admin/subscribers/bulk-status`
- Payload:
  - `ids[]`
  - `status=rejected|maybe`
  - `reason=...`
- نتيجة متوقعة: عدد محدث + جدولة بريد لكل مشترك

### ملاحظات تنفيذية للجزء الثاني

- كل مسارات الإدارة محمية بـ `auth:sanctum` + `manage.subscribers`.
- إرسال البريد يعتمد على Queue؛ يلزم تشغيل:

```powershell
php artisan queue:work
```

- واجهة الأدمن (UI) الخاصة بالكروت/المودال هي جزء فرونت إند، لكن الباكند المطلوب لها (filters, actions, bulk, email) متوفر.

## خارج نطاق هذا التقرير

لا يشمل هذا التقرير أي أعمال على الفرونت، وذلك بناءً على الطلب.

## ملحق: التدقيق النهائي لإدارة Postman (تحديث مايو 2026)

### حالة التغطية النهائية

- تغطية فلاتر القائمة (type/status/name/date/round_id/per_page): مكتمل.
- تغطية العرض المجمع والاحصائيات والاتجاهات: مكتمل.
- تغطية عرض التفاصيل لكل الأنواع: مكتمل عبر `subscriber_type`.
- تغطية تحديث الحالة (`accepted/rejected/maybe`) بشروط الحقول الإلزامية: مكتمل.
- تغطية عمليات التحديد (`select_all/select_none/invert`): مكتمل.
- تغطية التحديث الجماعي (`rejected/maybe`): مكتمل.
- تغطية إعادة إرسال البريد: مكتمل.

### تحقق تنفيذي إضافي على الباكند

تم تنفيذ أوامر تحقق فعلية داخل مجلد `back`:

- `php artisan route:list --path=api/admin/subscribers`
  - النتيجة: تم العثور على 9 مسارات إدارة للمشتركين (القائمة، grouped، selection، stats، trends، العرض، تحديث الحالة، bulk-status، resend-email).
- `php artisan test --filter=AdminSubscriber --stop-on-failure`
  - النتيجة: هذا الفلتر لا يطابق اسم كلاس الاختبار الحالي.
- `php artisan test --filter=SubscriptionsFlowTest --stop-on-failure`
  - النتيجة: جميع اختبارات التدفق نجحت (16/16) وتشمل سيناريوهات الإدارة (stats/trends/grouped/selection/update-status/bulk/resend-email).

### ملاحظة جودة

- تم توحيد التوثيق مع التنفيذ الفعلي لحد رفع الملفات ليعتمد على متغير البيئة `SUBSCRIPTIONS_MAX_UPLOAD_KB` (الافتراضي: 70MB).
