import React, { useState } from "react";
import { Language } from "../types";
import {
  CheckCircle2,
  PhoneCall,
  Zap,
  Lock,
  ArrowRight,
  Globe,
  TrendingUp,
  Camera,
  GraduationCap,
  Crown,
  Star,
  BarChart2,
  Megaphone,
  Calculator,
  ShieldCheck,
  Building,
  Sparkles,
  MapPin,
  Check
} from "lucide-react";
import { getTranslation } from "../i18n/translations";

interface PlansSectionProps {
  setActiveTab: (tab: string, option?: string) => void;
  lang?: Language;
}

export type PlanRegion = "egypt" | "saudi" | "uae" | "kuwait" | "europe" | "global";

interface RegionalPlan {
  id: string;
  badgeAr: string;
  badgeEn: string;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  priceDisplayAr: string;
  priceDisplayEn: string;
  durationAr: string;
  durationEn: string;
  featured: boolean;
  featuresAr: string[];
  featuresEn: string[];
  ctaAr: string;
  ctaEn: string;
  whatsappMessage: string;
}

export const REGIONAL_PLANS_DATA: Record<PlanRegion, {
  regionNameAr: string;
  regionNameEn: string;
  flag: string;
  currencyNoteAr: string;
  currencyNoteEn: string;
  plans: RegionalPlan[];
}> = {
  egypt: {
    regionNameAr: "السوق المصري",
    regionNameEn: "Egyptian Market",
    flag: "🇪🇬",
    currencyNoteAr: "الأسعار بالجنيه المصري (EGP) مخصصة للشركات والأنشطة العاملة داخل جمهورية مصر العربية.",
    currencyNoteEn: "Priced in Egyptian Pounds (EGP), tailored for enterprises operating in Egypt.",
    plans: [
      {
        id: "eg-diagnostic",
        badgeAr: "مصفوفة التشخيص المستقل",
        badgeEn: "Diagnostic Blueprint",
        titleAr: "كتاب التشخيص التشريحي وعزل الهدر المالي",
        titleEn: "Anatomical Diagnostic & Waste Elimination Matrix",
        subtitleAr: "فحص ميداني شامل لكشف مواطن تسريب الميزانيات في الإعلانات المحلية والواتساب قبل التعاقد.",
        subtitleEn: "Comprehensive audit identifying marketing spend leakage and sales funnel bleed in Egypt.",
        priceDisplayAr: "10,000 ج.م",
        priceDisplayEn: "10,000 EGP",
        durationAr: "7 - 10 أيام عمل",
        durationEn: "7 - 10 Business Days",
        featured: false,
        featuresAr: [
          "فحص مواطن الهدر المالي المباشر في حملات ميتا وتيك توك بالسوق المصري",
          "تشريح رحلة العميل واكتشاف التسريب البيعي في قنوات الواتساب والمحادثات",
          "تقرير تحليلي مستقل ومكتوب يحدد مكامن القوة والفرص الاستثمارية للنشاط",
          "جلسة استشارية تشخيصية مباشرة (حضوري بالقاهرة أو أونلاين) مع كوتش سراج",
          "خصم 100% من قيمة هذا التشخيص عند الترقية لخطة التحول لـ 90 يوماً"
        ],
        featuresEn: [
          "Direct audit of ad spend leakage across Meta and TikTok campaigns in Egypt",
          "Customer journey anatomy uncovering sales drop-off on WhatsApp & phone channels",
          "Independent written diagnostic report with concrete growth opportunities",
          "Private 1-on-1 diagnostic session (in Cairo or remote) with Coach Serag",
          "100% credit applied toward any 90-Day transformation plan upon contract signing"
        ],
        ctaAr: "طلب التشخيص المستقل (مصر)",
        ctaEn: "Request Egyptian Diagnostic",
        whatsappMessage: "السلام عليكم، أرغب في طلب كتاب التشخيص الميداني وعزل الهدر المالي في مصر (10,000 ج.م)"
      },
      {
        id: "eg-transformation-90",
        badgeAr: "الخطة الأكثر طلباً بمصر",
        badgeEn: "Most Popular in Egypt",
        titleAr: "خطة التحول الاستراتيجي والتشغيل الميداني — 90 يوماً",
        titleEn: "90-Day Strategic Transformation & Field Execution",
        subtitleAr: "إعادة بناء الهيكل التسويقي والبيعي وإنتاج محتوى سينمائي 4K ووقف النزيف المالي بالكامل.",
        subtitleEn: "Restructure marketing and sales architecture with on-ground 4K filming and ROAS optimization.",
        priceDisplayAr: "25,000 ج.م",
        priceDisplayEn: "25,000 EGP",
        durationAr: "90 يوماً تنفيذية",
        durationEn: "90 Execution Days",
        featured: true,
        featuresAr: [
          "إعادة تهيئة الهوية البصرية ورسائل المبيعات المباشرة للمستهلك المصري",
          "يوم تصوير سينمائي 4K كامل لمقر النشاط أو المنتجات بالقاهرة/الإسكندرية عبر Pioneers",
          "إنتاج 12 فيديو ريلز إعلاني عالي التحويل + 20 بوست وتصميم شهرياً",
          "تدريب مسؤولي المبيعات على سيناريوهات الإغلاق السريع (Sales Closing SOPs)",
          "استرداد كافة التكاليف التسويقية دفترياً وفق المعايير المحاسبية والضريبية المصرية",
          "إشراف ومتابعة أسبوعية مباشرة على ROAS لضمان وصوله إلى 3.5x فما فوق"
        ],
        featuresEn: [
          "Re-align visual identity and direct response messaging for the Egyptian consumer",
          "Full-day 4K cinematic on-ground filming at your location (Cairo/Alexandria) via Pioneers",
          "Production of 12 high-converting promotional reels + 20 graphic posts monthly",
          "Sales team coaching with battle-tested closing frameworks (Sales Closing SOPs)",
          "Tax-deductible accounting and marketing expense recovery under Egyptian commercial standards",
          "Weekly direct ROAS optimization sprints targeting 3.5x+ return on ad spend"
        ],
        ctaAr: "بدء خطة التحول 90 يوماً (مصر)",
        ctaEn: "Start 90-Day Transformation (Egypt)",
        whatsappMessage: "السلام عليكم كوتش سراج، أطلب الانضمام لخطة التحول الاستراتيجي 90 يوماً بالسوق المصري (25,000 ج.م)"
      },
      {
        id: "eg-dominance-90",
        badgeAr: "الهيمنة والتوسع السوقي",
        badgeEn: "Market Dominance",
        titleAr: "خطة الهيمنة والتوسع السوقي الشامل — 90 يوماً",
        titleEn: "Comprehensive Market Dominance & Enterprise Scale",
        subtitleAr: "للمؤسسات والأنشطة الراغبة في اكتساح المنافسين، ومضاعفة المبيعات، وبناء أسطول تسويقي مؤتمت.",
        subtitleEn: "For enterprises aiming to outpace competitors, double revenue, and deploy an automated sales engine.",
        priceDisplayAr: "45,000 ج.م",
        priceDisplayEn: "45,000 EGP",
        durationAr: "90 يوماً مكثفة",
        durationEn: "90 Intensive Days",
        featured: false,
        featuresAr: [
          "إعادة تسعير المنتجات والخدمات لبناء باقات القيمة المرتفعة (High-Ticket Packages)",
          "3 أيام تصوير وإنتاج سينمائي 4K كامل وتغطية الفعاليات والمؤتمرات الكبرى",
          "أتمتة قمع المبيعات بالكامل والربط مع WhatsApp Cloud API للردود الفورية",
          "قيادة الحملات الإعلانية عالية الكثافة واقتناص الحصة السوقية من المنافسين",
          "هندسة برامج ولاء وإحالة العملاء الدائمين لرفع القيمة التكرارية للشراء",
          "خط ساخن استشاري مباشر مع كوتش سراج واجتماعات إشراف أسبوعية مغلقة"
        ],
        featuresEn: [
          "Strategic re-pricing to build lucrative high-ticket packages and premium offerings",
          "3 full days of 4K cinematic production covering key events, brand assets, and venues",
          "Full sales funnel automation integrated directly with official WhatsApp Cloud API",
          "High-intensity media buying aggressive competitor market-share acquisition",
          "Customer retention and VIP referral architecture maximizing customer lifetime value",
          "Direct priority consulting hotline with Coach Serag and weekly closed executive meetings"
        ],
        ctaAr: "طلب باقة الهيمنة السوقية (مصر)",
        ctaEn: "Request Dominance Suite (Egypt)",
        whatsappMessage: "السلام عليكم، أطلب باقة الهيمنة والتوسع السوقي 90 يوماً بالسوق المصري (45,000 ج.م)"
      }
    ]
  },

  saudi: {
    regionNameAr: "السوق السعودي (المملكة العربية السعودية)",
    regionNameEn: "Saudi Arabia Market",
    flag: "🇸🇦",
    currencyNoteAr: "الأسعار بالريال السعودي (SAR) مخصصة للشركات والأنشطة العاملة داخل المملكة (الرياض، جدة، الشرقية).",
    currencyNoteEn: "Priced in Saudi Riyals (SAR), tailored for enterprises operating in Saudi Arabia (Riyadh, Jeddah, Eastern Province).",
    plans: [
      {
        id: "sa-diagnostic",
        badgeAr: "مصفوفة فحص السوق السعودي",
        badgeEn: "Saudi Market Diagnostic",
        titleAr: "التشخيص الاستراتيجي وعزل الهدر في السوق السعودي",
        titleEn: "Saudi Strategic Audit & Ad Spend Optimization",
        subtitleAr: "تحليل تنافسي دقيق لأسواق الرياض وجدة مع عزل الهدر في إعلانات سناب شات وتيك توك السعودية.",
        subtitleEn: "In-depth competitive audit tailored for Riyadh and Jeddah consumer spending dynamics.",
        priceDisplayAr: "3,800 ريال سعودي",
        priceDisplayEn: "3,800 SAR",
        durationAr: "7 - 10 أيام عمل",
        durationEn: "7 - 10 Business Days",
        featured: false,
        featuresAr: [
          "تحليل تموضع العلامة والقدرة التنافسية في قطاعات التجزئة والخدمات بالرياض وجدة",
          "تشريح سلوك المستهلك السعودي عالي القوة الشرائية واحتساب الـ Customer LTV",
          "فحص كفاءة الإنفاق الإعلاني على منصات سناب شات، تيك توك، ومنصة إكس (X)",
          "تقرير استراتيجي يحدد فجوات السوق وفرص التوسع السريع داخل مدن المملكة",
          "جلسة استشارية تنفيذية مغلقة عن بُعد (Secure Remote Executive Session) مع كوتش سراج",
          "خصم 100% من قيمة هذا التشخيص عند التعاقد على خطة التحول السعودية لـ 90 يوماً"
        ],
        featuresEn: [
          "Competitive positioning audit across Riyadh and Jeddah commercial ecosystems",
          "High-AOV Saudi consumer behavior modeling and customer lifetime value framework",
          "Ad spend efficiency audit across Snapchat, TikTok KSA, and X ad engines",
          "Strategic expansion roadmap identifying rapid scaling gaps in Saudi Arabia",
          "Confidential 1-on-1 executive video briefing directly with Coach Serag",
          "100% credited toward your 90-Day Saudi transformation agreement"
        ],
        ctaAr: "طلب تشخيص السوق السعودي (3,800 ر.س)",
        ctaEn: "Request Saudi Diagnostic (3,800 SAR)",
        whatsappMessage: "السلام عليكم، أرغب في طلب مصفوفة التشخيص الاستراتيجي للسوق السعودي (3,800 ريال سعودي)"
      },
      {
        id: "sa-transformation-90",
        badgeAr: "باقة التحول والتوسع السعودي المعتمدة",
        badgeEn: "Premier Saudi Transformation",
        titleAr: "منظومة التحول والتوسع في السوق السعودي — 90 يوماً",
        titleEn: "90-Day Saudi Strategic Transformation & Scaling",
        subtitleAr: "إعادة التموضع الراقي المتوافق مع الذائقة السعودية، واستراتيجية إعلانات الشرائح الممتازة، والمحتوى 4K.",
        subtitleEn: "Premium brand recalibration for Saudi taste, high-AOV targeting, and luxury 4K visual direction.",
        priceDisplayAr: "9,500 ريال سعودي",
        priceDisplayEn: "9,500 SAR",
        durationAr: "90 يوماً تنفيذية",
        durationEn: "90 Execution Days",
        featured: true,
        featuresAr: [
          "إعادة تموضع العلامة التجارية بما يتطابق مع الذائقة السعودية الرفيعة ومواسم الشراء",
          "إعلانات موجهة للشرائح السعودية ذات القوة الشرائية المرتفعة (High-Ticket Segments)",
          "إشراف إخراجي وفني متكامل على إنتاج المحتوى المرئي الفاخر المتوافق مع معايير 4K",
          "تفعيل استراتيجيات الإعلانات المؤثرة (Influencer Whitelisting & Creator Spark Ads)",
          "هندسة حملات مواسم المملكة الكبرى (عروض رمضان، يوم التأسيس، اليوم الوطني السعودي)",
          "مراقبة أسبوعية مباشرة لـ ROAS لضمان نمو الإيرادات والأرباح الصافية"
        ],
        featuresEn: [
          "Luxury brand repositioning aligning with premium Saudi cultural and visual standards",
          "High-AOV audience targeting capturing affluent consumer segments across KSA",
          "Complete creative direction & masterclass 4K asset production specifications via Pioneers",
          "Influencer whitelisting and creator spark ad integration on TikTok and Snapchat",
          "Major Saudi commercial calendar optimization (Ramadan, Founding Day, National Day)",
          "Weekly direct ROAS optimization sprints focused on Saudi market revenue growth"
        ],
        ctaAr: "بدء التحول السعودي 90 يوماً (9,500 ر.س)",
        ctaEn: "Start Saudi 90-Day Transformation (9,500 SAR)",
        whatsappMessage: "السلام عليكم كوتش سراج، أطلب التعاقد على منظومة التحول والتوسع بالسوق السعودي 90 يوماً (9,500 ر.س)"
      },
      {
        id: "sa-dominance-90",
        badgeAr: "الهيمنة السوقية في المملكة",
        badgeEn: "KSA Market Dominance",
        titleAr: "الهيمنة والتوسع المؤسسي الشامل في المملكة — 90 يوماً",
        titleEn: "Saudi Enterprise Dominance & Multi-City Expansion",
        subtitleAr: "خطة توسع مؤسسية كبرى تغطي الرياض، جدة، والدمام لإنشاء كيان تجاري رائد ومستدام.",
        subtitleEn: "Enterprise expansion framework establishing market leadership across Riyadh, Jeddah & Eastern Province.",
        priceDisplayAr: "18,500 ريال سعودي",
        priceDisplayEn: "18,500 SAR",
        durationAr: "90 يوماً مكثفة",
        durationEn: "90 Intensive Days",
        featured: false,
        featuresAr: [
          "خطة انتشار شاملة متعددة الفروع تغطي العاصمة الرياض ومحافظات المملكة الرئيسية",
          "هندسة باقات الصفقات الكبرى للقطاعات التجارية والحكومية (B2B & VIP Corporate Accounts)",
          "تأسيس الإجراءات القياسية (SOPs) لفريق خدمة العملاء والمبيعات السعودي بلباقة واحتراف",
          "حوكمة العمليات والبيانات المشفرة وحماية الملكية الفكرية بموجب وثائق DIMC",
          "اتفاقيات مستوى الخدمة المتقدمة (Enterprise SLA) وتدقيق هوامش الربحية الصافية",
          "خط ساخن استشاري مباشر لمجلس الإدارة مع كوتش سراج واجتماعات توجيه دورية"
        ],
        featuresEn: [
          "Multi-branch distribution strategy spanning Riyadh, Jeddah, and Eastern Province",
          "High-ticket B2B institutional deal structuring and VIP corporate client portfolios",
          "Standard Operating Procedures (SOPs) for Saudi customer concierge and sales reps",
          "Enterprise governance with cryptographic data protection and DIMC intellectual property coverage",
          "Enterprise SLA performance guarantees and net profit margin optimization",
          "Direct board-level executive hotline with Coach Serag with scheduled strategic briefings"
        ],
        ctaAr: "طلب باقة الهيمنة السعودية (18,500 ر.س)",
        ctaEn: "Request Saudi Dominance Suite (18,500 SAR)",
        whatsappMessage: "السلام عليكم، أطلب باقة التوسع المؤسسي والهيمنة بالسوق السعودي 90 يوماً (18,500 ر.س)"
      }
    ]
  },

  uae: {
    regionNameAr: "سوق دولة الإمارات (دبي وأبوظبي)",
    regionNameEn: "United Arab Emirates Market",
    flag: "🇦🇪",
    currencyNoteAr: "الأسعار بالدرهم الإماراتي (AED) مخصصة للشركات والأنشطة العاملة داخل دولة الإمارات العربية المتحدة.",
    currencyNoteEn: "Priced in UAE Dirhams (AED), tailored for enterprises operating in Dubai, Abu Dhabi, and UAE.",
    plans: [
      {
        id: "uae-diagnostic",
        badgeAr: "مصفوفة فحص السوق الإماراتي",
        badgeEn: "UAE Market Diagnostic",
        titleAr: "التشخيص الاستراتيجي واختراق سوق الإمارات ودبي",
        titleEn: "UAE & Dubai Market Strategic Diagnostic",
        subtitleAr: "تحليل تنافسي دقيق لبيئة الأعمال بدبي وأبوظبي مع عزل الهدر في الحملات الإعلانية الدولية والمحلية.",
        subtitleEn: "In-depth competitive audit tailored for Dubai and Abu Dhabi high-margin commerce.",
        priceDisplayAr: "3,800 درهم إماراتي",
        priceDisplayEn: "3,800 AED",
        durationAr: "7 - 10 أيام عمل",
        durationEn: "7 - 10 Business Days",
        featured: false,
        featuresAr: [
          "تحليل تموضع العلامة في السوق الإماراتي التنافسي متعدد الجنسيات",
          "تشريح رحلة العميل واكتشاف فجوات التحويل على قنوات الواتساب والمواقع الفاخرة",
          "فحص كفاءة الإنفاق الإعلاني على Meta, Google Ads Search, و TikTok UAE",
          "تقرير استراتيجي يحدد تموضع النشاط وفرص جذب العملاء الدوليين والمحليين",
          "جلسة استشارية تنفيذية مغلقة عن بُعد 1-on-1 مع كوتش سراج",
          "خصم 100% من قيمة هذا التشخيص عند التعاقد على خطة التحول لـ 90 يوماً"
        ],
        featuresEn: [
          "Multinational brand positioning audit in the highly competitive UAE ecosystem",
          "Customer journey anatomy across WhatsApp concierge and luxury web funnels",
          "Ad spend efficiency audit across Meta, Google Search, and TikTok UAE",
          "Strategic roadmap targeting resident and tourist high-margin segments",
          "Confidential 1-on-1 executive video briefing directly with Coach Serag",
          "100% credited toward your 90-Day UAE transformation agreement"
        ],
        ctaAr: "طلب تشخيص سوق الإمارات (3,800 د.إ)",
        ctaEn: "Request UAE Diagnostic (3,800 AED)",
        whatsappMessage: "السلام عليكم، أرغب في طلب مصفوفة التشخيص لسوق الإمارات (3,800 درهم إماراتي)"
      },
      {
        id: "uae-transformation-90",
        badgeAr: "باقة التحول والتوسع الإماراتي",
        badgeEn: "Premier UAE Transformation",
        titleAr: "منظومة التحول والتوسع في سوق الإمارات — 90 يوماً",
        titleEn: "90-Day UAE Strategic Transformation & Scaling",
        subtitleAr: "إعادة التموضع الفاخر المناسب للبيئة الإماراتية، وحملات الشرائح الممتازة، والمحتوى 4K.",
        subtitleEn: "Luxury brand positioning, high-AOV customer acquisition, and 4K visual assets.",
        priceDisplayAr: "9,500 درهم إماراتي",
        priceDisplayEn: "9,500 AED",
        durationAr: "90 يوماً تنفيذية",
        durationEn: "90 Execution Days",
        featured: true,
        featuresAr: [
          "إعادة تموضع العلامة التجارية بما يواكب معايير الفخامة والريادة العالمية في دبي",
          "إعلانات موجهة للشرائح ذات القوة الشرائية المرتفعة والمستثمرين في الإمارات",
          "إشراف إخراجي وفني متكامل على إنتاج المحتوى المرئي الفاخر المتوافق مع معايير 4K",
          "تفعيل استراتيجيات الإعلانات المؤثرة والـ Creator Spark Ads المعتمدة",
          "هندسة حملات مواسم الإمارات (مهرجان دبي للتسوق، العيد الوطني، فعاليات الشتاء)",
          "متابعة أسبوعية دقيقة للـ ROAS وضمان التوسع والربحية العالية"
        ],
        featuresEn: [
          "Luxury brand repositioning aligning with Dubai high-end executive standards",
          "High-ticket audience targeting capturing affluent expats and local residents",
          "Complete creative direction & masterclass 4K asset production specifications via Pioneers",
          "Influencer whitelisting and creator spark ad integration on TikTok and Instagram",
          "Major UAE commercial calendar optimization (Shopping Festival, National Day, Winter Events)",
          "Weekly direct ROAS optimization sprints ensuring sustained profit margins"
        ],
        ctaAr: "بدء التحول الإماراتي 90 يوماً (9,500 د.إ)",
        ctaEn: "Start UAE 90-Day Transformation (9,500 AED)",
        whatsappMessage: "السلام عليكم كوتش سراج، أطلب التعاقد على منظومة التحول والتوسع بسوق الإمارات 90 يوماً (9,500 د.إ)"
      },
      {
        id: "uae-dominance-90",
        badgeAr: "الهيمنة السوقية في الإمارات",
        badgeEn: "UAE Enterprise Dominance",
        titleAr: "الهيمنة والتوسع الإقليمي في دولة الإمارات — 90 يوماً",
        titleEn: "UAE Enterprise Dominance & Regional Scale",
        subtitleAr: "خطة توسع مؤسسية عابرة للإمارات تغطي دبي وأبوظبي لإنشاء كيان تجاري رائد ومستدام.",
        subtitleEn: "Enterprise expansion framework establishing regional market leadership across Dubai & Abu Dhabi.",
        priceDisplayAr: "18,500 درهم إماراتي",
        priceDisplayEn: "18,500 AED",
        durationAr: "90 يوماً مكثفة",
        durationEn: "90 Intensive Days",
        featured: false,
        featuresAr: [
          "خطة انتشار وتوسع شاملة تغطي دبي، أبوظبي، والشارقة للأنشطة الكبرى",
          "هندسة باقات الصفقات الكبرى للقطاعات التجارية والحكومية (B2B & VIP Corporate Accounts)",
          "تأسيس الإجراءات القياسية (SOPs) لفريق خدمة العملاء والمبيعات الراقي",
          "حوكمة العمليات والبيانات المشفرة وحماية الملكية الفكرية بموجب وثائق DIMC",
          "اتفاقيات مستوى الخدمة المتقدمة (Enterprise SLA) وتدقيق هوامش الربحية الصافية",
          "خط ساخن استشاري مباشر لمجلس الإدارة مع كوتش سراج واجتماعات توجيه دورية"
        ],
        featuresEn: [
          "Comprehensive multi-emirate scaling covering Dubai, Abu Dhabi, and Sharjah",
          "High-ticket B2B institutional deal structuring and VIP corporate client portfolios",
          "Standard Operating Procedures (SOPs) for UAE customer concierge and sales reps",
          "Enterprise governance with cryptographic data protection and DIMC intellectual property coverage",
          "Enterprise SLA performance guarantees and net profit margin optimization",
          "Direct board-level executive hotline with Coach Serag with scheduled strategic briefings"
        ],
        ctaAr: "طلب باقة الهيمنة الإماراتية (18,500 د.إ)",
        ctaEn: "Request UAE Dominance Suite (18,500 AED)",
        whatsappMessage: "السلام عليكم، أطلب باقة التوسع المؤسسي والهيمنة بسوق الإمارات 90 يوماً (18,500 د.إ)"
      }
    ]
  },

  kuwait: {
    regionNameAr: "سوق دولة الكويت",
    regionNameEn: "Kuwait Market",
    flag: "🇰🇼",
    currencyNoteAr: "الأسعار بالدينار الكويتي (KWD) مخصصة للشركات والأنشطة العاملة داخل دولة الكويت.",
    currencyNoteEn: "Priced in Kuwaiti Dinars (KWD), tailored for enterprises operating in Kuwait.",
    plans: [
      {
        id: "kw-diagnostic",
        badgeAr: "مصفوفة فحص السوق الكويتي",
        badgeEn: "Kuwait Market Diagnostic",
        titleAr: "التشخيص الاستراتيجي وعزل الهدر في السوق الكويتي",
        titleEn: "Kuwait Strategic Audit & Market Penetration",
        subtitleAr: "تحليل تنافسي دقيق للمستهلك الكويتي وسلوك الشراء المباشر مع فحص حملات إنستغرام وسناب شات.",
        subtitleEn: "In-depth competitive audit tailored for Kuwait consumer spending and Instagram/Snapchat dynamics.",
        priceDisplayAr: "315 دينار كويتي",
        priceDisplayEn: "315 KWD",
        durationAr: "7 - 10 أيام عمل",
        durationEn: "7 - 10 Business Days",
        featured: false,
        featuresAr: [
          "تحليل تموضع العلامة في السوق الكويتي عالي القيمة والطلب",
          "فحص كفاءة الإنفاق الإعلاني على سناب شات وإنستغرام الكويت",
          "تشريح رحلة العميل وسرعة الاستجابة البيعية على قنوات الواتساب",
          "تقرير استراتيجي يحدد هوامش الربحية وفرص التوسع المالي",
          "جلسة استشارية تنفيذية مغلقة عن بُعد مع كوتش سراج",
          "خصم 100% من قيمة هذا التشخيص عند التعاقد على خطة الـ 90 يوماً"
        ],
        featuresEn: [
          "Brand positioning analysis in the high-ticket Kuwait market",
          "Ad spend efficiency audit across Snapchat and Instagram Kuwait",
          "Customer journey anatomy and WhatsApp closing speed optimization",
          "Strategic report identifying net margin opportunities and scaling gaps",
          "Confidential 1-on-1 executive video briefing directly with Coach Serag",
          "100% credited toward your 90-Day Kuwait transformation agreement"
        ],
        ctaAr: "طلب تشخيص السوق الكويتي (315 د.ك)",
        ctaEn: "Request Kuwait Diagnostic (315 KWD)",
        whatsappMessage: "السلام عليكم، أرغب في طلب مصفوفة التشخيص لسوق الكويت (315 دينار كويتي)"
      },
      {
        id: "kw-transformation-90",
        badgeAr: "باقة التحول الكويتي المعتمدة",
        badgeEn: "Premier Kuwait Transformation",
        titleAr: "منظومة التحول والتوسع في السوق الكويتي — 90 يوماً",
        titleEn: "90-Day Kuwait Strategic Transformation & Scaling",
        subtitleAr: "إعادة التموضع الراقي بما يطابق الذائقة الكويتية، وحملات الشرائح الممتازة، والمحتوى 4K.",
        subtitleEn: "Premium brand recalibration for Kuwait taste, high-AOV targeting, and luxury 4K visual direction.",
        priceDisplayAr: "790 دينار كويتي",
        priceDisplayEn: "790 KWD",
        durationAr: "90 يوماً تنفيذية",
        durationEn: "90 Execution Days",
        featured: true,
        featuresAr: [
          "إعادة تموضع العلامة التجارية بما يتطابق مع الذائقة الكويتية الرفيعة",
          "إعلانات موجهة للشرائح الكويتية ذات القوة الشرائية المرتفعة",
          "إشراف إخراجي وفني متكامل على إنتاج المحتوى المرئي الفاخر 4K",
          "تفعيل استراتيجيات الإعلانات المؤثرة والـ Creator Spark Ads المعتمدة",
          "هندسة حملات مواسم الشراء الكبرى وعروض الأعياد الوطنية",
          "مراقبة أسبوعية مباشرة لـ ROAS لضمان نمو الإيرادات والأرباح الصافية"
        ],
        featuresEn: [
          "Luxury brand repositioning aligning with premium Kuwait cultural standards",
          "High-AOV audience targeting capturing affluent consumer segments across Kuwait",
          "Complete creative direction & masterclass 4K asset production specifications via Pioneers",
          "Influencer whitelisting and creator spark ad integration on TikTok and Instagram",
          "Major Kuwait commercial calendar optimization and national holiday sales",
          "Weekly direct ROAS optimization sprints focused on sustained net margins"
        ],
        ctaAr: "بدء التحول الكويتي 90 يوماً (790 د.ك)",
        ctaEn: "Start Kuwait 90-Day Transformation (790 KWD)",
        whatsappMessage: "السلام عليكم كوتش سراج، أطلب التعاقد على منظومة التحول بسوق الكويت 90 يوماً (790 د.ك)"
      },
      {
        id: "kw-dominance-90",
        badgeAr: "الهيمنة السوقية في الكويت",
        badgeEn: "Kuwait Enterprise Dominance",
        titleAr: "الهيمنة والتوسع التجاري الشامل في الكويت — 90 يوماً",
        titleEn: "Kuwait Enterprise Dominance & Commercial Scaling",
        subtitleAr: "خطة توسع مؤسسية كبرى لبناء كيان تجاري كويتي رائد ومستدام ومضاعفة الحصة السوقية.",
        subtitleEn: "Enterprise expansion framework establishing commercial market leadership across Kuwait.",
        priceDisplayAr: "1,540 دينار كويتي",
        priceDisplayEn: "1,540 KWD",
        durationAr: "90 يوماً مكثفة",
        durationEn: "90 Intensive Days",
        featured: false,
        featuresAr: [
          "خطة انتشار تجاري شاملة لزيادة الحصة السوقية واقتناص عملاء المنافسين",
          "هندسة باقات الصفقات الكبرى للقطاعات التجارية والحكومية (B2B)",
          "تأسيس الإجراءات القياسية (SOPs) لفريق خدمة العملاء والمبيعات",
          "حوكمة العمليات والبيانات المشفرة وحماية الملكية الفكرية بموجب وثائق DIMC",
          "اتفاقيات مستوى الخدمة المتقدمة (Enterprise SLA) وتدقيق هوامش الربحية الصافية",
          "خط ساخن استشاري مباشر لمجلس الإدارة مع كوتش سراج"
        ],
        featuresEn: [
          "Comprehensive commercial scaling capturing competitor market share in Kuwait",
          "High-ticket B2B institutional deal structuring and VIP corporate client portfolios",
          "Standard Operating Procedures (SOPs) for customer concierge and sales reps",
          "Enterprise governance with cryptographic data protection and DIMC intellectual property coverage",
          "Enterprise SLA performance guarantees and net profit margin optimization",
          "Direct board-level executive hotline with Coach Serag with scheduled strategic briefings"
        ],
        ctaAr: "طلب باقة الهيمنة الكويتية (1,540 د.ك)",
        ctaEn: "Request Kuwait Dominance Suite (1,540 KWD)",
        whatsappMessage: "السلام عليكم، أطلب باقة التوسع المؤسسي والهيمنة بسوق الكويت 90 يوماً (1,540 د.ك)"
      }
    ]
  },

  europe: {
    regionNameAr: "سوق الاتحاد الأوروبي (أوروبا)",
    regionNameEn: "European Union Market",
    flag: "🇪🇺",
    currencyNoteAr: "الأسعار باليورو (EUR €) مخصصة للشركات والكيانات العاملة في دول الاتحاد الأوروبي.",
    currencyNoteEn: "Priced in Euros (EUR €), tailored for enterprises in the European Union.",
    plans: [
      {
        id: "eu-diagnostic",
        badgeAr: "التشخيص الاستراتيجي الأوروبي",
        badgeEn: "EU Market Diagnostic",
        titleAr: "كتاب الفحص والتموضع الاستراتيجي في الأسواق الأوروبية",
        titleEn: "EU Strategic Market Entry & Funnel Audit",
        subtitleAr: "تدقيق نموذج العمل، والامتثال للائحة GDPR وحوكمة تسريب الإعلانات على المنصات الأوروبية.",
        subtitleEn: "Business model audit, GDPR compliance, and paid acquisition waste elimination.",
        priceDisplayAr: "1,100 € EUR",
        priceDisplayEn: "1,100 € EUR",
        durationAr: "7 - 10 أيام عمل",
        durationEn: "7 - 10 Business Days",
        featured: false,
        featuresAr: [
          "تحليل سلوك المستهلك الأوروبي ومعدلات التحويل للشرائح عالية القيمة",
          "تدقيق الامتثال للائحة حماية البيانات العامة (GDPR) وبوابات الدفع باليورو",
          "فحص قنوات الإعلانات الرقمية المستهدفة (Google EU, Meta, LinkedIn B2B)",
          "تقرير تحليلي مستقل يحدد فرص التوسع في الأسواق الأوروبية",
          "جلسة استشارية تنفيذية مغلقة عن بُعد 1-on-1 مع كوتش سراج",
          "خصم 100% من قيمة هذا التشخيص عند التعاقد على خطة التحول الأوروبية لـ 90 يوماً"
        ],
        featuresEn: [
          "European consumer behavior and high-AOV conversion rate analysis",
          "GDPR data privacy and European payment gateway compliance audit",
          "Ad spend efficiency review across Google Search EU, Meta, and LinkedIn",
          "Strategic expansion roadmap tailored for European business ecosystems",
          "Confidential 1-on-1 executive video briefing directly with Coach Serag",
          "100% credit applied toward your 90-Day European transformation agreement"
        ],
        ctaAr: "طلب التشخيص الأوروبي (1,100 €)",
        ctaEn: "Request EU Diagnostic (1,100 €)",
        whatsappMessage: "Hello Coach Serag, I want to request the EU Strategic Market Diagnostic (1,100 € EUR)."
      },
      {
        id: "eu-transformation-90",
        badgeAr: "خطة التحول الأوروبية المعتمدة",
        badgeEn: "European Transformation Suite",
        titleAr: "منظومة التحول والتوسع في السوق الأوروبي — 90 يوماً",
        titleEn: "90-Day European Strategic Transformation & Scaling",
        subtitleAr: "إعادة بناء الهيكل التسويقي متعدد اللغات، بوابات الدفع باليورو، والإنتاج البصري الاحترافي 4K.",
        subtitleEn: "Multilingual marketing architecture, Euro checkout funnels, and high-end 4K creative direction.",
        priceDisplayAr: "3,500 € EUR",
        priceDisplayEn: "3,500 € EUR",
        durationAr: "90 يوماً تنفيذية",
        durationEn: "90 Execution Days",
        featured: true,
        featuresAr: [
          "معايرة الهوية والرسائل الإعلانية بما يطابق الثقافة الاستهلاكية الأوروبية",
          "بناء قنوات تحويل رقمية سلسة متعددة اللغات مع تحسين الـ CRO الأوروبي",
          "الإشراف الإخراجي والفني على إنتاج المحتوى 4K بما يواكب المعايير العالمية",
          "صياغة إجراءات التشغيل القياسية (SOPs) لفرق المبيعات والدعم عن بُعد",
          "هندسة الاشتراكات الشهرية وتوليد الإيرادات المتكررة وخفض معدل التراجع (Churn)",
          "إشراف ومتابعة دورية مباشرة على مؤشرات العائد الإعلاني ROAS مع كوتش سراج"
        ],
        featuresEn: [
          "Brand calibration and persuasive messaging tailored for European consumers",
          "Multilingual conversion funnels with advanced Conversion Rate Optimization (CRO)",
          "Full creative direction for high-spec 4K visual assets adhering to global standards",
          "Standard Operating Procedures (SOPs) for remote sales and European client concierge",
          "Recurring subscription revenue architecture (MRR) and churn optimization",
          "Bi-weekly executive sprint reviews and ROAS governance directly with Coach Serag"
        ],
        ctaAr: "بدء التحول الأوروبي (3,500 €)",
        ctaEn: "Start EU 90-Day Transformation (3,500 €)",
        whatsappMessage: "Hello Coach Serag, I would like to enroll in the 90-Day European Transformation (3,500 € EUR)."
      },
      {
        id: "eu-dominance-90",
        badgeAr: "الهيمنة الأوروبية الشاملة",
        badgeEn: "EU Enterprise Dominance",
        titleAr: "التوسع المؤسسي والهيمنة في السوق الأوروبي — 90 يوماً",
        titleEn: "90-Day EU Enterprise Dominance & Scaling Engine",
        subtitleAr: "للمؤسسات والأنشطة العابرة للحدود التي تستهدف التوسع والريادة في دول الاتحاد الأوروبي.",
        subtitleEn: "Cross-border scaling architecture establishing market leadership across European Union member states.",
        priceDisplayAr: "6,900 € EUR",
        priceDisplayEn: "6,900 € EUR",
        durationAr: "90 يوماً مكثفة",
        durationEn: "90 Intensive Days",
        featured: false,
        featuresAr: [
          "خطة توسع شاملة تغطي الأسواق الأوروبية الكبرى (ألمانيا، فرنسا، إسبانيا، إيطاليا)",
          "بنية تحتية لصفقات الشركات والمؤسسات B2B مع عقود القيمة المرتفعة",
          "حوكمة العمليات والبيانات المشفرة وحماية الملكية الفكرية بموجب DIMC",
          "اتفاقيات مستوى الخدمة التنفيذية المتقدمة (Enterprise SLA)",
          "تنسيق هندسي مباشر لمضاعفة هوامش الربحية الصافية",
          "خط ساخن استشاري مباشر لمجلس الإدارة مع كوتش سراج"
        ],
        featuresEn: [
          "Comprehensive multi-country growth strategy across Germany, France, Spain & Italy",
          "High-ticket institutional enterprise B2B sales funnel & corporate contracts",
          "Cryptographic data governance and international DIMC intellectual property protection",
          "Enterprise SLA performance guarantees and rapid turnaround",
          "Direct net profit margin engineering and CAC reduction",
          "Direct C-level advisory desk with Coach Serag with priority intervention"
        ],
        ctaAr: "طلب باقة الهيمنة الأوروبية (6,900 €)",
        ctaEn: "Request EU Dominance Suite (6,900 €)",
        whatsappMessage: "Hello Coach Serag, I want to apply for the EU Enterprise Dominance Suite (6,900 € EUR)."
      }
    ]
  },

  global: {
    regionNameAr: "السوق الدولي والأوروبي",
    regionNameEn: "Global & European Market",
    flag: "🌐 🇪🇺 🇺🇸",
    currencyNoteAr: "الأسعار بالدولار الأمريكي (USD $) مخصصة للشركات العالمية والمشاريع العابرة للقارات في أوروبا وأمريكا.",
    currencyNoteEn: "Priced in US Dollars (USD $), designed for international enterprises and European/US markets.",
    plans: [
      {
        id: "global-diagnostic",
        badgeAr: "التموضع العالمي المستقل",
        badgeEn: "Global Strategic Audit",
        titleAr: "التحليل الاستراتيجي للتموضع الدولي واختراق الأسواق الغربية",
        titleEn: "International Positioning Blueprint & Funnel Audit",
        subtitleAr: "تشريح نموذج العمل، تدقيق وحدات الاقتصاد (Unit Economics)، واختبار جاهزية المنافسة في الأسواق الدولية.",
        subtitleEn: "Comprehensive business model audit, unit economics review, and Western market entry readiness.",
        priceDisplayAr: "$1,200 USD",
        priceDisplayEn: "$1,200 USD",
        durationAr: "10 أيام عمل",
        durationEn: "10 Business Days",
        featured: false,
        featuresAr: [
          "نمذجة الملف الشخصي للعميل المثالي (ICP) للأسواق الأوروبية والأمريكية",
          "تدقيق القنوات الرقمية المتعددة (Google Ads Search, Meta Global, LinkedIn B2B)",
          "تحسين مؤشرات الاقتصاد الوحدوي ونسبة تكلفة الاستحواذ إلى القيمة الدائمة (CAC:LTV)",
          "تدقيق حماية الملكية الفكرية عبر DIMC Register لمواجهة القرصنة الدولية",
          "جلسة استشارية خاصة عن بُعد 1-on-1 مع كوتش سراج عبر البوابة السيادية المشفرة",
          "استرداد كامل المبلغ عند التعاقد على خطة التحول الدولية لـ 90 يوماً"
        ],
        featuresEn: [
          "Ideal Customer Profile (ICP) architecture calibrated for North American and European demographics",
          "Omnichannel acquisition audit spanning Google Search, Meta Global, and LinkedIn B2B",
          "Unit economics & CAC:LTV optimization blueprint for high-margin scalability",
          "DIMC international intellectual property prior-art certification audit",
          "1-on-1 confidential video strategy summit directly with Coach Serag via Sovereign Portal",
          "100% credited toward your 90-Day international transformation agreement"
        ],
        ctaAr: "طلب التشخيص الدولي ($1,200)",
        ctaEn: "Request Global Diagnostic ($1,200)",
        whatsappMessage: "Hello Coach Serag, I would like to request the International Positioning Blueprint ($1,200 USD)."
      },
      {
        id: "global-transformation-90",
        badgeAr: "التحول السيادي الدولي",
        badgeEn: "Global Sovereign Tier",
        titleAr: "منظومة التحول الاستراتيجي العالمي — 90 يوماً",
        titleEn: "90-Day Global Sovereign Transformation",
        subtitleAr: "إعادة بناء قمع الاستحواذ متعدد العملات، أتمتة العمليات عن بُعد، والانتشار في الأسواق الغربية.",
        subtitleEn: "Multi-currency acquisition funnel, asynchronous remote operations, and Western market penetration.",
        priceDisplayAr: "$3,800 USD",
        priceDisplayEn: "$3,800 USD",
        durationAr: "90 يوماً تنفيذية",
        durationEn: "90 Execution Days",
        featured: true,
        featuresAr: [
          "معايرة الهوية والرسائل الإعلانية لتناسب معايير وثقافة الأسواق الغربية والأوروبية",
          "بناء قنوات تحويل رقمية متعددة العملات مع تحسين فائق لمعدلات التحويل (CRO)",
          "الإشراف الإبداعي على إنتاج أصول مرئية فائقة الجودة 4K لحملات الإعلانات العالمية",
          "صياغة لوائح الـ SOPs لتشغيل فرق المبيعات والدعم الفني عن بُعد بلا مركزية",
          "هندسة الاشتراكات الشهرية وتوليد الإيرادات المتكررة (MRR Architecture) وخفض الـ Churn",
          "مراجعة إشرافية نصف شهرية لـ ROAS ومؤشرات الأداء مع كوتش سراج مباشرة"
        ],
        featuresEn: [
          "Brand calibration and persuasive messaging tailored for Western and Anglo-European markets",
          "Multi-currency conversion funnel architecture with high-performance conversion rate optimization (CRO)",
          "Creative direction and high-spec 4K visual playbook for international paid acquisition campaigns",
          "Asynchronous standard operating procedures (SOPs) for remote cross-border sales and support",
          "Monthly recurring revenue (MRR) architecture, subscription funnels, and churn reduction",
          "Bi-weekly executive sprint reviews and ROAS governance directly with Coach Serag"
        ],
        ctaAr: "بدء التحول الدولي ($3,800)",
        ctaEn: "Start Global Transformation ($3,800)",
        whatsappMessage: "Hello Coach Serag, I want to initiate the 90-Day Global Sovereign Transformation ($3,800 USD)."
      },
      {
        id: "global-dominance-90",
        badgeAr: "التوسع متعدد الأقاليم",
        badgeEn: "Multi-Territory Scale",
        titleAr: "التوسع المؤسسي متعدد الأقاليم والهيمنة العالمية — 90 يوماً",
        titleEn: "Multi-Territory Scale & Global Enterprise Dominance",
        subtitleAr: "بنية تحتية متكاملة للشركات الكبرى التي تستهدف التوسع في أمريكا الشمالية والمملكة المتحدة والاتحاد الأوروبي.",
        subtitleEn: "Enterprise growth engine for corporations expanding across the US, UK, and European Union.",
        priceDisplayAr: "$7,500 USD",
        priceDisplayEn: "$7,500 USD",
        durationAr: "90 يوماً مكثفة",
        durationEn: "90 Intensive Days",
        featured: false,
        featuresAr: [
          "محرك نمو عابر للقارات يغطي أسواق الولايات المتحدة، المملكة المتحدة، ودول الاتحاد الأوروبي",
          "بنية تحتية لصفقات الشركات الكبرى (Enterprise B2B) وحملات الـ Account-Based Marketing (ABM)",
          "إعادة هيكلة المنظومة التشغيلية بالكامل ووضع مقاييس الأداء التنافسية العالمية (KPIs)",
          "حماية قانونية فكرية شاملة وسرية مطلقة بموجب بروتوكولات DIMC Fiduciary Shield",
          "اتفاقيات مستوى الخدمة التنفيذية مع وقت استجابة لا يتعدى 24 ساعة (24-Hour SLA)",
          "مكتب استشاري خاص لكبار التنفيذيين مع كوتش سراج وإشراف مباشر على النمو الدولي"
        ],
        featuresEn: [
          "Cross-continental growth engine targeting the United States, United Kingdom, and European Union",
          "High-ticket institutional enterprise infrastructure and Account-Based Marketing (ABM) playbooks",
          "Complete corporate operating system restructuring with international benchmarked KPIs",
          "Comprehensive DIMC Intellectual Property fiduciary licensing protection and trade-secret immunity",
          "Guaranteed 24-hour executive SLA response turnaround for mission-critical operations",
          "Dedicated C-level advisory desk with Coach Serag with direct strategic intervention"
        ],
        ctaAr: "طلب التوسع العالمي ($7,500)",
        ctaEn: "Request Enterprise Global Suite ($7,500)",
        whatsappMessage: "Hello Coach Serag, I want to apply for the Multi-Territory Enterprise Dominance Suite ($7,500 USD)."
      }
    ]
  }
};

export const PlansSection: React.FC<PlansSectionProps> = ({ setActiveTab, lang = "ar" }) => {
  const isRtl = lang === "ar";
  const [selectedRegion, setSelectedRegion] = useState<PlanRegion>("egypt");

  const currentRegionData = REGIONAL_PLANS_DATA[selectedRegion];

  return (
    <div id="plans-section" className={`py-10 max-w-7xl mx-auto space-y-10 select-none ${isRtl ? "text-right" : "text-left"}`}>
      {/* Section Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-[#dc2626]/15 border border-[#dc2626]/30 px-4 py-1.5 rounded-full text-xs font-mono font-bold text-[#ef4444]">
          <ShieldCheck className="w-4 h-4 text-[#ef4444]" />
          <span>{isRtl ? "خطط التحول الميداني والإنتاج والريادة" : "Sovereign Transformation & Operational Architecture"}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-[#f8fafc] tracking-tight">
          {isRtl ? "باقات وخطط الـ 90 يوماً حسب السوق الإقليمي" : "90-Day Execution Plans by Regional Market"}
        </h1>

        <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed">
          {isRtl
            ? "لا نؤمن بالقوالب الموحدة الجاهزة؛ كل سوق إقليمي له طبيعة شرائية، ميزانيات، ومعايير إنتاجية مختلفة. اختر سوق نشاطك للاطلاع على الخطة المصممة خصيصاً له."
            : "We reject one-size-fits-all templates. Each regional market has unique consumer purchasing power, media buying dynamics, and production requirements. Select your operating market below."}
        </p>

        {/* Market Parity Philosophy Notice */}
        <div className="inline-block p-3 bg-amber-950/20 border border-amber-600/30 rounded-2xl text-[11px] text-amber-300/90 max-w-2xl text-center">
          💡 {isRtl
            ? "معايرة القوة الشرائية والتكاليف الميدانية: الأسعار مدروسة وفق الواقع التشغيلي الحقيقي لكل دولة، وليست تحويلاً حسابياً مجرداً."
            : "Purchasing Power Parity (PPP) calibrated: Pricing reflects genuine localized operating costs and unit economics for each target market."}
        </div>
      </div>

      {/* 6 Regional Market Selector Tabs */}
      <div className="bg-[#0b1015] border border-slate-800 p-2 rounded-3xl max-w-4xl mx-auto shadow-xl">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {(
            [
              { id: "egypt", nameAr: "مصر (EGP)", nameEn: "Egypt (EGP)", flag: "🇪🇬" },
              { id: "saudi", nameAr: "السعودية (SAR)", nameEn: "Saudi (SAR)", flag: "🇸🇦" },
              { id: "uae", nameAr: "الإمارات (AED)", nameEn: "UAE (AED)", flag: "🇦🇪" },
              { id: "kuwait", nameAr: "الكويت (KWD)", nameEn: "Kuwait (KWD)", flag: "🇰🇼" },
              { id: "europe", nameAr: "أوروبا (EUR €)", nameEn: "Europe (EUR €)", flag: "🇪🇺" },
              { id: "global", nameAr: "دولي (USD $)", nameEn: "Global (USD $)", flag: "🌐 🇺🇸" },
            ] as const
          ).map((tab) => {
            const isSelected = selectedRegion === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedRegion(tab.id as PlanRegion)}
                className={`py-3 px-2 rounded-2xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                  isSelected
                    ? "bg-gradient-to-r from-[#dc2626] to-[#991b1b] text-white shadow-lg shadow-red-600/30 font-black scale-[1.02]"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                <span className="text-lg">{tab.flag}</span>
                <span className="truncate text-center text-[11px]">
                  {isRtl ? tab.nameAr : tab.nameEn}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Regional Context Banner */}
      <div className="bg-gradient-to-r from-[#121a21] to-[#090d14] border border-slate-800/90 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <span className="text-xl">{currentRegionData.flag}</span>
          <span className="font-bold text-white">
            {isRtl ? currentRegionData.regionNameAr : currentRegionData.regionNameEn}
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400">
            {isRtl ? currentRegionData.currencyNoteAr : currentRegionData.currencyNoteEn}
          </span>
        </div>

        <button
          onClick={() => setActiveTab("diagnostic-99")}
          className="text-red-400 hover:text-red-300 font-bold flex items-center gap-1 whitespace-nowrap cursor-pointer transition-colors"
        >
          <span>{isRtl ? "هل ترغب في فحص مجاني أولاً؟" : "Want a free audit first?"}</span>
          <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* Regional Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
        {currentRegionData.plans.map((plan) => (
          <div
            key={plan.id}
            className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 relative ${
              plan.featured
                ? "bg-gradient-to-b from-[#141b25] via-[#0d131b] to-[#080d14] border-2 border-red-500 shadow-[0_0_50px_rgba(220,38,38,0.25)] scale-[1.02] z-10"
                : "bg-gradient-to-b from-[#0d131a] to-[#070a0f] border border-slate-800 hover:border-slate-700 shadow-xl"
            }`}
          >
            {/* Featured Glowing Ribbon */}
            {plan.featured && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-red-600 to-red-700 text-white text-[11px] font-black px-4 py-1 rounded-full shadow-lg shadow-red-600/40 uppercase tracking-wider font-mono flex items-center gap-1.5 whitespace-nowrap">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>{isRtl ? plan.badgeAr : plan.badgeEn}</span>
              </div>
            )}

            <div className="space-y-5">
              {!plan.featured && (
                <div className="inline-block px-3 py-1 rounded-full bg-slate-800/80 text-slate-300 text-[10px] font-mono font-bold border border-slate-700/50">
                  {isRtl ? plan.badgeAr : plan.badgeEn}
                </div>
              )}

              <div>
                <h3 className="text-xl font-black text-white leading-tight mb-2">
                  {isRtl ? plan.titleAr : plan.titleEn}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed min-h-[48px]">
                  {isRtl ? plan.subtitleAr : plan.subtitleEn}
                </p>
              </div>

              {/* Price Tag */}
              <div className="p-4 rounded-2xl bg-[#040609] border border-slate-800/80 flex items-baseline justify-between">
                <div>
                  <span className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                    {isRtl ? plan.priceDisplayAr : plan.priceDisplayEn}
                  </span>
                </div>
                <span className="text-[11px] font-mono font-bold text-red-400">
                  {isRtl ? plan.durationAr : plan.durationEn}
                </span>
              </div>

              {/* Feature Points - Completely customized per region */}
              <div className="space-y-3 pt-2">
                <span className="text-[11px] font-bold text-slate-300 block uppercase tracking-wider font-mono">
                  {isRtl ? "المخرجات ونطاق العمل المعتمد:" : "Included Scope & Deliverables:"}
                </span>
                <ul className="space-y-2.5 text-xs text-slate-300">
                  {(isRtl ? plan.featuresAr : plan.featuresEn).map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                      <Check className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-8 space-y-2.5">
              <a
                href={`https://wa.me/201274879442?text=${encodeURIComponent(plan.whatsappMessage)}`}
                target="_blank"
                rel="noreferrer"
                className={`w-full py-3.5 px-4 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg ${
                  plan.featured
                    ? "bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white shadow-red-600/40"
                    : "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
                }`}
              >
                <PhoneCall className="w-4 h-4" />
                <span>{isRtl ? plan.ctaAr : plan.ctaEn}</span>
              </a>

              <p className="text-[10px] text-center text-slate-500 font-mono">
                {isRtl ? "عقود رسمية محمية بـ NDA ووثائق DIMC" : "Official SLA & NDA-Protected Protocol"}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Guarantee Banner */}
      <div className="bg-[#0b1015] border border-red-600/30 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500 shrink-0">
            <Crown className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h4 className="text-base font-black text-white">
              {isRtl ? "ضمان الاسترداد الدفتري وحماية الميزانية" : "Fiscal Expense Recovery & Budget Protection Guarantee"}
            </h4>
            <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
              {isRtl
                ? "كافة خطط الـ 90 يوماً تضمن لك عزل الهدر المالي الميداني، ومراقبة أسبوعية للـ ROAS من خلال لوحة الـ CRM المشفرة، مع صياغة العقود الرسمية المعتمدة لحفظ كامل حقوقك."
                : "All 90-Day transformation plans guarantee direct waste elimination, weekly ROAS oversight via your encrypted CRM dashboard, and legally binding bilateral contracts protecting your rights."}
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab("contact")}
          className="px-6 py-3.5 bg-red-600 hover:bg-red-500 text-white font-black text-xs rounded-2xl transition-all cursor-pointer whitespace-nowrap shadow-lg shadow-red-600/30"
        >
          {isRtl ? "تواصل مع مكتب كوتش سراج" : "Contact Office of Coach Serag"}
        </button>
      </div>
    </div>
  );
};
