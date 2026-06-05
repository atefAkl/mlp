import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Calendar, Clock, Info, CheckCircle2 } from "lucide-react";

const TRAINEE_DAYS = [
    { key: "sat", ar: "السبت" },
    { key: "sun", ar: "الأحد" },
    { key: "mon", ar: "الاثنين" },
    { key: "wed", ar: "الأربعاء" },
];

const TIME_SLOTS = [
    { key: "morning", ar: "صباحاً (9 – 11)" },
    { key: "midday", ar: "ظهراً (12 – 2)" },
    { key: "afternoon", ar: "عصراً (3 – 5)" },
    { key: "evening", ar: "مساءً (6 – 8)" },
];

const Step4Schedule = ({ formData, updateData }) => {
    const { t } = useTranslation();
    const w = t("subscribe.wizard", { returnObjects: true });
    const { role, schedule } = formData;

    const handleChange = (field, value) => {
        updateData("schedule", field, value);
    };

    if (role === "company") {
        return (
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
            >
                <h3 className="text-[14px] font-bold text-white mb-6">
                    {w.steps.schedule}
                </h3>
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 flex items-start gap-4">
                    <Info className="w-6 h-6 text-emerald-400 shrink-0 mt-1" />
                    <p className="text-emerald-100 text-lg leading-relaxed">
                        {w.schedule.companyNote}
                    </p>
                </div>
            </motion.div>
        );
    }

    const daysList = role === "trainee" ? TRAINEE_DAYS : [{ key: "fri", ar: "الجمعة" }];

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
        >
            <h3 className="text-[14px] font-bold text-white mb-6">
                {w.steps.schedule}
            </h3>

            {role === "trainer" && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 flex items-center gap-3">
                    <Info className="w-5 h-5 text-emerald-400 shrink-0" />
                    <p className="text-emerald-100 text-sm">
                        {w.schedule.trainerFridayNote}
                    </p>
                </div>
            )}

            <div className="space-y-4">
                <label className="flex items-center gap-2 text-[14px] font-semibold text-white/80">
                    <Calendar className="w-4 h-4 text-emerald-400" />
                    {w.schedule.interviewDay}
                </label>
                <div className="grid grid-cols-2 gap-3">
                    {daysList.map((day) => {
                        const isSelected = schedule.interviewDay === day.key;
                        return (
                            <button
                                key={day.key}
                                type="button"
                                onClick={() => handleChange("interviewDay", day.key)}
                                className={`relative h-9 px-4 flex items-center justify-start rounded-xl border transition-all duration-300 text-[14px] font-medium ${
                                    isSelected
                                        ? "bg-emerald-500/20 border-emerald-400 text-white shadow-[0_0_15px_rgba(52,211,153,0.15)]"
                                        : "bg-white/5 border-white/25 text-white/70 hover:border-emerald-400/50 hover:text-white"
                                }`}
                            >
                                {day.ar}
                                {isSelected && (
                                    <CheckCircle2 className="absolute top-1/2 -translate-y-1/2 right-4 w-5 h-5 text-emerald-400" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="space-y-4">
                <label className="flex items-center gap-2 text-[14px] font-semibold text-white/80">
                    <Clock className="w-4 h-4 text-emerald-400" />
                    {w.schedule.interviewTime}
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {TIME_SLOTS.map((time) => {
                        const isSelected = schedule.interviewTime === time.key;
                        return (
                            <button
                                key={time.key}
                                type="button"
                                onClick={() => handleChange("interviewTime", time.key)}
                                className={`relative h-9 px-4 flex items-center justify-start rounded-xl border transition-all duration-300 text-[14px] font-medium ${
                                    isSelected
                                        ? "bg-emerald-500/20 border-emerald-400 text-white shadow-[0_0_15px_rgba(52,211,153,0.15)]"
                                        : "bg-white/5 border-white/25 text-white/70 hover:border-emerald-400/50 hover:text-white"
                                }`}
                            >
                                {time.ar}
                                {isSelected && (
                                    <CheckCircle2 className="absolute top-1/2 -translate-y-1/2 left-4 w-5 h-5 text-emerald-400" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </motion.div>
    );
};

export default Step4Schedule;
