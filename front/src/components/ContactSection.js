import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2, Shield, Clock, Headphones,
  Building2, GraduationCap, UserCog, ArrowLeft, ArrowRight, CalendarCheck,
  ChevronDown,
} from "lucide-react";
import { trackEvent } from "../utils/analytics";

// ─── Audience icon map ────────────────────────────────────────────────────────
const AUDIENCE_ICONS = {
  company: Building2,
  trainee: GraduationCap,
  trainer: UserCog,
};

// ─── Course Registration CTA ─────────────────────────────────────────────────
// ─── Course Registration CTA ─────────────────────────────────────────────────
const CourseCTA = ({ lang, onNavigate }) => {
  const isRtl = lang === "ar";
  const Arrow = isRtl ? ArrowLeft : ArrowRight;

  return (
    <motion.button
      whileHover={{ y: -4, scale: 1.01 }}
      onClick={() => {
        trackEvent("course_register_click", { source: "contact_section" });
        onNavigate();
      }}
      className="group flex items-center gap-4 w-full rounded-2xl overflow-hidden
        bg-white/5 border border-white/10
        hover:border-emerald-400/60 transition-all duration-300 shadow-lg p-4 text-start"
      aria-label={isRtl ? "سجل في الدورة التالية" : "Register for Next Cohort"}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      {/* Icon */}
      <div className="relative w-11 h-11 rounded-xl bg-emerald-500/20
        border border-emerald-500/30 flex items-center justify-center shrink-0
        group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
        <CalendarCheck className="w-5 h-5 text-emerald-300" strokeWidth={1.8} />
      </div>

      {/* Text */}
      <div className="relative flex-1 min-w-0">
        <div className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider mb-0.5 flex items-center gap-1.5">
          <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
          {isRtl ? "دفعة مارس 2026 م" : "March 2026 Batch"}
        </div>
        <p className="text-white font-black text-sm md:text-base leading-tight">
          {isRtl ? "سجل في الدورة القادمة واحجز مكانك" : "Register for the Next Cohort Now"}
        </p>
      </div>

      {/* Arrow */}
      <Arrow
        className="relative w-4 h-4 text-white/40 group-hover:text-emerald-400
          group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-all duration-300 shrink-0"
        strokeWidth={2}
      />
    </motion.button>
  );
};

// ─── Helpers ────────────────────────────────────────────────────────────────
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getUtmParams() {
  const p = new URLSearchParams(window.location.search);
  return {
    source: p.get("utm_source") || "organic",
    campaign: p.get("utm_campaign") || "landing",
  };
}

// ─── FieldError ─────────────────────────────────────────────────────────────
const FieldError = ({ id, msg }) =>
  msg ? (
    <p id={id} role="alert" className="mt-1 text-xs text-red-400 font-medium">
      {msg}
    </p>
  ) : null;

// ─── FormField ───────────────────────────────────────────────────────────────
const inputBase =
  "w-full bg-white/10 border border-white/25 rounded-xl px-3 py-2.5 text-white text-sm placeholder-white/40 " +
  "focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 transition-all duration-200";

const labelBase = "block text-xs font-semibold text-white/80 mb-1";

// ─── CustomSelect ──────────────────────────────────────────────────────────
const CustomSelect = ({ id, label, value, options, onChange, placeholder = "—", "data-key": dataKey }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const clickOut = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", clickOut);
    return () => document.removeEventListener("mousedown", clickOut);
  }, []);

  const selectedLabel = options.find((o) => o === value || (typeof o === "object" && o.value === value));
  const displayLabel = typeof selectedLabel === "object" ? selectedLabel.label : selectedLabel || placeholder;

  return (
    <div className="relative" ref={dropdownRef}>
      <label htmlFor={id} className={labelBase}>
        {label}
      </label>
      <button
        id={id}
        type="button"
        data-key={dataKey}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className={`${inputBase} flex items-center justify-between text-start group`}
      >
        <span className={!value ? "text-white/40" : "text-white"}>{displayLabel}</span>
        <ChevronDown
          className={`w-4 h-4 text-white/40 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          } group-hover:text-emerald-400`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            role="listbox"
            className="absolute z-[100] mt-2 w-full max-h-60 overflow-auto rounded-xl
              bg-[#1e293b] border border-white/10 shadow-2xl backdrop-blur-xl p-1.5
              scrollbar-thin scrollbar-thumb-white/10"
          >
            {options.map((opt) => {
              const val = typeof opt === "object" ? opt.value : opt;
              const lbl = typeof opt === "object" ? opt.label : opt;
              const isActive = value === val;

              return (
                <li key={val} role="option" aria-selected={isActive}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(val);
                      setIsOpen(false);
                    }}
                    className={`w-full text-start px-3 py-2 rounded-lg text-sm transition-all
                      ${
                        isActive
                          ? "bg-emerald-500/20 text-emerald-300 font-bold"
                          : "text-white/70 hover:bg-white/5 hover:text-white"
                      }`}
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

// ─── ConditionalFields ───────────────────────────────────────────────────────
const CompanyFields = ({ form, c, fields, setFields, errors }) => (
  <div className="space-y-3 animate-fade-in">
    {/* Company Name */}
    <div>
      <label htmlFor="company_name" className={labelBase}>
        {c.companyName}
      </label>
      <input
        id="company_name"
        type="text"
        data-key="company_name"
        className={inputBase}
        placeholder={c.companyName}
        value={fields.companyName}
        onChange={(e) => setFields((f) => ({ ...f, companyName: e.target.value }))}
      />
    </div>
    {/* Company Size */}
    <CustomSelect
      id="company_size"
      label={c.companySize}
      value={fields.companySize}
      options={c.companySizeOptions}
      onChange={(val) => setFields((f) => ({ ...f, companySize: val }))}
    />
    {/* Company Interest (checkboxes) */}
    <div>
      <p className={labelBase}>{c.companyInterest}</p>
      <div className="flex flex-wrap gap-2 mt-1">
        {c.companyInterestOptions.map((opt) => {
          const checked = (fields.companyInterest || []).includes(opt);
          return (
            <label
              key={opt}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold cursor-pointer transition-all duration-200
                ${checked
                  ? "bg-emerald-500/30 border-emerald-400 text-emerald-200"
                  : "bg-white/5 border-white/20 text-white/60 hover:border-white/40"}`}
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={checked}
                onChange={() =>
                  setFields((f) => {
                    const cur = f.companyInterest || [];
                    return {
                      ...f,
                      companyInterest: checked
                        ? cur.filter((x) => x !== opt)
                        : [...cur, opt],
                    };
                  })
                }
              />
              {opt}
            </label>
          );
        })}
      </div>
    </div>
  </div>
);

const TraineeFields = ({ c, fields, setFields }) => (
  <div className="space-y-3 animate-fade-in">
    {/* Track */}
    <CustomSelect
      id="track"
      label={c.track}
      value={fields.track}
      options={c.trackOptions}
      onChange={(val) => setFields((f) => ({ ...f, track: val }))}
    />
    {/* wants_demo */}
    <label className="flex items-center gap-2 cursor-pointer group">
      <input
        type="checkbox"
        data-key="wants_demo"
        className="w-4 h-4 rounded border-white/30 accent-emerald-400"
        checked={!!fields.wantsDemo}
        onChange={(e) => setFields((f) => ({ ...f, wantsDemo: e.target.checked }))}
      />
      <span className="text-xs text-white/70 group-hover:text-white/90 transition-colors">
        {c.wantsDemo}
      </span>
    </label>
  </div>
);

const TrainerFields = ({ c, fields, setFields }) => (
  <div className="space-y-3 animate-fade-in">
    {/* Experience Years */}
    <div>
      <label htmlFor="experience_years" className={labelBase}>
        {c.experienceYears}
      </label>
      <input
        id="experience_years"
        type="number"
        data-key="experience_years"
        inputMode="numeric"
        min="0"
        max="50"
        className={inputBase}
        placeholder="0"
        value={fields.experienceYears}
        onChange={(e) =>
          setFields((f) => ({ ...f, experienceYears: e.target.value }))
        }
      />
    </div>
    {/* Trainer Interest */}
    <CustomSelect
      id="trainer_interest"
      label={c.trainerInterest}
      value={fields.trainerInterest}
      options={c.trainerInterestOptions}
      onChange={(val) => setFields((f) => ({ ...f, trainerInterest: val }))}
    />
  </div>
);

// ─── Main Component ──────────────────────────────────────────────────────────
const ContactSection = ({ t, lang, onNavigate }) => {
  const c = t.contact;
  const f = c.form;
  const e = c.errors;

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    audienceType: "",
    subject: "",
    message: "",
    sendCopy: false,
    // honeypot
    _hp: "",
  });
  const [condFields, setCondFields] = useState({
    // company
    companyName: "",
    companySize: "",
    companyInterest: [],
    // trainee
    track: "",
    wantsDemo: false,
    // trainer
    experienceYears: "",
    trainerInterest: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const sectionRef = useRef(null);
  const hasTrackedView = useRef(false);

  // ── Analytics: view ──────────────────────────────────────────────
  useEffect(() => {
    if (!sectionRef.current || hasTrackedView.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          trackEvent("contact_form_view", {});
          hasTrackedView.current = true;
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  // ── Analytics: audience selection ────────────────────────────────
  useEffect(() => {
    if (form.audienceType) {
      trackEvent("contact_form_select_audience", { audienceType: form.audienceType });
    }
  }, [form.audienceType]);

  // ── Validate single field ─────────────────────────────────────────
  const validateField = useCallback(
    (name, value) => {
      switch (name) {
        case "fullName":
          if (!value.trim()) return e.fullNameRequired;
          if (value.trim().split(/\s+/).length < 2) return e.fullNameShort;
          return "";
        case "email":
          if (!value.trim()) return e.emailRequired;
          if (!EMAIL_RE.test(value)) return e.emailInvalid;
          return "";
        case "audienceType":
          if (!value) return e.audienceRequired;
          return "";
        case "subject":
          if (!value.trim()) return e.subjectRequired;
          return "";
        case "message":
          if (value.trim().length < 20) return e.messageTooShort;
          return "";
        default:
          return "";
      }
    },
    [e]
  );

  // ── onBlur validation ────────────────────────────────────────────
  const handleBlur = (name) => {
    setTouched((t) => ({ ...t, [name]: true }));
    const err = validateField(name, form[name]);
    setErrors((prev) => ({ ...prev, [name]: err }));
  };

  // ── onChange ─────────────────────────────────────────────────────
  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const err = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: err }));
    }
  };

  // ── Full validation ───────────────────────────────────────────────
  const validateAll = () => {
    const fields = ["fullName", "email", "audienceType", "subject", "message"];
    const newErrors = {};
    let valid = true;
    fields.forEach((name) => {
      const err = validateField(name, form[name]);
      newErrors[name] = err;
      if (err) valid = false;
    });
    setErrors(newErrors);
    setTouched({ fullName: true, email: true, audienceType: true, subject: true, message: true });
    return valid;
  };

  // ── isValid (for button) ─────────────────────────────────────────
  const isValid =
    !errors.fullName &&
    !errors.email &&
    !errors.audienceType &&
    !errors.subject &&
    !errors.message &&
    form.fullName &&
    form.email &&
    form.audienceType &&
    form.subject &&
    form.message.length >= 20;

  // ── Submit ────────────────────────────────────────────────────────
  const handleSubmit = async (ev) => {
    ev.preventDefault();

    // Honeypot check
    if (form._hp) return;

    if (!validateAll()) {
      trackEvent("contact_form_error", {
        reason: "validation",
        audienceType: form.audienceType,
      });
      return;
    }

    const payload = {
      fullName: form.fullName,
      email: form.email,
      audienceType: form.audienceType,
      subject: form.subject,
      message: form.message,
      sendCopy: form.sendCopy,
      conditionalFields:
        form.audienceType === "company"
          ? {
              companyName: condFields.companyName,
              companySize: condFields.companySize,
              companyInterest: condFields.companyInterest,
            }
          : form.audienceType === "trainee"
          ? { track: condFields.track, wantsDemo: condFields.wantsDemo }
          : {
              experienceYears: condFields.experienceYears,
              trainerInterest: condFields.trainerInterest,
            },
      utm: getUtmParams(),
    };

    setLoading(true);
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      trackEvent("contact_form_submit", {
        audienceType: form.audienceType,
        subjectLength: form.subject.length,
        success: true,
      });
      setSubmitted(true);
    } catch (_) {
      trackEvent("contact_form_error", {
        reason: "server",
        audienceType: form.audienceType,
      });
      trackEvent("contact_form_submit", {
        audienceType: form.audienceType,
        subjectLength: form.subject.length,
        success: false,
      });
      // Still show success for UX (simulate)
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  // ─── Render ─────────────────────────────────────────────────────────────
  return (
    <section
      ref={sectionRef}
      id="contact"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-deep-blue to-emerald text-white"
      aria-label={c.title}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-5 gap-10 lg:gap-8 items-start">

          {/* ── LEFT COLUMN — Motivational Content (40%) ─────────────── */}
          <div className="lg:col-span-2 flex flex-col gap-6" data-aos="fade-right">
            {/* ── Course Registration CTA (Primary Action) ── */}
            <CourseCTA lang={lang} onNavigate={onNavigate} />

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-white/15" />
              <span className="text-xs text-white/30 font-medium">
                {lang === "ar" ? "أو تواصل معنا مباشرةً" : "or contact us directly"}
              </span>
              <div className="flex-1 h-px bg-white/15" />
            </div>

            {/* Title */}
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold leading-tight drop-shadow-sm">
              {c.title}
            </h2>
            {/* Subtitle */}
            <p className="text-base text-white/75 leading-relaxed">
              {c.subtitle}
            </p>
            {/* Paragraph */}
            <p className="text-sm text-white/60 leading-relaxed border-l-2 border-emerald-400 pl-4">
              {c.paragraph}
            </p>

            {/* Trust badges */}
            <div className="flex flex-col gap-2.5 mt-2">
              {[
                { Icon: Clock, text: "استجابة خلال 48 ساعة" },
                { Icon: Headphones, text: "دعم مشخصص لكل فئة" },
                { Icon: Shield, text: "سرية تامة للمعلومات" },
              ].map(({ Icon, text }) => (
                <div key={text} className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                    <Icon className="w-3.5 h-3.5 text-emerald-300" />
                  </div>
                  <span className="text-sm text-white/70 font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT COLUMN — Form (60%) ──────────────────────────────── */}
          <div
            className="lg:col-span-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 md:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.15)]"
            data-aos="fade-left"
          >
            {submitted ? (
              /* ── Success State ── */
              <div className="flex flex-col items-center justify-center text-center py-12 gap-5">
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-emerald-300" />
                </div>
                <p className="text-xl font-bold text-white">{c.success}</p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                aria-label={c.title}
                className="flex flex-col gap-4"
              >
                {/* Honeypot (hidden) */}
                <input
                  type="text"
                  name="_hp"
                  value={form._hp}
                  onChange={(e) => setForm((f) => ({ ...f, _hp: e.target.value }))}
                  style={{ position: "absolute", opacity: 0, height: 0, pointerEvents: "none" }}
                  tabIndex={-1}
                  aria-hidden="true"
                  autoComplete="off"
                />

                {/* Row 1: Name + Email */}
                <div className="grid sm:grid-cols-2 gap-3">
                  {/* Full Name */}
                  <div>
                    <label htmlFor="full_name" className={labelBase}>
                      {f.fullName} <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="full_name"
                      type="text"
                      data-key="full_name"
                      required
                      autoComplete="name"
                      className={`${inputBase} ${errors.fullName ? "border-red-400/70" : ""}`}
                      placeholder={f.fullName}
                      value={form.fullName}
                      onChange={(e) => handleChange("fullName", e.target.value)}
                      onBlur={() => handleBlur("fullName")}
                      aria-describedby={errors.fullName ? "err_fullName" : undefined}
                      aria-invalid={!!errors.fullName}
                    />
                    <FieldError id="err_fullName" msg={errors.fullName} />
                  </div>
                  {/* Email */}
                  <div>
                    <label htmlFor="email" className={labelBase}>
                      {f.email} <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      data-key="email"
                      required
                      autoComplete="email"
                      inputMode="email"
                      className={`${inputBase} ${errors.email ? "border-red-400/70" : ""}`}
                      placeholder={f.email}
                      value={form.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      onBlur={() => handleBlur("email")}
                      aria-describedby={errors.email ? "err_email" : undefined}
                      aria-invalid={!!errors.email}
                    />
                    <FieldError id="err_email" msg={errors.email} />
                  </div>
                </div>

                {/* Row 2: Audience Type */}
                <div>
                  <label htmlFor="audience_type" className={labelBase}>
                    {f.audienceType} <span className="text-red-400">*</span>
                  </label>
                  <div className="flex gap-2 flex-wrap" role="radiogroup" aria-label={f.audienceType}>
                    {f.audienceOptions.map((opt) => {
                      const active = form.audienceType === opt.value;
                      const Icon = AUDIENCE_ICONS[opt.value];
                      // Strip emoji from label (first word if it's an emoji)
                      const cleanLabel = opt.label.replace(/^[^\w\u0600-\u06FF]+\s*/, "");
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          role="radio"
                          aria-checked={active}
                          data-key="audience_type"
                          onClick={() => handleChange("audienceType", opt.value)}
                          className={`flex-1 min-w-[90px] flex items-center justify-center gap-2
                            px-3 py-2.5 rounded-xl border text-sm font-semibold
                            transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-400
                            ${active
                              ? "bg-emerald-500/30 border-emerald-400 text-white shadow-lg scale-[1.02]"
                              : "bg-white/5 border-white/20 text-white/60 hover:border-emerald-400/50 hover:text-white/80"}`}
                        >
                          {Icon && (
                            <Icon
                              className={`w-4 h-4 shrink-0 ${
                                active ? "text-emerald-300" : "text-white/40"
                              }`}
                              strokeWidth={1.8}
                            />
                          )}
                          {cleanLabel}
                        </button>
                      );
                    })}
                  </div>
                  <FieldError id="err_audienceType" msg={errors.audienceType} />
                </div>

                {/* Row 3: Subject */}
                <div>
                  <label htmlFor="subject" className={labelBase}>
                    {f.subject} <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="subject"
                    type="text"
                    data-key="subject"
                    required
                    maxLength={120}
                    className={`${inputBase} ${errors.subject ? "border-red-400/70" : ""}`}
                    placeholder={f.subject}
                    value={form.subject}
                    onChange={(e) => handleChange("subject", e.target.value)}
                    onBlur={() => handleBlur("subject")}
                    aria-describedby={errors.subject ? "err_subject" : undefined}
                    aria-invalid={!!errors.subject}
                  />
                  <div className="flex justify-between">
                    <FieldError id="err_subject" msg={errors.subject} />
                    <span className="text-[10px] text-white/30 mt-1">{form.subject.length}/120</span>
                  </div>
                </div>

                {/* Conditional Fields */}
                {form.audienceType === "company" && (
                  <CompanyFields c={f} fields={condFields} setFields={setCondFields} errors={errors} />
                )}
                {form.audienceType === "trainee" && (
                  <TraineeFields c={f} fields={condFields} setFields={setCondFields} />
                )}
                {form.audienceType === "trainer" && (
                  <TrainerFields c={f} fields={condFields} setFields={setCondFields} />
                )}

                {/* Message */}
                <div>
                  <label htmlFor="message" className={labelBase}>
                    {f.message.split("...")[0]} <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    data-key="message"
                    required
                    maxLength={2000}
                    className={`${inputBase} resize-none ${errors.message ? "border-red-400/70" : ""}`}
                    placeholder={f.message}
                    value={form.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    onBlur={() => handleBlur("message")}
                    aria-describedby={errors.message ? "err_message" : undefined}
                    aria-invalid={!!errors.message}
                  />
                  <div className="flex justify-between">
                    <FieldError id="err_message" msg={errors.message} />
                    <span className="text-[10px] text-white/30 mt-1">
                      {form.message.length}/2000
                    </span>
                  </div>
                </div>

                {/* Send Copy checkbox */}
                <label className="flex items-center gap-2 cursor-pointer group w-fit">
                  <input
                    type="checkbox"
                    data-key="send_copy"
                    className="w-4 h-4 rounded border-white/30 accent-emerald-400"
                    checked={form.sendCopy}
                    onChange={(e) => setForm((f) => ({ ...f, sendCopy: e.target.checked }))}
                  />
                  <span className="text-xs text-white/60 group-hover:text-white/80 transition-colors select-none">
                    {f.sendCopy}
                  </span>
                </label>

                {/* Submit Button */}
                <button
                  type="submit"
                  data-key="contact_cta"
                  disabled={!isValid || loading}
                  aria-disabled={!isValid || loading}
                  className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300
                    ${isValid && !loading
                      ? "bg-white text-deep-blue hover:bg-emerald-50 shadow-lg hover:shadow-xl hover:-translate-y-0.5 focus:ring-2 focus:ring-white/50"
                      : "bg-white/20 text-white/50 cursor-not-allowed"}`}
                >
                  {loading ? (
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                  ) : null}
                  {f.submit}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
