import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import "./styles/TechStack.css";
import {
  Terminal,
  Users,
  CheckCircle2,
  ArrowRight,
  MessageSquare,
  Clock,
  Globe,
  Star,
  Target,
  Shield,
  Zap,
  BookOpen,
  ChevronRight,
  Menu,
  X,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const App = () => {
  const [lang, setLang] = useState("ar");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
    });

    // Force infinite carousel animation
    const ensureCarouselAnimation = () => {
      const track = document.querySelector('.infinite-carousel-track');
      if (track) {
        // Remove and re-add animation to force restart
        const currentAnimation = track.style.animation;
        track.style.animation = 'none';

        // Force reflow
        void track.offsetHeight;

        // Re-add animation with same properties
        track.style.animation = currentAnimation || 'slide 15s linear infinite';

        // Ensure animation is running
        track.style.animationPlayState = 'running';
      }
    };

    // Run immediately and then periodically
    ensureCarouselAnimation();

    // Set up interval to ensure animation keeps running
    const animationCheck = setInterval(() => {
      ensureCarouselAnimation();
    }, 5000); // Check every 5 seconds

    // Clean up on unmount
    return () => clearInterval(animationCheck);
  }, []);

  const content = {
    ar: {
      dir: "rtl",
      font: "font-cairo",
      nav: {
        home: "الرئيسية",
        about: "من نحن",
        programs: "البرامج",
        requirements: "الشروط",
        journey: "الرحلة",
        success: "قصص نجاح",
        partners: "شركاء النجاح",
        contact: "تواصل معنا",
      },
      hero: {
        badge: "التسجيل مفتوح لدفعة مارس 2026",
        title: 'انتقل من "متعلم" إلى "موظف خبير"',
        subtitle:
          "موثق ليس مجرد دورة تدريبية، إنه محاكاة حقيقية لبيئة العمل. اكتسب الخبرة العملية التي تحتاجها للنجاح في سوق العمل.",
        cta: "انضم إلى قائمة الانتظار",
        stats: "+150 خبير انطلقوا في مسيرتهم المهنية",
      },
      problem: {
        title: "فجوة الخبرة هي التحدي الأكبر",
        subtitle: "لماذا يجد الخريجون صعوبة في الحصول على وظائف؟",
        gap: "فجوة الخبرة",
        gapDesc:
          "تملك المعرفة النظرية ولكن تفتقر للخبرة العملية في بيئة العمل الحقيقية.",
        fear: "رهبة الإنتاج",
        fearDesc:
          "تخاف من التعامل مع مشاريع حقيقية أو دمج الكود في أنظمة معقدة.",
        methodology: "غياب المنهجية",
        methodologyDesc:
          "لا تعرف كيفية العمل ضمن فرق Agile أو استخدام أدوات مثل Jira و Azure DevOps.",
      },
      solution: {
        title: "موثق يحل فجوة الخبرة",
        subtitle: "نوفر لك بيئة عمل محاكاة بالكامل",
        points: [
          "بيئة عمل حقيقية مع فرق Agile",
          "مشاريع محاكاة مع Code Reviews",
          "أدوات احترافية (Jira, Azure DevOps)",
          "Sprints و Scrum Meetings",
          "CI/CD و Deployment Pipeline",
        ],
      },
      techStack: {
        title: "التقنيات والأدوات",
        subtitle: "تعلم التقنيات والأدوات المستخدمة في الشركات الكبرى",
        technologies: [
          { name: "React", image: `${process.env.PUBLIC_URL}/assets/react.png` },
          { name: "Laravel", image: `${process.env.PUBLIC_URL}/assets/Laravel.svg` },
          { name: "PHP", image: `${process.env.PUBLIC_URL}/assets/php.png` },
          { name: "Node.js", image: `${process.env.PUBLIC_URL}/assets/nodejs.webp` },
          { name: "Flutter", image: `${process.env.PUBLIC_URL}/assets/Flutter.webp` },
          { name: "Angular", image: `${process.env.PUBLIC_URL}/assets/angularjs.png` },
          { name: "Vue.js", image: `${process.env.PUBLIC_URL}/assets/vue.webp` },
          { name: "Next.js", image: `${process.env.PUBLIC_URL}/assets/nextjs.svg` },
          { name: "Express.js", image: `${process.env.PUBLIC_URL}/assets/expressjs.png` },
          { name: "MySQL", image: `${process.env.PUBLIC_URL}/assets/mysql.png` },
          { name: "MongoDB", image: `${process.env.PUBLIC_URL}/assets/mongodb.png` },
          { name: "PostgreSQL", image: `${process.env.PUBLIC_URL}/assets/postgresql.svg` },
          { name: "Tailwind CSS", image: `${process.env.PUBLIC_URL}/assets/tailwind-css.png` },
          { name: "Bootstrap", image: `${process.env.PUBLIC_URL}/assets/bootstrap.png` },
          { name: "HTML", image: `${process.env.PUBLIC_URL}/assets/html.png` },
          { name: "CSS", image: `${process.env.PUBLIC_URL}/assets/css.png` },
          { name: "JavaScript", image: `${process.env.PUBLIC_URL}/assets/javascrit.png` },
          { name: "MUI", image: `${process.env.PUBLIC_URL}/assets/mui.png` },
          { name: "Font Awesome", image: `${process.env.PUBLIC_URL}/assets/font_awesome.png` },
        ],
        tools: [
          { name: "GitHub", image: `${process.env.PUBLIC_URL}/assets/github.svg` },
          { name: "Jira", image: `${process.env.PUBLIC_URL}/assets/jira.png` },
          { name: "Azure DevOps", image: `${process.env.PUBLIC_URL}/assets/azure.png` },
          { name: "Agile", image: `${process.env.PUBLIC_URL}/assets/agile.svg` },
          { name: "Scrum", image: `${process.env.PUBLIC_URL}/assets/scrum.png` },
          { name: "Sprints", image: `${process.env.PUBLIC_URL}/assets/sprints.png` },
          { name: "Code Review", image: `${process.env.PUBLIC_URL}/assets/code-review.png` },
          { name: "CI/CD", image: `${process.env.PUBLIC_URL}/assets/ci-cd.webp` },
        ],
      },
      requirements: {
        title: "شروط الالتحاق",
        subtitle: "نبحث عن المطورين الجادين",
        items: [
          {
            icon: <BookOpen className="w-6 h-6" />,
            title: "أساسيات قوية",
            desc: "إتقان الأساسيات في المسار التقني المختار",
          },
          {
            icon: <Clock className="w-6 h-6" />,
            title: "التزام يومي",
            desc: "الالتزام بالمزامنات اليومية والأسابيعية",
          },
          {
            icon: <MessageSquare className="w-6 h-6" />,
            title: "انفتاح للمراجعات",
            desc: "الاستعداد لمراجعات الكود والتغذية الراجعة البناءة",
          },
          {
            icon: <Users className="w-6 h-6" />,
            title: "عقلية الفريق",
            desc: "القدرة على العمل ضمن فريق والتعاون الفعال",
          },
        ],
      },
      journey: {
        title: "رحلة الطالب (5 مراحل)",
        subtitle: "من التدريب إلى الاحتراف",
        stages: [
          {
            number: "01",
            title: "Onboarding",
            desc: "استقبال وتوجيه وتجهيز بيئة العمل",
            duration: "أسبوع",
          },
          {
            number: "02",
            title: "Learning Sprint",
            desc: "تعلم مكثف مع تقييمات مستمرة",
            duration: "أسبوعان",
          },
          {
            number: "03",
            title: "Project Simulation",
            desc: "العمل على مشاريع محاكاة واقعية",
            duration: "أسبوعان",
          },
          {
            number: "04",
            title: "Real Workflow",
            desc: "انضمام لفريق عمل حقيقي ومزامنات يومية",
            duration: "أسبوعان",
          },
          {
            number: "05",
            title: "Demo Day",
            desc: "عرض المشاريع وتقييم نهائي",
            duration: "يوم",
          },
        ],
      },
      success: {
        title: "قصص نجاح",
        subtitle: "خبراء من موثيق يشاركون قصصهم",
        stories: [
          {
            quote:
              "موثق ساعدني على كسر حاجز الخوف من الإنتاج. الآن أعمل بثقة في شركة كبرى.",
            name: "أحمد محمد",
            position: "Full Stack Developer",
            company: "شركة تقنية كبرى",
          },
          {
            quote:
              "البيئة المحاكاة أعطتني الخبرة التي كنت أحتاجها. بنيت معرض أعمال احترافي.",
            name: "فاطمة علي",
            position: "Frontend Developer",
            company: "شركة ناشئة",
          },
          {
            quote:
              "تعلمت كيفية العمل ضمن فريق Agile. هذا كان المفتاح للحصول على وظيفتي.",
            name: "محمد خالد",
            position: "Backend Developer",
            company: "شركة استشارية",
          },
        ],
      },
      partners: {
        title: "شركاء النجاح",
        subtitle: "شركات وخبراء يدعمون رحلتك",
      },
      cta: {
        title: "هل أنت مستعد لبدء رحلتك المهنية؟",
        subtitle:
          "انضم إلى قائمة الانتظار واحصل على فرصة لتغيير مسيرتك المهنية",
        form: {
          name: "الاسم الكامل",
          email: "البريد الإلكتروني",
          phone: "رقم الهاتف",
          track: "المسار التقني",
          message: "رسالة إضافية (اختياري)",
          submit: "انضم إلى قائمة الانتظار",
        },
        success: "شكراً لتسجيلك! سنتواصل معك خلال 48 ساعة.",
      },
      footer: {
        about:
          "موثق هو جسر يعبر بك من التعلم إلى التوظيف. نحن نوفر بيئة عمل حقيقية لمحاكاة الخبرة المهنية.",
        quickLinks: "روابط سريعة",
        contact: "تواصل معنا",
        rights: "جميع الحقوق محفوظة © 2026 موثق",
      },
    },
    en: {
      dir: "ltr",
      font: "font-almarai",
      nav: {
        home: "Home",
        about: "About",
        programs: "Programs",
        requirements: "Requirements",
        journey: "Journey",
        success: "Success Stories",
        partners: "Partners",
        contact: "Contact",
      },
      hero: {
        badge: "Registration Open for March 2026",
        title: 'Move from "Learner" to "Expert Employee"',
        subtitle:
          "Mawthiq is not just a training course, it's a real work environment simulation. Gain the practical experience you need to succeed in the job market.",
        cta: "Join the Waitlist",
        stats: "+150 experts launched their careers",
      },
      problem: {
        title: "The Experience Gap is the Biggest Challenge",
        subtitle: "Why do graduates struggle to get jobs?",
        gap: "Experience Gap",
        gapDesc:
          "You have theoretical knowledge but lack practical experience in a real work environment.",
        fear: "Production Fear",
        fearDesc:
          "You fear dealing with real projects or merging code into complex systems.",
        methodology: "Methodology Gap",
        methodologyDesc:
          "You don't know how to work in Agile teams or use tools like Jira and Azure DevOps.",
      },
      solution: {
        title: "Mawthiq Bridges the Experience Gap",
        subtitle: "We provide a fully simulated work environment",
        points: [
          "Real work environment with Agile teams",
          "Simulation projects with Code Reviews",
          "Professional tools (Jira, Azure DevOps)",
          "Sprints and Scrum Meetings",
          "CI/CD and Deployment Pipeline",
        ],
      },
      techStack: {
        title: "Technologies & Tools",
        subtitle: "Learn technologies and tools used in major companies",
        technologies: [
          { name: "React", image: `${process.env.PUBLIC_URL}/assets/react.png` },
          { name: "Laravel", image: `${process.env.PUBLIC_URL}/assets/Laravel.svg` },
          { name: "PHP", image: `${process.env.PUBLIC_URL}/assets/php.png` },
          { name: "Node.js", image: `${process.env.PUBLIC_URL}/assets/nodejs.webp` },
          { name: "Flutter", image: `${process.env.PUBLIC_URL}/assets/Flutter.webp` },
          { name: "Angular", image: `${process.env.PUBLIC_URL}/assets/angularjs.png` },
          { name: "Vue.js", image: `${process.env.PUBLIC_URL}/assets/vue.webp` },
          { name: "Next.js", image: `${process.env.PUBLIC_URL}/assets/nextjs.svg` },
          { name: "Express.js", image: `${process.env.PUBLIC_URL}/assets/expressjs.png` },
          { name: "MySQL", image: `${process.env.PUBLIC_URL}/assets/mysql.png` },
          { name: "MongoDB", image: `${process.env.PUBLIC_URL}/assets/mongodb.png` },
          { name: "PostgreSQL", image: `${process.env.PUBLIC_URL}/assets/postgresql.svg` },
          { name: "Tailwind CSS", image: `${process.env.PUBLIC_URL}/assets/tailwind-css.png` },
          { name: "Bootstrap", image: `${process.env.PUBLIC_URL}/assets/bootstrap.png` },
          { name: "HTML", image: `${process.env.PUBLIC_URL}/assets/html.png` },
          { name: "CSS", image: `${process.env.PUBLIC_URL}/assets/css.png` },
          { name: "JavaScript", image: `${process.env.PUBLIC_URL}/assets/javascrit.png` },
          { name: "MUI", image: `${process.env.PUBLIC_URL}/assets/mui.png` },
          { name: "Font Awesome", image: `${process.env.PUBLIC_URL}/assets/font_awesome.png` },
        ],
        tools: [
          { name: "GitHub", image: `${process.env.PUBLIC_URL}/assets/github.svg` },
          { name: "Jira", image: `${process.env.PUBLIC_URL}/assets/jira.png` },
          { name: "Azure DevOps", image: `${process.env.PUBLIC_URL}/assets/azure.png` },
          { name: "Agile", image: `${process.env.PUBLIC_URL}/assets/agile.svg` },
          { name: "Scrum", image: `${process.env.PUBLIC_URL}/assets/scrum.png` },
          { name: "Sprints", image: `${process.env.PUBLIC_URL}/assets/sprints.png` },
          { name: "Code Review", image: `${process.env.PUBLIC_URL}/assets/code-review.png` },
          { name: "CI/CD", image: `${process.env.PUBLIC_URL}/assets/ci-cd.webp` },
        ],
      },
      requirements: {
        title: "Eligibility Requirements",
        subtitle: "We are looking for serious developers",
        items: [
          {
            icon: <BookOpen className="w-6 h-6" />,
            title: "Solid Basics",
            desc: "Strong fundamentals in your chosen tech track",
          },
          {
            icon: <Clock className="w-6 h-6" />,
            title: "Daily Commitment",
            desc: "Commitment to daily syncs and weekly sprints",
          },
          {
            icon: <MessageSquare className="w-6 h-6" />,
            title: "Open to Reviews",
            desc: "Readiness for code reviews and constructive feedback",
          },
          {
            icon: <Users className="w-6 h-6" />,
            title: "Team Mindset",
            desc: "Ability to work in a team and effective collaboration",
          },
        ],
      },
      journey: {
        title: "Student Journey (5 Stages)",
        subtitle: "From Training to Professional",
        stages: [
          {
            number: "01",
            title: "Onboarding",
            desc: "Welcome, orientation, and work environment setup",
            duration: "1 week",
          },
          {
            number: "02",
            title: "Learning Sprint",
            desc: "Intensive learning with continuous assessments",
            duration: "2 weeks",
          },
          {
            number: "03",
            title: "Project Simulation",
            desc: "Working on realistic simulation projects",
            duration: "2 weeks",
          },
          {
            number: "04",
            title: "Real Workflow",
            desc: "Joining a real team and daily syncs",
            duration: "2 weeks",
          },
          {
            number: "05",
            title: "Demo Day",
            desc: "Project presentations and final evaluation",
            duration: "1 day",
          },
        ],
      },
      success: {
        title: "Success Stories",
        subtitle: "Mawthiq experts share their stories",
        stories: [
          {
            quote:
              "Mawthiq helped me break the fear of production. Now I work confidently at a major company.",
            name: "Ahmed Mohammed",
            position: "Full Stack Developer",
            company: "Major Tech Company",
          },
          {
            quote:
              "The simulation environment gave me the experience I needed. I built a professional portfolio.",
            name: "Fatima Ali",
            position: "Frontend Developer",
            company: "Startup Company",
          },
          {
            quote:
              "I learned how to work in Agile teams. This was the key to getting my job.",
            name: "Mohammed Khalid",
            position: "Backend Developer",
            company: "Consulting Company",
          },
        ],
      },
      partners: {
        title: "Success Partners",
        subtitle: "Companies and experts supporting your journey",
      },
      cta: {
        title: "Ready to Start Your Professional Journey?",
        subtitle: "Join the waitlist and get a chance to transform your career",
        form: {
          name: "Full Name",
          email: "Email Address",
          phone: "Phone Number",
          track: "Tech Track",
          message: "Additional Message (Optional)",
          submit: "Join Waitlist",
        },
        success:
          "Thank you for registering! We will contact you within 48 hours.",
      },
      footer: {
        about:
          "Mawthiq is a bridge that takes you from learning to employment. We provide a real work environment to simulate professional experience.",
        quickLinks: "Quick Links",
        contact: "Contact Us",
        rights: "All Rights Reserved © 2026 Mawthiq",
      },
    },
  };

  const t = content[lang];

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsFormSubmitted(true);
  };

  return (
    <div className={`min-h-screen bg-soft-gray ${t.font}`} dir={t.dir}>
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-lg shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-deep-blue to-emerald text-white rounded-lg flex items-center justify-center">
                <Terminal className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold gradient-text">Mawthiq</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {Object.entries(t.nav).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => scrollToSection(key)}
                  className="text-gray-600 hover:text-deep-blue transition-colors font-medium"
                >
                  {value}
                </button>
              ))}

              {/* Language Toggle */}
              <button
                onClick={() => setLang(lang === "ar" ? "en" : "ar")}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 transition-all"
              >
                <Globe className="w-4 h-4" />
                <span className="text-sm">
                  {lang === "ar" ? "English" : "العربية"}
                </span>
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden py-4 border-t"
              >
                <div className="flex flex-col gap-4">
                  {Object.entries(t.nav).map(([key, value]) => (
                    <button
                      key={key}
                      onClick={() => {
                        scrollToSection(key);
                        setMobileMenuOpen(false);
                      }}
                      className="text-gray-600 hover:text-deep-blue transition-colors font-medium text-right"
                    >
                      {value}
                    </button>
                  ))}

                  <button
                    onClick={() => setLang(lang === "ar" ? "en" : "ar")}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 transition-all justify-end"
                  >
                    <Globe className="w-4 h-4" />
                    <span className="text-sm">
                      {lang === "ar" ? "English" : "العربية"}
                    </span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div data-aos="fade-right">
              <div className="inline-flex items-center gap-2 bg-emerald/10 text-emerald px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <span className="w-2 h-2 bg-emerald rounded-full animate-pulse"></span>
                {t.hero.badge}
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                <span className="gradient-text">{t.hero.title}</span>
              </h1>

              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                {t.hero.subtitle}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={() => scrollToSection("cta")}
                  className="btn-primary bg-gradient-to-r from-deep-blue to-emerald text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  {t.hero.cta}
                  <ArrowRight
                    className={`w-5 h-5 ${lang === "ar" ? "rotate-180" : ""}`}
                  />
                </button>

                <div className="flex items-center gap-4 px-4">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-10 h-10 bg-gradient-to-br from-deep-blue to-emerald rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                      >
                        {i}
                      </div>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 font-semibold">
                    {t.hero.stats}
                  </span>
                </div>
              </div>
            </div>

            <div data-aos="fade-left" className="relative">
              <div className="relative z-10">
                <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="text-xs text-gray-500 font-mono">
                      Mawthiq IDE
                    </div>
                  </div>

                  <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm">
                    <div className="text-green-400 mb-2">
                      {'// Welcome to Mawthiq'}
                    </div>
                    <div className="text-blue-400 mb-2">
                      class CareerBridge {"{"}
                    </div>
                    <div className="text-gray-400 ml-4 mb-2">
                      constructor() {"{"}
                    </div>
                    <div className="text-emerald-400 ml-8 mb-2">
                      this.status = 'Expert';
                    </div>
                    <div className="text-emerald-400 ml-8 mb-2">
                      this.confidence = 100;
                    </div>
                    <div className="text-gray-400 ml-4 mb-2">{"}"}</div>
                    <div className="text-blue-400">{"}"}</div>

                    <div className="mt-4 flex gap-2">
                      <span className="px-2 py-1 bg-emerald/20 text-emerald text-xs rounded">
                        ✓ Sprint Active
                      </span>
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">
                        PR Approved
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute top-10 -right-10 w-20 h-20 bg-emerald/20 rounded-full animate-float"></div>
              <div
                className="absolute bottom-10 -left-10 w-16 h-16 bg-deep-blue/20 rounded-full animate-float"
                style={{ animationDelay: "1s" }}
              ></div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
              {t.problem.title}
            </h2>
            <p className="text-lg text-gray-600">{t.problem.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { key: "gap", icon: <Target className="w-8 h-8" /> },
              { key: "fear", icon: <Shield className="w-8 h-8" /> },
              { key: "methodology", icon: <Zap className="w-8 h-8" /> },
            ].map((item, index) => (
              <div
                key={item.key}
                className="card-hover bg-gray-50 p-8 rounded-2xl border border-gray-100"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-deep-blue to-emerald text-white rounded-xl flex items-center justify-center mb-6">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">
                  {t.problem[item.key]}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {t.problem[item.key + "Desc"]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-deep-blue to-emerald text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div data-aos="fade-right">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                {t.solution.title}
              </h2>
              <p className="text-lg mb-8 opacity-90">{t.solution.subtitle}</p>

              <div className="space-y-4">
                {t.solution.points.map((point, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald flex-shrink-0" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <div data-aos="fade-left">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">8</div>
                    <div className="text-sm opacity-80">أسابيع تدريب</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">5</div>
                    <div className="text-sm opacity-80">مراحل تطور</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">100%</div>
                    <div className="text-sm opacity-80">تطبيق عملي</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">24/7</div>
                    <div className="text-sm opacity-80">دعم فني</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
              {t.techStack.title}
            </h2>
            <p className="text-lg text-gray-600">{t.techStack.subtitle}</p>
          </div>

          {/* Technologies Infinite Carousel */}
          <div className="mb-16">
            <div className="infinite-carousel">
              <div className="infinite-carousel-track">
                {[...t.techStack.technologies, ...t.techStack.technologies].map((tech, index) => (
                  <div
                    key={index}
                    className="tech-logo bg-gray-50 p-4 rounded-xl border border-gray-200 text-center hover:shadow-lg transition-shadow"
                    data-aos="fade-up"
                  >
                    <img
                      src={tech.image}
                      alt={tech.name}
                      className="w-16 h-16 mx-auto mb-3 object-contain"
                    />
                    <div className="font-semibold text-sm">{tech.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tools Section */}
          <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {t.techStack.tools.map((tool, index) => (
                <div
                  key={index}
                  className="tool-card bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100 text-center hover:shadow-lg transition-all hover:scale-105"
                  data-aos="fade-up"
                  data-aos-delay={index * 50}
                >
                  <img
                    src={tool.image}
                    alt={tool.name}
                    className="w-12 h-12 mx-auto mb-3 object-contain"
                  />
                  <div className="font-semibold text-sm text-gray-800">{tool.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* Requirements Section */}
      <section
        id="requirements"
        className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
              {t.requirements.title}
            </h2>
            <p className="text-lg text-gray-600">{t.requirements.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.requirements.items.map((item, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl border border-gray-100 card-hover"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-deep-blue to-emerald text-white rounded-xl flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold mb-3">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey Section */}
      <section id="journey" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
              {t.journey.title}
            </h2>
            <p className="text-lg text-gray-600">{t.journey.subtitle}</p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full timeline-line"></div>

            <div className="space-y-12">
              {t.journey.stages.map((stage, index) => (
                <div
                  key={index}
                  className={`flex items-center ${index % 2 === 0 ? "flex-row-reverse" : ""}`}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div className="flex-1"></div>

                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-deep-blue to-emerald text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg">
                      {stage.number}
                    </div>
                  </div>

                  <div className="flex-1 px-8">
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                      <h3 className="text-xl font-bold mb-2">{stage.title}</h3>
                      <p className="text-gray-600 mb-3">{stage.desc}</p>
                      <div className="flex items-center gap-2 text-sm text-deep-blue font-semibold">
                        <Clock className="w-4 h-4" />
                        {stage.duration}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section
        id="success"
        className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-deep-blue to-emerald text-white"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t.success.title}
            </h2>
            <p className="text-lg opacity-90">{t.success.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {t.success.stories.map((story, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                <blockquote className="text-lg leading-relaxed mb-6 italic">
                  "{story.quote}"
                </blockquote>

                <div>
                  <div className="font-bold">{story.name}</div>
                  <div className="text-sm opacity-80">{story.position}</div>
                  <div className="text-sm opacity-60">{story.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section id="partners" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
              {t.partners.title}
            </h2>
            <p className="text-lg text-gray-600">{t.partners.subtitle}</p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {["Google", "Microsoft", "Amazon", "IBM", "Oracle", "SAP"].map(
              (partner, index) => (
                <div
                  key={index}
                  className="w-32 h-16 bg-gray-100 rounded-lg flex items-center justify-center font-bold text-gray-400"
                  data-aos="fade-up"
                  data-aos-delay={index * 50}
                >
                  {partner}
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        id="cta"
        className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-deep-blue to-emerald text-white"
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t.cta.title}
            </h2>
            <p className="text-lg opacity-90">{t.cta.subtitle}</p>
          </div>

          <div
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
            data-aos="fade-up"
          >
            {!isFormSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      {t.cta.form.name}
                    </label>
                    <input
                      type="text"
                      required
                      className="form-input w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/70 focus:outline-none focus:border-white"
                      placeholder={t.cta.form.name}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      {t.cta.form.email}
                    </label>
                    <input
                      type="email"
                      required
                      className="form-input w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/70 focus:outline-none focus:border-white"
                      placeholder={t.cta.form.email}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      {t.cta.form.phone}
                    </label>
                    <input
                      type="tel"
                      required
                      className="form-input w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/70 focus:outline-none focus:border-white"
                      placeholder={t.cta.form.phone}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      {t.cta.form.track}
                    </label>
                    <select className="form-input w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white">
                      <option value="">اختر المسار</option>
                      <option value="fullstack">Full Stack Development</option>
                      <option value="frontend">Frontend Development</option>
                      <option value="backend">Backend Development</option>
                      <option value="mobile">Mobile Development</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    {t.cta.form.message}
                  </label>
                  <textarea
                    rows="4"
                    className="form-input w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/70 focus:outline-none focus:border-white"
                    placeholder={t.cta.form.message}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full bg-white text-deep-blue py-4 rounded-xl font-bold hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
                >
                  {t.cta.form.submit}
                  <ChevronRight
                    className={`w-5 h-5 ${lang === "ar" ? "rotate-180" : ""}`}
                  />
                </button>
              </form>
            ) : (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-emerald/20 text-emerald rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{t.cta.success}</h3>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-deep-blue to-emerald text-white rounded-lg flex items-center justify-center">
                  <Terminal className="w-5 h-5" />
                </div>
                <span className="text-xl font-bold">Mawthiq</span>
              </div>
              <p className="text-gray-400 leading-relaxed">{t.footer.about}</p>
            </div>

            <div>
              <h3 className="font-bold mb-4">{t.footer.quickLinks}</h3>
              <div className="space-y-2">
                {Object.entries(t.nav)
                  .slice(0, 5)
                  .map(([key, value]) => (
                    <button
                      key={key}
                      onClick={() => scrollToSection(key)}
                      className="block text-gray-400 hover:text-white transition-colors"
                    >
                      {value}
                    </button>
                  ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-4">{t.footer.contact}</h3>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  info@mawthiq.com
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  +966 50 123 4567
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Riyadh, Saudi Arabia
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>{t.footer.rights}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
