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
- Framer Motion للأنيميشن
- AOS للتحريك مع السكرول
- متجاوب بالكامل (Mobile-first)

### 📱 الأقسام
1. **Hero Section** - عنوان رئيسي جذاب مع CTA
2. **Problem & Solution** - عرض فجوة الخبرة والحل
3. **Tech Stack & Ecosystem** - عرض التقنيات والأدوات
4. **Eligibility Requirements** - شروط الالتحاق
5. **Student Journey** - رحلة الطالب في 5 مراحل
6. **Success Stories** - قصص نجاح الخريجين
7. **Success Partners** - شركاء النجاح
8. **Final CTA** - نموذج تسجيل للقائمة الانتظارية

## التقنيات المستخدمة

- **React 18** - واجهة المستخدم
- **Tailwind CSS** - تصميم وتنسيق
- **Framer Motion** - أنيميشن وانتقالات
- **AOS (Animate On Scroll)** - تحريك العناصر مع السكرول
- **Lucide React** - أيقونات حديثة

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
├── App.js              # المكون الرئيسي
├── index.js            # نقطة الدخول
└── index.css           # التنسيقات العامة
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

### الأنيميشن
يمكن تخصيص الأنيميشن من `src/index.css` أو باستخدام Framer Motion.

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
