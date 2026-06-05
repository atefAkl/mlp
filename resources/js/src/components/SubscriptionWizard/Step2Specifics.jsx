import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Calendar, Clock, Users, Code, Award, CheckCircle2, Briefcase, DollarSign, ListChecks } from "lucide-react";

// Dummy Data for Programs (Trainees)
const PROGRAMS = [
    {
        id: "batch-12",
        name: "الدفعة 12",
        target: "تطوير خلفيات الويب (Backend Dev)",
        startDate: "28/06/2026",
        duration: "12 أسبوع",
        seats: "150",
        tech: ["Laravel 12", "MySQL", "RESTful API"],
        requirements: ["php", "mysql", "devops", "github"],
        certificate: true,
        cost: "مجاني"
    },
    {
        id: "batch-13",
        name: "الدفعة 13",
        target: "تطوير فرونت الويب (Frontend Dev)",
        startDate: "28/07/2026",
        duration: "16 أسبوع",
        seats: "250",
        tech: ["React", "TailwindCSS", "Axios"],
        requirements: ["react", "tailwindcss", "Axios", "github"],
        certificate: true,
        cost: "مجاني"
    }
];

// Dummy Data for Jobs (Trainers)
const JOBS = [
    {
        id: "tech-lead",
        title: "قائد تقني (Tech Lead)",
        requirements: "خبرة لا تقل عن 5 سنوات في تطوير البرمجيات، مهارات قيادية عالية، وإجادة تصميم المعمارية البرمجية للأنظمة المعقدة.",
        type: "جزئي (4 ساعات)",
        salary: "نسبة"
    },
    {
        id: "team-leader",
        title: "قائد فريق (Team Leader)",
        requirements: "خبرة 3 سنوات على الأقل، القدرة على توجيه المطورين المبتدئين، وإدارة وتوزيع المهام باستخدام منهجية Agile.",
        type: "جزئي (4 ساعات)",
        salary: "نسبة"
    },
    {
        id: "accountant",
        title: "محاسب",
        requirements: "خبرة في المحاسبة المالية وإعداد التقارير المالية، إجادة استخدام البرامج المحاسبية والقدرة على إدارة مسيرات الرواتب.",
        type: "جزئي (4 ساعات)",
        salary: "ثابت"
    }
];

// Reusable label styling matching the landing page
const labelBase = "block text-[14px] font-semibold text-white/80 mb-2";
const inputBase = "w-full bg-white/10 border border-white/25 rounded-xl px-4 h-9 text-white text-[12px] placeholder-white/40 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 transition-all duration-200";

const Step2Specifics = ({ formData, updateData }) => {
    const { t } = useTranslation();
    const w = t("subscribe.wizard", { returnObjects: true });
    const { role, specifics } = formData;

    const handleChange = (field, value) => {
        updateData("specifics", field, value);
    };

    if (role === "trainee") {
        return (
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
            >
                <h3 className="text-[14px] font-bold text-white mb-2">
                    {w.steps.specifics} - {w.roles.trainee}
                </h3>
                <div className="space-y-4">
                    <label className={labelBase}>البرامج التدريبية المتاحة</label>
                    <div className="grid grid-cols-1 gap-4">
                        {PROGRAMS.map((prog) => {
                            const isSelected = specifics.track === prog.name;
                            return (
                                <button
                                    key={prog.id}
                                    type="button"
                                    onClick={() => handleChange("track", prog.name)}
                                    className={`relative p-5 text-start rounded-2xl border transition-all duration-300 ${
                                        isSelected
                                            ? "bg-emerald-500/20 border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.15)]"
                                            : "bg-white/5 border-white/10 hover:border-emerald-400/50 hover:bg-white/10"
                                    }`}
                                >
                                    {isSelected && (
                                        <div className="absolute top-4 right-4 text-emerald-400">
                                            <CheckCircle2 className="w-6 h-6" />
                                        </div>
                                    )}
                                    <div className="flex justify-between items-start mb-3 pr-8">
                                        <div>
                                            <h4 className="text-[14px] font-bold text-white">{prog.name}</h4>
                                            <p className="text-emerald-400 text-[12px] font-medium">{prog.target}</p>
                                        </div>
                                        <div className="bg-white/10 text-white text-[12px] px-3 py-1 rounded-full whitespace-nowrap">
                                            {prog.cost}
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                                        <div className="flex items-center gap-2 text-[12px] text-gray-300">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            <span>البداية: {prog.startDate}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-[12px] text-gray-300">
                                            <Clock className="w-4 h-4 text-gray-400" />
                                            <span>{prog.duration}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-[12px] text-gray-300">
                                            <Users className="w-4 h-4 text-gray-400" />
                                            <span>المقاعد: {prog.seats}</span>
                                        </div>
                                        {prog.certificate && (
                                            <div className="flex items-center gap-2 text-[12px] text-gray-300">
                                                <Award className="w-4 h-4 text-gray-400" />
                                                <span>شهادة معتمدة</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <div className="text-[12px] text-gray-400 font-medium flex items-center gap-2">
                                            <Code className="w-3.5 h-3.5" /> التقنيات:
                                        </div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {prog.tech.map(t => <span key={t} className="bg-blue-500/10 text-blue-300 border border-blue-500/20 text-[12px] px-2 py-0.5 rounded">{t}</span>)}
                                        </div>
                                        
                                        <div className="text-[12px] text-gray-400 font-medium flex items-center gap-2 mt-2">
                                            <ListChecks className="w-3.5 h-3.5" /> المتطلبات:
                                        </div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {prog.requirements.map(r => <span key={r} className="bg-white/5 text-gray-300 border border-white/10 text-[12px] px-2 py-0.5 rounded">{r}</span>)}
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </motion.div>
        );
    }

    if (role === "trainer") {
        return (
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
            >
                <h3 className="text-[14px] font-bold text-white mb-2">
                    {w.steps.specifics} - {w.roles.trainer}
                </h3>
                <div className="space-y-4">
                    <label className={labelBase}>الوظائف المتاحة</label>
                    <div className="grid grid-cols-1 gap-4">
                        {JOBS.map((job) => {
                            const isSelected = specifics.position === job.title;
                            return (
                                <button
                                    key={job.id}
                                    type="button"
                                    onClick={() => handleChange("position", job.title)}
                                    className={`relative p-5 text-start rounded-2xl border transition-all duration-300 ${
                                        isSelected
                                            ? "bg-emerald-500/20 border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.15)]"
                                            : "bg-white/5 border-white/10 hover:border-emerald-400/50 hover:bg-white/10"
                                    }`}
                                >
                                    {isSelected && (
                                        <div className="absolute top-4 right-4 text-emerald-400">
                                            <CheckCircle2 className="w-6 h-6" />
                                        </div>
                                    )}
                                    <h4 className="text-[14px] font-bold text-white mb-2 pr-8">{job.title}</h4>
                                    
                                    <div className="flex flex-wrap gap-4 mb-3">
                                        <div className="flex items-center gap-1.5 text-[12px] text-gray-300 bg-white/5 px-2.5 py-1 rounded-lg">
                                            <Briefcase className="w-4 h-4 text-emerald-400" />
                                            <span>الدوام: {job.type}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[12px] text-gray-300 bg-white/5 px-2.5 py-1 rounded-lg">
                                            <DollarSign className="w-4 h-4 text-emerald-400" />
                                            <span>الراتب: {job.salary}</span>
                                        </div>
                                    </div>

                                    <div className="text-[12px] text-gray-400 leading-relaxed bg-black/20 p-3 rounded-xl border border-white/5">
                                        <span className="text-emerald-300 font-semibold block mb-1">المتطلبات:</span>
                                        {job.requirements}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </motion.div>
        );
    }

    if (role === "company") {
        return (
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
            >
                <h3 className="text-[14px] font-bold text-white mb-2">
                    {w.steps.specifics} - {w.roles.company}
                </h3>
                <div className="space-y-5">
                    <div>
                        <label className={labelBase}>
                            {w.company.traineesCountLabel}
                        </label>
                        <input
                            type="number"
                            min="1"
                            value={specifics.traineesCount}
                            onChange={(e) => handleChange("traineesCount", e.target.value)}
                            className={inputBase}
                            placeholder="مثال: 5"
                        />
                    </div>
                    <div>
                        <label className={labelBase}>
                            {w.company.programDescLabel}
                        </label>
                        <textarea
                            value={specifics.programDesc}
                            onChange={(e) => handleChange("programDesc", e.target.value)}
                            rows={4}
                            className={`${inputBase} !h-auto py-2 resize-none`}
                            placeholder={w.company.programDescPlaceholder}
                        ></textarea>
                    </div>
                </div>
            </motion.div>
        );
    }

    return null;
};

export default Step2Specifics;
