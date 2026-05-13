# Mawthiq Landing Page

صفحة هبوط عالية التحويل لشركة "Mawthiq" (موثق) - منصة انتقال المتعلمين إلى موظفين خبراء.

## المميزات

### 🌐 ثنائية اللغة
- دعم كامل للغة العربية والإنجليزية
- تبديل سلس بين اللغات
- دعم RTL/LTR كامل

### 🎨 التصميم
- تصميم عصري و Minimalist
- ألوان احترافية (أزرق عميق، زمردي، رمادي ناعم)
- خطوط عربية احترافية (Cairo, Almarai)

### ⚡ الأداء والتفاعل
- React 18 مع Hooks
- Tailwind CSS للتصميم
- AOS للتحريك مع السكرول
- متجاوب بالكامل (Mobile-first)
- A/B Testing مدمج عبر `analytics.js`
- تتبع أحداث المستخدم (gtag) مع `trackEvent`

### 📱 الأقسام
1. **Navbar** - شريط تنقل ثنائي اللغة مع قائمة موبايل
2. **Hero Section** - كاروسيل متعدد الشرائح مع CTA
3. **Problem Section** - عرض فجوة الخبرة (A/B test: `hero_headline_test`)
4. **Solution Section** - عرض الحل مع بطاقات المميزات والإحصاءات
5. **Tech Stack** - عرض التقنيات والأدوات
6. **Requirements Section** - شروط الالتحاق
7. **Journey Section** - رحلة المتدرب في 6 مراحل (timeline عمودي)
8. **Success Section** - قصص نجاح الخريجين
9. **Partners Section** - شركاء النجاح
10. **Contact Section** - نموذج تسجيل للقائمة الانتظارية
11. **Course Details** - صفحة تفاصيل البرنامج (view منفصل)
12. **Footer** - تذييل الصفحة

## التقنيات المستخدمة

- **React 18** - واجهة المستخدم
- **Tailwind CSS** - تصميم وتنسيق
- **AOS (Animate On Scroll)** - تحريك العناصر مع السكرول
- **Lucide React** - أيقونات حديثة
- **react-slick** - كاروسيل Hero Section

## التثبيت والتشغيل

1. تثبيت الاعتماديات:
```bash
npm install
```

2. تشغيل خادم التطوير:
```bash
npm start
```

3. بناء نسخة الإنتاج:
```bash
npm run build
```

## الهيكل

```
src/
├── App.js                    # المكون الرئيسي — يدير view (landing | course) ولغة العرض
├── index.js                  # نقطة الدخول
├── index.css                 # التنسيقات العامة + Tailwind directives
├── components/
│   ├── Navbar.js             # شريط التنقل
│   ├── HeroSection.js        # كاروسيل Hero
│   ├── ProblemSection.js     # قسم المشكلة (A/B)
│   ├── SolutionSection.js    # قسم الحل
│   ├── TechStackSection.js   # التقنيات
│   ├── RequirementsSection.js# شروط الالتحاق
│   ├── JourneySection.js     # رحلة المتدرب (vertical timeline، 6 مراحل)
│   ├── SuccessSection.js     # قصص النجاح
│   ├── PartnersSection.js    # الشركاء
│   ├── ContactSection.js     # نموذج التواصل
│   ├── CourseDetails.js      # صفحة تفاصيل البرنامج
│   ├── CTASection.js         # CTA مستقل
│   └── Footer.js             # التذييل
├── data/
│   └── content.js            # جميع المحتوى بالعربية والإنجليزية
├── utils/
│   └── analytics.js          # trackEvent + getVariant (A/B) + getStoredVariants
└── styles/
    └── TechStack.css         # ستايلات خاصة بقسم التقنيات
```

## التخصيص

### الألوان
يمكن تعديل الألوان من `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      'deep-blue': '#1E3A8A',
      'emerald': '#10B981',
      'soft-gray': '#F9FAFB',
    }
  }
}
```

### الخطوط
الخطوط العربية محددة في `public/index.html`:
- Cairo للغة العربية
- Almarai للغة الإنجليزية

### المحتوى
جميع النصوص والمحتوى مركزي في `src/data/content.js` — يدعم `ar` و `en` وسهل التوسعة.

### A/B Testing
يستخدم المشروع `src/utils/analytics.js` لتجربة متغيرات المحتوى:
- `getVariant(key, variants)` — يختار variant ويخزنه في localStorage
- `trackEvent(name, payload)` — يُطلق حدث gtag + console.debug
- `getStoredVariants()` — يُرجع جميع المتغيرات المخزنة

## التوافق

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile Safari
- ✅ Chrome Mobile

## المساهمة

1. Fork المشروع
2. إنشاء فرع جديد (`git checkout -b feature/AmazingFeature`)
3. عمل Commit (`git commit -m 'Add some AmazingFeature'`)
4. الدفع إلى الفرع (`git push origin feature/AmazingFeature`)
5. إنشاء Pull Request

## الرخصة

جميع الحقوق محفوظة © 2026 موثق
