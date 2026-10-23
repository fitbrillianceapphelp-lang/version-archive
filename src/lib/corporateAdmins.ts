import { doc, getDocs, setDoc, deleteDoc, collection } from "firebase/firestore";
import { firestore } from "./firebase";

export interface CorporateAdmin {
  id: string;
  name: string;
  corporateEmail: string;
  phoneOrChannel: string;
  pin: string;
  role: "super_admin" | "operations_lead" | "strategy_consultant" | "department_manager";
  status: "active" | "pending_authorization";
  departmentName?: string;
  addedAt: string;
}

const LOCAL_ADMINS_KEY = "fb_corporate_admins_vault";

// Master Sovereign Lead: Coach Serag (Executive Leadership)
export const DEFAULT_SUPER_ADMIN: CorporateAdmin = {
  id: "admin-master-serag",
  name: "كوتش مصطفى سراج (القيادة والسيادة التنفيذية)",
  corporateEmail: "serag@fitbrilliance.store",
  phoneOrChannel: "+201274879442 (خط القيادة المباشر)",
  pin: "0020303",
  role: "super_admin",
  status: "active",
  departmentName: "مكتب القيادة العامة والاستراتيجية",
  addedAt: "2011-04-22T00:00:00.000Z",
};

// The 11 Departmental / Communication Channels of FitBrilliance
// Kept present in the ecosystem, but LOCKED (غير مفعلة) until Coach Serag appoints and authorizes managers.
export const THE_11_DEPARTMENT_CHANNELS: CorporateAdmin[] = [
  {
    id: "chan-core",
    name: "قسم العمليات الاستراتيجية الكبرى (Core Strategic Operations)",
    corporateEmail: "core@fitbrilliance.store",
    phoneOrChannel: "+201274879442",
    pin: "",
    role: "operations_lead",
    status: "pending_authorization",
    departmentName: "العمليات المركزية",
    addedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "chan-pioneers",
    name: "إدارة الإنتاج السينمائي 4K وتصوير الإيفنتات (Pioneers Media)",
    corporateEmail: "pioneers@fitbrilliance.store",
    phoneOrChannel: "+201274534493",
    pin: "",
    role: "operations_lead",
    status: "pending_authorization",
    departmentName: "الإنتاج البصري 4K",
    addedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "chan-balanced",
    name: "منظومة الاستشارات الأكاديمية والدراسات العليا (Balanced Brilliance)",
    corporateEmail: "balanced@fitbrilliance.store",
    phoneOrChannel: "+201274879442",
    pin: "",
    role: "strategy_consultant",
    status: "pending_authorization",
    departmentName: "البحث العلمي والتوازن",
    addedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "chan-creative",
    name: "إدارة الإخراج الإبداعي وما بعد الإنتاج (Creative Directorate)",
    corporateEmail: "creative@fitbrilliance.store",
    phoneOrChannel: "+201274534493",
    pin: "",
    role: "operations_lead",
    status: "pending_authorization",
    departmentName: "الإخراج الإبداعي",
    addedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "chan-new",
    name: "استقبال المشاريع الجديدة وتدقيق التعاقدات (New Client Onboarding)",
    corporateEmail: "new@fitbrilliance.store",
    phoneOrChannel: "+201274534493",
    pin: "",
    role: "department_manager",
    status: "pending_authorization",
    departmentName: "المشاريع الجديدة",
    addedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "chan-offers",
    name: "إدارة عروض الأسعار والتسعير الاستراتيجي (Strategic Proposals)",
    corporateEmail: "offers@fitbrilliance.store",
    phoneOrChannel: "+201274534493",
    pin: "",
    role: "strategy_consultant",
    status: "pending_authorization",
    departmentName: "التسعير والعروض",
    addedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "chan-projects",
    name: "متابعة تسليم الخطط ونمذجة الـ 90 يوماً (Plans Delivery)",
    corporateEmail: "projects@fitbrilliance.store",
    phoneOrChannel: "+201274879442",
    pin: "",
    role: "operations_lead",
    status: "pending_authorization",
    departmentName: "تسليم الخطط الميدانية",
    addedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "chan-complaints",
    name: "قسم الشكاوى الفورية وتصحيح المسارات (Rapid Resolution)",
    corporateEmail: "complaints@fitbrilliance.store",
    phoneOrChannel: "+201274879442",
    pin: "",
    role: "department_manager",
    status: "pending_authorization",
    departmentName: "الشكاوى وضمان الجودة",
    addedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "chan-ethics",
    name: "لجنة الأخلاق المهنية وتدقيق الشركاء (Ethics & Squad Vetting)",
    corporateEmail: "ethics@fitbrilliance.store",
    phoneOrChannel: "+201274879442",
    pin: "",
    role: "strategy_consultant",
    status: "pending_authorization",
    departmentName: "لجنة النزاهة والأمانة",
    addedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "chan-support",
    name: "مركز خدمة ودعم العملاء المستمر (Customer Support)",
    corporateEmail: "support@fitbrilliance.store",
    phoneOrChannel: "+201274879442",
    pin: "",
    role: "department_manager",
    status: "pending_authorization",
    departmentName: "الدعم الفني والخدمات",
    addedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "chan-legal",
    name: "الشؤون القانونية وحماية الملكية الفكرية (DIMC Legal Protection)",
    corporateEmail: "legal@fitbrilliance.store",
    phoneOrChannel: "+201274879442",
    pin: "",
    role: "strategy_consultant",
    status: "pending_authorization",
    departmentName: "الشؤون القانونية وDIMC",
    addedAt: "2024-01-01T00:00:00.000Z",
  },
];

export const ALL_12_CHANNELS: CorporateAdmin[] = [
  DEFAULT_SUPER_ADMIN,
  ...THE_11_DEPARTMENT_CHANNELS,
];

export function getAuthorizedAdmins(): CorporateAdmin[] {
  try {
    const raw = localStorage.getItem(LOCAL_ADMINS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Failed to read corporate admins from storage:", e);
  }
  // Initialize with Super Admin + 11 Department Channels (Pending Authorization)
  const initial = [DEFAULT_SUPER_ADMIN, ...THE_11_DEPARTMENT_CHANNELS];
  saveAuthorizedAdmins(initial);
  return initial;
}

export function saveAuthorizedAdmins(admins: CorporateAdmin[]): void {
  try {
    localStorage.setItem(LOCAL_ADMINS_KEY, JSON.stringify(admins));
  } catch (e) {
    console.error("Failed to save corporate admins:", e);
  }
}

/**
 * Toggle authorization of a department channel (Only by Coach Serag)
 */
export function toggleChannelActivation(
  channelId: string,
  managerName?: string,
  newPin?: string
): CorporateAdmin[] {
  const current = getAuthorizedAdmins();
  const updated = current.map((admin) => {
    if (admin.id === channelId) {
      const nextStatus =
        admin.status === "active" ? "pending_authorization" : "active";
      return {
        ...admin,
        status: nextStatus as CorporateAdmin["status"],
        name: managerName ? managerName.trim() : admin.name,
        pin: newPin ? newPin.trim() : admin.pin,
      };
    }
    return admin;
  });

  saveAuthorizedAdmins(updated);
  return updated;
}

export async function addCorporateAdmin(
  admin: Omit<CorporateAdmin, "id" | "addedAt" | "status"> & { status?: CorporateAdmin["status"] }
): Promise<CorporateAdmin> {
  const newId = `admin-${Date.now().toString().slice(-4)}`;
  const record: CorporateAdmin = {
    ...admin,
    status: admin.status || "active",
    id: newId,
    addedAt: new Date().toISOString(),
  };

  try {
    await setDoc(doc(firestore, "sovereign_admins", newId), record);
  } catch (e) {
    console.warn("Firestore sovereign_admins write error:", e);
  }

  const existing = getAuthorizedAdmins();
  const updated = [record, ...existing.filter((a) => a.id !== newId)];
  saveAuthorizedAdmins(updated);
  return record;
}

export async function removeCorporateAdmin(adminId: string): Promise<boolean> {
  if (adminId === "admin-master-serag") return false; // Prevent removing master admin

  try {
    await deleteDoc(doc(firestore, "sovereign_admins", adminId));
  } catch (e) {
    console.warn("Firestore sovereign_admins delete error:", e);
  }

  const existing = getAuthorizedAdmins();
  const updated = existing.filter((a) => a.id !== adminId);
  saveAuthorizedAdmins(updated);
  return true;
}
