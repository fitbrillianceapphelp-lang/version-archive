export type Language = 'ar' | 'en';

export type ConsultationOption = 
  | 'improvement_plan' 
  | 'activity_analysis' 
  | 'event_filming' 
  | 'academic_research';

export type ConsultationStatus = 'new' | 'analyzing' | 'response_drafted' | 'sent' | 'closed';

export interface ConsultationResponseData {
  problems?: string[];
  improvementMethods?: string[];
  priorities?: string[];
  estimatedCostRange?: string;
  currentSituation?: string;
  strengths?: string[];
  weaknesses?: string[];
  opportunities?: string[];
  threats?: string[];
  recommendations?: string[];
  fullAnalysisCost?: string;
  notes?: string;
  updatedAt?: string;
}

export interface ConsultationRequest {
  id: string; // e.g. "FB-1042"
  customerName: string;
  email: string;
  phone: string;
  businessName: string;
  businessType: string;
  location: string;
  websiteOrSocial?: string;
  rating: number; // 1-5
  dissatisfaction: string;
  improvementGoal: string;
  imageUrl?: string;
  requestedOption: ConsultationOption;
  status: ConsultationStatus;
  createdAt: string;
  membershipCode?: string;
  response?: ConsultationResponseData;
}

export interface TeamApplication {
  id: string; // e.g. "TEAM-101"
  fullName: string;
  email: string;
  phone: string;
  workMode: 'remote' | 'onsite_filming_and_projects' | 'both';
  specialty: string;
  experienceYears: string;
  portfolioUrl?: string;
  notes?: string;
  createdAt: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'contacted';
}

export interface VideoAd {
  id: string;
  title: string;
  youtubeEmbedUrl: string;
  active: boolean;
}

export interface FoundingMember {
  id: string;
  memberCode: string; // e.g., "FB-FM-001042"
  customerName: string;
  email: string;
  phone: string;
  businessName: string;
  promoCode: string;
  discountPercent: number;
  monthlyConsultationsAvailable: number;
  status: 'active' | 'vip' | 'inactive' | 'pending';
  createdAt: string;
  profileType?: 'client' | 'team_applicant';
}

export interface PromoCode {
  id: string;
  code: string;
  discountPercent: number;
  description: string;
  active: boolean;
  usesCount: number;
}

export interface PlanMonthlyBreakdown {
  monthNumber: number; // 1, 2, 3
  title: string;
  steps: string[];
  adsBudget: string;
  operatingExpenses: string;
  kpiGoal: string;
}

export interface PlanItem {
  id: string;
  title: string;
  subtitle: string;
  startingPrice: string;
  numericPrice: number;
  durationDays: number;
  features: string[];
  category: 'transformation' | 'growth' | 'analysis' | 'event_production' | 'academic_research' | 'custom';
  active: boolean;
  team?: 'fitbrilliance' | 'balancedbrilliance';
  whatsappContactName?: string;
  whatsappNumber?: string;
  monthlyBreakdown?: PlanMonthlyBreakdown[];
  weeklyExecutionSteps?: string[];
  dailyOperationalTasks?: string[];
}

export interface ContactMessage {
  id: string;
  department: 'new_projects' | 'offers' | 'projects' | 'complaints' | 'events_production' | 'academic_research';
  departmentLabel: string;
  emailChannel: string;
  name: string;
  email: string;
  phone: string;
  business: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  createdAt: string;
}

export interface ClientReview {
  id: string;
  customerName: string;
  businessName: string;
  rating: number;
  quote: string;
  isFoundingMember: boolean;
  membershipCode?: string;
  proofImageUrl?: string;
  approved: boolean;
  createdAt: string;
}

export interface UserAccount {
  email: string;
  name?: string;
  role: 'admin' | 'client';
  memberInfo?: FoundingMember;
  preferredTimeSlot?: string;
  whatsapp?: string;
}

export interface ProtectedProject {
  projectCode: string;
  clientName: string;
  companyName: string;
  teamAssigned: 'FitBrilliance Team' | 'Balanced Brilliance Team';
  status: 'active' | 'completed' | 'in_review';
  planName: string;
  duration: string;
  confidentialDetails: string;
  executionSteps: string[];
  watermarkText: string;
  embedUrl?: string; // Canva or Google Drive or direct interactive presentation link
  sourceType?: 'canva' | 'google_drive' | 'direct' | 'pdf'; // Auto-detected or specified
  clientEmail?: string;
  clientPhone?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpcomingModule {
  id: string;
  title: string;
  subtitle: string;
  progressPercent: number;
  timerFormatted: string; // e.g. "48:00:00"
  isRunning: boolean;
  active: boolean;
  statusText: string;
}
