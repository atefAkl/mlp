import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Calendar, Clock, Info, CheckCircle2 } from "lucide-react";

const TRAINEE_DAYS = ["sat", "sun", "mon", "wed"];
const TIME_SLOTS = ["morning", "midday", "afternoon", "evening"];

const Step4Schedule = ({ formData, updateData }) => {
    const { t } = useTranslation();
    const w = t("subscribe.wizard", { returnObjects: true });
    const { role, schedule } = formData;

    const toggleSelection = (field, value) => {
        const current = Array.isArray(schedule[field]) ? schedule[field] : [];
        const isSelected = current.includes(value);
        let updated;
        if (isSelected) {
            updated = current.filter(item => item !== value);
        } else {
            updated = [...current, value];
        }
        updateData("schedule", field, updated);
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

    const daysList = role === "trainee" ? TRAINEE_DAYS : ["fri"];

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
                    {daysList.map((dayKey) => {
                        const isSelected = (schedule.interviewDay || []).includes(dayKey);
                        return (
                            <button
                                key={dayKey}
                                type="button"
                                onClick={() => toggleSelection("interviewDay", dayKey)}
                                className={`relative h-9 px-4 flex items-center justify-start rounded-xl border transition-all duration-300 text-[14px] font-medium ${
                                    isSelected
                                        ? "bg-emerald-500/20 border-emerald-400 text-white shadow-[0_0_15px_rgba(52,211,153,0.15)]"
                                        : "bg-white/5 border-white/25 text-white/70 hover:border-emerald-400/50 hover:text-white"
                                }`}
                            >
                                {w.days?.[dayKey]}
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
                    {TIME_SLOTS.map((timeKey) => {
                        const isSelected = (schedule.interviewTime || []).includes(timeKey);
                        return (
                            <button
                                key={timeKey}
                                type="button"
                                onClick={() => toggleSelection("interviewTime", timeKey)}
                                className={`relative h-9 px-4 flex items-center justify-start rounded-xl border transition-all duration-300 text-[14px] font-medium ${
                                    isSelected
                                        ? "bg-emerald-500/20 border-emerald-400 text-white shadow-[0_0_15px_rgba(52,211,153,0.15)]"
                                        : "bg-white/5 border-white/25 text-white/70 hover:border-emerald-400/50 hover:text-white"
                                }`}
                            >
                                {w.times?.[timeKey]}
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
