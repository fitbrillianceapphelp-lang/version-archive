import nodemailer, { Transporter } from "nodemailer";
import { ConsultationRequest, FoundingMember } from "../types";

let cachedTransporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  if (cachedTransporter) return cachedTransporter;

  const host = process.env.SMTP_HOST?.trim() || "smtp.hostinger.com";
  const port = Number(process.env.SMTP_PORT) || 465;
  const user = process.env.SMTP_USER?.trim() || "support@fitbrilliance.store";
  const pass = process.env.SMTP_PASS?.trim();

  if (host && user && pass) {
    cachedTransporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
      tls: {
        rejectUnauthorized: false, // Avoid strict certificate failures in containerized envs
      },
    });
    return cachedTransporter;
  }

  return null;
}

const DEFAULT_FROM = process.env.SMTP_FROM || '"Fit Brilliance" <support@fitbrilliance.store>';
const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || "serag@fitbrilliance.store";

export interface MailDispatchResult {
  adminSuccess: boolean;
  clientSuccess: boolean;
  mode: "smtp" | "simulated";
  adminError?: string;
  clientError?: string;
}

/**
 * Dispatches both Admin Notification and Client Confirmation emails
 * upon successful completion of the FreeConsultationForm.
 */
export async function sendConsultationEmails(
  consultation: ConsultationRequest,
  member?: FoundingMember | null
): Promise<MailDispatchResult> {
  const transporter = getTransporter();

  const optionLabels: Record<string, string> = {
    improvement_plan: "خطة تحسين وتحول استراتيجي (90 يوم)",
    activity_analysis: "كتاب تحليل وتشخيص النشاط المستقل",
    event_filming: "إعداد وتصوير إيفنتات ومحتوى تدريبي 4K",
    academic_research: "استشارات أبحاث ودراسات عليا",
  };
  const optionLabel = optionLabels[consultation.requestedOption] || consultation.requestedOption;

  // 1. Admin Email HTML Content
  const adminHtml = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="utf-8">
  <title>طلب استشارة جديد</title>
</head>
<body style="margin: 0; padding: 24px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #05080c; color: #f8fafc;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 650px; margin: 0 auto; background: #0c1219; border: 1px solid rgba(220, 38, 38, 0.4); border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.8);">
    <tr>
      <td style="padding: 28px 32px; background: linear-gradient(135deg, #18090a 0%, #0c1219 100%); border-bottom: 2px solid #dc2626; text-align: center;">
        <h1 style="margin: 0; color: #f87171; font-size: 22px; font-weight: 800; letter-spacing: 0.5px;">Fit Brilliance — منظومة التحول والريادة</h1>
        <p style="margin: 6px 0 0; color: #94a3b8; font-size: 13px;">إشعار استلام طلب استشارة مبدئية جديد من الموقع</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 32px;">
        <div style="background: rgba(220, 38, 38, 0.1); border-right: 4px solid #ef4444; padding: 14px 18px; margin-bottom: 24px; border-radius: 6px;">
          <strong style="color: #fca5a5; font-size: 15px;">كود الطلب: ${consultation.id}</strong>
          ${member ? `<span style="color: #94a3b8; margin-right: 16px; font-size: 13px;">| عضوية الأوائل: <span style="color: #38bdf8;">${member.memberCode}</span></span>` : ""}
        </div>

        <h3 style="color: #f1f5f9; font-size: 16px; margin-top: 0; border-bottom: 1px solid #1e293b; padding-bottom: 8px;">🏢 بيانات المنشأة والعميل</h3>
        <table width="100%" cellspacing="0" cellpadding="8" style="font-size: 13px; color: #cbd5e1; margin-bottom: 24px;">
          <tr>
            <td width="30%" style="color: #94a3b8; font-weight: bold;">اسم العميل:</td>
            <td width="70%"><strong style="color: #ffffff;">${consultation.customerName}</strong></td>
          </tr>
          <tr style="background: rgba(255,255,255,0.02);">
            <td style="color: #94a3b8; font-weight: bold;">البريد الإلكتروني:</td>
            <td><a href="mailto:${consultation.email}" style="color: #38bdf8; text-decoration: none;">${consultation.email}</a></td>
          </tr>
          <tr>
            <td style="color: #94a3b8; font-weight: bold;">رقم الهاتف / واتساب:</td>
            <td><a href="https://wa.me/${consultation.phone.replace(/[^0-9]/g, "")}" style="color: #4ade80; text-decoration: none; font-weight: bold;">${consultation.phone} (فتح واتساب)</a></td>
          </tr>
          <tr style="background: rgba(255,255,255,0.02);">
            <td style="color: #94a3b8; font-weight: bold;">اسم النشاط التجاري:</td>
            <td><strong style="color: #ffffff;">${consultation.businessName}</strong></td>
          </tr>
          <tr>
            <td style="color: #94a3b8; font-weight: bold;">نوع ومجال النشاط:</td>
            <td>${consultation.businessType}</td>
          </tr>
          <tr style="background: rgba(255,255,255,0.02);">
            <td style="color: #94a3b8; font-weight: bold;">الموقع الجغرافي:</td>
            <td>${consultation.location}</td>
          </tr>
          ${consultation.websiteOrSocial ? `
          <tr>
            <td style="color: #94a3b8; font-weight: bold;">الموقع / السوشيال ميديا:</td>
            <td><a href="${consultation.websiteOrSocial}" target="_blank" style="color: #38bdf8;">${consultation.websiteOrSocial}</a></td>
          </tr>` : ""}
          <tr style="background: rgba(255,255,255,0.02);">
            <td style="color: #94a3b8; font-weight: bold;">الخدمة المطلوبة:</td>
            <td><span style="background: #991b1b; color: #ffffff; padding: 3px 8px; border-radius: 4px; font-size: 11px;">${optionLabel}</span></td>
          </tr>
          <tr>
            <td style="color: #94a3b8; font-weight: bold;">التقييم الذاتي للوضع الحالي:</td>
            <td style="color: #fbbf24;">${"★".repeat(consultation.rating)}${"☆".repeat(5 - consultation.rating)} (${consultation.rating}/5)</td>
          </tr>
        </table>

        <h3 style="color: #f1f5f9; font-size: 16px; margin-top: 0; border-bottom: 1px solid #1e293b; padding-bottom: 8px;">⚠️ المشاكل والتحديات الحالية</h3>
        <div style="background: #080c10; border: 1px solid #1e293b; padding: 14px; border-radius: 8px; font-size: 13px; color: #e2e8f0; line-height: 1.6; margin-bottom: 20px;">
          ${consultation.dissatisfaction || "لم يتم ذكر تفاصيل إضافية"}
        </div>

        <h3 style="color: #f1f5f9; font-size: 16px; margin-top: 0; border-bottom: 1px solid #1e293b; padding-bottom: 8px;">🎯 الهدف المنشود</h3>
        <div style="background: #080c10; border: 1px solid #1e293b; padding: 14px; border-radius: 8px; font-size: 13px; color: #e2e8f0; line-height: 1.6; margin-bottom: 24px;">
          ${consultation.improvementGoal || "لم يتم ذكر تفاصيل إضافية"}
        </div>

        <div style="text-align: center; padding-top: 10px;">
          <a href="https://fitbrilliance.store/#dashboard" style="display: inline-block; background: linear-gradient(135deg, #ef4444, #b91c1c); color: #ffffff; padding: 12px 28px; border-radius: 8px; font-weight: bold; text-decoration: none; font-size: 14px; box-shadow: 0 4px 15px rgba(220,38,38,0.4);">
            الدخول للوحة الإدارة ومراجعة الطلب ←
          </a>
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding: 18px 32px; background: #06090e; border-top: 1px solid #1e293b; text-align: center; font-size: 11px; color: #64748b;">
        Fit Brilliance Autonomous Notification Dispatcher &middot; تاريخ الإرسال: ${new Date().toLocaleString("ar-EG")}
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  // 2. Client Confirmation Email HTML Content
  const clientHtml = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="utf-8">
  <title>تأكيد استلام طلب استشارتك — Fit Brilliance</title>
</head>
<body style="margin: 0; padding: 24px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #05080c; color: #f8fafc;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 650px; margin: 0 auto; background: #0c1219; border: 1px solid rgba(220, 38, 38, 0.4); border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.8);">
    <tr>
      <td style="padding: 32px; background: linear-gradient(135deg, #18090a 0%, #0c1219 100%); border-bottom: 2px solid #dc2626; text-align: center;">
        <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 800;">Fit Brilliance</h1>
        <p style="margin: 6px 0 0; color: #fca5a5; font-size: 14px;">منظومة التحول الاستراتيجي، الإنتاج السينمائي والريادة</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 36px 32px;">
        <h2 style="color: #f8fafc; font-size: 18px; margin-top: 0;">أهلاً بك أستاذ / ${consultation.customerName}،</h2>
        <p style="color: #cbd5e1; font-size: 14px; line-height: 1.7; margin-bottom: 20px;">
          نشكرك على ثقتك واختيارك لمنظومة <strong style="color: #ef4444;">Fit Brilliance</strong> برعاية كوتش سراج. تم تسجيل طلب استشارتك المبدئية بنجاح لنشاطكم (<strong style="color: #ffffff;">${consultation.businessName}</strong>).
        </p>

        <!-- Status Card -->
        <div style="background: #090e14; border: 1px solid rgba(220,38,38,0.3); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <table width="100%" cellspacing="0" cellpadding="6" style="font-size: 13px; color: #cbd5e1;">
            <tr>
              <td width="40%" style="color: #94a3b8;">رقم ملف الاستشارة:</td>
              <td width="60%"><strong style="color: #f87171; font-family: monospace; font-size: 15px;">${consultation.id}</strong></td>
            </tr>
            <tr>
              <td style="color: #94a3b8;">النوع المطلوب:</td>
              <td><strong style="color: #ffffff;">${optionLabel}</strong></td>
            </tr>
            <tr>
              <td style="color: #94a3b8;">حالة الملف:</td>
              <td><span style="background: rgba(34,197,94,0.15); color: #4ade80; border: 1px solid rgba(34,197,94,0.3); padding: 2px 10px; border-radius: 9999px; font-size: 12px; font-weight: bold;">قيد الفحص والمراجعة (خلال 24 ساعة)</span></td>
            </tr>
          </table>
        </div>

        ${member ? `
        <!-- Founding Member Privilege Card -->
        <div style="background: linear-gradient(135deg, rgba(212,175,55,0.1) 0%, rgba(12,18,25,0.9) 100%); border: 1.5px solid #d4af37; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <div style="color: #fde047; font-weight: bold; font-size: 14px; margin-bottom: 8px;">
            🎖️ تهانينا! تم تفعيل عضوية الدعم الأولى (Founding Support Member)
          </div>
          <p style="color: #cbd5e1; font-size: 12px; line-height: 1.6; margin: 0 0 12px;">
            بصفتك من أوائل المسجلين معنا، حصلت منشأتكم على كود عضوية دائم بالإضافة لكود خصم 15% على خطط الـ 90 يوماً واستشارات التطوير الميداني.
          </p>
          <div style="background: #06090e; border: 1px dashed #d4af37; border-radius: 8px; padding: 10px 14px; display: inline-block;">
            <span style="color: #94a3b8; font-size: 11px;">كود العضوية: </span>
            <strong style="color: #fde047; font-family: monospace; font-size: 14px; margin-left: 12px;">${member.memberCode}</strong>
            <span style="color: #94a3b8; font-size: 11px; margin-right: 12px;">كود الخصم: </span>
            <strong style="color: #ef4444; font-family: monospace; font-size: 14px;">${member.promoCode} (-${member.discountPercent}%)</strong>
          </div>
        </div>
        ` : ""}

        <h3 style="color: #f1f5f9; font-size: 15px; margin-bottom: 10px;">ماذا سيحدث الآن؟</h3>
        <ol style="color: #94a3b8; font-size: 13px; line-height: 1.8; padding-right: 20px; margin-bottom: 28px;">
          <li>يقوم كوتش سراج وفريق العمل بدراسة المشكلة والهدف وصياغة مقترح تشخيصي أولي.</li>
          <li>سيتم إرسال نتيجة الاستشارة وتحديث حسابكم عبر المنصة خلال أقل من 24 ساعة.</li>
          <li>يمكنكم المتابعة المباشرة والاستفسار الفوري عبر قنوات الواتساب الرسمية.</li>
        </ol>

        <!-- Direct WhatsApp CTA -->
        <div style="text-align: center; margin-bottom: 12px;">
          <a href="https://wa.me/201274879442?text=${encodeURIComponent(`مرحباً كوتش سراج، قمت بتقديم طلب استشارة مبدئية لنشاط (${consultation.businessName}) برقم ملف (${consultation.id}).`)}" style="display: inline-block; background: #22c55e; color: #ffffff; padding: 14px 30px; border-radius: 9999px; font-weight: bold; text-decoration: none; font-size: 14px; box-shadow: 0 4px 15px rgba(34,197,94,0.4);">
            💬 التواصل الفوري مع كوتش سراج عبر واتساب ←
          </a>
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px 32px; background: #06090e; border-top: 1px solid #1e293b; text-align: center; font-size: 11px; color: #64748b;">
        جميع الحقوق محفوظة لـ Serag Onda &copy; 2024&ndash;2026 &middot; منظومة Fit Brilliance
        <br>
        الإسكندرية / القاهرة، جمهورية مصر العربية &middot; <a href="https://fitbrilliance.store" style="color: #ef4444; text-decoration: none;">fitbrilliance.store</a>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const result: MailDispatchResult = {
    adminSuccess: false,
    clientSuccess: false,
    mode: transporter ? "smtp" : "simulated",
  };

  // If no SMTP transporter is configured, perform simulated delivery (zero crashes)
  if (!transporter) {
    console.log("\n=======================================================");
    console.log("📨 [SIMULATED EMAIL ENGINE - SMTP UNCONFIGURED]");
    console.log(`To Admin (${ADMIN_EMAIL}): [New Consultation] ${consultation.businessName} (${consultation.id})`);
    console.log(`To Client (${consultation.email}): [Confirmation] Fit Brilliance Consultation Receipt`);
    console.log(`Consultation ID: ${consultation.id} | Member Code: ${member?.memberCode || "N/A"}`);
    console.log("=======================================================\n");
    result.adminSuccess = true;
    result.clientSuccess = true;
    return result;
  }

  // Real SMTP Dispatch
  try {
    await transporter.sendMail({
      from: DEFAULT_FROM,
      to: ADMIN_EMAIL,
      subject: `[استشارة جديدة] طلب استشارة مبدئية: ${consultation.businessName} (${consultation.id})`,
      html: adminHtml,
    });
    result.adminSuccess = true;
  } catch (err: any) {
    console.error("Failed to send admin consultation email:", err?.message || err);
    result.adminError = err?.message || String(err);
  }

  try {
    await transporter.sendMail({
      from: DEFAULT_FROM,
      to: consultation.email,
      subject: `تأكيد استلام طلب استشارتك المبدئية — Fit Brilliance (${consultation.id})`,
      html: clientHtml,
    });
    result.clientSuccess = true;
  } catch (err: any) {
    console.error("Failed to send client consultation email:", err?.message || err);
    result.clientError = err?.message || String(err);
  }

  return result;
}
