import { useEffect } from "react";
import { supabase } from "./supabase";

export interface AnalyticsEvent {
  eventType: "page_view" | "section_view" | "scroll_depth" | "click";
  sectionId?: string;
  depthPercent?: number;
  metadata?: Record<string, any>;
  timestamp: string;
}

export function useAnalyticsTracker() {
  useEffect(() => {
    trackEvent({
      eventType: "page_view",
      timestamp: new Date().toISOString(),
    });

    let maxScroll = 0;
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const percent = Math.min(100, Math.round((scrollTop / docHeight) * 100));
        if (percent > maxScroll + 25) {
          maxScroll = Math.floor(percent / 25) * 25;
          trackEvent({
            eventType: "scroll_depth",
            depthPercent: maxScroll,
            timestamp: new Date().toISOString(),
          });
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
}

export async function trackEvent(event: AnalyticsEvent) {
  try {
    const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL;
    if (!supabaseUrl || supabaseUrl.includes("your-project") || supabaseUrl.includes("placeholder")) {
      return; // Skip analytics insertion if Supabase URL is not configured
    }
    await supabase.from("analytics_events").insert([
      {
        event_type: event.eventType,
        section_id: event.sectionId || null,
        depth_percent: event.depthPercent || null,
        metadata: event.metadata || {},
        created_at: event.timestamp,
      },
    ]);
  } catch (_) {}
}

// =========================================================================
// MOCK DATA SERVICE FOR PROJECT GROWTH & VISITOR ENGAGEMENT METRICS
// =========================================================================

export type KanbanFunnelStage = "Lead" | "Discovery" | "Proposal" | "In-Production" | "Completed";

export interface MonthlyGrowthMetric {
  month: string;
  projects: number;
  targetProjects: number;
  revenue: number;
  userEngagement: number; // engagement index (0 - 100)
  activeVisitors: number;
}

export interface FunnelStageMetric {
  stage: KanbanFunnelStage;
  label: string;
  count: number;
  value: number;
  conversionRate: number;
  fill: string;
}

export interface UserEngagementSummary {
  dailyActiveUsers: number;
  avgSessionDuration: string;
  diagnosticCompletionRate: number;
  roiCalculatorInteractions: number;
  returnVisitorRate: number;
  peakEngagementHour: string;
}

/**
 * Monthly Project Growth & User Engagement Historical Mock Data
 */
export const MOCK_MONTHLY_GROWTH_DATA: MonthlyGrowthMetric[] = [
  { month: "يناير", projects: 2, targetProjects: 2, revenue: 14000, userEngagement: 42, activeVisitors: 620 },
  { month: "فبراير", projects: 4, targetProjects: 3, revenue: 26000, userEngagement: 55, activeVisitors: 890 },
  { month: "مارس", projects: 7, targetProjects: 5, revenue: 48000, userEngagement: 68, activeVisitors: 1240 },
  { month: "أبريل", projects: 9, targetProjects: 8, revenue: 64000, userEngagement: 74, activeVisitors: 1580 },
  { month: "مايو", projects: 13, targetProjects: 11, revenue: 92000, userEngagement: 81, activeVisitors: 1950 },
  { month: "يونيو", projects: 16, targetProjects: 14, revenue: 115000, userEngagement: 85, activeVisitors: 2300 },
  { month: "يوليو", projects: 19, targetProjects: 17, revenue: 138000, userEngagement: 88, activeVisitors: 2680 },
  { month: "أغسطس", projects: 22, targetProjects: 20, revenue: 162000, userEngagement: 91, activeVisitors: 3100 },
  { month: "سبتمبر", projects: 25, targetProjects: 23, revenue: 185000, userEngagement: 93, activeVisitors: 3450 },
  { month: "أكتوبر", projects: 28, targetProjects: 26, revenue: 210000, userEngagement: 96, activeVisitors: 3900 },
  { month: "نوفمبر (المتوقع)", projects: 32, targetProjects: 29, revenue: 245000, userEngagement: 97, activeVisitors: 4350 },
  { month: "ديسمبر (المتوقع)", projects: 36, targetProjects: 32, revenue: 280000, userEngagement: 99, activeVisitors: 4900 },
];

/**
 * Standard Funnel Breakdown for Consultation Pipeline
 */
export const MOCK_FUNNEL_DATA: FunnelStageMetric[] = [
  { stage: "Lead", label: "Lead (وارد جديد)", count: 34, value: 420000, conversionRate: 100, fill: "#ef4444" },
  { stage: "Discovery", label: "Discovery (تدقيق الاحتياج)", count: 21, value: 310000, conversionRate: 62, fill: "#f59e0b" },
  { stage: "Proposal", label: "Proposal (العرض والتعاقد)", count: 14, value: 245000, conversionRate: 41, fill: "#3b82f6" },
  { stage: "In-Production", label: "In-Production (قيد التنفيذ)", count: 9, value: 185000, conversionRate: 26, fill: "#10b981" },
  { stage: "Completed", label: "Completed (شريك مستدام)", count: 6, value: 140000, conversionRate: 18, fill: "#06b6d4" },
];

/**
 * Simulated User Engagement Summary
 */
export const MOCK_ENGAGEMENT_SUMMARY: UserEngagementSummary = {
  dailyActiveUsers: 340,
  avgSessionDuration: "4m 42s",
  diagnosticCompletionRate: 68.4,
  roiCalculatorInteractions: 842,
  returnVisitorRate: 31.8,
  peakEngagementHour: "08:00 PM - 11:30 PM",
};

/**
 * Mock Data Service API
 */
export const analyticsMockService = {
  getMonthlyGrowth(): MonthlyGrowthMetric[] {
    return MOCK_MONTHLY_GROWTH_DATA;
  },

  getFunnelMetrics(customCounts?: Record<KanbanFunnelStage, number>): FunnelStageMetric[] {
    if (!customCounts) return MOCK_FUNNEL_DATA;
    return MOCK_FUNNEL_DATA.map((item) => {
      const dynamicCount = customCounts[item.stage] ?? item.count;
      return {
        ...item,
        count: dynamicCount,
      };
    });
  },

  getUserEngagement(): UserEngagementSummary {
    return MOCK_ENGAGEMENT_SUMMARY;
  },
};
