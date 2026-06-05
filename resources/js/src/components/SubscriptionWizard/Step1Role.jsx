import React from "react";
import { motion } from "framer-motion";
import { GraduationCap, UserCog, Building2 } from "lucide-react";
import { useTranslation } from "react-i18next";

const Step1Role = ({ formData, updateData, nextStep }) => {
    const { t } = useTranslation();
    const w = t("subscribe.wizard", { returnObjects: true });

    const roles = [
        {
            id: "trainee",
            title: w.roles.trainee,
            desc: w.roles.traineeDesc,
            Icon: GraduationCap,
            color: "text-blue-400",
            bg: "bg-blue-400/10",
            border: "border-blue-400/50",
            activeBg: "bg-blue-400/20",
        },
        {
            id: "trainer",
            title: w.roles.trainer,
            desc: w.roles.trainerDesc,
            Icon: UserCog,
            color: "text-emerald-400",
            bg: "bg-emerald-400/10",
            border: "border-emerald-400/50",
            activeBg: "bg-emerald-400/20",
        },
        {
            id: "company",
            title: w.roles.company,
            desc: w.roles.companyDesc,
            Icon: Building2,
            color: "text-purple-400",
            bg: "bg-purple-400/10",
            border: "border-purple-400/50",
            activeBg: "bg-purple-400/20",
        },
    ];

    const handleSelect = (id) => {
        updateData("role", null, id);
    };

    return (
        <div className="space-y-6">
            <h3 className="text-[14px] font-bold text-white mb-6">
                {w.steps.role}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {roles.map((role, idx) => {
                    const isActive = formData.role === role.id;
                    const { Icon } = role;

                    return (
                        <motion.button
                            key={role.id}
                            type="button"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            onClick={() => handleSelect(role.id)}
                            className={`flex flex-col items-center text-center p-6 rounded-2xl border transition-all duration-300 ${
                                isActive
                                    ? `${role.activeBg} border-emerald-400 ring-2 ring-emerald-400/30 shadow-[0_0_15px_rgba(52,211,153,0.15)]`
                                    : "bg-white/5 border-white/25 hover:border-emerald-400/50 hover:bg-white/10"
                            }`}
                        >
                            <div
                                className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${role.bg} ${role.color}`}
                            >
                                <Icon className="w-8 h-8" />
                            </div>
                            <h4 className="text-[14px] font-bold text-white mb-1">
                                {role.title}
                            </h4>
                            <p className="text-[12px] text-gray-400">
                                {role.desc}
                            </p>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
};

export default Step1Role;
