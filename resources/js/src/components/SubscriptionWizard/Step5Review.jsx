import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { CheckCircle2, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const Step5Review = ({ formData, updateData }) => {
    const { t } = useTranslation();
    const w = t("subscribe.wizard", { returnObjects: true });
    const { role, specifics, info, schedule, agreed } = formData;

    const summaryItems = [];

    // Role
    summaryItems.push({ label: w.steps.role, value: w.roles[role] });

    // Specifics
    if (role === "trainee" && specifics.track) {
        summaryItems.push({ label: w.trainee.trackLabel, value: specifics.track });
    }
    if (role === "trainer" && specifics.position) {
        summaryItems.push({ label: w.trainer.positionLabel, value: specifics.position });
    }
    if (role === "company") {
        if (specifics.traineesCount) summaryItems.push({ label: w.company.traineesCountLabel, value: specifics.traineesCount });
        if (specifics.programDesc) summaryItems.push({ label: w.company.programDescLabel, value: specifics.programDesc });
    }

    // Info
    if (info.fullName) summaryItems.push({ label: w.info.fullName, value: info.fullName });
    if (info.brandName) summaryItems.push({ label: w.info.brandName, value: info.brandName });
    if (info.email) summaryItems.push({ label: w.info.email, value: info.email, ltr: true });
    if (info.phone) summaryItems.push({ label: w.info.phone, value: info.phone, ltr: true });
    if (info.country) summaryItems.push({ label: w.info.country, value: info.country });
    if (info.crNumber) summaryItems.push({ label: w.info.crNumber, value: info.crNumber });

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            <h3 className="text-[14px] font-bold text-white mb-6">
                {w.steps.review}
            </h3>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                <h4 className="text-[14px] font-bold text-white mb-4 border-b border-white/10 pb-2">
                    {w.review.summary}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                    {summaryItems.map((item, idx) => (
                        <div key={idx} className="space-y-1">
                            <span className="text-[12px] text-gray-500 block">{item.label}</span>
                            <span className={`text-[14px] text-gray-200 block ${item.ltr ? 'dir-ltr text-right' : ''}`}>
                                {item.value}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex items-start gap-3 mt-8">
                <button
                    type="button"
                    onClick={() => updateData("agreed", null, !agreed)}
                    className={`shrink-0 w-6 h-6 mt-1 rounded flex items-center justify-center transition-colors border ${
                        agreed
                            ? "bg-emerald-500 border-emerald-500 text-white shadow-[0_0_10px_rgba(52,211,153,0.3)]"
                            : "bg-white/5 border-white/25 text-transparent hover:border-emerald-400/50"
                    }`}
                >
                    <CheckCircle2 className="w-4 h-4" />
                </button>
                <div className="text-gray-300 text-[14px] leading-relaxed">
                    {w.review.termsAgree}{" "}
                    <Link
                        to="/terms"
                        target="_blank"
                        className="text-emerald-400 hover:text-emerald-300 underline underline-offset-4 inline-flex items-center gap-1"
                    >
                        {w.review.termsLink}
                        <ExternalLink className="w-3 h-3" />
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

export default Step5Review;
