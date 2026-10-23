import { ProtectedProject } from '../types';

/**
 * Normalizes any Canva or Google Drive or presentation link into a clean,
 * white-labeled embed URL suitable for direct iframe rendering without external bars.
 */
export function normalizeEmbedUrl(rawUrl: string): { embedUrl: string; sourceType: 'canva' | 'google_drive' | 'direct' | 'pdf' } {
  const url = (rawUrl || '').trim();
  if (!url) return { embedUrl: '', sourceType: 'direct' };

  // 1. Canva URLs
  // Handles:
  // - https://www.canva.com/design/DAG.../view
  // - https://www.canva.com/design/DAG.../view?utm_content=...
  // - https://www.canva.com/design/DAG.../watch
  // - https://www.canva.com/design/DAG.../view?embed
  if (url.includes('canva.com')) {
    const designMatch = url.match(/\/design\/([a-zA-Z0-9_-]+)/);
    if (designMatch) {
      const designId = designMatch[1];
      // Check if there is an access token / slug after designId: e.g. /design/DAG.../slug/view
      const slugMatch = url.match(/\/design\/[a-zA-Z0-9_-]+\/([a-zA-Z0-9_-]+)\/(?:view|watch|edit)/);
      if (slugMatch) {
        return {
          embedUrl: `https://www.canva.com/design/${designId}/${slugMatch[1]}/view?embed`,
          sourceType: 'canva',
        };
      }
      return {
        embedUrl: `https://www.canva.com/design/${designId}/view?embed`,
        sourceType: 'canva',
      };
    }
    // Fallback for canva: if it doesn't already have ?embed, add it
    if (!url.includes('?embed') && !url.includes('&embed')) {
      const sep = url.includes('?') ? '&' : '?';
      return { embedUrl: `${url}${sep}embed`, sourceType: 'canva' };
    }
    return { embedUrl: url, sourceType: 'canva' };
  }

  // 2. Google Drive File Preview
  // Handles:
  // - https://drive.google.com/file/d/FILE_ID/view?usp=sharing
  // - https://drive.google.com/open?id=FILE_ID
  if (url.includes('drive.google.com')) {
    const fileIdMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileIdMatch) {
      return {
        embedUrl: `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`,
        sourceType: 'google_drive',
      };
    }
    const openIdMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (openIdMatch) {
      return {
        embedUrl: `https://drive.google.com/file/d/${openIdMatch[1]}/preview`,
        sourceType: 'google_drive',
      };
    }
  }

  // 3. Google Slides
  if (url.includes('docs.google.com/presentation')) {
    const slideIdMatch = url.match(/\/presentation\/d\/([a-zA-Z0-9_-]+)/);
    if (slideIdMatch) {
      return {
        embedUrl: `https://docs.google.com/presentation/d/${slideIdMatch[1]}/embed?start=false&loop=false&delayms=3000`,
        sourceType: 'google_drive',
      };
    }
  }

  // 4. Google Docs
  if (url.includes('docs.google.com/document')) {
    const docIdMatch = url.match(/\/document\/d\/([a-zA-Z0-9_-]+)/);
    if (docIdMatch) {
      return {
        embedUrl: `https://docs.google.com/document/d/${docIdMatch[1]}/preview`,
        sourceType: 'google_drive',
      };
    }
  }

  // 5. Google Sheets
  if (url.includes('docs.google.com/spreadsheets')) {
    const sheetIdMatch = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
    if (sheetIdMatch) {
      return {
        embedUrl: `https://docs.google.com/spreadsheets/d/${sheetIdMatch[1]}/htmlembed`,
        sourceType: 'google_drive',
      };
    }
  }

  // 6. Direct PDF or other embeddable URL
  const isPdf = url.toLowerCase().endsWith('.pdf');
  return {
    embedUrl: url,
    sourceType: isPdf ? 'pdf' : 'direct',
  };
}

const STORAGE_KEY = 'fitbrilliance_projects';

export const INITIAL_PROJECTS: ProtectedProject[] = [
  {
    projectCode: "PRJ-CANVA-SHOWCASE",
    clientName: "مؤسسة الريادة الدولية",
    companyName: "شركة الريادة الدولية للخدمات والتدريب",
    teamAssigned: "FitBrilliance Team",
    status: "active",
    planName: "عرض التحول الاستراتيجي والهوية المؤسسية (عرض حي)",
    duration: "90 يوماً",
    confidentialDetails: "عرض تفاعلي مباشر وشامل لكافة أصول المشروع، خطط التسويق، مراحل التنفيذ الأسبوعية، وتحليلات النمو والتحول.",
    executionSteps: [
      "الأسبوع 1-2: إطلاق الهوية المؤسسية والعرض التسويقي المعتمد",
      "الأسبوع 3-5: تدشين خطوط التواصل وتوليد العملاء المحتملين",
      "الأسبوع 6-8: تحسين معدلات التحويل وبناء خط المبيعات التكراري",
      "الأسبوع 9-12: أتمتة المنظومة واستقرار التدفق المالي الربحي",
    ],
    watermarkText: "مؤسسة الريادة الدولية • PRJ-CANVA-SHOWCASE",
    embedUrl: "https://www.canva.com/design/DAGQ7e-V8gE/view?embed",
    sourceType: "canva",
    clientEmail: "ceo@reyada-intl.com",
    clientPhone: "01274534493",
    createdAt: "2026-03-01",
    updatedAt: "2026-04-10",
  },
  {
    projectCode: "PRJ-LOGISTICS",
    clientName: "أ. حسام البنا",
    companyName: "مؤسسة الشحن والتجارة الدولية (مصر ⇄ الصين واليونان)",
    teamAssigned: "FitBrilliance Team",
    status: "completed",
    planName: "خطة التوسع اللوجستي وسلاسل الإمداد (90 يوماً)",
    duration: "90 يوماً ميدانياً",
    confidentialDetails:
      "التحول من الشحن الشخصي المحدود إلى تأسيس خطوط الشحن بالحاويات الكاملة (Containers)، ضبط الدورة المستندية الجمركية، ومضاعفة الأرباح التشغيلية بنسبة 280%.",
    executionSteps: [
      "الأسبوع 1-3: تدقيق مسار الشحن الشخصي وفصل تكاليف النولون والجمارك",
      "الأسبوع 4-7: توقيع بروتوكولات الشحن البحري والجوي المنتظم (كونتينرات)",
      "الأسبوع 8-10: إطلاق منصة الحجز والتتبع الآلي لطلبات الشحن والتجار",
      "الأسبوع 11-12: تثبيت الهيكل التكراري وتوسيع خط الصين واليونان",
    ],
    watermarkText: "أ. حسام البنا • PRJ-LOGISTICS",
    embedUrl: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/preview",
    sourceType: "google_drive",
    clientEmail: "hossam@logistics-trade.com",
    clientPhone: "01274534493",
    createdAt: "2026-01-15",
    updatedAt: "2026-04-01",
  },
  {
    projectCode: "PRJ-FITNESS",
    clientName: "كابتن رامي العوضي",
    companyName: "مجمع اللياقة البدنية والتدريب الرياضي (Gym Hub)",
    teamAssigned: "FitBrilliance Team",
    status: "active",
    planName: "خطة التحول الرياضي وتدفق الاشتراكات (90 يوماً)",
    duration: "90 يوماً",
    confidentialDetails:
      "إعادة هيكلة أسعار الباقات والاشتراكات السنوية، ضبط قمع المبيعات للمدربين، وتحقيق معدل تجديد اشتراكات بنسبة 85% مع وقف نزيف الإعلانات العشوائية.",
    executionSteps: [
      "الأسبوع 1-2: إعادة تسعير الباقات وتفعيل برنامج الولاء الرياضي",
      "الأسبوع 3-6: إطلاق حملات الاستحواذ الجغرافي المركزة للمنطقة المحيطة",
      "الأسبوع 7-10: تدريب فريق المبيعات والاستقبال على الإغلاق السريع",
      "الأسبوع 11-12: تحقيق الاستقرار المالي وضمان التدفق النقدي الشهري",
    ],
    watermarkText: "كابتن رامي العوضي • PRJ-FITNESS",
    sourceType: "canva",
    clientEmail: "rami@gymhub.com",
    clientPhone: "01274879442",
    createdAt: "2026-02-10",
    updatedAt: "2026-04-12",
  },
  {
    projectCode: "PRJ-KSA-ENG",
    clientName: "م. عبد العزيز الشمري",
    companyName: "مكتب الاستشارات الهندسية وإدارة المشاريع (الرياض - السعودية)",
    teamAssigned: "Balanced Brilliance Team",
    status: "active",
    planName: "خطة هندسة العروض والشراكات المؤسسية بالسوق السعودي",
    duration: "90 يوماً",
    confidentialDetails:
      "إعادة صياغة الملف التعريفي والبروفايل الهندسي، استهداف عقود الإشراف والمقاولات الكبرى، وبناء استراتيجية تفاوض احترافية مع كبرى الشركات.",
    executionSteps: [
      "إعادة هيكلة محفظة المشاريع والسابقة الهندسية",
      "بناء استراتيجية التقديم على المناقصات والمشاريع الكبرى",
      "جلسات التوجيه والتسعير الاستراتيجي المباشر مع كوتش سراج",
    ],
    watermarkText: "م. عبد العزيز الشمري • PRJ-KSA-ENG",
    sourceType: "google_drive",
    clientEmail: "abdulaziz@shammary-eng.sa",
    clientPhone: "01274879442",
    createdAt: "2026-02-20",
    updatedAt: "2026-04-05",
  },
];

export function getStoredProjects(): ProtectedProject[] {
  if (typeof window === 'undefined') return INITIAL_PROJECTS;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PROJECTS));
      return INITIAL_PROJECTS;
    }
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_PROJECTS;
  } catch {
    return INITIAL_PROJECTS;
  }
}

export function saveStoredProjects(projects: ProtectedProject[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    window.dispatchEvent(new CustomEvent('fitbrilliance_projects_updated', { detail: projects }));
  } catch (e) {
    console.error('Failed to save projects to localStorage', e);
  }
}

export const saveProjects = saveStoredProjects;

export function findProjectByCode(code: string): ProtectedProject | null {
  const clean = (code || '').trim().toUpperCase();
  if (!clean) return null;
  const list = getStoredProjects();
  return list.find((p) => p.projectCode.trim().toUpperCase() === clean) || null;
}
