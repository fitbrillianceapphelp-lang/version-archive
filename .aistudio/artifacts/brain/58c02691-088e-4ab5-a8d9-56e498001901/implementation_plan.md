# Implementation Plan: Visual Analytics Board & Firestore CRM Pipeline

## Overview
Elevate the **Sovereign Command Center** (`SovereignCommandCenter.tsx`) to match the executive portal standards (inspired by the reference Fit Brilliance admin architecture). This adds two first-class modules:
1. **Interactive Visual Analytics Board (Recharts)**: High-fidelity visualizations tracking project growth, monthly trajectory, visitor engagement metrics, ROAS efficiency, and service distribution.
2. **Dedicated Firestore CRM Dashboard**: An interactive drag-and-drop Kanban board for managing client consultations, leads, and projects across 6 funnel stages with live two-way Firestore synchronization, instant WhatsApp actions, and contract/plan generation.

---

## User Preferences & Clarifications
- **Integration**: Seamless dedicated tabs within the existing `SovereignCommandCenter` modal/full-view deck.
- **CRM Flow**: Interactive Kanban board with drag-and-drop / single-click stage progression across funnel columns.
- **Analytics Data Source**: Live Firestore consultation/project counts combined with realistic historical growth and engagement trend simulation (7D, 30D, 90D, 1Y filters).

---

## Architecture & Proposed Changes

### 1. Data Layer & Firestore Integration (`src/lib/crmFirestore.ts`)
- Create a dedicated CRM Firestore helper module providing:
  - Real-time Firestore sync via `onSnapshot` / `getDocs` on `consultations` and `projects` collections.
  - Safe fallback to `/api/consultations` and `localStorage` so the admin never experiences downtime if offline or during rule propagation.
  - CRUD operations: `updateConsultationStage`, `addConsultation`, `deleteConsultation`, `addAdminNote`.
  - Realistic historical metrics generator combining live Firestore counts with 90-day trajectory models.

### 2. Visual Analytics Board Component (`src/components/admin/AdminAnalyticsBoard.tsx`)
- Modern dark-themed dashboard using `recharts` (`AreaChart`, `BarChart`, `PieChart`, `ResponsiveContainer`, `Tooltip`, `XAxis`, `YAxis`, `CartesianGrid`):
  - **KPI Header**: Total Pipeline Value, Active 90-Day Projects, Average ROAS Multiplier, Lead-to-Client Conversion Rate.
  - **Growth Trajectory Chart**: Area chart showing revenue, project milestones, and client acquisitions over time.
  - **Visitor Engagement & Conversion Funnel**: Multi-bar chart displaying daily site visitors, diagnostic tool completions, consultation submissions, and closed deals.
  - **Service Revenue Distribution**: Donut/Pie chart highlighting the 90-Day Execution Program, 4K Cinema Hub, Strategic Diagnostic, and Direct Acquisition campaigns.
  - **ROAS & Performance Index**: Comparative chart measuring client campaign performance before vs after Fit Brilliance intervention.
  - **Time Range Controls**: 7 Days, 30 Days, 90 Days (Default), 1 Year.

### 3. Dedicated CRM Pipeline & Kanban Board (`src/components/admin/AdminCrmKanban.tsx`)
- Kanban board featuring 6 distinct strategic funnel stages:
  1. **وارد جديد (New Inbound)**: Fresh consultation inquiries and diagnostic submissions.
  2. **تم التدقيق والتواصل (Qualified & Contacted)**: Leads verified and initial discovery call held.
  3. **صياغة خطة الـ 90 يوماً (Plan Drafted)**: Strategy blueprint drafted and customized.
  4. **مرحلة التعاقد والتأسيس (Contracting & Setup)**: Contract issued, preliminary audit initiated.
  5. **قيد التنفيذ والنمو (Active Execution)**: Live 90-day campaign rollout and 4K media production.
  6. **شراكة مستدامة / مكتمل (Retainer / Completed)**: Successful milestone delivered, recurring growth partner.
- Features:
  - Drag-and-drop or quick stage transition buttons.
  - Detailed lead drawer / modal with full notes, budget, contact details, and one-click WhatsApp launcher with pre-filled executive greeting.
  - Add new lead / consultation modal directly from the CRM.
  - Search bar and filtering by service tier or stage.
  - Live sync indicator showing Firestore connection status.

### 4. Integration into Sovereign Command Center (`src/components/SovereignCommandCenter.tsx`)
- Add two new tabs to the top module navigation:
  - **لوحة التحليلات المرئية (Analytics)** with icon and real-time badge.
  - **منظومة إدارة العملاء (CRM Kanban)** with live lead counter.
- Maintain existing tabs (`submissions`, `projects`, `roi`, `contracts`, `cloud`) while interconnecting data so actions taken in CRM reflect instantly across projects and analytics.

---

## Verification Plan
1. **Compilation & Syntax**: Run `compile_applet` and `lint_applet` to verify TypeScript types, Recharts imports, and JSX structures.
2. **Firestore Sync**: Verify that moving a consultation card updates the state and Firestore document gracefully.
3. **Responsive UI**: Check mobile and desktop rendering of Recharts containers and Kanban columns.
4. **End-to-End Workflow**: Test creating a lead, moving through Kanban stages, and viewing updated analytics graphs.
