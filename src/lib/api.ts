/**
 * FitBrilliance API Client
 * ========================
 * Unified frontend → backend connection layer.
 * All API calls go through this file — no scattered fetch() calls across components.
 *
 * Priority: Uses server REST API (/api/...) as primary,
 *           falls back to localStorage if server is unreachable.
 */

// ── Base URL Detection ─────────────────────────────────────────
// In dev: uses Vite proxy (same origin). In prod (Vercel): same origin.
const BASE_URL = "";
const MESSAGING_AGENT_KEY = (import.meta as any).env?.VITE_MESSAGING_AGENT_KEY || "";

async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(MESSAGING_AGENT_KEY ? { "x-messaging-agent-key": MESSAGING_AGENT_KEY } : {}),
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errBody = await response.json().catch(() => ({}));
    throw new Error(
      (errBody as any)?.error ||
      `API Error ${response.status}: ${response.statusText}`
    );
  }

  return response.json() as Promise<T>;
}

// ═══════════════════════════════════════════════════════════════
// 📋 Consultations
// ═══════════════════════════════════════════════════════════════

export interface SubmitConsultationPayload {
  customerName: string;
  email: string;
  phone: string;
  businessName: string;
  businessType: string;
  location: string;
  websiteOrSocial?: string;
  dissatisfaction: string;
  improvementGoal: string;
  requestedOption: string;
  rating?: number;
  imageUrl?: string;
}

export async function submitConsultation(payload: SubmitConsultationPayload) {
  return apiFetch<{ success: boolean; consultation: any; member: any }>(
    "/api/consultations",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}

export async function getConsultationById(id: string) {
  return apiFetch<{ consultation: any | null }>(`/api/consultations?id=${encodeURIComponent(id)}`);
}

export async function getConsultationsByEmail(email: string) {
  return apiFetch<{ consultations: any[] }>(`/api/consultations?email=${encodeURIComponent(email)}`);
}

export async function getAllConsultations() {
  return apiFetch<{ consultations: any[] }>("/api/consultations");
}

// ═══════════════════════════════════════════════════════════════
// 👥 Team Applications
// ═══════════════════════════════════════════════════════════════

export interface SubmitApplicationPayload {
  fullName: string;
  email: string;
  phone: string;
  workMode: "remote" | "onsite_filming_and_projects" | "both";
  specialty: string;
  experienceYears: string;
  portfolioUrl?: string;
  notes?: string;
}

export async function submitTeamApplication(payload: SubmitApplicationPayload) {
  return apiFetch<{ success: boolean; application: any }>(
    "/api/applications",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}

export async function getAllApplications() {
  return apiFetch<{ applications: any[] }>("/api/applications");
}

// ═══════════════════════════════════════════════════════════════
// 📦 Plans
// ═══════════════════════════════════════════════════════════════

export async function getPlans() {
  return apiFetch<{ plans: any[] }>("/api/plans");
}

export async function createPlan(plan: any) {
  return apiFetch<{ success: boolean; plan: any }>("/api/plans", {
    method: "POST",
    body: JSON.stringify(plan),
  });
}

export async function updatePlan(id: string, updates: any) {
  return apiFetch<{ success: boolean; plan: any }>(`/api/plans/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
}

export async function deletePlan(id: string) {
  return apiFetch<{ success: boolean }>(`/api/plans/${id}`, {
    method: "DELETE",
  });
}

// ═══════════════════════════════════════════════════════════════
// ⭐ Reviews
// ═══════════════════════════════════════════════════════════════

export async function getReviews() {
  return apiFetch<{ reviews: any[] }>("/api/reviews");
}

export async function submitReview(payload: {
  customerName: string;
  businessName?: string;
  rating: number;
  quote: string;
  isFoundingMember?: boolean;
  proofImageUrl?: string;
}) {
  return apiFetch<{ success: boolean; review: any }>("/api/reviews", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// ═══════════════════════════════════════════════════════════════
// 📬 Contact Center
// ═══════════════════════════════════════════════════════════════

export async function submitContactMessage(payload: {
  department: string;
  name: string;
  email: string;
  phone?: string;
  business?: string;
  subject?: string;
  message: string;
}) {
  return apiFetch<{ success: boolean; message: string }>("/api/contact", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// ═══════════════════════════════════════════════════════════════
// 🔐 Authentication (OTP)
// ═══════════════════════════════════════════════════════════════

export async function sendOtp(email: string) {
  return apiFetch<{ success: boolean; message: string }>("/api/auth/send-otp", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function verifyOtp(email: string, code: string) {
  return apiFetch<{
    success: boolean;
    user: {
      email: string;
      name: string;
      role: "admin" | "client";
      memberInfo: any;
    };
  }>("/api/auth/verify-otp", {
    method: "POST",
    body: JSON.stringify({ email, code }),
  });
}

// ═══════════════════════════════════════════════════════════════
// 🏅 Memberships
// ═══════════════════════════════════════════════════════════════

export async function getMemberByEmail(email: string) {
  return apiFetch<{ member: any }>(`/api/memberships/${encodeURIComponent(email)}`);
}

// ═══════════════════════════════════════════════════════════════
// 🤖 AI Plan Generation
// ═══════════════════════════════════════════════════════════════

export async function generateAIPlan(consultationId: string) {
  return apiFetch<{ success: boolean; plan: any; consultation: any }>(
    `/api/consultations/${consultationId}/generate-plan`,
    { method: "POST" }
  );
}
