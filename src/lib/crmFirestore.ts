import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs,
  serverTimestamp
} from "firebase/firestore";
import { firestore } from "./firebase";
import { ConsultationRequest } from "../types";

export type CrmFunnelStage = 
  | "Lead" 
  | "Discovery" 
  | "Proposal" 
  | "In-Production" 
  | "Completed";

export interface CrmLead {
  id: string;
  customerName: string;
  phone: string;
  email?: string;
  businessName: string;
  serviceType: string;
  stage: CrmFunnelStage;
  budget?: string;
  budgetValue?: number;
  roasGoal?: string;
  notes?: string;
  createdAt: string;
  lastUpdated?: string;
  source?: "firestore" | "local" | "api";
  membershipCode?: string;
  diagnosticScore?: number;
}

export const CRM_STAGES: { 
  id: CrmFunnelStage; 
  title: string; 
  subtitle: string; 
  color: string; 
  badgeBg: string; 
}[] = [
  {
    id: "Lead",
    title: "Lead",
    subtitle: "عملاء واستشارات واردة جديدة",
    color: "#ef4444",
    badgeBg: "bg-red-500/10 text-red-400 border-red-500/30",
  },
  {
    id: "Discovery",
    title: "Discovery",
    subtitle: "فحص عمق الهدر والتحديات التشغيلية",
    color: "#f59e0b",
    badgeBg: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  },
  {
    id: "Proposal",
    title: "Proposal",
    subtitle: "صياغة خطة الـ 90 يوماً ومسودة العقد",
    color: "#3b82f6",
    badgeBg: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  },
  {
    id: "In-Production",
    title: "In-Production",
    subtitle: "تنفيذ المنظومة الإعلانية والإنتاج 4K",
    color: "#10b981",
    badgeBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  },
  {
    id: "Completed",
    title: "Completed",
    subtitle: "تحقيق المستهدف وشراكة نمو مستدامة",
    color: "#06b6d4",
    badgeBg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
  },
];

/**
 * Normalizes any legacy string stage to one of the 5 canonical stages
 */
export function normalizeStage(rawStage?: string): CrmFunnelStage {
  if (!rawStage) return "Lead";
  const s = rawStage.toLowerCase().trim();
  if (s === "lead" || s === "new" || s === "جديد") return "Lead";
  if (s === "discovery" || s === "contacted" || s === "analyzing" || s === "تم التواصل") return "Discovery";
  if (s === "proposal" || s === "plan_drafted" || s === "contracting" || s === "sent" || s === "response_drafted") return "Proposal";
  if (s === "in-production" || s === "in_production" || s === "active" || s === "production" || s === "قيد التنفيذ") return "In-Production";
  if (s === "completed" || s === "closed" || s === "مكتمل") return "Completed";
  return "Lead";
}

// Seed initial realistic leads if Firestore collection is empty
export const INITIAL_LEADS: CrmLead[] = [
  {
    id: "FB-CRM-101",
    customerName: "المهندس كريم عبدالفتاح",
    phone: "+201098765432",
    email: "karim.media@business.com",
    businessName: "مجموعة فالكون للإنتاج والتوزيع",
    serviceType: "تطوير وتشغيل منظومة الـ 90 يوماً",
    stage: "In-Production",
    budget: "45,000 $",
    budgetValue: 45000,
    roasGoal: "4.8x",
    notes: "تم عزل الهدر الإعلاني الأسبوع الماضي، والـ ROAS الحالي وصل 4.2x. يتم إعداد جلسة التوثيق السينمائي 4K.",
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    membershipCode: "FB-90D-1040",
    diagnosticScore: 92,
  },
  {
    id: "FB-CRM-102",
    customerName: "عبدالرحمن الشهري",
    phone: "+966501234567",
    email: "alshahri@saudienterprise.sa",
    businessName: "سلسلة مطاعم وشرفات القمة",
    serviceType: "تشخيص استراتيجي وتحول رقمي",
    stage: "Proposal",
    budget: "35,000 $",
    budgetValue: 35000,
    roasGoal: "5.5x",
    notes: "تمت مراجعة مسودة العقد، بانتظار تحويل الدفعة الأولى لبدء ورشة الـ SOPs الميدانية.",
    createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
    diagnosticScore: 84,
  },
  {
    id: "FB-CRM-103",
    customerName: "د. إبراهيم الدسوقي",
    phone: "+201234567890",
    email: "eldesouky.clinic@gmail.com",
    businessName: "مجمع النخبة لجراحة الأسنان",
    serviceType: "هندسة الاستحواذ المباشر وتقليل تكلفة العميل",
    stage: "Proposal",
    budget: "20,000 $",
    budgetValue: 20000,
    roasGoal: "6.0x",
    notes: "الخطة المقترحة تركز على إعلانات الفيديو التثقيفية وبناء قمع تحويل فوري للحجوزات العاجلة.",
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    diagnosticScore: 78,
  },
  {
    id: "FB-CRM-104",
    customerName: "سارة المنصوري",
    phone: "+971509988776",
    email: "sara@almansoori-retail.ae",
    businessName: "براند أزياء وحقائب فاخرة (Luxury Retail)",
    serviceType: "إنتاج سينمائي 4K للفعاليات وإعادة هندسة المحتوى",
    stage: "Discovery",
    budget: "18,000 $",
    budgetValue: 18000,
    roasGoal: "4.0x",
    notes: "تم التواصل عبر الواتساب، طلبت استعراض أعمال Pioneers Media Hub الخاصة بالأزياء قبل توقيع العقد.",
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    diagnosticScore: 88,
  },
  {
    id: "FB-CRM-105",
    customerName: "فيصل بن عياف",
    phone: "+966555443322",
    email: "faisal@techsa.io",
    businessName: "منصة تدريب واشتراكات تعليمية B2B",
    serviceType: "تطوير وتشغيل منظومة الـ 90 يوماً",
    stage: "Lead",
    budget: "28,000 $",
    budgetValue: 28000,
    roasGoal: "5.0x",
    notes: "طلب استشارة تشخيصية طارئة بعد انخفاض عائد الحملات الإعلانية في الربع الأخير بنسبة 40%.",
    createdAt: new Date().toISOString(),
    diagnosticScore: 65,
  },
  {
    id: "FB-CRM-106",
    customerName: "م. طارق العوضي",
    phone: "+201112233445",
    email: "tariq@awadi-furn.com",
    businessName: "مصانع العوضي للأثاث الفندقي والمكتبي",
    serviceType: "تطوير وتشغيل منظومة الـ 90 يوماً",
    stage: "Completed",
    budget: "55,000 $",
    budgetValue: 55000,
    roasGoal: "6.2x",
    notes: "اكتملت مرحلة الـ 90 يوماً بنجاح باهر مع تحقيق مبيعات تعاقدية تخطت 800 ألف دولار. تم التجديد كشريك نمو مستدام.",
    createdAt: new Date(Date.now() - 95 * 86400000).toISOString(),
    membershipCode: "FB-PRJ-2026-AWADI",
    diagnosticScore: 96,
  },
];

const LOCAL_STORAGE_KEY = "fb_crm_leads_cache_v2";

export function getCachedLeads(): CrmLead[] {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((item) => ({
          ...item,
          stage: normalizeStage(item.stage),
        }));
      }
    }
  } catch (e) {
    console.error("Failed to read cached CRM leads:", e);
  }
  return INITIAL_LEADS;
}

export function saveCachedLeads(leads: CrmLead[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(leads));
  } catch (e) {
    console.error("Failed to save CRM leads cache:", e);
  }
}

/**
 * Subscribe to Firestore 'consultations' collection with live real-time sync.
 * Directly links cards to Firestore updates.
 */
export function subscribeToCrmLeads(
  onData: (leads: CrmLead[], isLive: boolean) => void
): () => void {
  let isSubscribed = true;
  const initialCache = getCachedLeads();
  onData(initialCache, false);

  try {
    const colRef = collection(firestore, "consultations");
    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        if (!isSubscribed) return;

        if (snapshot.empty) {
          // If Firestore collection is empty, seed it with initial leads
          seedInitialLeadsIfEmpty().catch(console.error);
          onData(initialCache, true);
          return;
        }

        const firestoreLeads: CrmLead[] = snapshot.docs.map((d) => {
          const data = d.data();
          const mappedStage = normalizeStage(data.stage || data.status);

          let budgetVal = 20000;
          if (data.budget) {
            const num = parseInt(String(data.budget).replace(/[^0-9]/g, ""), 10);
            if (!isNaN(num) && num > 0) budgetVal = num;
          }

          return {
            id: d.id,
            customerName: data.customerName || data.name || "عميل استراتيجي",
            phone: data.phone || "",
            email: data.email || "",
            businessName: data.businessName || data.service || "نشاط تجاري",
            serviceType: data.serviceType || data.service || "تطوير وتشغيل منظومة الـ 90 يوماً",
            stage: mappedStage,
            budget: data.budget || `$${budgetVal.toLocaleString()}`,
            budgetValue: budgetVal,
            roasGoal: data.roasGoal || "4.5x",
            notes: data.notes || data.dissatisfaction || "",
            createdAt: data.createdAt || new Date().toISOString(),
            lastUpdated: data.updatedAt || new Date().toISOString(),
            source: "firestore",
            membershipCode: data.membershipCode || undefined,
            diagnosticScore: data.diagnosticScore || 80,
          };
        });

        saveCachedLeads(firestoreLeads);
        onData(firestoreLeads, true);
      },
      (err) => {
        console.warn("Firestore live subscription fallback to API/Cache:", err);
        fetchFromBackendApi()
          .then((apiLeads) => {
            if (isSubscribed && apiLeads.length > 0) {
              saveCachedLeads(apiLeads);
              onData(apiLeads, false);
            }
          })
          .catch(() => {
            if (isSubscribed) onData(initialCache, false);
          });
      }
    );

    return () => {
      isSubscribed = false;
      unsubscribe();
    };
  } catch (err) {
    console.error("Firestore setup error:", err);
    return () => {
      isSubscribed = false;
    };
  }
}

async function fetchFromBackendApi(): Promise<CrmLead[]> {
  try {
    const res = await fetch("/api/consultations");
    if (!res.ok) return [];
    const data = await res.json();
    if (Array.isArray(data.consultations)) {
      return data.consultations.map((c: ConsultationRequest) => ({
        id: c.id,
        customerName: c.customerName,
        phone: c.phone,
        email: c.email,
        businessName: c.businessName,
        serviceType: c.requestedOption === "improvement_plan" 
          ? "تطوير وتشغيل منظومة الـ 90 يوماً" 
          : c.requestedOption === "event_filming"
          ? "إنتاج سينمائي 4K وتوثيق ميداني"
          : "تشخيص استراتيجي وتحول رقمي",
        stage: normalizeStage(c.status),
        budget: "$25,000",
        budgetValue: 25000,
        roasGoal: "4.5x",
        notes: c.dissatisfaction || c.improvementGoal || "",
        createdAt: c.createdAt,
        membershipCode: c.membershipCode,
      }));
    }
  } catch (e) {
    console.error("fetchFromBackendApi error:", e);
  }
  return [];
}

async function seedInitialLeadsIfEmpty(): Promise<void> {
  try {
    const snap = await getDocs(collection(firestore, "consultations"));
    if (snap.empty) {
      for (const lead of INITIAL_LEADS) {
        await setDoc(doc(firestore, "consultations", lead.id), {
          ...lead,
          status: lead.stage,
          seededAt: serverTimestamp(),
        });
      }
    }
  } catch (e) {
    console.warn("Unable to seed initial Firestore leads (non-fatal):", e);
  }
}

/**
 * Update stage of a CRM Lead directly in Firestore and Local Cache
 */
export async function updateLeadStage(leadId: string, newStage: CrmFunnelStage): Promise<boolean> {
  try {
    const docRef = doc(firestore, "consultations", leadId);
    await updateDoc(docRef, {
      stage: newStage,
      status: newStage,
      updatedAt: new Date().toISOString(),
    });
  } catch (e) {
    console.warn("Firestore updateDoc error (will use optimistic local update):", e);
  }

  // Always apply optimistic local update so UI responds instantly
  const current = getCachedLeads();
  const updated = current.map((item) =>
    item.id === leadId ? { ...item, stage: newStage, lastUpdated: new Date().toISOString() } : item
  );
  saveCachedLeads(updated);
  return true;
}

/**
 * Add a new CRM Lead to Firestore
 */
export async function createCrmLead(lead: Omit<CrmLead, "id" | "createdAt">): Promise<CrmLead> {
  const newId = `FB-CRM-${Date.now().toString().slice(-4)}`;
  const fullLead: CrmLead = {
    ...lead,
    id: newId,
    createdAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    source: "firestore",
  };

  try {
    await setDoc(doc(firestore, "consultations", newId), {
      ...fullLead,
      status: fullLead.stage,
      serverCreatedAt: serverTimestamp(),
    });
  } catch (e) {
    console.warn("Firestore write error, saving to local cache:", e);
  }

  const cached = getCachedLeads();
  saveCachedLeads([fullLead, ...cached]);

  return fullLead;
}

/**
 * Delete a lead from Firestore
 */
export async function removeCrmLead(leadId: string): Promise<boolean> {
  try {
    await deleteDoc(doc(firestore, "consultations", leadId));
  } catch (e) {
    console.warn("Firestore deleteDoc error:", e);
  }

  const cached = getCachedLeads();
  saveCachedLeads(cached.filter((l) => l.id !== leadId));
  return true;
}
