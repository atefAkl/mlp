import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Shield,
  GraduationCap,
  UserCog,
  Building2,
  Upload,
  X,
  Copy,
  BookOpen,
  ChevronDown,
  Clock,
  Calendar,
  Info,
  PhoneCall,
} from "lucide-react";
import { trackEvent } from "../utils/analytics";

// ─── Constants ───────────────────────────────────────────────────────────────

const ROUND_ID = 3;

const TABS = [
  { key: "trainee", Icon: GraduationCap },
  { key: "trainer", Icon: UserCog },
  { key: "company", Icon: Building2 },
];

const STACKS = [
  "Laravel (PHP)",
  "MERN Stack",
  "Next.js",
  "Flutter",
  "React Native",
  "Django (Python)",
  "Spring Boot (Java)",
  "DevOps & Cloud",
];

const POSITIONS = [
  "Senior Software Engineer",
  "Tech Lead",
  "Full-Stack Developer",
  "Mobile Developer",
  "DevOps Engineer",
  "Data Scientist",
  "UI/UX Designer",
  "Product Manager",
];

const COMPANY_FIELDS_LIST = [
  "Technology",
  "Finance & Banking",
  "Healthcare",
  "Education",
  "E-Commerce",
  "Logistics",
  "Media & Entertainment",
  "Government",
  "Consulting",
  "Other",
];

const PACKAGES = ["1 – 10", "11 – 50", "51 – 100", "101 – 250", "251+"];

const COUNTRIES = [
  "Saudi Arabia", "Jordan", "UAE", "Kuwait", "Qatar",
  "Bahrain", "Oman", "Egypt", "Palestine", "Iraq",
  "Yemen", "Lebanon", "Syria", "Morocco", "Tunisia",
  "Algeria", "Libya", "Sudan", "Other",
];

// ─── Interview scheduling data ────────────────────────────────────────────────
// Trainees: 3–4 days per round, multiple time slots each
const TRAINEE_INTERVIEW_DAYS = [
  { key: "sat", ar: "السبت",    en: "Saturday"  },
  { key: "sun", ar: "الأحد",   en: "Sunday"    },
  { key: "mon", ar: "الاثنين", en: "Monday"    },
  { key: "wed", ar: "الأربعاء", en: "Wednesday" },
];

const TRAINEE_TIME_SLOTS = [
  { key: "morning",   ar: "صباحاً (9 – 11)",   en: "Morning (9 – 11 AM)"   },
  { key: "midday",    ar: "ظهراً (12 – 2)",     en: "Midday (12 – 2 PM)"    },
  { key: "afternoon", ar: "عصراً (3 – 5)",      en: "Afternoon (3 – 5 PM)"  },
  { key: "evening",   ar: "مساءً (6 – 8)",      en: "Evening (6 – 8 PM)"    },
];

// Trainers: one day is enough
const TRAINER_INTERVIEW_DAYS = [
  { key: "sat", ar: "السبت",    en: "Saturday"  },
  // { key: "sun", ar: "الأحد",   en: "Sunday"    },
  // { key: "mon", ar: "الاثنين", en: "Monday"    },
  // { key: "tue", ar: "الثلاثاء", en: "Tuesday"  },
  // { key: "wed", ar: "الأربعاء", en: "Wednesday" },
  // { key: "thu", ar: "الخميس",  en: "Thursday"  },
];

const TRAINER_TIME_SLOTS = [
  { key: "morning",   ar: "صباحاً (9 – 11)",   en: "Morning (9 – 11 AM)"   },
  { key: "afternoon", ar: "عصراً (3 – 5)",      en: "Afternoon (3 – 5 PM)"  },
  { key: "evening",   ar: "مساءً (6 – 8)",      en: "Evening (6 – 8 PM)"    },
];

// ─── i18n content ─────────────────────────────────────────────────────────────

const CONTENT = {
  ar: {
    sectionTitle: "سجّل اشتراكك",
    sectionSubtitle: "اختر نوع اشتراكك وأكمل بياناتك للانضمام إلى برنامج موثق",
    tabs: { trainee: "متدرب", trainer: "مدرّب", company: "شركة" },
    general: {
      email: "البريد الإلكتروني",
      name: "الاسم الكامل",
      country: "الدولة",
      acceptConditions: "أوافق على الشروط والأحكام وسياسة الخصوصية",
      conditionsRequired: "يجب الموافقة على الشروط للمتابعة",
    },
    trainee: {
      stack: "التقنية / المسار",
      cv: "السيرة الذاتية (اختياري)",
      interviewDay: "أيام المقابلة المتاحة",
      interviewTime: "الأوقات المفضلة",
      interviewNote: "اختر ما يناسبك من الأيام الأربعة المتاحة للدفعة الحالية",
      cvHint: "PDF أو MD — اختياري",
      dayRequired: "اختر يوماً واحداً على الأقل",
      timeRequired: "اختر وقتاً واحداً على الأقل",
    },
    trainer: {
      position: "المسمى الوظيفي",
      cv: "السيرة الذاتية",
      interviewDay: "اليوم المناسب للمقابلة",
      interviewTime: "الوقت المفضل",
      interviewNote: "اختر يوماً واحداً فقط يناسبك للمقابلة",
      cvHint: "PDF أو MD — إلزامي",
      dayRequired: "اختر يوم المقابلة",
      timeRequired: "اختر وقت المقابلة",
    },
    company: {
      brand: "الاسم التجاري / العلامة التجارية",
      field: "المجال",
      package: "الباقة (عدد المتدربين)",
      crNumber: "رقم السجل التجاري",
      cr: "صورة السجل التجاري (اختياري)",
      crHint: "PDF أو MD — اختياري",
      extraInfo: "معلومات إضافية",
      extraInfoPlaceholder: "أي تفاصيل أخرى تودّ إضافتها…",
      contactNote: "سيتواصل معك فريقنا مباشرةً لترتيب موعد المقابلة..",
    },
    submit: "إرسال الطلب",
    submitting: "جارٍ الإرسال…",
    errors: {
      required: "هذا الحقل مطلوب",
      emailInvalid: "البريد الإلكتروني غير صحيح",
      fullNameShort: "الرجاء إدخال الاسم الكامل (اسمان على الأقل)",
      fileType: "الملف يجب أن يكون PDF أو MD",
    },
    success: {
      title: "تم إرسال طلبك بنجاح! ",
      body: "سيصلك بريد تأكيد على عنوانك الإلكتروني خلال دقائق.",
      idLabel: "رقم الطلب",
      hint: "احتفظ برقم طلبك — ستحتاجه للمتابعة لاحقاً.",
      copyBtn: "نسخ",
      copied: "تم النسخ!",
    },
    fileUpload: "اسحب الملف هنا أو انقر للتحميل",
    selectPlaceholder: "اختر…",
    badges: [
      "استجابة خلال 48 ساعة",
      "دعم مخصص لكل فئة",
      "سرية تامة للمعلومات",
    ],
  },
  en: {
    sectionTitle: "Register Your Subscription",
    sectionSubtitle: "Choose your subscription type and complete your details to join the Mawthiq program",
    tabs: { trainee: "Trainee", trainer: "Trainer", company: "Company" },
    general: {
      email: "Email Address",
      name: "Full Name",
      country: "Country",
      acceptConditions: "I agree to the Terms & Conditions and Privacy Policy",
      conditionsRequired: "You must accept the terms to continue",
    },
    trainee: {
      stack: "Tech Stack / Track",
      cv: "CV / Resume (Optional)",
      interviewDay: "Available Interview Days",
      interviewTime: "Preferred Time Slots",
      interviewNote: "Select from the 4 available days for the current round",
      cvHint: "PDF or MD — optional",
      dayRequired: "Select at least one day",
      timeRequired: "Select at least one time slot",
    },
    trainer: {
      position: "Job Position",
      cv: "CV / Resume",
      interviewDay: "Preferred Interview Day",
      interviewTime: "Preferred Time",
      interviewNote: "Select one day that works best for you",
      cvHint: "PDF or MD — required",
      dayRequired: "Please select your interview day",
      timeRequired: "Please select your preferred time",
    },
    company: {
      brand: "Brand / Trademark",
      field: "Industry Field",
      package: "Package (No. of Trainees)",
      crNumber: "Commercial Registration No.",
      cr: "CR Document (Optional)",
      crHint: "PDF or MD — optional",
      extraInfo: "Extra Information",
      extraInfoPlaceholder: "Any additional details you'd like to share…",
      contactNote: "Our team will reach out directly to schedule your interview. If you're currently busy, we'll suggest an alternative time that works for you.",
    },
    submit: "Submit Application",
    submitting: "Submitting…",
    errors: {
      required: "This field is required",
      emailInvalid: "Invalid email address",
      fullNameShort: "Please enter your full name (at least 2 words)",
      fileType: "File must be PDF or MD",
    },
    success: {
      title: "Application Submitted Successfully! 🎉",
      body: "A confirmation email has been sent to your address within minutes.",
      idLabel: "Application ID",
      hint: "Keep your application ID — you'll need it for follow-ups.",
      copyBtn: "Copy",
      copied: "Copied!",
    },
    fileUpload: "Drag & drop or click to upload",
    selectPlaceholder: "Select…",
    badges: [
      "Response within 48 hours",
      "Dedicated support per type",
      "Full information privacy",
    ],
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function generateId() {
  return "MWT-" + Date.now().toString(36).toUpperCase() + "-" + Math.random().toString(36).slice(2, 6).toUpperCase();
}

function isValidFile(file) {
  if (!file) return true;
  const name = file.name.toLowerCase();
  return name.endsWith(".pdf") || name.endsWith(".md");
}

// ─── Shared sub-components ────────────────────────────────────────────────────

const inputBase =
  "w-full bg-white/10 border border-white/25 rounded-xl px-3 py-2.5 text-white text-sm placeholder-white/40 " +
  "focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 transition-all duration-200";

const labelBase = "block text-xs font-semibold text-white/80 mb-1";

const FieldError = ({ msg }) =>
  msg ? <p role="alert" className="mt-1 text-xs text-red-400 font-medium">{msg}</p> : null;

// ── CustomSelect ──────────────────────────────────────────────────────────────
const CustomSelect = ({ id, label, value, options, onChange, placeholder, required }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const displayLabel = options.find((o) => (typeof o === "object" ? o.value === value : o === value));
  const display = displayLabel
    ? typeof displayLabel === "object" ? displayLabel.label : displayLabel
    : placeholder;

  return (
    <div className="relative" ref={ref}>
      {label && (
        <label htmlFor={id} className={labelBase}>
          {label}{required && <span className="text-red-400 ms-0.5">*</span>}
        </label>
      )}
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className={`${inputBase} flex items-center justify-between text-start`}
      >
        <span className={!value ? "text-white/40" : ""}>{display}</span>
        <ChevronDown className={`w-4 h-4 text-white/40 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            role="listbox"
            className="absolute z-[200] mt-1.5 w-full max-h-56 overflow-auto rounded-xl
              bg-[#1a2f4e] border border-white/10 shadow-2xl p-1.5"
          >
            {options.map((opt) => {
              const val = typeof opt === "object" ? opt.value : opt;
              const lbl = typeof opt === "object" ? opt.label : opt;
              const active = value === val;
              return (
                <li key={val} role="option" aria-selected={active}>
                  <button
                    type="button"
                    onClick={() => { onChange(val); setOpen(false); }}
                    className={`w-full text-start px-3 py-2 rounded-lg text-sm transition-all
                      ${active
                        ? "bg-emerald-500/20 text-emerald-300 font-bold"
                        : "text-white/70 hover:bg-white/5 hover:text-white"}`}
                  >
                    {lbl}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── FileUpload ────────────────────────────────────────────────────────────────
const FileUpload = ({ id, label, hint, value, onChange, error, required }) => {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (file) => { if (file) onChange(file); };

  return (
    <div>
      {label && (
        <label htmlFor={id} className={labelBase}>
          {label}{required && <span className="text-red-400 ms-0.5">*</span>}
        </label>
      )}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
        className={`relative flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer
          transition-all duration-200
          ${dragging ? "border-emerald-400 bg-emerald-500/10" : "border-white/25 bg-white/10 hover:border-emerald-400/60"}
          ${error ? "border-red-400/60" : ""}`}
      >
        <Upload className="w-4 h-4 text-white/40 shrink-0" />
        <div className="flex-1 min-w-0">
          {value ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-emerald-300 font-medium truncate">{value.name}</span>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onChange(null); }}
                className="text-white/40 hover:text-red-400 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <span className="text-sm text-white/40">{hint}</span>
          )}
        </div>
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept=".pdf,.md"
          className="sr-only"
          onChange={(e) => handleFile(e.target.files[0])}
        />
      </div>
      <FieldError msg={error} />
    </div>
  );
};

// ── InterviewScheduler ────────────────────────────────────────────────────────
// Handles the two-field (Day + Time) interview scheduling UI
// multiDay = true for trainees (pick many days), false for trainers (pick one day)
const InterviewScheduler = ({
  lang,
  dayLabel,
  timeLabel,
  note,
  days,
  times,
  selectedDays,
  selectedTimes,
  onDaysChange,
  onTimesChange,
  multiDay = true,
  dayError,
  timeError,
}) => {
  const isRtl = lang === "ar";

  const toggleDay = (key) => {
    if (multiDay) {
      onDaysChange(
        selectedDays.includes(key)
          ? selectedDays.filter((k) => k !== key)
          : [...selectedDays, key]
      );
    } else {
      // single-select for trainer
      onDaysChange(selectedDays.includes(key) ? [] : [key]);
    }
  };

  const toggleTime = (key) => {
    onTimesChange(
      selectedTimes.includes(key)
        ? selectedTimes.filter((k) => k !== key)
        : [...selectedTimes, key]
    );
  };

  const chipBase =
    "flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold cursor-pointer select-none transition-all duration-200";
  const chipActive = "bg-emerald-500/30 border-emerald-400 text-emerald-200";
  const chipInactive = "bg-white/5 border-white/20 text-white/60 hover:border-emerald-400/50 hover:text-white/80";

  return (
    <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-4">
      {/* Note banner */}
      {note && (
        <div className="flex items-start gap-2 text-xs text-amber-300/80 bg-amber-400/10 border border-amber-400/20 rounded-xl px-3 py-2">
          <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <span>{note}</span>
        </div>
      )}

      {/* Day picker */}
      <div>
        <p className={labelBase}>
          <Calendar className="inline w-3.5 h-3.5 me-1 text-emerald-400" />
          {dayLabel} <span className="text-red-400">*</span>
        </p>
        <div className="flex flex-wrap gap-2 mt-1">
          {days.map(({ key, ar, en }) => {
            const checked = selectedDays.includes(key);
            return (
              <label key={key} className={`${chipBase} ${checked ? chipActive : chipInactive}`}>
                <input
                  type={multiDay ? "checkbox" : "radio"}
                  name="interview_day"
                  className="sr-only"
                  checked={checked}
                  onChange={() => toggleDay(key)}
                />
                {isRtl ? ar : en}
              </label>
            );
          })}
        </div>
        <FieldError msg={dayError} />
      </div>

      {/* Time picker — only shown when at least one day is selected */}
      <AnimatePresence>
        {selectedDays.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <p className={labelBase}>
              <Clock className="inline w-3.5 h-3.5 me-1 text-emerald-400" />
              {timeLabel} <span className="text-red-400">*</span>
            </p>
            <div className="flex flex-wrap gap-2 mt-1">
              {times.map(({ key, ar, en }) => {
                const checked = selectedTimes.includes(key);
                return (
                  <label key={key} className={`${chipBase} ${checked ? chipActive : chipInactive}`}>
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={checked}
                      onChange={() => toggleTime(key)}
                    />
                    {isRtl ? ar : en}
                  </label>
                );
              })}
            </div>
            <FieldError msg={timeError} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── CompanyContactNotice ──────────────────────────────────────────────────────
// Companies don't pick slots — we reach out to them
const CompanyContactNotice = ({ lang, note }) => (
  <div className="flex items-start gap-3 rounded-2xl border border-blue-400/25 bg-blue-500/10 px-4 py-4">
    <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-400/30 flex items-center justify-center shrink-0 mt-0.5">
      <PhoneCall className="w-4 h-4 text-blue-300" />
    </div>
    <p className="text-sm text-blue-200/80 leading-relaxed">{note}</p>
  </div>
);

// ─── Success / Confirmation Page ──────────────────────────────────────────────
const SuccessPage = ({ lang, applicationId, name, email, tab }) => {
  const c = CONTENT[lang].success;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(applicationId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-[60vh] flex items-center justify-center px-4 py-20"
    >
      <div className="max-w-lg w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-emerald-300" />
        </div>
        <h2 className="text-2xl font-extrabold text-white">{c.title}</h2>
        <p className="text-white/70 text-sm leading-relaxed">{c.body}</p>

        <div className="bg-white/5 border border-white/15 rounded-2xl p-5 space-y-3">
          <p className="text-xs text-white/50 uppercase tracking-widest font-semibold">{c.idLabel}</p>
          <div className="flex items-center justify-center gap-3">
            <span className="text-2xl font-black text-emerald-300 tracking-wider font-mono">
              {applicationId}
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-emerald-500/20 border border-white/20 hover:border-emerald-400 text-xs text-white/70 hover:text-emerald-300 transition-all"
            >
              <Copy className="w-3 h-3" />
              {copied ? c.copied : c.copyBtn}
            </button>
          </div>

          <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-start">
            {[
              { label: lang === "ar" ? "الاسم" : "Name", value: name },
              { label: lang === "ar" ? "البريد" : "Email", value: email },
              { label: lang === "ar" ? "النوع" : "Type", value: CONTENT[lang].tabs[tab] },
            ].map(({ label, value }) => (
              <div key={label} className="col-span-1">
                <p className="text-[10px] text-white/40 font-semibold uppercase">{label}</p>
                <p className="text-xs text-white/80 font-medium truncate">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-start gap-2.5 bg-amber-500/10 border border-amber-400/30 rounded-xl px-4 py-3 text-start">
          <BookOpen className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
          <p className="text-xs text-amber-200/80 leading-relaxed">{c.hint}</p>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const SubscriptionSection = ({ lang = "ar" }) => {
  const c = CONTENT[lang];
  const isRtl = lang === "ar";

  const [activeTab, setActiveTab] = useState("trainee");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [appId, setAppId] = useState("");

  // ── General fields ──────────────────────────────────────────────
  const [general, setGeneral] = useState({
    email: "", name: "", country: "", acceptConditions: false,
  });

  // ── Trainee fields ──────────────────────────────────────────────
  const [trainee, setTrainee] = useState({
    stack: "",
    cv: null,
    interviewDays: [],   // multi-select (3–4 days available)
    interviewTimes: [],  // multi-select
  });

  // ── Trainer fields ──────────────────────────────────────────────
  const [trainer, setTrainer] = useState({
    position: "",
    cv: null,
    interviewDays: [],   // single-select (one day)
    interviewTimes: [],  // multi-select
  });

  // ── Company fields ──────────────────────────────────────────────
  // No interview scheduling — team contacts them directly
  const [company, setCompany] = useState({
    brand: "", field: "", package: "", crNumber: "", cr: null, extraInfo: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const sectionRef = useRef(null);

  // ── Validate ─────────────────────────────────────────────────────
  const validate = useCallback(() => {
    const errs = {};

    if (!general.name.trim()) errs.name = c.errors.required;
    else if (general.name.trim().split(/\s+/).length < 2) errs.name = c.errors.fullNameShort;

    if (!general.email.trim()) errs.email = c.errors.required;
    else if (!EMAIL_RE.test(general.email)) errs.email = c.errors.emailInvalid;

    if (!general.country) errs.country = c.errors.required;
    if (!general.acceptConditions) errs.acceptConditions = c.general.conditionsRequired;

    if (activeTab === "trainee") {
      if (!trainee.stack) errs.stack = c.errors.required;
      if (!trainee.interviewDays.length) errs.interviewDays = c.trainee.dayRequired;
      if (trainee.interviewDays.length && !trainee.interviewTimes.length)
        errs.interviewTimes = c.trainee.timeRequired;
      if (trainee.cv && !isValidFile(trainee.cv)) errs.cvTrainee = c.errors.fileType;
    }

    if (activeTab === "trainer") {
      if (!trainer.position) errs.position = c.errors.required;
      if (!trainer.interviewDays.length) errs.interviewDays = c.trainer.dayRequired;
      if (trainer.interviewDays.length && !trainer.interviewTimes.length)
        errs.interviewTimes = c.trainer.timeRequired;
      if (!trainer.cv) errs.cvTrainer = c.errors.required;
      else if (!isValidFile(trainer.cv)) errs.cvTrainer = c.errors.fileType;
    }

    if (activeTab === "company") {
      if (!company.brand.trim()) errs.brand = c.errors.required;
      if (!company.field) errs.field = c.errors.required;
      if (!company.package) errs.package = c.errors.required;
      if (!company.crNumber.trim()) errs.crNumber = c.errors.required;
      if (company.cr && !isValidFile(company.cr)) errs.cr = c.errors.fileType;
    }

    return errs;
  }, [general, trainee, trainer, company, activeTab, c]);

  // ── Submit ────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    setTouched({
      name: true, email: true, country: true, acceptConditions: true,
      stack: true, interviewDays: true, interviewTimes: true,
      position: true, cvTrainer: true,
      brand: true, field: true, package: true, crNumber: true,
    });

    if (Object.keys(errs).length > 0) {
      trackEvent("subscription_form_error", { tab: activeTab, errors: Object.keys(errs) });
      return;
    }

    const id = generateId();
    setLoading(true);

    const interviewPayload =
      activeTab === "trainee"
        ? { days: trainee.interviewDays, times: trainee.interviewTimes }
        : activeTab === "trainer"
        ? { day: trainer.interviewDays[0] || null, times: trainer.interviewTimes }
        : { note: "team_will_contact" };

    const payload = {
      applicationId: id,
      type: activeTab,
      roundId: ROUND_ID,
      general,
      interview: interviewPayload,
      specific:
        activeTab === "trainee" ? { stack: trainee.stack, cv: trainee.cv?.name }
        : activeTab === "trainer" ? { position: trainer.position, cv: trainer.cv?.name }
        : company,
    };

    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (_) {
      // simulate success for UX
    } finally {
      trackEvent("subscription_form_submit", { tab: activeTab, success: true });
      setAppId(id);
      setLoading(false);
      setSubmitted(true);
    }
  };

  // ─── Render submitted state ──────────────────────────────────────
  if (submitted) {
    return (
      <section
        className="py-10 px-4 bg-gradient-to-br from-deep-blue to-emerald text-white"
        dir={isRtl ? "rtl" : "ltr"}
      >
        <SuccessPage lang={lang} applicationId={appId} name={general.name} email={general.email} tab={activeTab} />
      </section>
    );
  }

  // ─── Main render ─────────────────────────────────────────────────
  return (
    <section
      ref={sectionRef}
      id="subscribe"
      dir={isRtl ? "rtl" : "ltr"}
      className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-deep-blue to-emerald text-white"
      aria-label={c.sectionTitle}
    >
      <div className="max-w-3xl mx-auto">

        {/* ── Header ── */}
        <div className="text-center mb-10" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-3 drop-shadow-sm">{c.sectionTitle}</h2>
          <p className="text-white/65 text-base max-w-xl mx-auto leading-relaxed">{c.sectionSubtitle}</p>
        </div>

        {/* ── Card ── */}
        <motion.div
          data-aos="fade-up"
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 md:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.15)]"
        >
          {/* ── Tabs ── */}
          <div
            role="tablist"
            aria-label={c.sectionTitle}
            className="flex gap-2 mb-6 bg-white/5 rounded-2xl p-1.5"
          >
            {TABS.map(({ key, Icon }) => {
              const active = activeTab === key;
              return (
                <button
                  key={key}
                  role="tab"
                  aria-selected={active}
                  type="button"
                  onClick={() => {
                    setActiveTab(key);
                    setErrors({});
                    setTouched({});
                    trackEvent("subscription_tab_change", { tab: key });
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-bold
                    transition-all duration-250
                    ${active
                      ? "bg-emerald-500/30 border border-emerald-400 text-white shadow-md"
                      : "text-white/50 hover:text-white/80 hover:bg-white/5 border border-transparent"}`}
                >
                  <Icon className={`w-4 h-4 ${active ? "text-emerald-300" : "text-white/40"}`} strokeWidth={1.8} />
                  {c.tabs[key]}
                </button>
              );
            })}
          </div>

          {/* ── Form ── */}
          <AnimatePresence mode="wait">
            <motion.form
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSubmit}
              noValidate
              className="space-y-4"
            >
              {/* Hidden honeypot */}
              <input
                type="text"
                name="_hp"
                style={{ position: "absolute", opacity: 0, height: 0, pointerEvents: "none" }}
                tabIndex={-1}
                aria-hidden="true"
                autoComplete="off"
              />
              <input type="hidden" name="round_id" value={ROUND_ID} />

              {/* ── General Fields ── */}
              <div className="grid sm:grid-cols-2 gap-3">
                {/* Name */}
                <div>
                  <label htmlFor="sub_name" className={labelBase}>
                    {c.general.name} <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="sub_name"
                    type="text"
                    autoComplete="name"
                    className={`${inputBase} ${errors.name ? "border-red-400/70" : ""}`}
                    placeholder={c.general.name}
                    value={general.name}
                    onChange={(e) => setGeneral((g) => ({ ...g, name: e.target.value }))}
                    onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                    aria-invalid={!!errors.name}
                  />
                  <FieldError msg={touched.name && errors.name} />
                </div>
                {/* Email */}
                <div>
                  <label htmlFor="sub_email" className={labelBase}>
                    {c.general.email} <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="sub_email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    className={`${inputBase} ${errors.email ? "border-red-400/70" : ""}`}
                    placeholder={c.general.email}
                    value={general.email}
                    onChange={(e) => setGeneral((g) => ({ ...g, email: e.target.value }))}
                    onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                    aria-invalid={!!errors.email}
                  />
                  <FieldError msg={touched.email && errors.email} />
                </div>
              </div>

              {/* Country */}
              <CustomSelect
                id="sub_country"
                label={c.general.country}
                value={general.country}
                options={COUNTRIES}
                onChange={(val) => setGeneral((g) => ({ ...g, country: val }))}
                placeholder={c.selectPlaceholder}
                required
              />
              <FieldError msg={touched.country && errors.country} />

              {/* ── Tab-specific fields ── */}

              {/* TRAINEE */}
              {activeTab === "trainee" && (
                <div className="space-y-4">
                  <CustomSelect
                    id="sub_stack"
                    label={c.trainee.stack}
                    value={trainee.stack}
                    options={STACKS}
                    onChange={(val) => setTrainee((t) => ({ ...t, stack: val }))}
                    placeholder={c.selectPlaceholder}
                    required
                  />
                  <FieldError msg={touched.stack && errors.stack} />

                  {/* Interview scheduler — multi-day (3–4 days available per round) */}
                  <InterviewScheduler
                    lang={lang}
                    dayLabel={c.trainee.interviewDay}
                    timeLabel={c.trainee.interviewTime}
                    note={c.trainee.interviewNote}
                    days={TRAINEE_INTERVIEW_DAYS}
                    times={TRAINEE_TIME_SLOTS}
                    selectedDays={trainee.interviewDays}
                    selectedTimes={trainee.interviewTimes}
                    onDaysChange={(val) => setTrainee((t) => ({ ...t, interviewDays: val, interviewTimes: [] }))}
                    onTimesChange={(val) => setTrainee((t) => ({ ...t, interviewTimes: val }))}
                    multiDay={true}
                    dayError={touched.interviewDays && errors.interviewDays}
                    timeError={touched.interviewTimes && errors.interviewTimes}
                  />

                  <FileUpload
                    id="sub_cv_trainee"
                    label={c.trainee.cv}
                    hint={c.trainee.cvHint}
                    value={trainee.cv}
                    onChange={(f) => setTrainee((t) => ({ ...t, cv: f }))}
                    error={errors.cvTrainee}
                  />
                </div>
              )}

              {/* TRAINER */}
              {activeTab === "trainer" && (
                <div className="space-y-4">
                  <CustomSelect
                    id="sub_position"
                    label={c.trainer.position}
                    value={trainer.position}
                    options={POSITIONS}
                    onChange={(val) => setTrainer((t) => ({ ...t, position: val }))}
                    placeholder={c.selectPlaceholder}
                    required
                  />
                  <FieldError msg={touched.position && errors.position} />

                  {/* Interview scheduler — single day only */}
                  <InterviewScheduler
                    lang={lang}
                    dayLabel={c.trainer.interviewDay}
                    timeLabel={c.trainer.interviewTime}
                    note={c.trainer.interviewNote}
                    days={TRAINER_INTERVIEW_DAYS}
                    times={TRAINER_TIME_SLOTS}
                    selectedDays={trainer.interviewDays}
                    selectedTimes={trainer.interviewTimes}
                    onDaysChange={(val) => setTrainer((t) => ({ ...t, interviewDays: val, interviewTimes: [] }))}
                    onTimesChange={(val) => setTrainer((t) => ({ ...t, interviewTimes: val }))}
                    multiDay={false}
                    dayError={touched.interviewDays && errors.interviewDays}
                    timeError={touched.interviewTimes && errors.interviewTimes}
                  />

                  <FileUpload
                    id="sub_cv_trainer"
                    label={c.trainer.cv}
                    hint={c.trainer.cvHint}
                    value={trainer.cv}
                    onChange={(f) => setTrainer((t) => ({ ...t, cv: f }))}
                    error={touched.cvTrainer && errors.cvTrainer}
                    required
                  />
                </div>
              )}

              {/* COMPANY */}
              {activeTab === "company" && (
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-3">
                    {/* Brand */}
                    <div>
                      <label htmlFor="sub_brand" className={labelBase}>
                        {c.company.brand} <span className="text-red-400">*</span>
                      </label>
                      <input
                        id="sub_brand"
                        type="text"
                        className={`${inputBase} ${touched.brand && errors.brand ? "border-red-400/70" : ""}`}
                        placeholder={c.company.brand}
                        value={company.brand}
                        onChange={(e) => setCompany((co) => ({ ...co, brand: e.target.value }))}
                        onBlur={() => setTouched((t) => ({ ...t, brand: true }))}
                      />
                      <FieldError msg={touched.brand && errors.brand} />
                    </div>
                    {/* CR Number */}
                    <div>
                      <label htmlFor="sub_cr_num" className={labelBase}>
                        {c.company.crNumber} <span className="text-red-400">*</span>
                      </label>
                      <input
                        id="sub_cr_num"
                        type="text"
                        className={`${inputBase} ${touched.crNumber && errors.crNumber ? "border-red-400/70" : ""}`}
                        placeholder={c.company.crNumber}
                        value={company.crNumber}
                        onChange={(e) => setCompany((co) => ({ ...co, crNumber: e.target.value }))}
                        onBlur={() => setTouched((t) => ({ ...t, crNumber: true }))}
                      />
                      <FieldError msg={touched.crNumber && errors.crNumber} />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <CustomSelect
                        id="sub_field"
                        label={c.company.field}
                        value={company.field}
                        options={COMPANY_FIELDS_LIST}
                        onChange={(val) => setCompany((co) => ({ ...co, field: val }))}
                        placeholder={c.selectPlaceholder}
                        required
                      />
                      <FieldError msg={touched.field && errors.field} />
                    </div>
                    <div>
                      <CustomSelect
                        id="sub_package"
                        label={c.company.package}
                        value={company.package}
                        options={PACKAGES}
                        onChange={(val) => setCompany((co) => ({ ...co, package: val }))}
                        placeholder={c.selectPlaceholder}
                        required
                      />
                      <FieldError msg={touched.package && errors.package} />
                    </div>
                  </div>

                  <FileUpload
                    id="sub_cr"
                    label={c.company.cr}
                    hint={c.company.crHint}
                    value={company.cr}
                    onChange={(f) => setCompany((co) => ({ ...co, cr: f }))}
                    error={errors.cr}
                  />

                  {/* Extra Info */}
                  <div>
                    <label htmlFor="sub_extra" className={labelBase}>{c.company.extraInfo}</label>
                    <textarea
                      id="sub_extra"
                      rows={4}
                      maxLength={3000}
                      className={`${inputBase} resize-none`}
                      placeholder={c.company.extraInfoPlaceholder}
                      value={company.extraInfo}
                      onChange={(e) => setCompany((co) => ({ ...co, extraInfo: e.target.value }))}
                    />
                    <span className="text-[10px] text-white/30">{company.extraInfo.length}/3000</span>
                  </div>

                  {/* Contact notice — replaces interview scheduler for companies */}
                  <CompanyContactNotice lang={lang} note={c.company.contactNote} />
                </div>
              )}

              {/* ── Accept Conditions ── */}
              <label className="flex items-start gap-2.5 cursor-pointer group mt-2">
                <input
                  type="checkbox"
                  className="mt-0.5 w-4 h-4 rounded border-white/30 accent-emerald-400 shrink-0"
                  checked={general.acceptConditions}
                  onChange={(e) => {
                    setGeneral((g) => ({ ...g, acceptConditions: e.target.checked }));
                    setTouched((t) => ({ ...t, acceptConditions: true }));
                  }}
                />
                <span className="text-xs text-white/65 group-hover:text-white/85 transition-colors leading-relaxed">
                  {c.general.acceptConditions} <span className="text-red-400">*</span>
                </span>
              </label>
              <FieldError msg={touched.acceptConditions && errors.acceptConditions} />

              {/* Trust badges */}
              <div className="flex flex-wrap gap-x-5 gap-y-1.5 pt-1 border-t border-white/10">
                {[Shield, BookOpen, Clock].map((Icon, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <Icon className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[11px] text-white/50">{c.badges[i]}</span>
                  </div>
                ))}
              </div>

              {/* ── Submit ── */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300
                  ${loading
                    ? "bg-white/20 text-white/50 cursor-not-allowed"
                    : "bg-white text-deep-blue hover:bg-emerald-50 shadow-lg hover:shadow-xl hover:-translate-y-0.5 focus:ring-2 focus:ring-white/50"}`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    {c.submitting}
                  </>
                ) : c.submit}
              </button>
            </motion.form>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default SubscriptionSection;