# واجهة الاشتراكات البرمجية (الباكند)

## المسارات العامة

### GET /api/subscriptions/meta

يعيد البيانات المرجعية اللازمة لنماذج الاشتراك.

المفاتيح الراجعة في الاستجابة:

- countries
- stacks
- positions
- rounds
- company_fields
- package_ranges
- interview_times
- interview_times [Missing]

### POST /api/subscriptions

ينشئ اشتراكًا جديدًا لأحد الأنواع التالية:

- trainee
- trainer
- company

معدل الطلبات:

- 20 طلبًا لكل دقيقة لكل IP (`throttle:subscriptions-create`)

الحقول المشتركة في الطلب:

- type
- email
- full_name
- country_id
- accept_conditions

الحقول الخاصة بكل نوع:

- trainee: stack_id, round_id, interview_times[], cv (اختياري)
- trainer: position_id, interview_times[], cv (إجباري)
- company: brand_name, company_field_id, package_range_id, cr_number, extra_information (اختياري), cr (اختياري)

الاستجابة:

- message
- subscription_id
- redirect_url

### GET /api/subscriptions/public/{publicId}

يعيد الملخص العام للاشتراك باستخدام معرف الاشتراك العام.

## مسارات الإدارة (auth:sanctum + manage.subscribers)

### GET /api/admin/subscribers

يعيد قائمة المشتركين مع الفلاتر والتقسيم إلى صفحات.

الفلاتر المتاحة:

- type
- status
- name
- date
- round_id
- per_page

### GET /api/admin/subscribers/grouped

يعيد المشتركين مجمعين حسب النوع لواجهات الكروت/الأقسام.

معاملات الاستعلام:

- type (اختياري)
- status (اختياري)
- name (اختياري)
- date (اختياري)
- round_id (اختياري)
- per_type_limit (القيمة الافتراضية 20)

### GET /api/admin/subscribers/stats

يعيد:

- total_subscribers
- totals_by_type
- totals_by_status
- daily_counts_last_7_days

### GET /api/admin/subscribers/trends

معاملات الاستعلام:

- interval: daily|weekly (القيمة الافتراضية daily)
- days: من 1 إلى 90 (القيمة الافتراضية 30)
- type: trainee|trainer|company
- status: pending|accepted|rejected|maybe

### GET /api/admin/subscribers/{type}/{subscription}

يعيد التفاصيل الكاملة للمشترك.

### PATCH /api/admin/subscribers/{subscription}/status

بيانات الطلب:

- status: accepted|rejected|maybe
- scheduled_at (إجباري عند accepted)
- reason (إجباري عند rejected/maybe)

### PATCH /api/admin/subscribers/bulk-status

بيانات الطلب:

- ids[]
- status: rejected|maybe
- reason

### POST /api/admin/subscribers/selection

مساعد تحديد لعمليات الإجراءات الجماعية في الواجهة.

بيانات الطلب:

- action: select_all | select_none | invert
- selected_ids[] (اختياري)
- نفس فلاتر endpoint القائمة

الاستجابة:

- matching_count
- selected_count
- selected_ids[]

### POST /api/admin/subscribers/{subscription}/resend-email

بيانات الطلب (اختيارية):

- event_type: submitted|accepted|rejected|maybe
- reason
- scheduled_at

السلوك:

- يتم جدولة مهمة بريد إلكتروني باستخدام event_type المرسل.
- إذا لم يتم إرسال event_type، يتم الاعتماد على حالة الاشتراك الحالية (أو submitted عند pending).

## إدارة البيانات المرجعية (الإدارة)

هذه المسارات تتطلب middleware التالية: `auth:sanctum` و `manage.subscribers`.

### GET /api/admin/reference-data

يعيد جميع القوائم المرجعية:

- countries
- stacks
- positions
- rounds
- company_fields
- package_ranges

### POST /api/admin/reference-data/{resource}

ينشئ عنصرًا مرجعيًا جديدًا.

بيانات الطلب:

- name

الموارد المسموح بها:

- countries
- stacks
- positions
- rounds
- company_fields
- package_ranges

### PUT /api/admin/reference-data/{resource}/{id}

يحدث اسم عنصر مرجعي.

بيانات الطلب:

- name

### DELETE /api/admin/reference-data/{resource}/{id}

يحذف عنصرًا مرجعيًا.

## ملاحظات

- يتم التحقق من الملفات المرفوعة لتكون بصيغة `pdf` أو `md`، وحد الحجم الأقصى يعتمد على `SUBSCRIPTIONS_MAX_UPLOAD_KB` (الافتراضي: 71680 كيلوبايت = 70MB).
- يتم إرسال إشعارات البريد عبر `SendSubscriptionEmailJob` باستخدام Queue.
- مهام البريد تستخدم retries/backoff على queue باسم `emails`.
