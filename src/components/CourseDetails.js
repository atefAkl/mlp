import React from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Zap,
  Users,
  Award,
  CheckCircle2,
  Clock,
  BookOpen,
  Calendar,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

const CourseDetails = ({ t, lang, onBack }) => {
  const cd = t.courseDetails;
  const isRtl = lang === "ar";
  const Arrow = isRtl ? ArrowLeft : ArrowRight;
  const Chevron = isRtl ? ChevronLeft : ChevronRight;

  if (!cd) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={`pt-24 pb-20 ${t.font} bg-slate-50 min-h-screen`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ─── Breadcrumbs / Back ─── */}
        <motion.button
          variants={itemVariants}
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-deep-blue transition-colors mb-8 group"
        >
          <Arrow className="w-4 h-4 group-hover:-translate-x-1 rtl:group-hover:translate-x-1 transition-transform" />
          <span className="text-sm font-medium">{isRtl ? "العودة للرئيسية" : "Back to Home"}</span>
        </motion.button>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* ─── LEFT: Main Content (8 cols) ─── */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Hero Section */}
            <motion.div variants={itemVariants} className="space-y-4">
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider">
                {cd.hero.badge}
              </span>
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
                {cd.hero.title}
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
                {cd.hero.subtitle}
              </p>
            </motion.div>

            {/* Highlights Grid */}
            <motion.div variants={itemVariants} className="grid sm:grid-cols-3 gap-4">
              {cd.highlights.map((h, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center mb-4 text-emerald-600">
                    {h.icon === "zap" && <Zap className="w-5 h-5" />}
                    {h.icon === "users" && <Users className="w-5 h-5" />}
                    {h.icon === "award" && <Award className="w-5 h-5" />}
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1">{h.title}</h3>
                  <p className="text-xs text-slate-500">{h.desc}</p>
                </div>
              ))}
            </motion.div>

            {/* Curriculum Timeline */}
            <motion.div variants={itemVariants} className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-emerald-500" />
                {isRtl ? "المنهج الدراسي والجدول الزمني" : "Curriculum & Roadmap"}
              </h2>
              <div className="space-y-4">
                {cd.curriculum.map((module, idx) => (
                  <div key={idx} className="relative pl-8 rtl:pl-0 rtl:pr-8 pb-8 last:pb-0 group">
                    {/* Vertical Line */}
                    <div className="absolute left-3 rtl:left-auto rtl:right-3 top-0 bottom-0 w-px bg-slate-200 group-last:bg-transparent" />
                    {/* Dot */}
                    <div className="absolute left-[7px] rtl:left-auto rtl:right-[7px] top-1.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white shadow-sm" />
                    
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm transition-all group-hover:border-emerald-200 group-hover:shadow-md">
                      <span className="text-xs font-bold text-emerald-600 mb-1 block uppercase">{module.week}</span>
                      <h4 className="text-lg font-bold text-slate-900 mb-3">{module.title}</h4>
                      <ul className="grid sm:grid-cols-2 gap-2">
                        {module.topics.map((t, j) => (
                          <li key={j} className="flex items-center gap-2 text-sm text-slate-600">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Tech Stack Showcase */}
            <motion.div variants={itemVariants} className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
               <h2 className="text-xl font-bold mb-8 relative z-10">{isRtl ? "التقنيات التي ستتقنها" : "Technologies You'll Master"}</h2>
               <div className="grid sm:grid-cols-3 gap-8 relative z-10">
                  <div>
                    <h4 className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-4">{isRtl ? "الواجهات" : "Frontend"}</h4>
                    <div className="flex flex-wrap gap-2">
                      {cd.techStack.frontend.map(t => <span key={t} className="px-3 py-1 bg-white/10 rounded-full text-xs border border-white/5">{t}</span>)}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-4">{isRtl ? "الخوادم" : "Backend"}</h4>
                    <div className="flex flex-wrap gap-2">
                      {cd.techStack.backend.map(t => <span key={t} className="px-3 py-1 bg-white/10 rounded-full text-xs border border-white/5">{t}</span>)}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-4">{isRtl ? "الأدوات" : "Tools"}</h4>
                    <div className="flex flex-wrap gap-2">
                      {cd.techStack.tools.map(t => <span key={t} className="px-3 py-1 bg-white/10 rounded-full text-xs border border-white/5">{t}</span>)}
                    </div>
                  </div>
               </div>
            </motion.div>
          </div>

          {/* ─── RIGHT: Sidebar (4 cols) ─── */}
          <div className="lg:col-span-4 sticky top-24 space-y-6">
            
            {/* Enrollment Card */}
            <motion.div variants={itemVariants} className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <span className="text-slate-500 text-sm font-medium">{isRtl ? "مدة الدورة" : "Duration"}</span>
                <div className="flex items-center gap-1.5 text-slate-900 font-bold">
                  <Clock className="w-4 h-4 text-emerald-500" />
                  {cd.hero.duration}
                </div>
              </div>
              
              <div className="mb-6">
                <span className="text-slate-400 text-xs uppercase font-bold tracking-widest">{isRtl ? "الاستثمار" : "Investment"}</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-black text-slate-900">{cd.hero.price}</span>
                </div>
              </div>

              <button 
                onClick={onBack}
                className="w-full py-4 bg-deep-blue text-white rounded-2xl font-bold shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all mb-4"
              >
                {cd.hero.cta}
              </button>
              
              <button className="w-full py-4 border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-colors">
                {cd.hero.secondaryCta}
              </button>

              <div className="mt-8 pt-8 border-t border-slate-100">
                <h5 className="text-sm font-bold text-slate-900 mb-4">{isRtl ? "بماذا تخرج؟" : "What's Included?"}</h5>
                <ul className="space-y-3">
                  {[
                    isRtl ? "مشاريع بنظام Sprints" : "Sprint-based projects",
                    isRtl ? "مراجعة كود فردية" : "1v1 Code reviews",
                    isRtl ? "إرشاد مهني للتوظيف" : "Career mentorship",
                    isRtl ? "بيئة عمل Slack/Jira" : "Slack/Jira environment",
                  ].map((x, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      {x}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Small FAQ teaser */}
            <motion.div variants={itemVariants} className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
              <h4 className="font-bold text-emerald-900 mb-2">{isRtl ? "هل لديك تساؤلات؟" : "Any questions?"}</h4>
              <p className="text-sm text-emerald-800/70 mb-4">{isRtl ? "راجع الأسئلة الشائعة أو تواصل مع فريقنا." : "Check our FAQ or talk to our team."}</p>
              <button className="flex items-center gap-2 text-emerald-700 font-bold text-sm hover:underline">
                {isRtl ? "رؤية الأسئلة الشائعة" : "View FAQ"}
                <Chevron className="w-4 h-4" />
              </button>
            </motion.div>

          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseDetails;
