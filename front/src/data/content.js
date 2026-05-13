import React from "react";
import {
  Terminal,
  Users,
  CheckCircle2,
  MessageSquare,
  Clock,
  Star,
  Target,
  BookOpen,
  Rocket,
  // Award,
  // FileCode,
  // Layout,
  // Server,
  // Zap,
} from "lucide-react";

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
      carousel: [
        {
          title: "انطلق في رحلتك المهنية مع موثق",
          subtitle: "من التعلم إلى الاحتراف، نوفر لك الجسر الحقيقي لسوق العمل",
          cta: "ابدأ رحلتك الآن",
          icon: <Rocket className="w-12 h-12" />,
          bg: "from-deep-blue to-emerald",
        },
        {
          title: "كن جزءاً من نخبة المطورين",
          subtitle: "نختار الأفضل لنضمن بيئة تعليمية متميزة ومحفزة",
          cta: "تقديم للانتقاء",
          icon: <Star className="w-12 h-12" />,
          bg: "from-purple-600 to-pink-600",
        },
        {
          title: "اعمل كأنك في شركة حقيقية",
          subtitle: "فرق Agile، اجتماعات يومية، ومدير مشاريع حقيقي",
          cta: "استكشف البيئة",
          icon: <Users className="w-12 h-12" />,
          bg: "from-blue-600 to-cyan-600",
        },
        {
          title: "بناء مشاريع تضيف لمعرض أعمالك",
          subtitle: "مشاريع تجارية حقيقية مع Code Reviews وتحديات واقعية",
          cta: "شاهد المشاريع",
          icon: <Terminal className="w-12 h-12" />,
          bg: "from-orange-600 to-red-600",
        },
        {
          title: "إتقان دورة حياة البرمجيات بالكامل",
          subtitle: "من Planning إلى Deployment، تعلم كل خطوة عملية",
          cta: "تعرف على المنهج",
          icon: <Target className="w-12 h-12" />,
          bg: "from-green-600 to-teal-600",
        },
        {
          title: "اجمع بين الخبرة والشهادة المعتمدة",
          subtitle: "منهجية Agile مع شهادة معتمدة في المشاريع البرمجية الحديثة",
          cta: "احصل على شهادتك",
          icon: <CheckCircle2 className="w-12 h-12" />,
          bg: "from-indigo-600 to-purple-600",
        },
      ],
      stats: "+150 خبير انطلقوا في مسيرتهم المهنية",
      bullets: [
        "بيئة عمل محاكاة حقيقية مع فرق Scrum وSprints.",
        "مشاريع قابلة للعرض مع Code Reviews وCI/CD.",
        "دعم فني وإرشاد مهني 24/7 حتى أول نشر حقيقي.",
      ],
      abVariants: {
        headlines: [
          { key: "A1", text: "ابدأ مشروعك العملي الأول خلال 8 أسابيع" },
          { key: "A2", text: "تدريب عملي مع شركات حقيقية وأدوات احترافية" },
          { key: "A3", text: "حوّل معرفتك إلى خبرة قابلة للتوظيف" },
        ],
        ctas: [
          { key: "cta_free", text: "ابدأ تجربة مجانية" },
          { key: "cta_book", text: "احجز مكانك الآن" },
          { key: "cta_demo", text: "اطلب عرض توضيحي قصير" },
        ],
      },
    },
    problem: {
      title: "فجوة الخبرة تمنعك من الحصول على أول وظيفة عملية",
      subtitle: "لماذا يجد الخريجون صعوبة في الحصول على وظائف؟",
      heroSubtitle:
        "المعرفة النظرية لا تكفي — تحتاج مشاريع عملية، أدوات حقيقية، وتجربة فريقية لتُوظّف.",
      ctaText: "هل تريد حل هذه الفجوة الآن",
      gap: "فجوة الخبرة",
      gapDesc: "معرفة نظرية قوية لكن بدون أمثلة عملية تُعرض لأصحاب العمل.",
      fear: "رهبة الإنتاج",
      fearDesc:
        "تتردد عند التعامل مع مشاريع حقيقية ودمج الكود في أنظمة حقيقية.",
      methodology: "غياب المنهجية",
      methodologyDesc:
        "لا تعرف كيفية العمل ضمن فريق Agile أو استخدام أدوات الشركات.",
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
      features: [
        {
          icon: "tool",
          title: "أدوات الشركات الحقيقية",
          benefit: "تعمل على Azure DevOps وJira لتدخل سوق العمل بثقة.",
        },
        {
          icon: "portfolio",
          title: "معرض أعمال قابل للعرض",
          benefit: "تقييم مهني ومراجعات كود تضيف مشاريع حقيقية لـ Portfolio.",
        },
        {
          icon: "deploy",
          title: "نظام نشر CI/CD حقيقي",
          benefit: "تجربة Deployment Pipeline كاملة من أول يوم.",
        },
        {
          icon: "team",
          title: "عمل فريقي Agile",
          benefit: "اجتماعات Scrum يومية بإشراف مهني حتى التخرج.",
        },
      ],
    },
    techStack: {
      title: "التقنيات والأدوات",
      subtitle: "تعلم التقنيات والأدوات المستخدمة في الشركات الكبرى",
      technologies: [
        { name: "React", image: `${process.env.PUBLIC_URL}/assets/react.png` },
        {
          name: "Laravel",
          image: `${process.env.PUBLIC_URL}/assets/Laravel.svg`,
        },
        { name: "PHP", image: `${process.env.PUBLIC_URL}/assets/php.png` },
        {
          name: "Node.js",
          image: `${process.env.PUBLIC_URL}/assets/nodejs.webp`,
        },
        {
          name: "Flutter",
          image: `${process.env.PUBLIC_URL}/assets/Flutter.webp`,
        },
        {
          name: "Angular",
          image: `${process.env.PUBLIC_URL}/assets/angularjs.png`,
        },
        { name: "Vue.js", image: `${process.env.PUBLIC_URL}/assets/vue.webp` },
        {
          name: "Next.js",
          image: `${process.env.PUBLIC_URL}/assets/nextjs.svg`,
        },
        {
          name: "Express.js",
          image: `${process.env.PUBLIC_URL}/assets/expressjs.png`,
        },
        { name: "MySQL", image: `${process.env.PUBLIC_URL}/assets/mysql.png` },
        {
          name: "MongoDB",
          image: `${process.env.PUBLIC_URL}/assets/mongodb.png`,
        },
        {
          name: "PostgreSQL",
          image: `${process.env.PUBLIC_URL}/assets/postgresql.svg`,
        },
        {
          name: "Tailwind CSS",
          image: `${process.env.PUBLIC_URL}/assets/tailwind-css.png`,
        },
        {
          name: "Bootstrap",
          image: `${process.env.PUBLIC_URL}/assets/bootstrap.png`,
        },
        { name: "HTML", image: `${process.env.PUBLIC_URL}/assets/html.png` },
        { name: "CSS", image: `${process.env.PUBLIC_URL}/assets/css.png` },
        {
          name: "JavaScript",
          image: `${process.env.PUBLIC_URL}/assets/javascrit.png`,
        },
        { name: "MUI", image: `${process.env.PUBLIC_URL}/assets/mui.png` },
        {
          name: "Font Awesome",
          image: `${process.env.PUBLIC_URL}/assets/font_awesome.png`,
        },
      ],
      tools: [
        {
          name: "GitHub",
          image: `${process.env.PUBLIC_URL}/assets/github.svg`,
        },
        { name: "Jira", image: `${process.env.PUBLIC_URL}/assets/jira.png` },
        {
          name: "Azure DevOps",
          image: `${process.env.PUBLIC_URL}/assets/azure.png`,
        },
        { name: "Agile", image: `${process.env.PUBLIC_URL}/assets/agile.svg` },
        { name: "Scrum", image: `${process.env.PUBLIC_URL}/assets/scrum.png` },
        {
          name: "Sprints",
          image: `${process.env.PUBLIC_URL}/assets/sprints.png`,
        },
        {
          name: "Code Review",
          image: `${process.env.PUBLIC_URL}/assets/code-review.png`,
        },
        { name: "CI/CD", image: `${process.env.PUBLIC_URL}/assets/ci-cd.webp` },
        {
          name: "Docker",
          image: `${process.env.PUBLIC_URL}/assets/docker.png`,
        },
        {
          name: "Postman",
          image: `${process.env.PUBLIC_URL}/assets/postman.png`,
        },
        { name: "Figma", image: `${process.env.PUBLIC_URL}/assets/figma.png` },
        { name: "Slack", image: `${process.env.PUBLIC_URL}/assets/slack.png` },
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
      title: "رحلة المتدرب — من التدريب إلى التوظيف خلال 6 أسابيع",
      subtitle:
        "خريطة عملية ومباشرة مع مهام يومية، أدوات حقيقية، ومخرجات قابلة للعرض أمام أصحاب العمل.",
      stages: [
        {
          number: "01",
          title: "استقبال وإعداد",
          keyEN: "onboarding",
          desc: "تهيئة بيئة العمل، إعداد الحسابات، وتعريف الفريق.",
          longDesc:
            "أسبوع تمهيدي يهدف إلى تجهيز المتدرب للعمل الفعلي: إعداد حسابات المشروع، تهيئة بيئة التطوير، تعريف الأدوات (Git, Jira, Azure DevOps)، ومنح صلاحيات الوصول. يتضمن جلسات تعريفية مع المرشد وقائد الفريق وقائمة مهام أولية لضمان انطلاقة سلسة.",
          descKeyEN: "onboarding_desc",
          duration: "أسبوع 1",
          weekKey: "week_1",
          highlight: false,
        },
        {
          number: "02",
          title: "Sprint تعلمي مكثف",
          keyEN: "learning_sprint",
          desc: "مهام قصيرة مع تقييمات يومية ومراجعات كود.",
          longDesc:
            "سلسلة مهام قصيرة ومركّزة مع تسليمات يومية: تمارين عملية، تحديات برمجية، ومراجعات كود فورية. الهدف رفع مستوى الثقة في كتابة الكود والعمل وفق معايير الفريق.",
          descKeyEN: "learning_sprint_desc",
          duration: "أسبوع 2",
          weekKey: "week_2",
          highlight: false,
        },
        {
          number: "03",
          title: "انطلاق المشروع (Project Kickoff)",
          keyEN: "project_kickoff",
          desc: "تشكيل فرق، تقسيم مهام، وبدء العمل على مشروع محاكاة.",
          longDesc:
            "تشكيل فرق صغيرة، تقسيم المهام إلى قصص مستخدم، وضع Definition of Done، وبدء تنفيذ أولى المهام تحت إشراف مهندس مرشد مع مراجعات دورية.",
          descKeyEN: "project_kickoff_desc",
          duration: "أسبوع 3",
          weekKey: "week_3",
          highlight: false,
        },
        {
          number: "04",
          title: "سير عمل حقيقي (Real Workflow)",
          keyEN: "real_workflow",
          desc: "مهام يومية ضمن فريق Agile، اجتماعات Scrum، ومراجعات كود.",
          longDesc:
            "العمل اليومي ضمن فريق Agile: اجتماعات Scrum، إدارة المهام في Jira/Azure DevOps، مراجعات كود رسمية، ودمج تغييرات عبر feature branches. هذه المرحلة تحاكي وتيرة العمل الحقيقية وتجهّز المتدرب لتحمّل مسؤوليات وظيفية.",
          descKeyEN: "real_workflow_desc",
          duration: "أسبوع 4",
          weekKey: "week_4",
          highlight: true,
        },
        {
          number: "05",
          title: "تكامل ونشر (CI/CD & Finalization)",
          keyEN: "ci_cd",
          desc: "إعداد pipeline، اختبارات، ونشر تجريبي.",
          longDesc:
            "إعداد خطوط التكامل والتسليم: كتابة اختبارات تلقائية، إعداد pipeline، تنفيذ نشر تجريبي إلى بيئة staging، ومراقبة الأداء. المتدرب يتعلم ضمان جودة الكود واستقرار النشر.",
          descKeyEN: "ci_cd_desc",
          duration: "أسبوع 5",
          weekKey: "week_5",
          highlight: false,
        },
        {
          number: "06",
          title: "يوم العرض والتحضير للتوظيف (Demo Day)",
          keyEN: "demo_day",
          desc: "عرض المشروع، تقييم نهائي، وإعداد محفظة أعمال قابلة للعرض.",
          longDesc:
            "عرض نهائي للمشاريع أمام لجنة تقييم وممثلين من سوق العمل، مراجعة محفظة الأعمال، جلسة تحضير للمقابلات، وخطة متابعة للتوظيف. الهدف خروج المتدرب بمواد قابلة للعرض وفرص متابعة توظيفية.",
          descKeyEN: "demo_day_desc",
          duration: "أسبوع 6",
          weekKey: "week_6",
          highlight: true,
        },
      ],
    },
    success: {
      // EN key: testimonials_title
      title: "آراء المتدربين",
      // EN key: testimonials_subtitle
      subtitle:
        "تجارب حقيقية من متدربين انتقلوا من التدريب إلى وظائف فعلية بعد إتمام البرنامج.",
      stories: [
        {
          // EN key: testimonial_1_name
          name: "ريم العتيبي",
          // EN key: testimonial_1_role
          position: "مطورة Frontend — موظفة حالياً في شركة تقنية",
          country: "السعودية",
          date: "مارس 2026",
          image:
            "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?fit=crop&w=300&h=300",
          // EN key: testimonial_1_quote
          quote:
            "بفضل الله ثم فضل هذا البرنامج، أصبحت قادرة على العمل في بيئة احترافية حقيقية. لم يكن الأمر سهلاً في البداية — كنت خائفة من Code Review ومن الأدوات الجديدة. لكن الفريق كان داعماً، والمهام كانت واضحة، والتغذية الراجعة كانت بنّاءة. بعد انتهاء البرنامج بأسبوعين فقط، حصلت على وظيفتي الأولى كـ Frontend Developer.",
        },
        {
          // EN key: testimonial_2_name
          name: "أيمن المحمود",
          // EN key: testimonial_2_role
          position:
            "Backend Developer — انتقل من تدريب نظري إلى بيئة إنتاج حقيقية",
          country: "الكويت",
          date: "فبراير 2026",
          image:
            "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?fit=crop&w=300&h=300",
          // EN key: testimonial_2_quote
          quote:
            "كنت أتساءل دائماً: كيف تعمل الشركات فعلاً؟ ما الفرق بين ما تعلمته في الكورسات وما يحدث على أرض الواقع؟ موثق أجاب على هذا السؤال عملياً. عملت ضمن فريق Agile حقيقي، استخدمت Azure DevOps، وأجريت أول Code Review في حياتي. الآن لديّ مشاريع أعرضها في المقابلات، وتوظيفي جاء في الشركة الأولى التي تقدمت إليها.",
        },
        {
          // EN key: testimonial_3_name
          name: "نورة الزهراني",
          // EN key: testimonial_3_role
          position:
            "Full Stack Developer — حصلت على عرض عمل قبل إتمام البرنامج",
          country: "السعودية",
          date: "يناير 2026",
          image:
            "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?fit=crop&w=300&h=300",
          // EN key: testimonial_3_quote
          quote:
            "ما ميّز موثق عن غيره هو أنه لم يكن مجرد تعليم — كان عمل حقيقي بمسؤوليات حقيقية. كل sprint كان لديه هدف، وكل مهمة كان لها تسليم واضح. شاركت في بناء مشروع كامل من الصفر حتى النشر، واكتسبت خبرة لا تحصل عليها في سنوات من المشاهدة والتمارين. حصلت على عرض عمل قبل أن ينتهي البرنامج بأسبوعين.",
        },
        {
          // EN key: testimonial_4_name
          name: "محمد الشريف",
          // EN key: testimonial_4_role
          position: "DevOps Engineer — تحوّل كامل في المسار المهني",
          country: "الأردن",
          date: "مارس 2026",
          image:
            "https://images.unsplash.com/photo-1557862921-37829c790f19?fit=crop&w=300&h=300",
          // EN key: testimonial_4_quote
          quote:
            "كنت أعمل في مجال آخر تماماً، وقررت تغيير مساري المهني نحو التقنية. كثيرون أخبروني أن هذا صعب بدون خبرة. لكن موثق أعطاني تلك الخبرة. من أول أسبوع بدأت أفهم كيف تعمل الفرق الحقيقية. تعلمت CI/CD وDocker وGit Workflows بشكل عملي. اليوم أعمل كـ DevOps Junior في شركة ناشئة، وأشعر أنني أستحق هذا المنصب.",
        },
        {
          // EN key: testimonial_5_name
          name: "سارة القحطاني",
          // EN key: testimonial_5_role
          position:
            "Mobile Developer — من خريجة جامعية إلى موظفة تقنية خلال شهرين",
          country: "الإمارات",
          date: "ديسمبر 2025",
          image:
            "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?fit=crop&w=300&h=300",
          // EN key: testimonial_5_quote
          quote:
            "تخرجت من الجامعة وكان لديّ معرفة نظرية جيدة، لكنني لم أكن أعرف كيف أعمل ضمن فريق أو كيف أستخدم أدوات بيئة العمل الحقيقية. في موثق تعلمت كيف أكتب كوداً قابلاً للمراجعة، وكيف أساهم في Sprint وأتعامل مع Merge Conflicts أمام الفريق. هذا ما جعل CV الخاصة بي مختلفة عن كل زميلاتي الخريجات.",
        },
      ],
    },
    partners: {
      title: "شركاء النجاح",
      subtitle: "شركات وخبراء يدعمون رحلتك",
    },
    cta: {
      title: "هل أنت مستعد لبدء رحلتك المهنية؟",
      subtitle: "انضم إلى قائمة الانتظار واحصل على فرصة لتغيير مسيرتك المهنية",
      primaryBtn: "ابدأ تجربة مجانية",
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
    // ─── Contact Section ───────────────────────────────────────────
    contact: {
      // EN key: contact_section_title
      title: "تواصل معنا واسأل عن كل ما يهمك",
      // EN key: contact_section_subtitle
      subtitle:
        "سواء كنت شركة تبحث عن شراكات، متدربًا يسعى لفرصة عملية، أو مدرّبًا يريد الانضمام كمرشد — نحن هنا لنستمع ونوجّهك.",
      // EN key: contact_section_paragraph
      paragraph:
        "أخبرنا بما تحتاجه وسنرد بخطة واضحة خلال 48 ساعة. نميّز بين احتياجات الشركات والمتدربين والمدرّبين لنقدّم استجابة مخصّصة: عروض تدريبية، فرص توظيف، أو تعاون تدريسي. املأ النموذج على اليمين — خطوة بسيطة تقربك من الحل.",
      // EN key: contact_section_trust
      trust: "نسبة استجابة سريعة؛ دعم مخصص؛ سرية تامة للمعلومات.",
      // A/B variants
      // EN key: contact_variant_a
      variantA: "أخبرنا بطبيعة احتياجك وسنقدّم حلًا مخصّصًا خلال 48 ساعة.",
      // EN key: contact_variant_b
      variantB:
        "هل تبحث عن تدريب عملي أو شريك توظيف؟ املأ النموذج وسنعود لك بخطوات واضحة.",
      // Form fields
      form: {
        // EN key: full_name
        fullName: "الاسم الكامل",
        // EN key: email
        email: "البريد الإلكتروني",
        // EN key: subject
        subject: "موضوع الرسالة",
        // EN key: message
        message: "اكتب رسالتك هنا...",
        // EN key: send_copy
        sendCopy: "أرسل لي نسخة على بريدي الإلكتروني",
        // EN key: audience_type
        audienceType: "نوع المرسل",
        audienceOptions: [
          { value: "company", label: "🏢 شركة" },
          { value: "trainee", label: "🎓 متدرب" },
          { value: "trainer", label: "🧑‍💼 مدرّب" },
        ],
        // Company fields
        // EN key: company_name
        companyName: "اسم الشركة",
        // EN key: company_size
        companySize: "حجم الشركة",
        companySizeOptions: ["1-10", "11-50", "51-200", "+200"],
        // EN key: company_interest
        companyInterest: "هدف التواصل",
        companyInterestOptions: ["شراكة", "توظيف", "تدريب", "استشارة"],
        // Trainee fields
        // EN key: track
        track: "المسار التقني",
        trackOptions: ["Frontend", "Backend", "Fullstack", "DevOps", "Data"],
        // EN key: wants_demo
        wantsDemo: "أريد جلسة تعريفية مجانية",
        // Trainer fields
        // EN key: experience_years
        experienceYears: "سنوات الخبرة",
        // EN key: trainer_interest
        trainerInterest: "نوع التعاون المطلوب",
        trainerInterestOptions: ["مرشد", "مدرّب جزئي", "مدرّب كامل"],
        // EN key: contact_cta
        submit: "أرسل الرسالة",
      },
      errors: {
        // EN key: full_name_required
        fullNameRequired: "الاسم الكامل مطلوب.",
        fullNameShort: "يجب أن يتكوّن الاسم من كلمتين على الأقل.",
        // EN key: email_required
        emailRequired: "البريد الإلكتروني مطلوب.",
        // EN key: email_invalid
        emailInvalid: "أدخل بريدًا إلكترونيًا صالحًا.",
        // EN key: subject_required
        subjectRequired: "الموضوع مطلوب.",
        // EN key: message_too_short
        messageTooShort: "الرسالة قصيرة جدًا، اكتب مزيدًا من التفاصيل.",
        audienceRequired: "يرجى تحديد نوع المرسل.",
      },
      // EN key: contact_success
      success: "شكرًا! استلمنا رسالتك وسنرد خلال 48 ساعة.",
    },
    footer: {
      // EN key: brand_name
      brandName: "موثّق",
      // EN key: brand_tagline
      brandTagline: "من التدريب إلى التوظيف — مشاريع عملية وأدوات حقيقية.",
      about:
        "موثق هو جسر يعبر بك من التعلم إلى التوظيف. نحن نوفر بيئة عمل حقيقية لمحاكاة الخبرة المهنية.",
      // Newsletter
      // EN key: newsletter_title
      newsletterTitle: "اشترك في النشرة البريدية",
      // EN key: newsletter_placeholder
      newsletterPlaceholder: "بريدك الإلكتروني",
      // EN key: newsletter_cta
      newsletterCta: "اشترك",
      newsletterConsent: "أوافق على استقبال الرسائل البريدية",
      newsletterSuccess: "شكرًا! تم اشتراكك بنجاح.",
      // Social alts
      social: {
        twitter: { alt: "Twitter / X", key: "social_twitter", href: "#" },
        linkedin: { alt: "LinkedIn", key: "social_linkedin", href: "#" },
        instagram: { alt: "Instagram", key: "social_instagram", href: "#" },
        youtube: { alt: "YouTube", key: "social_youtube", href: "#" },
      },
      // Sitemap categories
      sitemap: [
        {
          // EN key: footer_col_sitemap
          title: "خريطة الموقع",
          links: [
            { label: "الرئيسية", key: "sitemap_home", to: "hero" },
            { label: "من نحن", key: "sitemap_about", to: "solution" },
            { label: "تواصل معنا", key: "sitemap_contact", to: "contact" },
            { label: "المدونة", key: "sitemap_blog", to: "#" },
          ],
        },
        {
          // EN key: footer_col_business
          title: "الأعمال",
          links: [
            { label: "دراسات حالة", key: "works_case_studies", to: "#" },
            { label: "عملاؤنا", key: "works_clients", to: "partners" },
            { label: "شراكات", key: "works_partnerships", to: "partners" },
          ],
        },
        {
          // EN key: footer_col_products
          title: "المنتجات",
          links: [
            { label: "الكورسات", key: "products_courses", to: "journey" },
            { label: "البوتكامبس", key: "products_bootcamps", to: "journey" },
            { label: "الأدوات", key: "products_tools", to: "techStack" },
          ],
        },
        {
          // EN key: footer_col_support
          title: "الدعم",
          links: [
            { label: "أسئلة شائعة", key: "support_faq", to: "#" },
            { label: "التوثيق", key: "support_docs", to: "#" },
            { label: "تواصل معنا", key: "support_contact", to: "contact" },
          ],
        },
      ],
      // Bottom bar
      // EN key: copyright
      copyright: "© 2026 موثّق. كل الحقوق محفوظة.",
      // EN key: trademark
      trademark: "موثّق مسجّلة كعلامة تجارية.",
      // Legacy keys kept for compatibility
      quickLinks: "روابط سريعة",
      contact: "تواصل معنا",
      rights: "جميع الحقوق محفوظة © 2026 موثق",
    },
    // MegaMenu sections
    megaMenu: [
      {
        title: "خريطة الموقع",
        links: [
          { label: "الرئيسية", to: "hero", icon: "home" },
          { label: "البرنامج", to: "journey", icon: "map" },
          { label: "التقنيات", to: "techStack", icon: "cpu" },
          { label: "الشروط", to: "requirements", icon: "check" },
        ],
      },
      {
        title: "الموارد",
        links: [
          { label: "قصص نجاح", to: "success", icon: "star" },
          { label: "الشركاء", to: "partners", icon: "handshake" },
          { label: "رحلة المتدرب", to: "journey", icon: "rocket" },
          { label: "المدونة", to: "#", icon: "book" },
        ],
      },
      {
        title: "الأعمال",
        links: [
          { label: "شركات", to: "contact", icon: "building" },
          { label: "توظيف", to: "contact", icon: "briefcase" },
          { label: "دراسات حالة", to: "#", icon: "folder" },
        ],
      },
      {
        title: "سجّل الآن",
        isCta: true,
        links: [
          {
            label: "ابدأ مجانيّا",
            to: "contact",
            icon: "zap",
            highlight: true,
          },
          { label: "تواصل معنا", to: "contact", icon: "chat" },
        ],
      },
    ],
    courseDetails: {
      hero: {
        badge: "دبلوم مكثف — دفعة مارس 2026",
        title: "برنامج هندسة البرمجيات المتكاملة",
        subtitle:
          "حوّل شغفك إلى مهنة احترافية في 8 أسابيع من العمل الجاد على مشاريع حقيقية.",
        cta: "سجل مكانك الآن",
        secondaryCta: "تحميل الخطة الكاملة",
        price: "بداية من 1,500 ريال",
        duration: "8 أسابيع (دوام كامل)",
      },
      highlights: [
        {
          title: "تدريب عملي 100%",
          desc: "لا نظريات جوفاء، فقط كود ومشاريع حقيقية.",
          icon: "zap",
        },
        {
          title: "بيئة Scrum",
          desc: "تعمل في فريق محاكي للشركات الكبرى.",
          icon: "users",
        },
        {
          title: "شهادة معتمدة",
          desc: "توثق مهاراتك بشهادة خبرة عملية.",
          icon: "award",
        },
      ],
      curriculum: [
        {
          week: "الأسبوع 1-2",
          title: "أساسيات الويب وهيكلة البيانات",
          topics: [
            "HTML5 / Semantic UI",
            "CSS3 Advanced Layouts",
            "JavaScript (ES6+)",
            "Git & GitHub Workflow",
          ],
        },
        {
          week: "الأسبوع 3-4",
          title: "تطوير الواجهات (Frontend Mastery)",
          topics: [
            "React.js & State Management",
            "Tailwind CSS & Design Systems",
            "API Integration",
            "Performance Optimization",
          ],
        },
        {
          week: "الأسبوع 5-6",
          title: "الخوادم وقواعد البيانات (Backend)",
          topics: [
            "Node.js & Express",
            "MongoDB Design",
            "Authentication & Security",
            "Server Architecture",
          ],
        },
        {
          week: "الأسبوع 7-8",
          title: "المشروع النهائي والنشر (Deployment)",
          topics: [
            "Full-Stack Project",
            "CI/CD Pipelines",
            "Docker Basics",
            "Cloud Hosting (AWS/Vercel)",
          ],
        },
      ],
      techStack: {
        frontend: ["React", "Next.js", "Tailwind", "Framer Motion"],
        backend: ["Node.js", "Express", "PostgreSQL", "Redis"],
        tools: ["Docker", "Git", "Jira", "Figma"],
      },
      faq: [
        {
          q: "هل أحتاج لخبرة سابقة؟",
          a: "نفضل معرفة أساسيات البرمجة، لكننا نبدأ معك من هيكلة المشاريع الاحترافية.",
        },
        {
          q: "ما هو الوقت المتوقع للالتزام؟",
          a: "البرنامج مكثف، يتطلب 5-8 ساعات يومياً لضمان النتيجة.",
        },
      ],
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
      carousel: [
        {
          title: "Start Your Professional Journey with Mawthiq",
          subtitle:
            "From learning to professionalism, we provide the real bridge to the job market",
          cta: "Start Your Journey Now",
          icon: <Rocket className="w-12 h-12" />,
          bg: "from-deep-blue to-emerald",
        },
        {
          title: "Be Part of Elite Developers",
          subtitle:
            "We select the best to ensure an excellent and motivating learning environment",
          cta: "Apply for Selection",
          icon: <Star className="w-12 h-12" />,
          bg: "from-purple-600 to-pink-600",
        },
        {
          title: "Work as if in a Real Company",
          subtitle: "Agile teams, daily meetings, and a real project manager",
          cta: "Explore Environment",
          icon: <Users className="w-12 h-12" />,
          bg: "from-blue-600 to-cyan-600",
        },
        {
          title: "Build Projects for Your Portfolio",
          subtitle:
            "Real commercial projects with Code Reviews and realistic challenges",
          cta: "View Projects",
          icon: <Terminal className="w-12 h-12" />,
          bg: "from-orange-600 to-red-600",
        },
        {
          title: "Master the Complete Software Lifecycle",
          subtitle: "From Planning to Deployment, learn every practical step",
          cta: "Learn Curriculum",
          icon: <Target className="w-12 h-12" />,
          bg: "from-green-600 to-teal-600",
        },
        {
          title: "Combine Experience with Certified Certificate",
          subtitle:
            "Agile methodology with certified certificate in modern software projects",
          cta: "Get Your Certificate",
          icon: <CheckCircle2 className="w-12 h-12" />,
          bg: "from-indigo-600 to-purple-600",
        },
      ],
      stats: "+150 experts launched their careers",
    },
    problem: {
      title: "The Experience Gap is Blocking Your First Real Job",
      subtitle: "Why do graduates struggle to get jobs?",
      heroSubtitle:
        "Theoretical knowledge isn't enough — you need real projects, real tools, and team experience to get hired.",
      ctaText: "Want to close this gap now?",
      gap: "Experience Gap",
      gapDesc:
        "Strong theoretical knowledge, but no real-world examples to show employers.",
      fear: "Production Fear",
      fearDesc:
        "You hesitate when working with real projects or merging code into live systems.",
      methodology: "Methodology Gap",
      methodologyDesc:
        "You don't know how to work in an Agile team or use company tools.",
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
      features: [
        {
          icon: "tool",
          title: "Real Company Tools",
          benefit:
            "Work on Azure DevOps & Jira — enter the job market with confidence.",
        },
        {
          icon: "portfolio",
          title: "Presentable Portfolio",
          benefit:
            "Professional evaluation and code reviews that build your portfolio.",
        },
        {
          icon: "deploy",
          title: "Real CI/CD Pipeline",
          benefit: "Full deployment pipeline experience from day one.",
        },
        {
          icon: "team",
          title: "Agile Teamwork",
          benefit:
            "Daily Scrum meetings with professional mentorship until graduation.",
        },
      ],
    },
    techStack: {
      title: "Technologies & Tools",
      subtitle: "Learn technologies and tools used in major companies",
      technologies: [
        { name: "React", image: `${process.env.PUBLIC_URL}/assets/react.png` },
        {
          name: "Laravel",
          image: `${process.env.PUBLIC_URL}/assets/Laravel.svg`,
        },
        { name: "PHP", image: `${process.env.PUBLIC_URL}/assets/php.png` },
        {
          name: "Node.js",
          image: `${process.env.PUBLIC_URL}/assets/nodejs.webp`,
        },
        {
          name: "Flutter",
          image: `${process.env.PUBLIC_URL}/assets/Flutter.webp`,
        },
        {
          name: "Angular",
          image: `${process.env.PUBLIC_URL}/assets/angularjs.png`,
        },
        { name: "Vue.js", image: `${process.env.PUBLIC_URL}/assets/vue.webp` },
        {
          name: "Next.js",
          image: `${process.env.PUBLIC_URL}/assets/nextjs.svg`,
        },
        {
          name: "Express.js",
          image: `${process.env.PUBLIC_URL}/assets/expressjs.png`,
        },
        { name: "MySQL", image: `${process.env.PUBLIC_URL}/assets/mysql.png` },
        {
          name: "MongoDB",
          image: `${process.env.PUBLIC_URL}/assets/mongodb.png`,
        },
        {
          name: "PostgreSQL",
          image: `${process.env.PUBLIC_URL}/assets/postgresql.svg`,
        },
        {
          name: "Tailwind CSS",
          image: `${process.env.PUBLIC_URL}/assets/tailwind-css.png`,
        },
        {
          name: "Bootstrap",
          image: `${process.env.PUBLIC_URL}/assets/bootstrap.png`,
        },
        { name: "HTML", image: `${process.env.PUBLIC_URL}/assets/html.png` },
        { name: "CSS", image: `${process.env.PUBLIC_URL}/assets/css.png` },
        {
          name: "JavaScript",
          image: `${process.env.PUBLIC_URL}/assets/javascript.png`,
        },
        { name: "MUI", image: `${process.env.PUBLIC_URL}/assets/mui.png` },
        {
          name: "Font Awesome",
          image: `${process.env.PUBLIC_URL}/assets/font_awesome.png`,
        },
      ],
      tools: [
        {
          name: "GitHub",
          image: `${process.env.PUBLIC_URL}/assets/github.svg`,
        },
        { name: "Jira", image: `${process.env.PUBLIC_URL}/assets/jira.png` },
        {
          name: "Azure DevOps",
          image: `${process.env.PUBLIC_URL}/assets/azure.png`,
        },
        { name: "Agile", image: `${process.env.PUBLIC_URL}/assets/agile.svg` },
        { name: "Scrum", image: `${process.env.PUBLIC_URL}/assets/scrum.png` },
        {
          name: "Sprints",
          image: `${process.env.PUBLIC_URL}/assets/sprints.png`,
        },
        {
          name: "Code Review",
          image: `${process.env.PUBLIC_URL}/assets/code-review.png`,
        },
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
      title: "Trainee Journey — From Training to Employment in 6 Weeks",
      subtitle:
        "A practical roadmap with daily tasks, real tools, and presentable deliverables for employers.",
      stages: [
        {
          number: "01",
          title: "Onboarding",
          keyEN: "onboarding",
          desc: "Work environment setup, account configuration, and team introduction.",
          longDesc:
            "An introductory week to prepare the trainee for real work: setting up project accounts, configuring the development environment, introducing tools (Git, Jira, Azure DevOps), and granting access permissions. Includes orientation sessions with the mentor and team lead plus an initial task list for a smooth start.",
          descKeyEN: "onboarding_desc",
          duration: "Week 1",
          weekKey: "week_1",
          highlight: false,
        },
        {
          number: "02",
          title: "Learning Sprint",
          keyEN: "learning_sprint",
          desc: "Short tasks with daily evaluations and code reviews.",
          longDesc:
            "A series of short, focused tasks with daily deliverables: hands-on exercises, coding challenges, and immediate code reviews. The goal is to build confidence in writing code and working to team standards.",
          descKeyEN: "learning_sprint_desc",
          duration: "Week 2",
          weekKey: "week_2",
          highlight: false,
        },
        {
          number: "03",
          title: "Project Kickoff",
          keyEN: "project_kickoff",
          desc: "Team formation, task breakdown, and kickoff on a simulation project.",
          longDesc:
            "Forming small teams, breaking tasks into user stories, defining the Definition of Done, and beginning execution of first tasks under a mentor engineer with periodic reviews.",
          descKeyEN: "project_kickoff_desc",
          duration: "Week 3",
          weekKey: "week_3",
          highlight: false,
        },
        {
          number: "04",
          title: "Real Workflow",
          keyEN: "real_workflow",
          desc: "Daily tasks in an Agile team, Scrum meetings, and code reviews.",
          longDesc:
            "Daily work in an Agile team: Scrum meetings, task management in Jira/Azure DevOps, formal code reviews, and merging changes via feature branches. This phase mirrors the pace of real work and prepares the trainee for job responsibilities.",
          descKeyEN: "real_workflow_desc",
          duration: "Week 4",
          weekKey: "week_4",
          highlight: true,
        },
        {
          number: "05",
          title: "CI/CD & Finalization",
          keyEN: "ci_cd",
          desc: "Pipeline setup, testing, and trial deployment.",
          longDesc:
            "Setting up integration and delivery pipelines: writing automated tests, configuring the pipeline, executing a trial deployment to a staging environment, and monitoring performance. Trainees learn to ensure code quality and deployment stability.",
          descKeyEN: "ci_cd_desc",
          duration: "Week 5",
          weekKey: "week_5",
          highlight: false,
        },
        {
          number: "06",
          title: "Demo Day & Hiring Prep",
          keyEN: "demo_day",
          desc: "Project presentation, final evaluation, and building a presentable portfolio.",
          longDesc:
            "A final project presentation before an evaluation committee and job market representatives, portfolio review, interview preparation session, and an employment follow-up plan. The goal is for trainees to leave with presentable materials and follow-up job opportunities.",
          descKeyEN: "demo_day_desc",
          duration: "Week 6",
          weekKey: "week_6",
          highlight: true,
        },
      ],
    },
    success: {
      // EN key: testimonials_title
      title: "Our Trainees' Voices",
      // EN key: testimonials_subtitle
      subtitle:
        "Real experiences from trainees who moved from training to real jobs after completing the program.",
      stories: [
        {
          // EN key: testimonial_1_name
          name: "Reem Al-Otaibi",
          // EN key: testimonial_1_role
          position: "Frontend Developer — Currently employed at a tech company",
          country: "Saudi Arabia",
          date: "March 2026",
          image:
            "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?fit=crop&w=300&h=300",
          // EN key: testimonial_1_quote
          quote:
            "By the grace of God and this program, I became capable of working in a real professional environment. It wasn't easy at first — I was scared of Code Review and the new tools. But the team was supportive, the tasks were clear, and the feedback was constructive. Just two weeks after finishing the program, I landed my first job as a Frontend Developer.",
        },
        {
          // EN key: testimonial_2_name
          name: "Ayman Al-Mahmoud",
          // EN key: testimonial_2_role
          position:
            "Backend Developer — Moved from theoretical training to a real production environment",
          country: "Kuwait",
          date: "February 2026",
          image:
            "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?fit=crop&w=300&h=300",
          // EN key: testimonial_2_quote
          quote:
            "I always wondered: how do companies really work? What's the difference between what I learned in courses and what happens on the ground? Mawthiq answered that practically. I worked in a real Agile team, used Azure DevOps, and conducted my first Code Review. Now I have projects to show in interviews, and I got hired by the first company I applied to.",
        },
        {
          // EN key: testimonial_3_name
          name: "Noura Al-Zahrani",
          // EN key: testimonial_3_role
          position:
            "Full Stack Developer — Received a job offer before completing the program",
          country: "Saudi Arabia",
          date: "January 2026",
          image:
            "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?fit=crop&w=300&h=300",
          // EN key: testimonial_3_quote
          quote:
            "What distinguished Mawthiq was that it wasn't just education — it was real work with real responsibilities. Every sprint had a goal, every task had a clear deliverable. I participated in building a complete project from scratch to deployment, and I gained experience you can't get from years of watching tutorials. I received a job offer two weeks before the program ended.",
        },
        {
          // EN key: testimonial_4_name
          name: "Mohammed Al-Sharif",
          // EN key: testimonial_4_role
          position: "DevOps Engineer — Complete career change",
          country: "Jordan",
          date: "March 2026",
          image:
            "https://images.unsplash.com/photo-1557862921-37829c790f19?fit=crop&w=300&h=300",
          // EN key: testimonial_4_quote
          quote:
            "I was working in a completely different field and decided to switch my career to tech. Many told me it was hard without experience. But Mawthiq gave me that experience. From the first week I started understanding how real teams work. I learned CI/CD, Docker, and Git Workflows practically. Today I work as a DevOps Junior at a startup, and I feel I truly deserve this position.",
        },
        {
          // EN key: testimonial_5_name
          name: "Sara Al-Qahtani",
          // EN key: testimonial_5_role
          position:
            "Mobile Developer — From university graduate to tech employee in two months",
          country: "UAE",
          date: "December 2025",
          image:
            "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?fit=crop&w=300&h=300",
          // EN key: testimonial_5_quote
          quote:
            "I graduated from university with good theoretical knowledge, but I didn't know how to work in a team or use real work environment tools. At Mawthiq I learned how to write code that's ready for review, how to contribute to a Sprint, and how to handle Merge Conflicts in front of the team. This is what made my CV stand out from all my fellow graduates.",
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
      primaryBtn: "Start Free Trial",
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
    // ─── Contact Section ───────────────────────────────────────────
    contact: {
      // EN key: contact_section_title
      title: "Contact us and ask about everything that matters to you",
      // EN key: contact_section_subtitle
      subtitle:
        "Whether you're a company looking for partnerships, a trainee seeking practical opportunities, or a trainer wanting to join as a mentor — we're here to listen and guide you.",
      // EN key: contact_section_paragraph
      paragraph:
        "Tell us what you need and we'll respond with a clear plan within 48 hours. We differentiate between the needs of companies, trainees, and trainers to provide a customized response: training offers, employment opportunities, or teaching collaboration. Fill the form on the right — one simple step closer to your solution.",
      // EN key: contact_section_trust
      trust:
        "Fast response rate; dedicated support; complete information confidentiality.",
      // A/B variants
      // EN key: contact_variant_a
      variantA:
        "Tell us about your need and we'll provide a customized solution within 48 hours.",
      // EN key: contact_variant_b
      variantB:
        "Looking for practical training or a hiring partner? Fill the form and we'll get back with clear steps.",
      form: {
        // EN key: full_name
        fullName: "Full Name",
        // EN key: email
        email: "Email Address",
        // EN key: subject
        subject: "Message Subject",
        // EN key: message
        message: "Write your message here...",
        // EN key: send_copy
        sendCopy: "Send me a copy to my email",
        // EN key: audience_type
        audienceType: "Sender Type",
        audienceOptions: [
          { value: "company", label: "🏢 Company" },
          { value: "trainee", label: "🎓 Trainee" },
          { value: "trainer", label: "🧑‍💼 Trainer" },
        ],
        // EN key: company_name
        companyName: "Company Name",
        // EN key: company_size
        companySize: "Company Size",
        companySizeOptions: ["1-10", "11-50", "51-200", "+200"],
        // EN key: company_interest
        companyInterest: "Purpose of Contact",
        companyInterestOptions: [
          "Partnership",
          "Hiring",
          "Training",
          "Consulting",
        ],
        // EN key: track
        track: "Tech Track",
        trackOptions: ["Frontend", "Backend", "Fullstack", "DevOps", "Data"],
        // EN key: wants_demo
        wantsDemo: "I want a free intro session",
        // EN key: experience_years
        experienceYears: "Years of Experience",
        // EN key: trainer_interest
        trainerInterest: "Type of Collaboration",
        trainerInterestOptions: [
          "Mentor",
          "Part-time Trainer",
          "Full-time Trainer",
        ],
        // EN key: contact_cta
        submit: "Send Message",
      },
      errors: {
        // EN key: full_name_required
        fullNameRequired: "Full name is required.",
        fullNameShort: "Name must contain at least two words.",
        // EN key: email_required
        emailRequired: "Email address is required.",
        // EN key: email_invalid
        emailInvalid: "Please enter a valid email address.",
        // EN key: subject_required
        subjectRequired: "Subject is required.",
        // EN key: message_too_short
        messageTooShort: "Message is too short, please write more details.",
        audienceRequired: "Please select the sender type.",
      },
      // EN key: contact_success
      success:
        "Thank you! We received your message and will reply within 48 hours.",
    },
    footer: {
      // EN key: brand_name
      brandName: "Mawthiq",
      // EN key: brand_tagline
      brandTagline:
        "From training to employment — real projects and real tools.",
      about:
        "Mawthiq is a bridge that takes you from learning to employment. We provide a real work environment to simulate professional experience.",
      // Newsletter
      // EN key: newsletter_title
      newsletterTitle: "Subscribe to Newsletter",
      // EN key: newsletter_placeholder
      newsletterPlaceholder: "Your email address",
      // EN key: newsletter_cta
      newsletterCta: "Subscribe",
      newsletterConsent: "I agree to receive email messages",
      newsletterSuccess: "Thanks! You've subscribed successfully.",
      // Social alts
      social: {
        twitter: { alt: "Twitter / X", key: "social_twitter", href: "#" },
        linkedin: { alt: "LinkedIn", key: "social_linkedin", href: "#" },
        instagram: { alt: "Instagram", key: "social_instagram", href: "#" },
        youtube: { alt: "YouTube", key: "social_youtube", href: "#" },
      },
      // Sitemap categories
      sitemap: [
        {
          // EN key: footer_col_sitemap
          title: "Sitemap",
          links: [
            { label: "Home", key: "sitemap_home", to: "hero" },
            { label: "About", key: "sitemap_about", to: "solution" },
            { label: "Contact", key: "sitemap_contact", to: "contact" },
            { label: "Blog", key: "sitemap_blog", to: "#" },
          ],
        },
        {
          // EN key: footer_col_business
          title: "Business",
          links: [
            { label: "Case Studies", key: "works_case_studies", to: "#" },
            { label: "Clients", key: "works_clients", to: "partners" },
            {
              label: "Partnerships",
              key: "works_partnerships",
              to: "partners",
            },
          ],
        },
        {
          // EN key: footer_col_products
          title: "Products",
          links: [
            { label: "Courses", key: "products_courses", to: "journey" },
            { label: "Bootcamps", key: "products_bootcamps", to: "journey" },
            { label: "Tools", key: "products_tools", to: "techStack" },
          ],
        },
        {
          // EN key: footer_col_support
          title: "Support",
          links: [
            { label: "FAQ", key: "support_faq", to: "#" },
            { label: "Docs", key: "support_docs", to: "#" },
            { label: "Contact", key: "support_contact", to: "contact" },
          ],
        },
      ],
      // Bottom bar
      // EN key: copyright
      copyright: "© 2026 Mawthiq. All rights reserved.",
      // EN key: trademark
      trademark: "Mawthiq is a registered trademark.",
      // Legacy keys
      quickLinks: "Quick Links",
      contact: "Contact Us",
      rights: "All Rights Reserved © 2026 Mawthiq",
    },
    // MegaMenu sections
    megaMenu: [
      {
        title: "Sitemap",
        links: [
          { label: "Home", to: "hero", icon: "home" },
          { label: "Program", to: "journey", icon: "map" },
          { label: "Tech Stack", to: "techStack", icon: "cpu" },
          { label: "Requirements", to: "requirements", icon: "check" },
        ],
      },
      {
        title: "Resources",
        links: [
          { label: "Success Stories", to: "success", icon: "star" },
          { label: "Partners", to: "partners", icon: "handshake" },
          { label: "Journey", to: "journey", icon: "rocket" },
          { label: "Blog", to: "#", icon: "book" },
        ],
      },
      {
        title: "Business",
        links: [
          { label: "Companies", to: "contact", icon: "building" },
          { label: "Hiring", to: "contact", icon: "briefcase" },
          { label: "Case Studies", to: "#", icon: "folder" },
        ],
      },
      {
        title: "Get Started",
        isCta: true,
        links: [
          { label: "Start Free", to: "contact", icon: "zap", highlight: true },
          { label: "Contact Us", to: "contact", icon: "chat" },
        ],
      },
    ],
    courseDetails: {
      hero: {
        badge: "Intensive Diploma — March 2026 Batch",
        title: "Full-Stack Software Engineering Program",
        subtitle:
          "Transform your passion into a professional career in 8 weeks of intensive work on real-world projects.",
        cta: "Secure Your Seat Now",
        secondaryCta: "Download Full Roadmap",
        price: "Starting from $400",
        duration: "8 Weeks (Full-time)",
      },
      highlights: [
        {
          title: "100% Practical",
          desc: "No fluff, only code and real-world projects.",
          icon: "zap",
        },
        {
          title: "Scrum Environment",
          desc: "Work in teams simulating top tech companies.",
          icon: "users",
        },
        {
          title: "Certified",
          desc: "Verify your skills with a practical experience certificate.",
          icon: "award",
        },
      ],
      curriculum: [
        {
          week: "Week 1-2",
          title: "Web Foundations & Data Structure",
          topics: [
            "HTML5 / Semantic UI",
            "CSS3 Advanced Layouts",
            "JavaScript (ES6+)",
            "Git & GitHub Workflow",
          ],
        },
        {
          week: "Week 3-4",
          title: "Frontend Mastery",
          topics: [
            "React.js & State Management",
            "Tailwind CSS & Design Systems",
            "API Integration",
            "Performance Optimization",
          ],
        },
        {
          week: "Week 5-6",
          title: "Backend & Systems",
          topics: [
            "Node.js & Express",
            "MongoDB Design",
            "Authentication & Security",
            "Server Architecture",
          ],
        },
        {
          week: "Week 7-8",
          title: "Final Project & Deployment",
          topics: [
            "Full-Stack Project",
            "CI/CD Pipelines",
            "Docker Basics",
            "Cloud Hosting (AWS/Vercel)",
          ],
        },
      ],
      techStack: {
        frontend: ["React", "Next.js", "Tailwind", "Framer Motion"],
        backend: ["Node.js", "Express", "PostgreSQL", "Redis"],
        tools: ["Docker", "Git", "Jira", "Figma"],
      },
      faq: [
        {
          q: "Do I need prior experience?",
          a: "Basic programming knowledge is preferred, but we start from professional project structuring.",
        },
        {
          q: "What is the expected time commitment?",
          a: "The program is intensive, requiring 5-8 hours daily to guarantee results.",
        },
      ],
    },
  },
};

export default content;
