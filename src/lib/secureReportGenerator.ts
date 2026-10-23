import { jsPDF } from "jspdf";

export interface DiagnosticReportData {
  clientName: string;
  businessName: string;
  phone: string;
  projectCode: string;
  dateGenerated?: string;
  financialWastePercent: number;
  monthlyWasteEstimateEGP: number;
  projectedRoasMultiplier: number;
  criticalLeaks: string[];
  operationalChokepoints: string[];
  ninetyDayPhases: {
    phase: string;
    focus: string;
    targetKPI: string;
  }[];
  isSpyDecoy?: boolean;
}

/**
 * GenerateSecureReport:
 * Client-Side Zero-Knowledge PDF Generation.
 * Executed 100% inside the user's browser with NO server transit, NO paid API calls, and zero external costs.
 */
export async function generateSecureDiagnosticPdf(data: DiagnosticReportData): Promise<Blob> {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const dateStr = data.dateGenerated || new Date().toISOString().split("T")[0];

  // 1. Dark Sovereign Header Banner
  doc.setFillColor(10, 15, 22); // Obsidian black
  doc.rect(0, 0, pageWidth, 42, "F");

  // Crimson accent strip
  doc.setFillColor(220, 38, 38); // Crimson red
  doc.rect(0, 42, pageWidth, 2.5, "F");

  // Title in English / Latin characters (universal compatibility across standard jsPDF fonts)
  doc.setTextColor(248, 113, 113); // Light Crimson
  doc.setFont("helvetica", "bold");
  doc.setFontSize(19);
  doc.text("FIT BRILLIANCE ECOSYSTEM", 14, 16);

  doc.setTextColor(226, 232, 240); // Slate light
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Sovereign Business Transformation & Operational Diagnostic", 14, 23);
  doc.text("Originator: Coach Serag Onda (Prior Art 2011 - DIMC Verified)", 14, 29);

  // Security Badge in Header
  doc.setDrawColor(220, 38, 38);
  doc.setFillColor(20, 24, 33);
  doc.roundedRect(pageWidth - 75, 10, 62, 22, 2, 2, "FD");

  doc.setTextColor(239, 68, 68);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("PROJECT SECURITY CODE", pageWidth - 71, 16);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.text(data.projectCode || "FB-90D-SOVEREIGN", pageWidth - 71, 23);

  doc.setTextColor(148, 163, 184);
  doc.setFontSize(7);
  doc.text(`ISSUED: ${dateStr}`, pageWidth - 71, 28);

  // 2. Client & Meta Box
  let y = 52;
  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, y, pageWidth - 28, 26, 2, 2, "FD");

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("CLIENT / COMMERCIAL ENTITY:", 18, y + 8);
  doc.text("PRIMARY CONTACT:", 18, y + 16);
  doc.text("STATUS & PRIVACY LEVEL:", 18, y + 23);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(51, 65, 85);
  doc.text(`${data.businessName || "Confidential Enterprise"} (${data.clientName})`, 80, y + 8);
  doc.text(`${data.phone || "Verified Contact Link"}`, 80, y + 16);
  doc.setTextColor(185, 28, 28);
  doc.setFont("helvetica", "bold");
  doc.text("RESTRICTED - VALUE LOCK ACTIVE (FOR CLIENT EYES ONLY)", 80, y + 23);

  // 3. Core Financial Diagnostic Section (The Leakage Radar)
  y = 86;
  doc.setTextColor(185, 28, 28);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("1. EXECUTIVE FINANCIAL LEAKAGE ASSESSMENT", 14, y);

  y += 6;
  // Three KPI metric boxes
  const colWidth = (pageWidth - 28 - 8) / 3;

  // Box 1: Waste Percentage
  doc.setFillColor(254, 242, 242);
  doc.setDrawColor(248, 113, 113);
  doc.roundedRect(14, y, colWidth, 24, 2, 2, "FD");
  doc.setTextColor(153, 27, 27);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("ESTIMATED OPERATIONAL LEAK", 18, y + 7);
  doc.setFontSize(16);
  doc.text(`${data.financialWastePercent}%`, 18, y + 17);

  // Box 2: Monthly Waste EGP
  doc.setFillColor(254, 242, 242);
  doc.setDrawColor(248, 113, 113);
  doc.roundedRect(14 + colWidth + 4, y, colWidth, 24, 2, 2, "FD");
  doc.setTextColor(153, 27, 27);
  doc.setFontSize(8);
  doc.text("EST. MONTHLY DRAIN", 18 + colWidth + 4, y + 7);
  doc.setFontSize(14);
  doc.text(`${data.monthlyWasteEstimateEGP.toLocaleString()} EGP`, 18 + colWidth + 4, y + 17);

  // Box 3: Projected ROAS Recovery
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(74, 222, 128);
  doc.roundedRect(14 + (colWidth + 4) * 2, y, colWidth, 24, 2, 2, "FD");
  doc.setTextColor(22, 101, 52);
  doc.setFontSize(8);
  doc.text("TARGET 90-DAY ROAS", 18 + (colWidth + 4) * 2, y + 7);
  doc.setFontSize(16);
  doc.text(`${data.projectedRoasMultiplier}x`, 18 + (colWidth + 4) * 2, y + 17);

  // 4. Critical Leaks Identified
  y += 32;
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("2. PRIMARY CHOKEPOINTS & FRICTION POINTS (DIAGNOSTIC MATRIX 99):", 14, y);

  y += 6;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(51, 65, 85);

  const leaks = data.criticalLeaks.length > 0 ? data.criticalLeaks : [
    "High audience mismatch in digital acquisition channels resulting in inflated CPL.",
    "Absence of high-converting rapid closing mechanism (Sales SOP breakdown).",
    "Customer lifetime value (LTV) leakage due to unoptimized post-acquisition retention."
  ];

  leaks.forEach((leak, idx) => {
    doc.setFillColor(220, 38, 38);
    doc.circle(18, y + 2, 1.2, "F");
    doc.text(leak, 23, y + 3.5, { maxWidth: pageWidth - 42 });
    y += 9;
  });

  // 5. 90-Day Transformation Roadmap (Locked Teaser)
  y += 4;
  doc.setTextColor(185, 28, 28);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("3. PROPRIETARY 90-DAY WORK-TO-GOAL EXECUTION ROADMAP:", 14, y);

  y += 6;
  const phases = data.ninetyDayPhases.length > 0 ? data.ninetyDayPhases : [
    {
      phase: "MONTH 1: STRUCTURAL AUDIT & BLEED-STOP",
      focus: "Re-engineering direct offer, stopping ad leakage, geographical targeting",
      targetKPI: "Immediate 25-30% reduction in customer acquisition cost"
    },
    {
      phase: "MONTH 2: HIGH-INTENSITY CAMPAIGN DEPLOYMENT",
      focus: "Field execution, multi-channel scaling, sales closing SOPs deployment",
      targetKPI: "+50% validated booking volume with stabilized conversion"
    },
    {
      phase: "MONTH 3: MARKET DOMINANCE & PROFIT MULTIPLICATION",
      focus: "Channel consolidation, referral systems, tax-compliant expense recovery",
      targetKPI: "Target ROAS milestone reaching 3.5x to 4.2x sustained"
    }
  ];

  phases.forEach((p) => {
    doc.setDrawColor(226, 232, 240);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(14, y, pageWidth - 28, 17, 1.5, 1.5, "FD");

    doc.setTextColor(185, 28, 28);
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "bold");
    doc.text(p.phase, 18, y + 5);

    doc.setTextColor(71, 85, 105);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(`Scope: ${p.focus}`, 18, y + 10);

    doc.setTextColor(21, 128, 61);
    doc.setFont("helvetica", "bold");
    doc.text(`Target: ${p.targetKPI}`, 18, y + 14.5);

    y += 20;
  });

  // 6. Security & Value Lock Box at bottom
  y += 2;
  doc.setFillColor(15, 23, 42); // Navy Dark
  doc.rect(14, y, pageWidth - 28, 28, "F");

  doc.setTextColor(248, 113, 113);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("VALUE LOCK - CONFIDENTIAL STRATEGIC DIRECTIVE", 20, y + 7);

  doc.setTextColor(226, 232, 240);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.text("The full daily operational SOPs, exact budget allocation formulas, and creative production master drafts", 20, y + 13);
  doc.text("are exclusively unsealed during the 90-Day Transformation Inception Session with Coach Serag Onda.", 20, y + 18);

  doc.setTextColor(254, 202, 202);
  doc.setFont("helvetica", "bold");
  doc.text("Direct Executive Hotline / WhatsApp: +201274879442 | Verification Portal: fitbrilliance.store", 20, y + 23.5);

  // 7. Footer Watermark
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text(
    `INTELLECTUAL PROPERTY NOTICE: Original Framework authored by Coach Serag Onda (2011-2026). Client Code: ${data.projectCode}. All Rights Reserved.`,
    pageWidth / 2,
    pageHeight - 5,
    { align: "center" }
  );

  return doc.output("blob");
}

/**
 * Convenience helper to trigger client-side instant PDF download
 */
export async function downloadSecureReportPdf(data: DiagnosticReportData, filename?: string) {
  const blob = await generateSecureDiagnosticPdf(data);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename || `FitBrilliance_Report_${data.projectCode || "Diagnostic"}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 3000);
}
