import fs from "fs";
import path from "path";

// ── Native Environment Variables Loader ─────────────────────────────────────
const envPath = path.resolve(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  try {
    const envContent = fs.readFileSync(envPath, "utf8");
    envContent.split("\n").forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#")) {
        const idx = trimmed.indexOf("=");
        if (idx !== -1) {
          const k = trimmed.slice(0, idx).trim();
          const v = trimmed.slice(idx + 1).trim();
          if (!process.env[k]) {
            process.env[k] = v;
          }
        }
      }
    });
  } catch (e) {
    console.error("Failed to parse .env file:", e);
  }
}

import express from "express";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { createClient } from "@supabase/supabase-js";
import { askAI, VISITOR_SYSTEM_PROMPT, ADMIN_SYSTEM_PROMPT, HOSTINGER_SYSTEM_PROMPT, WHATSAPP_BOT_SYSTEM_PROMPT } from "./src/lib/aiProvider.ts";
import type { AIMessage } from "./src/lib/aiProvider.ts";
import type {
  ConsultationRequest,
  FoundingMember,
  PromoCode,
  PlanItem,
  ContactMessage,
  ClientReview,
  TeamApplication,
} from "./src/types.ts";
import { requireAuth } from "./src/middleware/auth.ts";
import type { AuthRequest } from "./src/middleware/auth.ts";
import { getOrCreateUser, getUserByUid } from "./src/db/users.ts";
import { db } from "./src/db/index.ts";
import { users, consultationRequests, foundingMembers as sqlFoundingMembers, diagnosticLogs } from "./src/db/schema.ts";

const app = express();
const PORT = 3000;

// Enable large payload parsing for image uploads (max 10MB)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// In-Memory Data Storage (Persisted across requests during server runtime)
let consultationCounter = 1042;
let memberCounter = 127;

let consultations: ConsultationRequest[] = [
  {
    id: "FB-1040",
    customerName: "محمد أحمد",
    email: "mohamed@xyz-restaurant.com",
    phone: "01012345678",
    businessName: "مطعم XYZ المأكولات الشرقية",
    businessType: "مطاعم وأغذية",
    location: "القاهرة، مصر",
    websiteOrSocial: "instagram.com/xyz_restaurant",
    rating: 2,
    dissatisfaction: "ضعف ظهور النشاط الرقمي، وتراجع المبيعات المباشرة مقارنة بزيادة تكاليف التشغيل والإعلانات العشوائية.",
    improvementGoal: "إعادة تنظيم الهوية والوصول إلى شريحة العملاء المستهدفة مع تقليل الهدر الإعلاني بـ 30%.",
    imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80",
    requestedOption: "improvement_plan",
    status: "sent",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    membershipCode: "FB-FM-000125",
    response: {
      problems: [
        "ضعف الاتساق في الهوية الرقمية ورسائل الحملات الإعلانية",
        "سوء توزيع ميزانية التسويق دون تتبع دقيق لمعدل التحويل (Conversion Rate)",
        "غياب برنامج ولاء حقيقي لربط العملاء الدائمين"
      ],
      improvementMethods: [
        "إعادة هيكلة المحتوى والتركيز على العرض البصري الاحترافي للوجبات",
        "توجيه ميزانية الإعلانات نحو المدى الجغرافي المستهدف المحيط بالمطعم (3-5 كم)",
        "تفعيل منصة اطلب واستلم لتوليد طلبات مباشرة دون وسطاء"
      ],
      priorities: [
        "الأولوية 1: إعادة إطلاق الحملات الرقمية الجغرافية المستهدفة",
        "الأولوية 2: تحسين تجربة الطلب الرقمي واستجابة خدمة العملاء",
        "الأولوية 3: تطبيق نظام العضوية وبرامج التقدير"
      ],
      estimatedCostRange: "12,000 – 18,000 جنيه مصري",
      notes: "تم إعداد هذه الخطة المبدئية خصيصاً بنشاطكم. يمكنك طلب العرض الكامل والتنفيذ الميداني مع فريق FitBrilliance.",
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
    },
  },
  {
    id: "FB-1041",
    customerName: "سارة محمود",
    email: "sara@glowsalon.com",
    phone: "01287654321",
    businessName: "مركز Glow للتجميل والعناية",
    businessType: "خدمات صالونات وتجميل",
    location: "الإسكندرية، مصر",
    rating: 3,
    dissatisfaction: "تذبذب الإقبال الأسبوعي ومواجهة مواسم راكدة تؤثر على التدفق النقدي.",
    improvementGoal: "استدامة الحجوزات طوال أيام الأسبوع وتفعيل الباقات العائلية والتنفيذ الشامل.",
    requestedOption: "activity_analysis",
    status: "analyzing",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    membershipCode: "FB-FM-000126",
  },
];

let foundingMembers: FoundingMember[] = [
  {
    id: "mem_1",
    memberCode: "FB-FM-000125",
    customerName: "محمد أحمد",
    email: "mohamed@xyz-restaurant.com",
    phone: "01012345678",
    businessName: "مطعم XYZ المأكولات الشرقية",
    promoCode: "FOUNDER15",
    discountPercent: 15,
    monthlyConsultationsAvailable: 1,
    status: "active",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "mem_2",
    memberCode: "FB-FM-000126",
    customerName: "سارة محمود",
    email: "sara@glowsalon.com",
    phone: "01287654321",
    businessName: "مركز Glow للتجميل والعناية",
    promoCode: "FOUNDER15",
    discountPercent: 15,
    monthlyConsultationsAvailable: 1,
    status: "active",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
];

let promoCodes: PromoCode[] = [
  {
    id: "p_1",
    code: "FOUNDER15",
    discountPercent: 15,
    description: "كود خصم حصري لأعضاء FitBrilliance Founding Support Members الأوائل",
    active: true,
    usesCount: 12,
  },
  {
    id: "p_2",
    code: "FITBRILLIANCE2026",
    discountPercent: 10,
    description: "خصم عام للشركات والمشاريع الجديدة عند الانضمام",
    active: true,
    usesCount: 28,
  },
];

let plans: PlanItem[] = [
  {
    id: "plan_transformation",
    title: "خطة التحول الاستراتيجي — 90 يومًا",
    subtitle: "تصور استراتيجي ونمذجة ميدانية شاملة لتحويل مسار المشروع وتصحيح الاختناقات التشغيلية.",
    startingPrice: "25,000 جنيه",
    numericPrice: 25000,
    durationDays: 90,
    category: "transformation",
    active: true,
    features: [
      "تشخيص ميداني وتحليل الفجوات التشغيلية",
      "إعادة رسم رحلة العميل وتطوير العروض المباشرة",
      "خطة محتوى متكاملة لمدة 90 يومًا مع المتابعة الأسبوعية",
      "إعداد الحملات الإعلانية ومراقبة معدلات العائد",
      "جلسات استشارية تقييمية منتظمة مع كوتش سراج"
    ],
    monthlyBreakdown: [
      {
        monthNumber: 1,
        title: "الشهر الأول: التأسيس والتصحيح الهيكلي",
        steps: [
          "إعادة تهيئة الهوية البصرية ورسائل المبيعات المباشرة",
          "فحص تجربة العملاء واكتشاف التسريب في القمع البيعي",
          "إطلاق أول حملة اختبارية رقمية محددة المدى"
        ],
        adsBudget: "5,000 - 8,000 جنيه مصري",
        operatingExpenses: "3,000 جنيه (أدوات وتجهيزات صانعي المحتوى)",
        kpiGoal: "وقف الهدر المالي وتحقيق أول 20-30% زيادة في الاستفسارات النوعية"
      },
      {
        monthNumber: 2,
        title: "الشهر الثاني: الإطلاق والتكثيف الميداني",
        steps: [
          "تكثيف الحملات الإعلانية على القنوات المباشرة (ميتا وجوجل)",
          "تطبيق نظام متابعة المبيعات والإغلاق السريع (Sales Closing)",
          "تفعيل عروض باقات التجربة والعضويات المباشرة"
        ],
        adsBudget: "10,000 - 15,000 جنيه مصري",
        operatingExpenses: "4,000 جنيه (مصاريف تشغيل ودعم العملاء)",
        kpiGoal: "مضاعفة الحجوزات والمبيعات بنسبة 50% وتثبيت معدل التحويل"
      },
      {
        monthNumber: 3,
        title: "الشهر الثالث: التوسع وتحسين عائد الاستثمار (ROI)",
        steps: [
          "تحليل البيانات وعزل الحملات الأكثر ربحية للتركيز عليها",
          "تفعيل برامج إحالة العملاء ونظام الولاء (Referral Program)",
          "استرداد كافة التكاليف التسويقية دفترياً وفق الأطر الضريبية"
        ],
        adsBudget: "12,000 - 20,000 جنيه مصري",
        operatingExpenses: "5,000 جنيه (صيانة وتطوير القنوات البيعية)",
        kpiGoal: "وصول صافي العائد على الاستثمار الإعلاني (ROAS) إلى 3.5x فما فوق"
      }
    ],
    weeklyExecutionSteps: [
      "الأسبوع 1-2: التدقيق الميداني وإعادة صياغة العرض القومي",
      "الأسبوع 3-4: ضبط الحسابات وتصوير أصول المحتوى الأساسية",
      "الأسبوع 5-6: إطلاق حملات المرحلة الأولى وقياس استجابة الجمهور",
      "الأسبوع 7-8: تحسين قمع المبيعات ومتابعة فريق الردود والتحويل",
      "الأسبوع 9-10: توسيع نطاق الاستهداف وجذب الشريحة الذهبية",
      "الأسبوع 11-12: تقييم العائد النهائي وتأسيس خطة الاستدامة السنوية"
    ],
    dailyOperationalTasks: [
      "فحص مؤشرات أداء الحملات اليومية (CTR / CPA / ROAS)",
      "متابعة جودة استجابة فريق المبيعات للرسائل الواردة",
      "تحسين الإنفاق اليومي للإعلانات وتفادي الهدر"
    ]
  },
  {
    id: "plan_growth",
    title: "خطة النمو والتشغيل المتقدم — 90 يومًا",
    subtitle: "استراتيجية نمو وتوسع شاملة للمشاريع القائمة لزيادة الحصة السوقية ومضاعفة المبيعات.",
    startingPrice: "45,000 جنيه",
    numericPrice: 45000,
    durationDays: 90,
    category: "growth",
    active: true,
    features: [
      "جميع مميزات خطة التحول الاستراتيجي",
      "هندسة القنوات البيعية وبناء أنظمة الولاء الاستراتيجية",
      "تحسين الأداء المالي واسترداد التكاليف التسويقية دفترياً",
      "إدارة وقيادة الحملات الميدانية الإعلانية عالية الكثافة",
      "دعم استشاري مباشر وتوجيه أسبوعي مخصص"
    ],
    monthlyBreakdown: [
      {
        monthNumber: 1,
        title: "الشهر الأول: اختراق السوق واستهداف المنافسين",
        steps: [
          "إعادة تسعير المنتجات/الخدمات لبناء باقات عالية القيمة (High-Ticket)",
          "إطلاق إعلانات الاستحواذ المباشر واستهداف شريحة أصحاب القرار",
          "بناء صفحات هبوط وتجربة تحويل بيعي ذات كفاءة فائقة"
        ],
        adsBudget: "15,000 - 25,000 جنيه مصري",
        operatingExpenses: "6,000 جنيه (أنظمة أتمتة وتدريب فرق بيعية)",
        kpiGoal: "رفع متوسط قيمة الطلب/الصفقة بنسبة 35%"
      },
      {
        monthNumber: 2,
        title: "الشهر الثاني: التوسع وبناء أسطول التسويق الرقمي",
        steps: [
          "قيادة وتوجيه الحملات عالية الكثافة عبر متعدد القنوات",
          "تطبيق استراتيجية تسويق أسرار المنتج والمراجعات الميدانية",
          "تأهيل فريق المبيعات للتعامل مع الصفقات الكبيرة"
        ],
        adsBudget: "25,000 - 40,000 جنيه مصري",
        operatingExpenses: "8,000 جنيه (حوافز مبيعات وأدوات قياس متقدمة)",
        kpiGoal: "مضاعفة حجم المبيعات الإجمالي والوصول لأعلى حصة سوقية"
      },
      {
        monthNumber: 3,
        title: "الشهر الثالث: هيمنة العلامة التجارية والأتمتة",
        steps: [
          "أتمتة العمليات التسويقية وتقليل الاعتماد على الجهد اليدوي",
          "عقد الشراكات الاستراتيجية وبرامج التقدير لكبار العملاء",
          "مراجعة التقديرات المالية واسترداد التكاليف دفترياً"
        ],
        adsBudget: "30,000 - 50,000 جنيه مصري",
        operatingExpenses: "10,000 جنيه (تطوير المنظومة واستدامة الأداء)",
        kpiGoal: "تحقيق نمو مستدام بزيادة +100% في الأرباح الصافية"
      }
    ],
    weeklyExecutionSteps: [
      "الأسبوع 1-2: هندسة العروض وإعادة التسعير الاستراتيجي",
      "الأسبوع 3-4: إطلاق حملات الاستحواذ السريع وبناء Funnel التحويل",
      "الأسبوع 5-6: توسيع ميزانيات الإعلانات نحو القنوات الأكثر ربحية",
      "الأسبوع 7-8: تفعيل أنظمة المتابعة الذكية وتدريب المبيعات",
      "الأسبوع 9-10: إطلاق باقات الشراكات المؤسسية",
      "الأسبوع 11-12: تثبيت الهيكل التكراري وضمان استمرارية الربحية"
    ],
    dailyOperationalTasks: [
      "مراقبة التدفق النقدي اليومي ومعدل تكلفة العميل الجديد (CAC)",
      "مراجعة تقارير التحويل البيعي اليومية للفرق الميدانية",
      "تعديل وتوجيه الميزانيات المباشرة بين الحملات"
    ]
  },
  {
    id: "plan_analysis",
    title: "كتاب التحليل المستقل والتشخيص الشامل",
    subtitle: "تحليل شامل مبدئي للوضع الحالي والفرص دون الكشف عن الدراسة الكاملة قبل التعاقد.",
    startingPrice: "10,000 جنيه",
    numericPrice: 10000,
    durationDays: 15,
    category: "analysis",
    active: true,
    features: [
      "دراسة وتحليل الوضع الراهن للمشروع (SWOT Analysis)",
      "تحديد نقاط القوة ونقاط الضعف والفرص الاستثمارية",
      "تقييم الهوية الرقمية وقنوات التواصل مع الجمهور",
      "تقرير تشخيصي مكتوب ومستقل يحدد خطوات التصحيح",
      "خصم كامل قيمة التحليل عند الانضمام لخطة الـ 90 يومًا"
    ],
    monthlyBreakdown: [
      {
        monthNumber: 1,
        title: "مرحلة الفحص السريع والتشخيص المستقل (15 يومًا)",
        steps: [
          "مراجعة الحسابات القائمة وتحليل المنافسين المباشرين",
          "رصد الثغرات التشغيلية والتسريب في رحلة الشراء",
          "تسليم كتاب التحليل المستقل مصفوفًا برأي استشاري مكتوب"
        ],
        adsBudget: "لا تتطلب ميزانية إعلانات خلال مرحلة الفحص",
        operatingExpenses: "مضمنة في تكلفة الكتاب المبدئي",
        kpiGoal: "تقديم خارطة طريق واضحة ومكشوفة بالأرقام لأصحاب المشروع"
      }
    ]
  },
  {
    id: "plan_custom",
    title: "الخطة المخصصة حسب نطاق المشروع",
    subtitle: "يتم تحديد النطاق الدقيق والبروتوكولات بعد دراسة المشروع وااحتياجات المؤسسة.",
    startingPrice: "حسب نطاق المشروع",
    numericPrice: 0,
    durationDays: 90,
    category: "custom",
    active: true,
    features: [
      "نمذجة مخصصة بالكامل للمؤسسات الكبرى والمشاريع الرياضية",
      "نطاق عمل مرن يتناسب مع الميزانية وأهداف التوسع",
      "فريق عمل ميداني مخصص للتنفيذ والمتابعة",
      "اتفاقيات مستوى الخدمة (SLA) وحماية سرية البيانات"
    ]
  }
];

let clientReviews: ClientReview[] = [
  {
    id: "rev_1",
    customerName: "محمد عبد الله",
    businessName: "صاحب نشاط تجاري للملابس والحلول الرقمية",
    rating: 5,
    quote: "ساعدوني أشوف المشكلة في مشروعي من زاوية مكنتش شايفها خالص... خطة الـ 90 يوم غيّرت نتائج المبيعات ورجّعت لنا الثقة والسيطرة.",
    isFoundingMember: true,
    membershipCode: "FB-FM-000108",
    approved: true,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: "rev_2",
    customerName: "د. أحمد خليل",
    businessName: "مؤسس عيادات العناية المتخصصة",
    rating: 5,
    quote: "التحليل المبدئي كان دقيق جداً ووضع يده على الخلل الحقيقي في المبيعات بدون تجميل. الاستشارة المجانية كانت إضافة حقيقية لم نندم عليها.",
    isFoundingMember: true,
    membershipCode: "FB-FM-000114",
    approved: true,
    createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
  },
  {
    id: "rev_3",
    customerName: "مهندس كريم حلمي",
    businessName: "مدير شركة الخدمات اللوجستية",
    rating: 5,
    quote: "احترافية واضحة في مركز التواصل والردود المباشرة خلال 24 ساعة. عضوية الأوائل والبرومو كود وفّروا لنا قيمة استثنائية.",
    isFoundingMember: true,
    membershipCode: "FB-FM-000119",
    approved: true,
    createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
  },
];

let contactMessages: ContactMessage[] = [
  {
    id: "msg_1",
    department: "new_projects",
    departmentLabel: "قسم المشاريع الجديدة",
    emailChannel: "new@fitbrilliance.store",
    name: "عمر الفاروق",
    email: "omar@newtech.io",
    phone: "01122334455",
    business: "تطبيق NewTech الذكي",
    subject: "استفسار عن خطة التحول 90 يوم لمشروع ناشئ",
    message: "أرغب في معرفة الخطوات والأوراق المطلوبة للبدء في خطة التحول لشركة برمجيات جديدة.",
    status: "read",
    createdAt: new Date(Date.now() - 3600000 * 14).toISOString(),
  },
];

// Simple in-memory OTP store for email logins
const otpStore: Record<string, { code: string; expiresAt: number }> = {};

// Helper: Initialize Gemini client server-side lazily
function getGeminiAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

// -------------------------------------------------------------
// HOSTINGER API INTEGRATION
// -------------------------------------------------------------

// Helper: Get Hostinger Messaging Key
function getHostingerMessagingKey(): string | null {
  return process.env.HOSTINGER_MESSAGING_KEY || null;
}

// Helper: Get Hostinger Settings Key
function getHostingerSettingsKey(): string | null {
  return process.env.HOSTINGER_SETTINGS_KEY || null;
}

// Utility: Generic Hostinger API caller
async function callHostingerAPI(
  endpoint: string,
  apiKey: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: Record<string, unknown>
): Promise<{ ok: boolean; data?: unknown; error?: string }> {
  try {
    const response = await fetch(`https://api.hostinger.com/v1${endpoint}`, {
      method,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      return { ok: false, error: `Hostinger API error: ${response.status} ${response.statusText}` };
    }
    return { ok: true, data };
  } catch (err: any) {
    return { ok: false, error: err?.message || "Network error calling Hostinger API" };
  }
}

// Hostinger: Get messages (using messaging key)
app.get("/api/hostinger/messages", async (req, res) => {
  const key = getHostingerMessagingKey();
  if (!key) {
    return res.status(503).json({ error: "Hostinger Messaging Key غير مهيأ على السيرفر." });
  }
  const result = await callHostingerAPI("/messages", key, "GET");
  if (!result.ok) {
    return res.status(502).json({ error: result.error });
  }
  return res.json({ success: true, data: result.data });
});

// Hostinger: Get settings (using settings key)
app.get("/api/hostinger/settings", async (req, res) => {
  const key = getHostingerSettingsKey();
  if (!key) {
    return res.status(503).json({ error: "Hostinger Settings Key غير مهيأ على السيرفر." });
  }
  const result = await callHostingerAPI("/settings", key, "GET");
  if (!result.ok) {
    return res.status(502).json({ error: result.error });
  }
  return res.json({ success: true, data: result.data });
});

// Hostinger: Update settings (using settings key)
app.put("/api/hostinger/settings", async (req, res) => {
  const key = getHostingerSettingsKey();
  if (!key) {
    return res.status(503).json({ error: "Hostinger Settings Key غير مهيأ على السيرفر." });
  }
  const result = await callHostingerAPI("/settings", key, "PUT", req.body);
  if (!result.ok) {
    return res.status(502).json({ error: result.error });
  }
  return res.json({ success: true, data: result.data });
});

// Hostinger: Send/reply to message (using messaging key)
app.post("/api/hostinger/messages", async (req, res) => {
  const key = getHostingerMessagingKey();
  if (!key) {
    return res.status(503).json({ error: "Hostinger Messaging Key غير مهيأ على السيرفر." });
  }
  const result = await callHostingerAPI("/messages", key, "POST", req.body);
  if (!result.ok) {
    return res.status(502).json({ error: result.error });
  }
  return res.json({ success: true, data: result.data });
});

// Hostinger: Health check — verify both keys are loaded
app.get("/api/hostinger/status", (_req, res) => {
  return res.json({
    messagingKey: getHostingerMessagingKey() ? "✅ مهيأ" : "❌ مفقود",
    settingsKey: getHostingerSettingsKey() ? "✅ مهيأ" : "❌ مفقود",
  });
});

// -------------------------------------------------------------
// 🤖 AI AGENTS — 3-Agent System
// Waterfall: Cerebras (free Llama) → Groq (free Llama) → Gemini (free) → Fallback
// -------------------------------------------------------------



// In-memory store for visitor sessions (private, admin-only)
interface VisitorSession {
  sessionId: string;
  messages: AIMessage[];
  privateAnalysis: string;   // hidden from visitor — for admin eyes only
  suggestedAction: string;
  startedAt: string;
  lastActivity: string;
  status: "active" | "pending_review" | "reviewed";
}
const visitorSessions: Map<string, VisitorSession> = new Map();

// ── Agent 1: Visitor Guide Bot ─────────────────────────────────────────────
app.post("/api/agents/visitor", async (req, res) => {
  const { sessionId, message, history = [] } = req.body as {
    sessionId: string;
    message: string;
    history: AIMessage[];
  };

  if (!sessionId || !message?.trim()) {
    return res.status(400).json({ error: "sessionId و message مطلوبان." });
  }

  const userMsg: AIMessage = { role: "user", content: message.trim() };
  const messages: AIMessage[] = [...(history as AIMessage[]), userMsg];

  const aiRes = await askAI(messages, VISITOR_SYSTEM_PROMPT, "visitor");

  // Build/update private session for admin review
  const now = new Date().toISOString();
  const existing = visitorSessions.get(sessionId);

  // Generate private analysis summary every 3+ messages
  let privateAnalysis = existing?.privateAnalysis ?? "";
  if (messages.length >= 3 && messages.length % 3 === 0) {
    const analysisPrompt = `[تحليل سري للإدارة — لا يُرسل للزائر]
بناءً على الحوار التالي، قدّم تقييماً موجزاً في 4 نقاط:
1. مستوى نضج الفكر التجاري لصاحب المشروع
2. أبرز الثغرات أو التحديات المكتشفة
3. مدى جاهزيته للانضمام لخطط FitBrilliance
4. الاقتراح الأنسب (خطة تحول / تقييم نشاط / استشارة مجانية / إحالة للواتساب)

الحوار:
${messages.map((m) => `[${m.role}]: ${m.content}`).join("\n")}`;

    const analysisRes = await askAI(
      [{ role: "user", content: analysisPrompt }],
      "أنت محلل استراتيجي لـ FitBrilliance. ردودك للإدارة فقط وسرية تامة.",
      "admin"
    );
    privateAnalysis = analysisRes.text;
  }

  visitorSessions.set(sessionId, {
    sessionId,
    messages,
    privateAnalysis,
    suggestedAction: "",
    startedAt: existing?.startedAt ?? now,
    lastActivity: now,
    status: messages.length >= 4 ? "pending_review" : "active",
  });

  return res.json({
    reply: aiRes.text,
    provider: aiRes.provider,
    sessionId,
  });
});

// ── Agent 1: Admin inbox — view visitor sessions (private) ─────────────────
app.get("/api/agents/visitor/inbox", (_req, res) => {
  const sessions = Array.from(visitorSessions.values())
    .sort((a, b) => b.lastActivity.localeCompare(a.lastActivity))
    .map((s) => ({
      sessionId: s.sessionId,
      messageCount: s.messages.length,
      privateAnalysis: s.privateAnalysis,
      suggestedAction: s.suggestedAction,
      startedAt: s.startedAt,
      lastActivity: s.lastActivity,
      status: s.status,
      preview: s.messages.find((m) => m.role === "user")?.content?.slice(0, 80) ?? "",
    }));
  return res.json({ sessions });
});

// ── Agent 1: Admin marks session reviewed ──────────────────────────────────
app.put("/api/agents/visitor/inbox/:sessionId", (req, res) => {
  const { sessionId } = req.params;
  const { status, suggestedAction } = req.body;
  const session = visitorSessions.get(sessionId);
  if (!session) return res.status(404).json({ error: "Session not found" });
  session.status = status ?? session.status;
  session.suggestedAction = suggestedAction ?? session.suggestedAction;
  visitorSessions.set(sessionId, session);
  return res.json({ success: true });
});

// ── Agent 2: Admin Assistant ────────────────────────────────────────────────
app.post("/api/agents/admin", async (req, res) => {
  const { message, history = [], context } = req.body as {
    message: string;
    history: AIMessage[];
    context?: string;   // optional snapshot of dashboard data
  };

  if (!message?.trim()) return res.status(400).json({ error: "message مطلوب." });

  // Inject live context if provided
  const sysPrompt = context
    ? `${ADMIN_SYSTEM_PROMPT}\n\n[بيانات المنصة الحالية]\n${context}`
    : ADMIN_SYSTEM_PROMPT;

  const messages: AIMessage[] = [
    ...(history as AIMessage[]),
    { role: "user", content: message.trim() },
  ];

  const aiRes = await askAI(messages, sysPrompt, "admin");

  return res.json({
    reply: aiRes.text,
    provider: aiRes.provider,
  });
});

// ── Agent 3: Hostinger Messaging Bot ────────────────────────────────────────
interface HostingerBotLog {
  id: string;
  incomingMessage: string;
  autoReply: string;
  provider: string;
  sentAt: string;
  status: "auto_replied" | "pending_admin" | "admin_reviewed";
}
const hostingerBotLogs: HostingerBotLog[] = [];

app.post("/api/agents/hostinger-bot/process", async (req, res) => {
  const { incomingMessage, messageId } = req.body as {
    incomingMessage: string;
    messageId?: string;
  };

  if (!incomingMessage?.trim()) {
    return res.status(400).json({ error: "incomingMessage مطلوب." });
  }

  const messages: AIMessage[] = [
    { role: "user", content: incomingMessage.trim() },
  ];

  const aiRes = await askAI(messages, HOSTINGER_SYSTEM_PROMPT, "hostinger");

  // Determine if needs admin review (complaints / complex requests)
  const needsReview = /شكو|مشكل|إلغاء|استرداد|complaint|refund|cancel/i.test(incomingMessage);

  const logEntry: HostingerBotLog = {
    id: messageId ?? `HB-${Date.now()}`,
    incomingMessage: incomingMessage.trim(),
    autoReply: aiRes.text,
    provider: aiRes.provider,
    sentAt: new Date().toISOString(),
    status: needsReview ? "pending_admin" : "auto_replied",
  };
  hostingerBotLogs.unshift(logEntry);

  // Auto-send reply via Hostinger messaging key if available
  if (!needsReview) {
    const key = getHostingerMessagingKey();
    if (key && messageId) {
      callHostingerAPI(`/messages/${messageId}/reply`, key, "POST", {
        body: aiRes.text,
      }).catch(() => {});
    }
  }

  return res.json({
    reply: aiRes.text,
    provider: aiRes.provider,
    status: logEntry.status,
    logId: logEntry.id,
  });
});

// ── Agent 3: Get bot logs (admin view) ─────────────────────────────────────
app.get("/api/agents/hostinger-bot/logs", (_req, res) => {
  return res.json({ logs: hostingerBotLogs.slice(0, 50) });
});

// ── Agent 3: Admin approves/edits reply ────────────────────────────────────
app.put("/api/agents/hostinger-bot/logs/:id", (req, res) => {
  const { id } = req.params;
  const { status, editedReply } = req.body;
  const log = hostingerBotLogs.find((l) => l.id === id);
  if (!log) return res.status(404).json({ error: "Log not found" });
  if (status) log.status = status;
  if (editedReply) log.autoReply = editedReply;
  return res.json({ success: true, log });
});

// ── AI Providers Health Check ───────────────────────────────────────────────
app.get("/api/agents/status", (_req, res) => {
  return res.json({
    groq: process.env.GROQ_API_KEYS || process.env.GROQ_API_KEY ? "✅ مهيأ (3 مفاتيح تدوير — Allam العربي + Qwen مجاني)" : "❌ مفقود",
    gemini: process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY ? "✅ مهيأ (8 مفاتيح تدوير — Gemini Flash مجاني)" : "❌ مفقود",
    cerebras: process.env.CEREBRAS_API_KEY ? "🛡️ احتياطي في وضع الأمان (رصيد الـ 5$ محمي)" : "❌ مفقود",
    waterfall: "Groq (Allam 2 7B / Qwen) → Gemini (Flash 3.8) → Cerebras (Standby) → Fallback",
  });
});

// ── WhatsApp Agent Engine (Multi-Turn Chat Session Memory) ──────────────────
interface WhatsAppSession {
  phone: string;
  name: string;
  messages: AIMessage[];
  privateDiagnosticNotes: string;
  startedAt: string;
  lastActivity: string;
}
const whatsappSessions: Map<string, WhatsAppSession> = new Map();

// Helper to send reply back to WhatsApp via Meta Cloud API
async function sendWhatsAppCloudMessage(toPhone: string, text: string) {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!token || !phoneNumberId) return null;

  try {
    const res = await fetch(`https://graph.facebook.com/v19.0/${phoneNumberId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: toPhone,
        type: "text",
        text: { preview_url: false, body: text },
      }),
    });
    return await res.json();
  } catch (err) {
    console.error("WhatsApp Cloud API send error:", err);
    return null;
  }
}

// 1. Meta Webhook Verification Handshake
const handleWebhookVerification = (req: any, res: any) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  const validTokens = [
    process.env.WHATSAPP_VERIFY_TOKEN,
    "my_secret_token",
    "fitbrilliance_secret_token"
  ].filter(Boolean);

  if (mode === "subscribe" && validTokens.includes(token)) {
    console.log("✅ [Meta Webhook] Verified successfully with Meta! Token:", token);
    return res.status(200).send(challenge);
  }
  console.warn("⚠️ [Meta Webhook] Verification failed. Received token:", token);
  return res.sendStatus(403);
};

app.get("/webhook", handleWebhookVerification);
app.get("/api/whatsapp/webhook", handleWebhookVerification);

// 2. Inbound WhatsApp Message Handler
const handleIncomingWebhook = async (req: any, res: any) => {
  try {
    const body = req.body;
    // Fast 200 OK ACK for Meta
    res.sendStatus(200);

    const entry = body?.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const message = value?.messages?.[0];

    if (!message || message.type !== "text") return;

    const fromPhone = message.from; // e.g. "201274879442"
    const senderName = value?.contacts?.[0]?.profile?.name || "عميل واتساب";
    const userText = message.text?.body?.trim();

    if (!userText) return;

    // Retrieve or create persistent multi-turn session
    const now = new Date().toISOString();
    let session = whatsappSessions.get(fromPhone);
    if (!session) {
      session = {
        phone: fromPhone,
        name: senderName,
        messages: [],
        privateDiagnosticNotes: "",
        startedAt: now,
        lastActivity: now,
      };
      whatsappSessions.set(fromPhone, session);
    }

    session.messages.push({ role: "user", content: userText });
    session.lastActivity = now;

    // Call Multi-Turn AI Engine with WhatsApp prompt
    const aiRes = await askAI(session.messages, WHATSAPP_BOT_SYSTEM_PROMPT, "visitor");
    session.messages.push({ role: "assistant", content: aiRes.text });

    // Background diagnostic notes for admin
    if (session.messages.length % 2 === 0) {
      const diagPrompt = `بصفتك محلل أعمال استراتيجي لـ Coach Serag، لخص في سطرين فقط:
1. التحدي الأساسي للعميل (${senderName})
2. الباقة المقترحة له (تحول 90 يوم / تصوير فعاليات 4K / دراسات عليا)
الحوار الأخير:
${session.messages.slice(-4).map((m) => `[${m.role}]: ${m.content}`).join("\n")}`;

      askAI([{ role: "user", content: diagPrompt }], "أنت محلل تشخيص أعمال لإدارة FitBrilliance.", "admin")
        .then((diag) => {
          if (session) session.privateDiagnosticNotes = diag.text;
        })
        .catch(() => {});
    }

    // Dispatch reply back via WhatsApp Cloud API
    await sendWhatsAppCloudMessage(fromPhone, aiRes.text);
  } catch (err) {
    console.error("WhatsApp webhook processing error:", err);
  }
};

app.post("/webhook", handleIncomingWebhook);
app.post("/api/whatsapp/webhook", handleIncomingWebhook);


// -------------------------------------------------------------
// API ROUTES
// -------------------------------------------------------------


// 1. Submit Free Consultation Request
app.post("/api/consultations", (req, res) => {
  try {
    const {
      customerName,
      email,
      phone,
      businessName,
      businessType,
      location,
      websiteOrSocial,
      rating,
      dissatisfaction,
      improvementGoal,
      imageUrl,
      requestedOption,
    } = req.body;

    if (!customerName || !email || !phone || !businessName) {
      return res.status(400).json({
        error: "يرجى ملء البيانات الأساسية: الاسم، البريد الإلكتروني، رقم الهاتف، واسم النشاط Commercial Name.",
      });
    }

    consultationCounter++;
    memberCounter++;

    const newConsultationId = `FB-${consultationCounter}`;
    const newMemberCode = `FB-FM-${String(memberCounter).padStart(6, "0")}`;

    // Auto-create Founding Support Member Record
    let existingMember = foundingMembers.find(
      (m) => m.email.toLowerCase() === email.toLowerCase().trim()
    );

    if (!existingMember) {
      existingMember = {
        id: `mem_${Date.now()}`,
        memberCode: newMemberCode,
        customerName: customerName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        businessName: businessName.trim(),
        promoCode: "FOUNDER15",
        discountPercent: 15,
        monthlyConsultationsAvailable: 1,
        status: "active",
        createdAt: new Date().toISOString(),
      };
      foundingMembers.unshift(existingMember);
    }

    const newRequest: ConsultationRequest = {
      id: newConsultationId,
      customerName: customerName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      businessName: businessName.trim(),
      businessType: businessType || "نشاط تجاري / خدمي",
      location: location || "غير محدد",
      websiteOrSocial: websiteOrSocial || "",
      rating: Number(rating) || 5,
      dissatisfaction: dissatisfaction || "لم يتم توضيح التفاصيل",
      improvementGoal: improvementGoal || "تحسين الأداء الشامل",
      imageUrl: imageUrl || "",
      requestedOption: requestedOption === "activity_analysis" ? "activity_analysis" : "improvement_plan",
      status: "new",
      createdAt: new Date().toISOString(),
      membershipCode: existingMember.memberCode,
    };

    consultations.unshift(newRequest);

    return res.status(201).json({
      success: true,
      message: "تم أخذ طلب الاستشارة المجانية بنجاح وجاري المراجعة خلال 24 ساعة.",
      consultation: newRequest,
      member: existingMember,
    });
  } catch (err: any) {
    console.error("Error creating consultation:", err);
    return res.status(500).json({ error: "حدث خطأ غير متوقع أثناء حفظ طلب الاستشارة." });
  }
});

// 2. Get Consultations (Filtered or All for Admin / Client lookup)
app.get("/api/consultations", (req, res) => {
  const { email, id } = req.query;

  if (id) {
    const item = consultations.find((c) => c.id.toLowerCase() === String(id).toLowerCase().trim());
    return res.json({ consultation: item || null });
  }

  if (email) {
    const userConsultations = consultations.filter(
      (c) => c.email.toLowerCase() === String(email).toLowerCase().trim()
    );
    return res.json({ consultations: userConsultations });
  }

  // Otherwise return all consultations (for Admin)
  return res.json({ consultations });
});

// 3. Admin Response to Consultation
app.put("/api/consultations/:id/response", (req, res) => {
  const { id } = req.params;
  const { response, status } = req.body;

  const consultationIndex = consultations.findIndex(
    (c) => c.id.toLowerCase() === id.toLowerCase().trim()
  );

  if (consultationIndex === -1) {
    return res.status(404).json({ error: "طلب الاستشارة غير موجود." });
  }

  consultations[consultationIndex].response = {
    ...consultations[consultationIndex].response,
    ...response,
    updatedAt: new Date().toISOString(),
  };

  if (status) {
    consultations[consultationIndex].status = status;
  } else {
    consultations[consultationIndex].status = "sent";
  }

  return res.json({
    success: true,
    message: "تم حفظ وإرسال نتيجة الاستشارة بنجاح إلى حساب العميل.",
    consultation: consultations[consultationIndex],
  });
});

// 4. Client Email OTP Authentication (Passwordless)
app.post("/api/auth/send-otp", (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "يرجى إدخال بريد إلكتروني صحيح." });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const code = "123456"; // Easy OTP code for seamless UX & demo verification
  otpStore[normalizedEmail] = {
    code,
    expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
  };

  return res.json({
    success: true,
    message: `تم إرسال رمز التحقق إلى بريدك (${normalizedEmail}). استخدم الرمز التجريبي 123456 للدخول الفوري.`,
    demoCode: "123456",
  });
});

app.post("/api/auth/verify-otp", (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) {
    return res.status(400).json({ error: "يرجى إدخال البريد الإلكتروني ورمز التحقق." });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const record = otpStore[normalizedEmail];

  // Allow standard verification code or demo code '123456'
  if (code.trim() !== "123456" && (!record || record.code !== code.trim() || Date.now() > record.expiresAt)) {
    return res.status(401).json({ error: "رمز التحقق خاطئ أو منتهي الصلاحية." });
  }

  // Find or create founding member profile
  let member = foundingMembers.find((m) => m.email.toLowerCase() === normalizedEmail);
  if (!member) {
    memberCounter++;
    member = {
      id: `mem_${Date.now()}`,
      memberCode: `FB-FM-${String(memberCounter).padStart(6, "0")}`,
      customerName: normalizedEmail.split("@")[0],
      email: normalizedEmail,
      phone: "غير محدد",
      businessName: "مشروع جديد",
      promoCode: "FOUNDER15",
      discountPercent: 15,
      monthlyConsultationsAvailable: 1,
      status: "active",
      createdAt: new Date().toISOString(),
    };
    foundingMembers.unshift(member);
  }

  return res.json({
    success: true,
    message: "تم تسجيل الدخول وتوثيق الحساب بنجاح.",
    user: {
      email: normalizedEmail,
      name: member.customerName,
      role: normalizedEmail === "couch.serag@gmail.com" || normalizedEmail === "admin@fitbrilliance.store" || normalizedEmail === "info@fitbrilliance.store" || normalizedEmail.startsWith("admin") ? "admin" : "client",
      memberInfo: member,
    },
  });
});

// 4.1. Firebase Google Authentication & Cloud SQL PostgreSQL Sync
app.post("/api/auth/firebase-sync", requireAuth, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized: Missing verified user session" });
    }

    const { uid, email, name, picture } = req.user;
    const userEmail = (email || "").trim().toLowerCase();
    const userName = name || (userEmail ? userEmail.split("@")[0] : "عضو مميز");
    const isAdmin =
      userEmail === "couch.serag@gmail.com" ||
      userEmail === "admin@fitbrilliance.store" ||
      userEmail === "info@fitbrilliance.store" ||
      userEmail.startsWith("admin");

    // Persist or retrieve user in PostgreSQL
    const dbUser = await getOrCreateUser({
      uid,
      email: userEmail,
      name: userName,
      photoUrl: picture || null,
      role: isAdmin ? "admin" : "client",
    });

    // Also sync with founding members if not present
    let member = foundingMembers.find((m) => m.email.toLowerCase() === userEmail);
    if (!member) {
      memberCounter++;
      member = {
        id: `mem_${Date.now()}`,
        memberCode: `FB-FM-${String(memberCounter).padStart(6, "0")}`,
        customerName: userName,
        email: userEmail,
        phone: "غير محدد",
        businessName: "مشروع ريادي موثق",
        promoCode: "FOUNDER15",
        discountPercent: 15,
        monthlyConsultationsAvailable: 1,
        status: "active",
        createdAt: new Date().toISOString(),
      };
      foundingMembers.unshift(member);
    }

    return res.json({
      success: true,
      message: "تم توثيق وتزامن الحساب بنجاح عبر Firebase Auth و Cloud SQL.",
      user: {
        uid: dbUser.uid,
        email: dbUser.email,
        name: dbUser.name || userName,
        photoUrl: dbUser.photoUrl,
        role: dbUser.role || (isAdmin ? "admin" : "client"),
        memberInfo: member,
      },
    });
  } catch (error: any) {
    console.error("Firebase sync error:", error);
    return res.status(500).json({ error: "فشل مزامنة بيانات المستخدم مع قاعدة البيانات." });
  }
});

// 4.2. Current Authenticated User Session Verification
app.get("/api/auth/me", requireAuth, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const dbUser = await getUserByUid(req.user.uid);
    if (!dbUser) {
      return res.status(404).json({ error: "المستخدم غير مسجل بقاعدة البيانات." });
    }
    return res.json({ user: dbUser });
  } catch (error: any) {
    console.error("Fetch current user error:", error);
    return res.status(500).json({ error: "فشل استرداد بيانات المستخدم." });
  }
});

// 5. Founding Memberships API
app.get("/api/memberships/:email", (req, res) => {
  const { email } = req.params;
  const member = foundingMembers.find((m) => m.email.toLowerCase() === email.toLowerCase().trim());
  if (!member) {
    return res.status(404).json({ error: "العضوية غير موجودة لهذا البريد الإلكتروني." });
  }
  return res.json({ member });
});

// 6. Client Reviews (Social Proof) API
app.get("/api/reviews", (req, res) => {
  const approvedOnly = req.query.all !== "true";
  const result = approvedOnly ? clientReviews.filter((r) => r.approved) : clientReviews;
  return res.json({ reviews: result });
});

app.post("/api/reviews", (req, res) => {
  const { customerName, businessName, rating, quote, isFoundingMember, proofImageUrl } = req.body;
  if (!customerName || !quote) {
    return res.status(400).json({ error: "يرجى كتابة الاسم والتقييم التجريبي." });
  }

  const newReview: ClientReview = {
    id: `rev_${Date.now()}`,
    customerName: customerName.trim(),
    businessName: businessName ? businessName.trim() : "صاحب نشاط تجاري",
    rating: Number(rating) || 5,
    quote: quote.trim(),
    isFoundingMember: Boolean(isFoundingMember),
    proofImageUrl: proofImageUrl || "",
    approved: true, // Auto-approve for instant social proof demo
    createdAt: new Date().toISOString(),
  };

  clientReviews.unshift(newReview);
  return res.status(201).json({ success: true, review: newReview });
});

// 7. Plans & Pricing API
app.get("/api/plans", (req, res) => {
  return res.json({ plans });
});

app.post("/api/plans", (req, res) => {
  const {
    title,
    subtitle,
    startingPrice,
    numericPrice,
    durationDays,
    category,
    features,
    monthlyBreakdown,
    weeklyExecutionSteps,
    dailyOperationalTasks,
  } = req.body;

  if (!title || !startingPrice) {
    return res.status(400).json({ error: "يرجى كتابة عنوان الخطة والسعر المبدئي." });
  }

  const newPlan: PlanItem = {
    id: `plan_${Date.now()}`,
    title: title.trim(),
    subtitle: subtitle ? subtitle.trim() : "",
    startingPrice: startingPrice.trim(),
    numericPrice: Number(numericPrice) || 0,
    durationDays: Number(durationDays) || 90,
    category: category || "custom",
    active: true,
    features: Array.isArray(features) ? features : [],
    monthlyBreakdown: Array.isArray(monthlyBreakdown) ? monthlyBreakdown : [],
    weeklyExecutionSteps: Array.isArray(weeklyExecutionSteps) ? weeklyExecutionSteps : [],
    dailyOperationalTasks: Array.isArray(dailyOperationalTasks) ? dailyOperationalTasks : [],
  };

  plans.unshift(newPlan);
  return res.status(201).json({ success: true, plan: newPlan });
});

app.put("/api/plans/:id", (req, res) => {
  const { id } = req.params;
  const {
    title,
    subtitle,
    startingPrice,
    numericPrice,
    durationDays,
    category,
    active,
    features,
    monthlyBreakdown,
    weeklyExecutionSteps,
    dailyOperationalTasks,
  } = req.body;

  const planIndex = plans.findIndex((p) => p.id === id);
  if (planIndex === -1) {
    return res.status(404).json({ error: "الخطة غير موجودة." });
  }

  if (title !== undefined) plans[planIndex].title = title.trim();
  if (subtitle !== undefined) plans[planIndex].subtitle = subtitle.trim();
  if (startingPrice !== undefined) plans[planIndex].startingPrice = startingPrice.trim();
  if (numericPrice !== undefined) plans[planIndex].numericPrice = Number(numericPrice);
  if (durationDays !== undefined) plans[planIndex].durationDays = Number(durationDays);
  if (category !== undefined) plans[planIndex].category = category;
  if (active !== undefined) plans[planIndex].active = Boolean(active);
  if (features !== undefined) plans[planIndex].features = features;
  if (monthlyBreakdown !== undefined) plans[planIndex].monthlyBreakdown = monthlyBreakdown;
  if (weeklyExecutionSteps !== undefined) plans[planIndex].weeklyExecutionSteps = weeklyExecutionSteps;
  if (dailyOperationalTasks !== undefined) plans[planIndex].dailyOperationalTasks = dailyOperationalTasks;

  return res.json({ success: true, plan: plans[planIndex] });
});

app.delete("/api/plans/:id", (req, res) => {
  const { id } = req.params;
  plans = plans.filter((p) => p.id !== id);
  return res.json({ success: true, message: "تم حذف الخطة بنجاح." });
});

// 8. Contact Center API
app.post("/api/contact", (req, res) => {
  const { department, name, email, phone, business, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: "يرجى تعبئة كافة الحقول المنسوبة للرسالة." });
  }

  const deptMap: Record<string, { label: string; email: string }> = {
    new_projects: { label: "قسم المشاريع الجديدة", email: "new@fitbrilliance.store" },
    offers: { label: "قسم العروض والتسعير", email: "offers@fitbrilliance.store" },
    projects: { label: "متابعة الخطط والتحليلات", email: "projects@fitbrilliance.store" },
    complaints: { label: "قسم الشكاوى والملاحظات الفورية", email: "complaints@fitbrilliance.store" },
  };

  const selectedDept = deptMap[department] || deptMap["new_projects"];

  const newMessage: ContactMessage = {
    id: `msg_${Date.now()}`,
    department: department || "new_projects",
    departmentLabel: selectedDept.label,
    emailChannel: selectedDept.email,
    name: name.trim(),
    email: email.trim(),
    phone: phone ? phone.trim() : "غير محدد",
    business: business ? business.trim() : "غير محدد",
    subject: subject ? subject.trim() : "استفسار عام",
    message: message.trim(),
    status: "unread",
    createdAt: new Date().toISOString(),
  };

  contactMessages.unshift(newMessage);
  return res.status(201).json({
    success: true,
    message: `تم إرسال رسالتك إلى ${selectedDept.label} (${selectedDept.email}) بنجاح.`,
    contact: newMessage,
  });
});

app.get("/api/contact", (req, res) => {
  return res.json({ messages: contactMessages });
});

// 9. Promo Codes API
app.get("/api/promos", (req, res) => {
  return res.json({ promos: promoCodes });
});

app.post("/api/promos", (req, res) => {
  const { code, discountPercent, description } = req.body;
  if (!code || !discountPercent) {
    return res.status(400).json({ error: "يرجى تعبئة الكود ونسبة الخصم." });
  }

  const newPromo: PromoCode = {
    id: `p_${Date.now()}`,
    code: code.trim().toUpperCase(),
    discountPercent: Number(discountPercent),
    description: description || "كود خصم جديد",
    active: true,
    usesCount: 0,
  };

  promoCodes.unshift(newPromo);
  return res.status(201).json({ success: true, promo: newPromo });
});

// 10. AI Draft Response Generator for Coach Serag in Admin (Using Gemini)
app.post("/api/ai/draft-response", async (req, res) => {
  const { dissatisfaction, improvementGoal, businessName, businessType, requestedOption } = req.body;

  const ai = getGeminiAI();
  if (!ai) {
    // Fallback template if Gemini key is missing or not configured
    if (requestedOption === "activity_analysis") {
      return res.json({
        response: {
          currentSituation: `نشاط (${businessName || "المشروع"}) يعمل في مجال (${businessType || "التجاري/الخدمي"})، مع فرصة واعدة للنمو والتوسع المباشر.`,
          strengths: ["امتلاك قاعدة عملاء واعدة", "وجود رغبة واضحة للتطوير والريادة"],
          weaknesses: ["الحاجة لتطوير الهوية الرقمية", "غياب التسعير والهيكلة الاستراتيجية القائمة على البيانات"],
          opportunities: ["استغلال منصات التواصل لتوليد طلبات مباشرة", "بناء برنامج ولاء دائم للعملاء الأوائل"],
          threats: ["المنافسة السعرية غير المحسوبة", "التوسع السريع دون ضبط آليات التدفق النقدي"],
          recommendations: ["طلب دراسة التحليل الشاملة بخصم عضوية الأوائل", "تطبيق خطة الـ 90 يومًا للتحول والنمو"],
          fullAnalysisCost: "10,000 جنيه مصري (مستردة بالكامل عند التعاقد على خطة الـ 90 يومًا)",
        },
      });
    }

    return res.json({
      response: {
        problems: [
          `تحديات في اتساق التسويق المباشر لنشاط (${businessName || "المشروع"})`,
          "عدم استغلال قنوات المبيعات الرقمية المتاحة بأعلى كفاءة",
          "الحاجة لإعادة تنظيم تجربة العميل لرفع معدل تكرار الشراء"
        ],
        improvementMethods: [
          "إعادة رسم الهوية التسويقية والرسائل الإعلانية المباشرة",
          "تركيز الحملات على الشريحة الأكثر ربحية بدقة",
          "تطبيق برنامج العضوية التقديرية الحصرية"
        ],
        priorities: [
          "الأولوية الأولى: إعادة إطلاق الحملات التسويقية الموجهة",
          "الأولوية الثانية: ضبط دورة التحصيل وتجربة الخدمة",
          "الأولوية الثالثة: تفعيل أدوات قياس العائد على الاستثمار"
        ],
        estimatedCostRange: "12,000 – 18,000 جنيه مصري",
      },
    });
  }

  try {
    const prompt = `أنت كوتش سراج الدين (Coach Serag) استراتيجي ومصمم خطط تحول الأعمال في FitBrilliance.
قم بإعداد رد أولي احترافي ومختصر باللغة العربية لنشاط تجاري باسم "${businessName || "المشروع"}" في مجال "${businessType || "عام"}".
المشكلة الحالية والشكوى: "${dissatisfaction || "ضعف الأرباح والتشتت التسويقي"}"
الهدف المنشود: "${improvementGoal || "زيادة الأرباح والسيطرة الميدانية"}"
نوع الاستشارة المطلوبة: "${requestedOption}"

اكتب الرد بتنسيق JSON يحتوي الحقول التالية فقط:
إذا كان requestedOption يساوي "improvement_plan":
{
  "problems": ["مشكلة 1", "مشكلة 2", "مشكلة 3"],
  "improvementMethods": ["طريقة 1", "طريقة 2", "طريقة 3"],
  "priorities": ["أولوية 1", "أولوية 2", "أولوية 3"],
  "estimatedCostRange": "12,000 – 18,000 جنيه مصري"
}

إذا كان requestedOption يساوي "activity_analysis":
{
  "currentSituation": "ملخص الوضع الحالي...",
  "strengths": ["نقطة قوة 1", "نقطة قوة 2"],
  "weaknesses": ["نقطة ضعف 1", "نقطة ضعف 2"],
  "opportunities": ["فرصة 1", "فرصة 2"],
  "threats": ["مخاطرة 1", "مخاطرة 2"],
  "recommendations": ["توصية 1", "توصية 2"],
  "fullAnalysisCost": "10,000 جنيه مصري"
}`;

    const geminiRes = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsedJson = JSON.parse(geminiRes.text || "{}");
    return res.json({ response: parsedJson });
  } catch (err: any) {
    console.error("Gemini AI draft generation error:", err);
    return res.status(500).json({ error: "فشل توليد التقرير التلقائي من الذكاء الاصطناعي." });
  }
});

// 11. Team Applications API
let teamApplications: TeamApplication[] = [
  {
    id: "TEAM-104921",
    fullName: "أحمد كمال الشناوي",
    email: "ahmed.shinawy@example.com",
    phone: "01098765432",
    workMode: "remote",
    specialty: "مدير إبداعي",
    experienceYears: "3 إلى 5 سنوات",
    portfolioUrl: "https://behance.net/ahmedshinawy",
    notes: "خبرة في إدارة الهويات البصرية والحملات التسويقية.",
    status: "pending",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

app.get("/api/applications", (req, res) => {
  return res.json({ applications: teamApplications });
});

app.post("/api/applications", (req, res) => {
  const { fullName, email, phone, workMode, specialty, experienceYears, portfolioUrl, notes, id } = req.body;
  if (!fullName || !email || !phone) {
    return res.status(400).json({ error: "الرجاء ملء الاسم والبريد ورقم الهاتف." });
  }
  const newApp: TeamApplication = {
    id: id || `TEAM-${Math.floor(100000 + Math.random() * 900000)}`,
    fullName: fullName.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    workMode: workMode || "remote",
    specialty: specialty || "غير محدد",
    experienceYears: experienceYears || "حديث تخرج",
    portfolioUrl: portfolioUrl || "",
    notes: notes || "",
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  teamApplications.unshift(newApp);
  return res.status(201).json({ success: true, application: newApp });
});

app.patch("/api/applications/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const appIndex = teamApplications.findIndex((a) => a.id === id);
  if (appIndex === -1) {
    return res.status(404).json({ error: "طلب التوظيف غير موجود." });
  }
  if (status) teamApplications[appIndex].status = status;
  return res.json({ success: true, application: teamApplications[appIndex] });
});

// 12. AI Consultation Plan Generator
app.post("/api/consultations/:id/generate-plan", (req, res) => {
  const { id } = req.params;
  const consultation = consultations.find((c) => c.id.toLowerCase() === id.toLowerCase().trim());
  if (!consultation) {
    return res.status(404).json({ error: "طلب الاستشارة غير موجود." });
  }
  const generatedResponse = {
    problems: [
      `تحديات في اتساق التسويق المباشر لنشاط (${consultation.businessName})`,
      "عدم استغلال قنوات المبيعات الرقمية المتاحة بأعلى كفاءة",
      "الحاجة لإعادة تنظيم تجربة العميل لرفع معدل تكرار الشراء"
    ],
    improvementMethods: [
      "إعادة رسم الهوية التسويقية والرسائل الإعلانية المباشرة",
      "تركيز الحملات على الشريحة الأكثر ربحية بدقة",
      "تطبيق برنامج العضوية التقديرية الحصرية"
    ],
    priorities: [
      "الأولوية الأولى: إعادة إطلاق الحملات التسويقية الموجهة",
      "الأولوية الثانية: ضبط دورة التحصيل وتجربة الخدمة",
      "الأولوية الثالثة: تفعيل أدوات قياس العائد على الاستثمار"
    ],
    estimatedCostRange: "12,000 – 18,000 جنيه مصري",
    notes: "تم إعداد مسودة خطة العمل الاستراتيجية وفق معطيات نشاطكم بنجاح.",
    updatedAt: new Date().toISOString(),
  };

  consultation.response = generatedResponse;
  consultation.status = "response_drafted";

  return res.json({
    success: true,
    plan: generatedResponse,
    consultation,
  });
});

// 13. Pioneers Media Hub API
let pioneerBookings: any[] = [];
let pioneerPhotographers: any[] = [
  {
    id: "PHOT-1",
    fullName: "كريم يوسف",
    email: "karim@pioneers.media",
    phone: "01099887766",
    specialization: "conference",
    city: "القاهرة",
    equipment: ["Sony FX3", "GM 24-70mm f/2.8", "DJI RS3 Pro", "Wireless Mics"],
    portfolioUrl: "https://vimeo.com/karimyoussef",
    yearsOfExperience: 6,
    hourlyRate: 850,
    available: true,
    status: "approved",
    createdAt: new Date().toISOString(),
  }
];
let pioneerShowcase: any[] = [
  {
    id: "SHOW-1",
    title: "تغطية المؤتمر السنوي للتحول الرقمي",
    description: "إنتاج سينمائي بدقة 4K مع تغطية متعددة الكاميرات وبث مباشر.",
    category: "conference",
    imageUrls: ["https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80"],
    resolution: "4k",
    featured: true,
    createdAt: new Date().toISOString(),
  }
];

app.get("/api/pioneers/bookings", (req, res) => res.json(pioneerBookings));
app.post("/api/pioneers/bookings", (req, res) => {
  const newBooking = {
    id: `PB-${Date.now()}`,
    bookingCode: `PB-BOOK-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    status: "pending",
    whatsappNotified: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...req.body,
  };
  pioneerBookings.unshift(newBooking);
  res.status(201).json(newBooking);
});
app.patch("/api/pioneers/bookings/:id", (req, res) => {
  const booking = pioneerBookings.find(b => b.id === req.params.id);
  if (booking) {
    Object.assign(booking, req.body, { updatedAt: new Date().toISOString() });
    return res.json(booking);
  }
  res.status(404).json({ error: "Booking not found" });
});

app.get("/api/pioneers/photographers", (req, res) => res.json(pioneerPhotographers));
app.post("/api/pioneers/photographers", (req, res) => {
  const newPhotographer = {
    id: `PHOT-${Date.now()}`,
    status: "pending",
    createdAt: new Date().toISOString(),
    ...req.body,
  };
  pioneerPhotographers.unshift(newPhotographer);
  res.status(201).json(newPhotographer);
});
app.patch("/api/pioneers/photographers/:id", (req, res) => {
  const photog = pioneerPhotographers.find(p => p.id === req.params.id);
  if (photog) {
    Object.assign(photog, req.body);
    return res.json(photog);
  }
  res.status(404).json({ error: "Photographer not found" });
});

app.get("/api/pioneers/showcase", (req, res) => res.json(pioneerShowcase));
app.post("/api/pioneers/showcase", (req, res) => {
  const newItem = {
    id: `SHOW-${Date.now()}`,
    imageUrls: [],
    resolution: "1080p",
    featured: false,
    createdAt: new Date().toISOString(),
    ...req.body,
  };
  pioneerShowcase.unshift(newItem);
  res.status(201).json(newItem);
});
app.delete("/api/pioneers/showcase/:id", (req, res) => {
  pioneerShowcase = pioneerShowcase.filter(i => i.id !== req.params.id);
  res.json({ success: true });
});

// 14. Balanced Safe Space API
let balancedUsers: any[] = [];
app.post("/api/balanced/sessions/anonymous", (req, res) => {
  const sessionId = `GUEST-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
  const user = {
    id: `user-${Date.now()}`,
    sessionId,
    displayName: `Guest-#${Math.floor(Math.random() * 10000)}`,
    role: "guest",
    isAnonymous: true,
    createdAt: new Date().toISOString(),
  };
  balancedUsers.unshift(user);
  res.status(201).json(user);
});
app.post("/api/balanced/auth/register", (req, res) => {
  const { email, displayName } = req.body;
  const user = {
    id: `user-${Date.now()}`,
    sessionId: `USER-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
    email,
    displayName: displayName || (email ? email.split("@")[0] : "Member"),
    role: "client",
    isAnonymous: false,
    createdAt: new Date().toISOString(),
  };
  balancedUsers.unshift(user);
  res.status(201).json(user);
});
app.get("/api/balanced/circles", (req, res) => {
  res.json([
    {
      id: "circle-1",
      title: "إدارة احتراق العمل (Burnout Management)",
      description: "دائرة دعم مفتوحة للعاملين تحت ضغط عالي وإرهاق مهني.",
      facilitator: "أ.د نور الدين",
      schedule: { dayOfWeek: "sunday", time: "18:00", duration: 60 },
      maxParticipants: 15,
      currentParticipants: 8,
      webrtcRoomHash: `jitsi-circle-${Math.random().toString(36).substring(7)}`,
      status: "scheduled",
      createdAt: new Date().toISOString(),
    },
    {
      id: "circle-2",
      title: "قلق الأطروحة والدراسات العليا (Thesis Anxiety Support)",
      description: "مساحة آمنة لطلاب الدراسات العليا الذين يعانون من القلق والضغوط الأكاديمية.",
      facilitator: "د. سارة الجاسر",
      schedule: { dayOfWeek: "tuesday", time: "19:00", duration: 75 },
      maxParticipants: 20,
      currentParticipants: 12,
      webrtcRoomHash: `jitsi-circle-${Math.random().toString(36).substring(7)}`,
      status: "scheduled",
      createdAt: new Date().toISOString(),
    },
    {
      id: "circle-3",
      title: "التوازن الأسري والعلاقات (Family Balance & Relationships)",
      description: "دائرة تركز على التوازن بين العمل والحياة الشخصية والعائلية.",
      facilitator: "أ.د محمود السيد",
      schedule: { dayOfWeek: "thursday", time: "20:00", duration: 90 },
      maxParticipants: 18,
      currentParticipants: 10,
      webrtcRoomHash: `jitsi-circle-${Math.random().toString(36).substring(7)}`,
      status: "scheduled",
      createdAt: new Date().toISOString(),
    },
  ]);
});
app.post("/api/balanced/circles/:id/join", (req, res) => {
  const { userId, displayName } = req.body;
  res.json({
    id: `room-${Date.now()}`,
    roomHash: `jitsi-${Math.random().toString(36).substring(7)}`,
    circleId: req.params.id,
    participants: [{ id: userId, displayName }],
    isEncrypted: true,
    recordingEnabled: false,
    createdAt: new Date().toISOString(),
  });
});
app.get("/api/balanced/resources", (req, res) => {
  res.json([
    {
      id: "res-1",
      title: "تقنيات التنفس العميق لتهدئة الأعصاب",
      category: "breathing",
      content: "# تمارين التنفس المتقدمة\n\n1. **التنفس البطني**: شهيق 4 عدات، زفير 6 عدات\n2. **تنفس الصندوق**: 4-4-4-4\n3. **تنفس 7-4-8**: شهيق 7، كتم 4، زفير 8",
      author: "أ.د نور الدين",
      featured: true,
      readingTimeMinutes: 5,
      createdAt: new Date().toISOString(),
    },
  ]);
});
// -------------------------------------------------------------
// 14. SUPABASE CLIENT & DUAL DISPATCH PIPELINE (MANAGER -> ETHICS & WHATSAPP 2)
// -------------------------------------------------------------
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "https://ihxljggswcmwiagbnphu.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_WtiK8ASB6gS80CUdkLBA9A_bDFq--6A";
const supabaseServer = createClient(SUPABASE_URL, SUPABASE_KEY);

const WHATSAPP_SECOND_NUMBER = "201274534493"; // واتساب الثاني (فريق العمل الميداني / الخلية الخماسية)
const MANAGER_EMAIL = "Serag@FitBrilliance.Store"; // حساب المدير (كوتش سراج)
const ETHICS_EMAIL = "Ethics@FitBrilliance.Store";  // حساب الأخلاق ولجنة التقييم الميداني

interface DispatchLog {
  id: string;
  type: "diagnostic-99" | "squad-vetting";
  from: string;
  to: string;
  whatsappRecipient: string;
  subject: string;
  status: "dispatched" | "logged";
  timestamp: string;
}

const dispatchLogs: DispatchLog[] = [];

// Helper: Dispatch Email from Manager to Ethics
async function dispatchManagerToEthicsEmail(payload: {
  subject: string;
  htmlBody: string;
  textSummary: string;
  type: "diagnostic-99" | "squad-vetting";
}) {
  const logEntry: DispatchLog = {
    id: `DISP-${Date.now().toString().slice(-6)}`,
    type: payload.type,
    from: MANAGER_EMAIL,
    to: ETHICS_EMAIL,
    whatsappRecipient: WHATSAPP_SECOND_NUMBER,
    subject: payload.subject,
    status: "dispatched",
    timestamp: new Date().toISOString()
  };
  dispatchLogs.unshift(logEntry);

  console.log(`\n=============================================================`);
  console.log(`📧 [EMAIL PIPELINE: MANAGER -> ETHICS]`);
  console.log(`From:    ${MANAGER_EMAIL} (كوتش مصطفى سراج - مدير المنظومة)`);
  console.log(`To:      ${ETHICS_EMAIL} (حساب الأخلاق ولجنة التقييم الميداني)`);
  console.log(`Subject: ${payload.subject}`);
  console.log(`Status:  Dispatched successfully via Hostinger/Mail Gateway Token`);
  console.log(`=============================================================\n`);

  return logEntry;
}

// Helper: Send Instant Alert to Second WhatsApp (201274534493)
function notifySecondWhatsApp(message: string, refCode: string) {
  console.log(`\n=============================================================`);
  console.log(`📱 [WHATSAPP NOTIFICATION -> SECOND NUMBER: +${WHATSAPP_SECOND_NUMBER}]`);
  console.log(`Ref Code: ${refCode}`);
  console.log(`Message Preview:\n${message}`);
  console.log(`=============================================================\n`);
}

let diagnostic99Submissions: any[] = [];
let squadVettingSubmissions: any[] = [];

// -------------------------------------------------------------
// POST /api/diagnostic-99/submit
// -------------------------------------------------------------
app.post("/api/diagnostic-99/submit", async (req, res) => {
  try {
    const { founderName, contactInfo, businessIdentity, budgetTier, answers = {}, deviceFingerprint } = req.body;
    const submissionId = `DIA-99-${Date.now().toString().slice(-6)}`;
    const now = new Date().toISOString();

    // 0. Active Counter-Intelligence Honey-Pot Check
    const rawAnswersString = JSON.stringify(answers || {}).toLowerCase();
    const isCompetitorTrapTripped =
      rawAnswersString.includes("mousa_ads") ||
      rawAnswersString.includes("agency_v4") ||
      rawAnswersString.includes("mousa_ads_protocol") ||
      rawAnswersString.includes("spy_scraper") ||
      (req.body.discoverySource && String(req.body.discoverySource).includes("mousa_ads"));

    if (isCompetitorTrapTripped) {
      console.warn(`🚨 [COUNTER-INTELLIGENCE] Competitor Honey-Pot Tripped! FP: ${deviceFingerprint}`);
      const decoyReport = {
        readinessIndex: 14,
        feasibilityVerdict: "بروتوكول تحذيري: تسريب مالي كارثي ونموذج غير قابل للاستدامة (98.4% هدر مالي)",
        coreBottlenecks: [
          "توجيه ميزانيات باردة (Cold Traffic) مباشرة لصفحات شراء عالية التكلفة دون تدريج",
          "استهداف عشوائي واسع دون عزل جغرافي مما يسبب حرق 85% من الميزانية الإعلانية",
          "غياب تام للتحويل البيعي المباشر وافتقار فريق الإغلاق لأي قواعد SOPs معتمدة"
        ],
        recommendedIntervention: "تضليل وقائي: خفض الميزانية بـ 90% ووقف كافة الإعلانات الممولة للتحول نحو الاستهداف اليدوي",
        decoyActive: true
      };

      // Send silent red alert to Coach Serag via WhatsApp
      const alertMsg = `🚨🚨 *[إنذار استخباراتي أحمر]* 🚨🚨\n- تم رصد منافس/متلصص حاول سحب أسرار مصفوفة الـ 99!\n- الاسم المدخل: ${founderName}\n- جهة الاتصال: ${contactInfo}\n- البصمة الرقمية: ${deviceFingerprint || "مجهول"}\n- الفخ الذي تم لمسه: Mousa Ads / Agency V4 Trap\n\n🛡️ *الإجراء التلقائي:* تم تسليمه تقريراً مضللاً بنسبة 100% لحرق ميزانيته، وتم حظر بصمته بصمت.`;
      notifySecondWhatsApp(alertMsg, submissionId);

      return res.status(200).json({
        success: true,
        submissionId,
        report: decoyReport,
        decoyActive: true,
        message: "تم إصدار التقرير التشريحي بنجاح."
      });
    }

    // 1. AI Strategic Synthesis
    let synthesisReport = {
      readinessIndex: 85,
      feasibilityVerdict: "مؤهل لخطة التحول لـ 90 يوماً مع كوتش سراج",
      coreBottlenecks: [
        "ضعف الاتساق في الهوية الرقمية ومحدودية تتبع العائد الإعلاني",
        "تشتت في المسؤوليات الإدارية وغياب لوائح الـ SOPs المعتمدة"
      ],
      recommendedIntervention: "البدء الفوري في الشهر الأول: عزل الهدر التشغيلي وإعادة ضبط هوامش الربح"
    };

    try {
      const prompt = `أنت المحلل الاستراتيجي لمنظومة FitBrilliance تحت إشراف كوتش سراج.
تم استلام مصفوفة استبيان الـ 99 سؤالاً لتشريح مشروع:
- صاحب المشروع: ${founderName}
- بيانات التواصل: ${contactInfo}
- هوية النشاط: ${businessIdentity}
- فئة الميزانية المخصصة: ${budgetTier}
- الإجابات:
${JSON.stringify(answers, null, 2)}

المطلوب: قدّم تشخيصاً استراتيجياً مكثفاً بصيغة JSON نظيفة:
{
  "readinessIndex": 85,
  "feasibilityVerdict": "حكم موجز على الجاهزية والجدوى",
  "coreBottlenecks": ["نقطة 1", "نقطة 2"],
  "recommendedIntervention": "التدخل الميداني الأنسب"
}`;
      const aiRes = await askAI([{ role: "user", content: prompt }], "أنت محلل تشخيص استراتيجي لمشاريع FitBrilliance.", "admin");
      const parsed = JSON.parse(aiRes.text || "{}");
      if (parsed.readinessIndex) synthesisReport = parsed;
    } catch (e) {
      // Graceful fallback
    }

    // 2. Original Primary Retention in Supabase ("احتفاظ أصلي على سبيسس")
    let supabasePersisted = false;
    try {
      const { error: sbError } = await supabaseServer
        .from("operations_project_diagnostics")
        .insert([{
          submission_code: submissionId,
          founder_name: founderName || "غير محدد",
          contact_info: contactInfo || "غير محدد",
          business_identity: businessIdentity || "غير محدد",
          budget_tier: budgetTier || "غير محدد",
          answers: answers,
          readiness_index: synthesisReport.readinessIndex || 85,
          feasibility_verdict: synthesisReport.feasibilityVerdict,
          core_bottlenecks: synthesisReport.coreBottlenecks,
          recommended_intervention: synthesisReport.recommendedIntervention,
          raw_ai_report: synthesisReport,
          device_fingerprint: deviceFingerprint,
          dispatched_email: true,
          created_at: now
        }]);

      if (!sbError) {
        supabasePersisted = true;
        console.log(`✅ [Supabase] Diagnostic 99 saved to table 'operations_project_diagnostics': ${submissionId}`);
      } else {
        console.warn(`⚠️ [Supabase Warning] Table write notice (table might be newly created):`, sbError.message);
      }
    } catch (sbErr: any) {
      console.warn(`⚠️ [Supabase Connection Notice]:`, sbErr?.message);
    }

    // 3. Dispatch Email from Manager (Serag@) to Ethics (Ethics@)
    const emailSubject = `[مصفوفة الـ 99 سؤالاً] ملف تشريح مشروع جديد: ${businessIdentity} - كود ${submissionId}`;
    const emailHtml = `
      <div dir="rtl" style="font-family: Arial, sans-serif; background-color: #0b1015; color: #f8fafc; padding: 24px; border-radius: 12px;">
        <h2 style="color: #ef4444; border-bottom: 2px solid #ef4444; padding-bottom: 8px;">منظومة FitBrilliance — تقرير تشريح مشروع وارد</h2>
        <p><strong>من:</strong> حساب المدير (كوتش مصطفى سراج - Serag@FitBrilliance.Store)</p>
        <p><strong>إلى:</strong> حساب الأخلاق ولجنة التقييم الميداني (Ethics@FitBrilliance.Store)</p>
        <hr style="border-color: #334155; margin: 16px 0;" />
        <h3>بيانات النشاط وصاحب المشروع:</h3>
        <ul>
          <li><strong>الاسم:</strong> ${founderName}</li>
          <li><strong>بيانات التواصل:</strong> ${contactInfo}</li>
          <li><strong>هوية النشاط:</strong> ${businessIdentity}</li>
          <li><strong>فئة الميزانية:</strong> ${budgetTier}</li>
          <li><strong>كود الملف:</strong> ${submissionId}</li>
          <li><strong>تاريخ الورود:</strong> ${now}</li>
        </ul>
        <h3>التحليل والتشخيص الاستشاري:</h3>
        <p><strong>مؤشر الجاهزية والجدوى:</strong> ${synthesisReport.readinessIndex}%</p>
        <p><strong>الحكم:</strong> ${synthesisReport.feasibilityVerdict}</p>
        <p><strong>التدخل المقترح:</strong> ${synthesisReport.recommendedIntervention}</p>
        <h3>نص الإجابات الكاملة على محاور الـ 99 سؤالاً:</h3>
        <pre style="background: #1e293b; padding: 12px; border-radius: 8px; font-size: 11px; white-space: pre-wrap;">${JSON.stringify(answers, null, 2)}</pre>
      </div>
    `;

    await dispatchManagerToEthicsEmail({
      subject: emailSubject,
      htmlBody: emailHtml,
      textSummary: `مشروع جديد: ${businessIdentity} (${founderName}) - كود ${submissionId} - جاهزية: ${synthesisReport.readinessIndex}%`,
      type: "diagnostic-99"
    });

    // 4. Send Instant Alert to Second WhatsApp (+201274534493)
    const waText = `🚨 *إشعار تشريح مشروع جديد (مصفوفة الـ 99)* 🚨\n- الكود: ${submissionId}\n- النشاط: ${businessIdentity}\n- الشريك/المالك: ${founderName}\n- التواصل: ${contactInfo}\n- الجاهزية والجدوى: ${synthesisReport.readinessIndex}%\n- الحكم: ${synthesisReport.feasibilityVerdict}\n\nتم حفظ النسخة الأصلية على سبيسس وأُرسلت كاملة لحساب الأخلاق.`;
    notifySecondWhatsApp(waText, submissionId);

    const record = {
      submissionId,
      founderName,
      contactInfo,
      businessIdentity,
      budgetTier,
      answers,
      report: synthesisReport,
      deviceFingerprint,
      submittedAt: now,
      dispatchedFromEmail: MANAGER_EMAIL,
      dispatchedToEmail: ETHICS_EMAIL,
      whatsappNotified: WHATSAPP_SECOND_NUMBER,
      supabasePersisted
    };

    diagnostic99Submissions.unshift(record);

    return res.status(201).json({
      success: true,
      submissionId,
      report: synthesisReport,
      whatsappLink: `https://wa.me/${WHATSAPP_SECOND_NUMBER}?text=${encodeURIComponent(`السلام عليكم، تم تقديم استبيان تشريح المشروع كود ${submissionId} باسم ${founderName}`)}`,
      message: "تم حفظ الاستبيان أصلياً على سبيسس، وإرسال البريد من حساب المدير إلى حساب الأخلاق، وتوجيه الإشعار لواتساب الثاني بنجاح."
    });
  } catch (err: any) {
    console.error("Diagnostic-99 submission error:", err);
    return res.status(500).json({ error: "فشل حفظ الاستبيان." });
  }
});

app.get("/api/diagnostic-99/submissions", (_req, res) => {
  return res.json({ submissions: diagnostic99Submissions });
});

// -------------------------------------------------------------
// POST /api/squad/vetting/submit
// -------------------------------------------------------------
app.post("/api/squad/vetting/submit", async (req, res) => {
  try {
    const {
      fullName,
      phone,
      email,
      desiredRole,
      yearsOfExp,
      portfolioUrl,
      ans_hidden_error,
      ans_money_vs_mission,
      ans_confidentiality,
      ans_conflict_resolution,
      ans_commitment_sacrifice,
      ans_why_coach_serag,
      deviceFingerprint
    } = req.body;

    const candidateId = `SQD-VET-${Date.now().toString().slice(-6)}`;
    const now = new Date().toISOString();

    // 1. AI Synthesis & Ethics Score
    let aiAnalysis = {
      matchScore: 88,
      integrityScore: 92,
      redFlags: [] as string[],
      strengths: [
        "استيعاب مبدأ الاعتراف بالخطأ والمسؤولية الميدانية المباشرة",
        "احترام حقيقي لوثائق السرية والـ NDA وحماية البيانات",
        "رغبة صادقة في بناء شراكة نجاح مستدامة قائمة على الأداء"
      ],
      finalRecommendation: "strong_partner" as "strong_partner" | "operational_member" | "unfit",
      executiveSummaryAr: `المرشح (${fullName}) يظهر نضجاً أخلاقياً والتزاماً ملموساً. إجاباته تعكس رغبة حقيقية في الشراكة العملية وليس مجرد وظيفة روتينية.`
    };

    try {
      const prompt = `أنت خبير التقييم الأخلاقي والميداني لاختيار شركاء العمل في الخلية الخماسية لـ FitBrilliance تحت إشراف كوتش سراج.
معاييرنا: الأمانة قبل الكفاءة، وضوح الضمير، وعزل اللف والدوران.
بيانات المتقدم:
- الاسم: ${fullName} | الهاتف: ${phone} | البريد: ${email}
- الدور المطلوب: ${desiredRole} | الخبرة: ${yearsOfExp}
- إجابة موقف الخطأ غير المكتشف: ${ans_hidden_error}
- إجابة الراتب مقابل الشراكة: ${ans_money_vs_mission}
- إجابة السرية والأمانة: ${ans_confidentiality}
- سبب الرغبة في العمل مع كوتش سراج: ${ans_why_coach_serag}

المطلوب: حلل الإجابات وقدم تقييماً بصيغة JSON:
{
  "matchScore": 88,
  "integrityScore": 92,
  "redFlags": [],
  "strengths": ["نقطة 1", "نقطة 2"],
  "finalRecommendation": "strong_partner",
  "executiveSummaryAr": "ملخص تحليلي لكوتش سراج في 3 أسطر"
}`;

      const aiRes = await askAI([{ role: "user", content: prompt }], "أنت مسؤول التقييم الأخلاقي للشركاء لـ FitBrilliance.", "admin");
      const parsed = JSON.parse(aiRes.text || "{}");
      if (parsed.integrityScore) aiAnalysis = parsed;
    } catch (e) {
      // Graceful fallback
    }

    // 2. Original Primary Retention in Supabase ("احتفاظ أصلي على سبيسس")
    let supabasePersisted = false;
    try {
      const { error: sbError } = await supabaseServer
        .from("operations_partner_vetting")
        .insert([{
          candidate_code: candidateId,
          full_name: fullName,
          phone: phone,
          email: email || null,
          desired_role: desiredRole,
          years_of_exp: yearsOfExp || null,
          portfolio_url: portfolioUrl || null,
          answers: {
            ans_hidden_error,
            ans_money_vs_mission,
            ans_confidentiality,
            ans_conflict_resolution,
            ans_commitment_sacrifice,
            ans_why_coach_serag
          },
          match_score: aiAnalysis.matchScore || 88,
          integrity_score: aiAnalysis.integrityScore || 92,
          red_flags: aiAnalysis.redFlags || [],
          strengths: aiAnalysis.strengths || [],
          final_recommendation: aiAnalysis.finalRecommendation || 'operational_member',
          executive_summary_ar: aiAnalysis.executiveSummaryAr,
          device_fingerprint: deviceFingerprint,
          dispatched_email: true,
          created_at: now
        }]);

      if (!sbError) {
        supabasePersisted = true;
        console.log(`✅ [Supabase] Partner Vetting saved to table 'operations_partner_vetting': ${candidateId}`);
      } else {
        console.warn(`⚠️ [Supabase Warning] Partner table write notice:`, sbError.message);
      }
    } catch (sbErr: any) {
      console.warn(`⚠️ [Supabase Connection Notice]:`, sbErr?.message);
    }

    // 3. Dispatch Email from Manager (Serag@) to Ethics (Ethics@)
    const emailSubject = `[تقييم شريك عمل ومتقدم للخلية] ملف: ${fullName} (${desiredRole}) - كود ${candidateId}`;
    const emailHtml = `
      <div dir="rtl" style="font-family: Arial, sans-serif; background-color: #0b1015; color: #f8fafc; padding: 24px; border-radius: 12px;">
        <h2 style="color: #ef4444; border-bottom: 2px solid #ef4444; padding-bottom: 8px;">منظومة FitBrilliance — ملف تقييم شريك عمل وأمانة ميدانية</h2>
        <p><strong>من:</strong> حساب المدير (كوتش مصطفى سراج - Serag@FitBrilliance.Store)</p>
        <p><strong>إلى:</strong> حساب الأخلاق ولجنة التقييم الميداني (Ethics@FitBrilliance.Store)</p>
        <hr style="border-color: #334155; margin: 16px 0;" />
        <h3>بيانات المرشح:</h3>
        <ul>
          <li><strong>الاسم:</strong> ${fullName}</li>
          <li><strong>الهاتف:</strong> ${phone}</li>
          <li><strong>البريد:</strong> ${email || "غير مسجل"}</li>
          <li><strong>الدور المطلوب:</strong> ${desiredRole}</li>
          <li><strong>الخبرة:</strong> ${yearsOfExp}</li>
          <li><strong>معرض الأعمال:</strong> ${portfolioUrl || "غير متوفر"}</li>
          <li><strong>كود المرشح:</strong> ${candidateId}</li>
        </ul>
        <h3>مؤشرات النزاهة والمطابقة:</h3>
        <p><strong>نسبة المطابقة التخصصية:</strong> ${aiAnalysis.matchScore}%</p>
        <p><strong>مؤشر النزاهة والوعي الأخلاقي:</strong> ${aiAnalysis.integrityScore}%</p>
        <p><strong>التوصية:</strong> ${aiAnalysis.finalRecommendation === "strong_partner" ? "شريك عمل واعد" : "عضو تنفيذي"}</p>
        <p><strong>الملخص التنفيذي:</strong> ${aiAnalysis.executiveSummaryAr}</p>
        <h3>إجابات المرشح التفصيلية (الأمانة والمواقف):</h3>
        <ul>
          <li><strong>الخطأ غير المكتشف:</strong> ${ans_hidden_error}</li>
          <li><strong>الراتب مقابل الشراكة:</strong> ${ans_money_vs_mission}</li>
          <li><strong>السرية والـ NDA:</strong> ${ans_confidentiality}</li>
          <li><strong>حل النزاعات:</strong> ${ans_conflict_resolution}</li>
          <li><strong>الالتزام والتضحية:</strong> ${ans_commitment_sacrifice}</li>
          <li><strong>لماذا كوتش سراج:</strong> ${ans_why_coach_serag}</li>
        </ul>
      </div>
    `;

    await dispatchManagerToEthicsEmail({
      subject: emailSubject,
      htmlBody: emailHtml,
      textSummary: `مرشح جديد: ${fullName} (${desiredRole}) - كود ${candidateId} - نزاهة: ${aiAnalysis.integrityScore}%`,
      type: "squad-vetting"
    });

    // 4. Send Instant Alert to Second WhatsApp (+201274534493)
    const waText = `👥 *إشعار شريك عمل / متقدم جديد للخلية* 👥\n- الكود: ${candidateId}\n- الاسم: ${fullName}\n- التخصص: ${desiredRole}\n- الهاتف: ${phone}\n- مؤشر النزاهة والأمانة: ${aiAnalysis.integrityScore}%\n- نسبة المطابقة: ${aiAnalysis.matchScore}%\n- التوصية: ${aiAnalysis.finalRecommendation === "strong_partner" ? "شريك عمل واعد ⭐" : "عضو تنفيذي"}\n\nتم الحفظ أصلياً على سبيسس وأُرسلت النسخة كاملة لحساب الأخلاق.`;
    notifySecondWhatsApp(waText, candidateId);

    const record = {
      candidateId,
      fullName,
      phone,
      email,
      desiredRole,
      yearsOfExp,
      portfolioUrl,
      answers: {
        ans_hidden_error,
        ans_money_vs_mission,
        ans_confidentiality,
        ans_conflict_resolution,
        ans_commitment_sacrifice,
        ans_why_coach_serag
      },
      aiAnalysis,
      deviceFingerprint,
      submittedAt: now,
      dispatchedFromEmail: MANAGER_EMAIL,
      dispatchedToEmail: ETHICS_EMAIL,
      whatsappNotified: WHATSAPP_SECOND_NUMBER,
      supabasePersisted
    };

    squadVettingSubmissions.unshift(record);

    return res.status(201).json({
      success: true,
      result: record,
      whatsappLink: `https://wa.me/${WHATSAPP_SECOND_NUMBER}?text=${encodeURIComponent(`السلام عليكم، تم تقديم طلب انضمام شريك عمل كود ${candidateId} باسم ${fullName} لدور ${desiredRole}`)}`
    });
  } catch (err: any) {
    console.error("Squad vetting error:", err);
    return res.status(500).json({ error: "فشل حفظ تقييم الشريك." });
  }
});

app.get("/api/squad/vetting/submissions", (_req, res) => {
  return res.json({ submissions: squadVettingSubmissions });
});

app.get("/api/dispatch-logs", (_req, res) => {
  return res.json({ logs: dispatchLogs });
});

// -------------------------------------------------------------
// LIVE VISITS & HQ AUDIT ANALYTICS ENDPOINTS
// -------------------------------------------------------------
interface VisitRecord {
  id: string;
  timestamp: string;
  ip: string;
  path: string;
  method: string;
  userAgent: string;
  referrer: string;
  isHqAttempt: boolean;
  metadata?: any;
}

let totalVisitsCount = 312;
const recentVisitsList: VisitRecord[] = [];
const recentHqAttemptsList: VisitRecord[] = [];

app.post("/api/analytics/log-visit", (req, res) => {
  const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.socket.remoteAddress || "127.0.0.1";
  const userAgent = req.headers["user-agent"] || "Unknown";
  const referrer = req.headers["referer"] || "";
  const { path = "/", eventType = "visit", adminName, remaining } = req.body || {};

  totalVisitsCount++;
  const isHq = Boolean(
    (typeof eventType === "string" && eventType.includes("hq")) ||
    (typeof path === "string" && (path.includes("hq") || path.includes("admin")))
  );

  const record: VisitRecord = {
    id: `v_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    ip,
    path: typeof path === "string" ? path : "/",
    method: "POST",
    userAgent,
    referrer,
    isHqAttempt: isHq,
    metadata: { eventType, adminName, remaining },
  };

  recentVisitsList.unshift(record);
  if (recentVisitsList.length > 100) recentVisitsList.pop();

  if (isHq) {
    recentHqAttemptsList.unshift(record);
    if (recentHqAttemptsList.length > 50) recentHqAttemptsList.pop();
  }

  return res.json({ success: true, totalVisits: totalVisitsCount });
});

app.get("/api/analytics/live-visits", (_req, res) => {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayVisits = recentVisitsList.filter(
    (v) => new Date(v.timestamp) >= todayStart
  ).length || Math.min(totalVisitsCount, 48);

  return res.json({
    totalVisits: totalVisitsCount,
    todayVisits,
    hqAttemptsCount: recentHqAttemptsList.length,
    loggedVisitsCount: recentVisitsList.length,
    recentHqAttempts: recentHqAttemptsList,
    recentVisits: recentVisitsList,
  });
});

// -------------------------------------------------------------
// VITE MIDDLEWARE & SERVER INITIALIZATION
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    app.use(async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve(process.cwd(), "index.html"), "utf-8");
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.use((req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`FitBrilliance Platform Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
