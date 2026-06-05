import React, { useRef } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Upload, X, FileText } from "lucide-react";

const COUNTRIES = [
    "Saudi Arabia", "Jordan", "UAE", "Kuwait", "Qatar", "Bahrain",
    "Oman", "Egypt", "Palestine", "Iraq", "Yemen", "Lebanon",
    "Syria", "Morocco", "Tunisia", "Algeria", "Libya", "Sudan", "Other"
];

const labelBase = "block text-[14px] font-semibold text-white/80 mb-2";
const inputBase = "w-full bg-white/10 border border-white/25 rounded-xl px-4 h-9 text-white text-[12px] placeholder-white/40 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 transition-all duration-200";

const Step3Info = ({ formData, updateData }) => {
    const { t } = useTranslation();
    const w = t("subscribe.wizard", { returnObjects: true });
    const { role, info } = formData;
    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        updateData("info", name, value);
    };

    const handleFileChange = (e, fieldName) => {
        if (e.target.files && e.target.files[0]) {
            updateData("info", fieldName, e.target.files[0]);
        }
    };

    const removeFile = (fieldName) => {
        updateData("info", fieldName, null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const FileUpload = ({ label, fieldName }) => (
        <div>
            <label className={labelBase}>
                {label}
            </label>
            {!info[fieldName] ? (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full bg-white/5 border border-white/25 border-dashed rounded-xl px-4 py-6 text-center cursor-pointer hover:border-emerald-400/50 hover:bg-white/10 transition-all group"
                >
                    <Upload className="w-8 h-8 text-white/50 mx-auto mb-2 group-hover:text-emerald-400 transition-colors" />
                    <p className="text-sm text-white/60 group-hover:text-emerald-300">
                        اضغط لرفع الملف (PDF أو Docx)
                    </p>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={(e) => handleFileChange(e, fieldName)}
                        className="hidden"
                        accept=".pdf,.doc,.docx"
                    />
                </div>
            ) : (
                <div className="flex items-center justify-between p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <FileText className="w-5 h-5 text-emerald-400 shrink-0" />
                        <span className="text-sm text-emerald-100 truncate">
                            {info[fieldName].name}
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={() => removeFile(fieldName)}
                        className="p-1 hover:bg-white/10 rounded-lg text-emerald-400/70 hover:text-red-400 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            )}
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            <h3 className="text-[14px] font-bold text-white mb-6">
                {w.steps.info}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {role === "company" ? (
                    <>
                        <div className="col-span-1 md:col-span-2">
                            <label className={labelBase}>
                                {w.info.brandName}
                            </label>
                            <input
                                type="text"
                                name="brandName"
                                value={info.brandName}
                                onChange={handleChange}
                                className={inputBase}
                                placeholder={w.info.brandName}
                            />
                        </div>
                        <div>
                            <label className={labelBase}>
                                {w.info.crNumber}
                            </label>
                            <input
                                type="text"
                                name="crNumber"
                                value={info.crNumber}
                                onChange={handleChange}
                                className={inputBase}
                                placeholder={w.info.crNumber}
                            />
                        </div>
                    </>
                ) : (
                    <div className="col-span-1 md:col-span-2">
                        <label className={labelBase}>
                            {w.info.fullName}
                        </label>
                        <input
                            type="text"
                            name="fullName"
                            value={info.fullName}
                            onChange={handleChange}
                            className={inputBase}
                            placeholder={w.info.fullName}
                        />
                    </div>
                )}

                <div>
                    <label className={labelBase}>
                        {w.info.email}
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={info.email}
                        onChange={handleChange}
                        className={inputBase}
                        dir="ltr"
                        placeholder="example@domain.com"
                    />
                </div>
                <div>
                    <label className={labelBase}>
                        {w.info.phone}
                    </label>
                    <input
                        type="tel"
                        name="phone"
                        value={info.phone}
                        onChange={handleChange}
                        className={inputBase}
                        dir="ltr"
                        placeholder="+966 50 000 0000"
                    />
                </div>
                <div className="col-span-1 md:col-span-2">
                    <label className={labelBase}>
                        {w.info.country}
                    </label>
                    <select
                        name="country"
                        value={info.country}
                        onChange={handleChange}
                        className={`${inputBase} [&>option]:bg-[#1e293b] [&>option]:text-white`}
                    >
                        <option value="">اختر الدولة...</option>
                        {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>

                <div className="col-span-1 md:col-span-2 mt-2">
                    {role === "company" && (
                        <FileUpload label={w.info.crDocMandatory} fieldName="crDoc" />
                    )}
                    {role === "trainer" && (
                        <FileUpload label={w.info.cvMandatory} fieldName="cv" />
                    )}
                    {role === "trainee" && (
                        <FileUpload label={w.info.cvOptional} fieldName="cv" />
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default Step3Info;
