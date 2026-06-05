import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { trackEvent } from "../utils/analytics";
import Step1Role from "./SubscriptionWizard/Step1Role";
import Step2Specifics from "./SubscriptionWizard/Step2Specifics";
import Step3Info from "./SubscriptionWizard/Step3Info";
import Step4Schedule from "./SubscriptionWizard/Step4Schedule";
import Step5Review from "./SubscriptionWizard/Step5Review";
import { CheckCircle2, Copy, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

const generateId = () => {
    return "APP" + Math.random().toString(36).substr(2, 9).toUpperCase();
};

const SuccessPage = ({ lang, applicationId, name, email, tab }) => {
    const { t } = useTranslation();
    const [copied, setCopied] = useState(false);
    const isRtl = (lang || "ar").split("-")[0] === "ar";

    const SUCCESS_CONTENT = {
        ar: {
            title: "تم تقديم طلبك بنجاح!",
            subtitle: "نحن سعداء باهتمامك بالانضمام إلى برنامجنا التدريبي.",
            desc: "لقد تلقينا طلبك وسيقوم فريقنا بمراجعته في أقرب وقت ممكن. ستتلقى رسالة تأكيد على بريدك الإلكتروني.",
            appId: "رقم الطلب الخاص بك",
            copy: "نسخ",
            copied: "تم النسخ!",
        },
        en: {
            title: "Application Submitted Successfully!",
            subtitle: "We're excited you want to join our training program.",
            desc: "We have received your application and our team will review it shortly. You'll receive a confirmation email.",
            appId: "Your Application ID",
            copy: "Copy",
            copied: "Copied!",
        }
    };
    
    const c = SUCCESS_CONTENT[isRtl ? "ar" : "en"];

    const handleCopy = () => {
        navigator.clipboard.writeText(applicationId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/5 border border-white/10 rounded-[2rem] p-8 md:p-12 text-center"
        >
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-400" />
            </div>

            <h2 className="text-3xl font-bold text-white mb-4">{c.title}</h2>
            <p className="text-xl text-gray-300 mb-4">{c.subtitle}</p>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto leading-relaxed">
                {c.desc}
            </p>

            <div className="bg-[#111] border border-white/10 rounded-2xl p-6 max-w-sm mx-auto relative group">
                <span className="block text-sm text-gray-500 mb-2">
                    {c.appId}
                </span>
                <div className="flex items-center justify-center gap-3">
                    <span className="text-2xl font-mono text-white font-bold tracking-wider">
                        {applicationId}
                    </span>
                    <button
                        onClick={handleCopy}
                        className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                        title={c.copy}
                    >
                        {copied ? (
                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                        ) : (
                            <Copy className="w-5 h-5" />
                        )}
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

const SubscriptionSection = ({ lang = "ar", registrationRequest }) => {
    const { t } = useTranslation();
    const w = t("subscribe.wizard", { returnObjects: true });
    const isRtl = (lang || "ar").split("-")[0] === "ar";

    const [currentStep, setCurrentStep] = useState(1);
    const [submitted, setSubmitted] = useState(false);
    const [appId, setAppId] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);

    const initialData = {
        role: "",
        specifics: {
            track: "",
            position: "",
            traineesCount: "",
            programDesc: "",
        },
        info: {
            fullName: "",
            email: "",
            phone: "",
            country: "",
            cv: null,
            brandName: "",
            crNumber: "",
            crDoc: null,
        },
        schedule: {
            interviewDay: [],
            interviewTime: [],
        },
        agreed: false,
    };

    const [formData, setFormData] = useState(initialData);

    useEffect(() => {
        if (registrationRequest?.audience) {
            updateData("role", null, registrationRequest.audience);
            if (registrationRequest.audience === "trainee" && registrationRequest.track) {
                updateData("specifics", "track", registrationRequest.track);
            }
            setCurrentStep(2);
        }
    }, [registrationRequest]);

    // Auto-advance is disabled per user request.

    const updateData = (section, field, value) => {
        setErrors([]);
        if (!field) {
            setFormData((prev) => ({ ...prev, [section]: value }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [field]: value,
                },
            }));
        }
    };

    const validateStep = (step) => {
        const { role, specifics, info, schedule, agreed } = formData;
        let errs = [];

        if (step === 1) {
            if (!role) errs.push("يجب اختيار نوع التسجيل");
        } else if (step === 2) {
            if (role === "trainee" && !specifics.track) errs.push("يرجى اختيار المسار التقني");
            if (role === "trainer" && !specifics.position) errs.push("يرجى اختيار المسمى الوظيفي");
            if (role === "company") {
                if (!specifics.traineesCount) errs.push("يرجى تحديد عدد المتدربين");
                if (!specifics.programDesc) errs.push("يرجى إدخال وصف البرنامج");
            }
        } else if (step === 3) {
            if (!info.email) errs.push("البريد الإلكتروني مطلوب");
            if (!info.phone) errs.push("رقم الهاتف مطلوب");
            if (!info.country) errs.push("يرجى اختيار الدولة");
            
            if (role === "trainee" || role === "trainer") {
                if (!info.fullName) errs.push("الاسم الكامل مطلوب");
            }
            if (role === "trainer" && !info.cv) errs.push("السيرة الذاتية إجبارية للمدربين");

            if (role === "company") {
                if (!info.brandName) errs.push("اسم العلامة التجارية مطلوب");
                if (!info.crNumber) errs.push("رقم السجل التجاري مطلوب");
                if (!info.crDoc) errs.push("صورة السجل التجاري إجبارية");
            }
        } else if (step === 4) {
            if (role === "trainee" || role === "trainer") {
                if (!schedule.interviewDay) errs.push("يرجى اختيار يوم المقابلة");
                if (!schedule.interviewTime) errs.push("يرجى اختيار وقت المقابلة");
            }
        } else if (step === 5) {
            if (!agreed) errs.push("يجب الموافقة على الشروط والأحكام");
        }

        setErrors(errs);
        return errs.length === 0;
    };

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep((p) => Math.min(p + 1, 5));
        }
    };

    const prevStep = () => {
        setCurrentStep((p) => Math.max(p - 1, 1));
        setErrors([]);
    };

    const handleSubmit = async () => {
        if (!validateStep(5)) return;

        setLoading(true);
        const id = generateId();
        
        // Build payload according to old structure so backend doesn't break
        const payload = {
            applicationId: id,
            type: formData.role,
            roundId: 3,
            general: {
                name: formData.info.fullName || formData.info.brandName,
                email: formData.info.email,
                country: formData.info.country,
                acceptConditions: formData.agreed
            },
            interview: formData.role === "company" 
                ? { note: "team_will_contact" }
                : { 
                    day: formData.schedule.interviewDay, 
                    days: [formData.schedule.interviewDay],
                    times: [formData.schedule.interviewTime]
                },
            specific: formData.role === "trainee"
                ? { stack: formData.specifics.track, cv: formData.info.cv?.name }
                : formData.role === "trainer"
                ? { position: formData.specifics.position, cv: formData.info.cv?.name }
                : { 
                    brand: formData.info.brandName, 
                    field: "Other", 
                    package: formData.specifics.traineesCount, 
                    crNumber: formData.info.crNumber, 
                    cr: formData.info.crDoc?.name 
                }
        };

        try {
            await fetch("/api/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
        } catch (e) {
            console.error(e);
        } finally {
            trackEvent("subscription_wizard_submit", {
                role: formData.role,
                success: true,
            });
            setAppId(id);
            setLoading(false);
            setSubmitted(true);
        }
    };

    if (submitted) {
        return (
            <section className="py-24 bg-gradient-to-br from-deep-blue to-emerald relative" dir={isRtl ? "rtl" : "ltr"}>
                <div className="container mx-auto px-6 max-w-4xl relative z-10">
                    <SuccessPage
                        lang={lang}
                        applicationId={appId}
                        name={formData.info.fullName || formData.info.brandName}
                        email={formData.info.email}
                        tab={formData.role}
                    />
                </div>
            </section>
        );
    }

    const stepsArray = [w.steps.role, w.steps.specifics, w.steps.info, w.steps.schedule, w.steps.review];

    return (
        <section className="pt-4 pb-24 bg-gradient-to-br from-deep-blue to-emerald relative overflow-hidden text-white" dir={isRtl ? "rtl" : "ltr"}>
            {/* Background elements */}
            <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-6 max-w-3xl relative z-10">
                <div className="text-center mb-8">
                    <h2 className="text-[28px] font-bold text-white mb-2">
                        سجّل اشتراكك
                    </h2>
                    <p className="text-[14px] text-white/80 max-w-xl mx-auto">
                        أكمل الخطوات التالية لتقديم طلب الانضمام إلى موثق
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="mb-10">
                    <div className="flex items-center justify-between relative">
                        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 rounded-full bg-white/10 -z-10" />
                        <div 
                            className="absolute right-0 top-1/2 -translate-y-1/2 h-1 rounded-full bg-white transition-all duration-500 -z-10" 
                            style={{ width: `${((currentStep - 1) / 4) * 100}%`, left: isRtl ? 'auto' : 0, right: isRtl ? 0 : 'auto' }}
                        />
                        
                        {stepsArray.map((stepLabel, idx) => {
                            const stepNum = idx + 1;
                            const isActive = stepNum === currentStep;
                            const isCompleted = stepNum < currentStep;

                            return (
                                <div key={stepNum} className="flex flex-col items-center gap-2">
                                    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 border-2 text-[14px] ${
                                        isActive ? "bg-emerald-700 border-emerald-700 text-white shadow-[0_0_15px_rgba(4,120,87,0.5)]" 
                                        : isCompleted ? "bg-emerald-700 border-white text-white"
                                        : "bg-gray-600 border-gray-500 text-white/80"
                                    }`}>
                                        {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : stepNum}
                                    </div>
                                    <span className={`text-[12px] md:text-[14px] font-medium hidden md:block ${
                                        isActive ? "text-emerald-400" : isCompleted ? "text-white/90" : "text-white/60"
                                    }`}>
                                        {stepLabel}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Errors */}
                <AnimatePresence>
                    {errors.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-4 mb-6"
                        >
                            <ul className="list-disc list-inside space-y-1">
                                {errors.map((e, i) => (
                                    <li key={i}>{e}</li>
                                ))}
                            </ul>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Step Content */}
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] p-6 md:p-10 min-h-[400px] flex flex-col justify-between shadow-2xl">
                    <AnimatePresence mode="wait">
                        {currentStep === 1 && <Step1Role key="step1" formData={formData} updateData={updateData} nextStep={nextStep} />}
                        {currentStep === 2 && <Step2Specifics key="step2" formData={formData} updateData={updateData} />}
                        {currentStep === 3 && <Step3Info key="step3" formData={formData} updateData={updateData} />}
                        {currentStep === 4 && <Step4Schedule key="step4" formData={formData} updateData={updateData} />}
                        {currentStep === 5 && <Step5Review key="step5" formData={formData} updateData={updateData} />}
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between mt-10 pt-6 border-t border-white/10">
                        {currentStep > 1 ? (
                            <button
                                type="button"
                                onClick={prevStep}
                                className="flex items-center gap-2 px-6 h-9 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors text-[14px]"
                            >
                                {isRtl ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                                {w.buttons.back}
                            </button>
                        ) : (
                            <div></div> // Spacer for flex-between
                        )}

                            {currentStep < 5 ? (
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="flex items-center gap-2 px-6 h-9 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-lg shadow-emerald-500/20 transition-all text-[14px]"
                                >
                                    {w.buttons.next}
                                    {isRtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={loading || !formData.agreed}
                                    className="flex items-center justify-center gap-2 px-6 h-9 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-medium shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed min-w-[150px] text-[14px]"
                                >
                                    {loading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            {w.buttons.agreeAndSubmit}
                                            <CheckCircle2 className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                </div>
            </div>
        </section>
    );
};

export default SubscriptionSection;
