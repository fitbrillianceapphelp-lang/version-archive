/**
 * aiProvider.ts — FitBrilliance AI Waterfall Engine
 * ─────────────────────────────────────────────────
 * Priority chain (All 100% FREE tiers - protects your Visa / Cerebras credits):
 *   1. Groq      → allam-2-7b (Arabic native) / qwen3.8-27b with 3 rotating API keys
 *   2. Gemini    → gemini-3.8-flash / gemini-flash-latest with 8 rotating API keys
 *   3. Cerebras  → Standby (safeguards your $5 credits)
 *   4. Fallback  → smart pre-written response (instant, offline)
 */

export type AIMessage = { role: "user" | "assistant" | "system"; content: string };
export type AgentType = "visitor" | "admin" | "hostinger";

export interface AIResponse {
  text: string;
  provider: "groq" | "gemini" | "cerebras" | "fallback";
  model: string;
}

// ─── Key Helpers ─────────────────────────────────────────────────────────────
function getGroqKeys(): string[] {
  const envList = process.env.GROQ_API_KEYS;
  if (envList) {
    return envList.split(",").map((k) => k.trim()).filter(Boolean);
  }
  const single = process.env.GROQ_API_KEY;
  return single ? [single.trim()] : [];
}

function getGeminiKeys(): string[] {
  const envList = process.env.GEMINI_API_KEYS;
  if (envList) {
    return envList.split(",").map((k) => k.trim()).filter(Boolean);
  }
  const single = process.env.GEMINI_API_KEY;
  return single ? [single.trim()] : [];
}

let groqKeyIndex = 0;
let geminiKeyIndex = 0;

// ─── 1. Groq Engine (Free Tier, 3 Keys Rotation) ─────────────────────────────
async function callGroq(msgs: AIMessage[], sys: string): Promise<AIResponse | null> {
  const keys = getGroqKeys();
  if (!keys.length) return null;

  const models = ["allam-2-7b", "qwen/qwen3.8-27b"];

  // Try across keys with rotation
  for (let attempt = 0; attempt < keys.length; attempt++) {
    const key = keys[(groqKeyIndex + attempt) % keys.length];

    for (const model of models) {
      try {
        const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${key}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model,
            messages: [{ role: "system", content: sys }, ...msgs],
            max_tokens: 800,
            temperature: 0.7,
          }),
        });

        if (r.ok) {
          const d = await r.json();
          const text = d?.choices?.[0]?.message?.content?.trim();
          if (text) {
            groqKeyIndex = (groqKeyIndex + attempt) % keys.length;
            return { text, provider: "groq", model };
          }
        }
      } catch {
        // Continue to next model / key on network error
      }
    }
  }

  return null;
}

// ─── 2. Gemini Engine (Free Tier, 8 Keys Rotation) ───────────────────────────
async function callGemini(msgs: AIMessage[], sys: string): Promise<AIResponse | null> {
  const keys = getGeminiKeys();
  if (!keys.length) return null;

  const models = ["gemini-3.8-flash", "gemini-flash-latest"];

  for (let attempt = 0; attempt < keys.length; attempt++) {
    const key = keys[(geminiKeyIndex + attempt) % keys.length];

    const contents = msgs.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    for (const model of models) {
      try {
        const r = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              system_instruction: { parts: [{ text: sys }] },
              contents,
              generationConfig: { maxOutputTokens: 800, temperature: 0.7 },
            }),
          }
        );

        if (r.ok) {
          const d = await r.json();
          const text = d?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
          if (text) {
            geminiKeyIndex = (geminiKeyIndex + attempt) % keys.length;
            return { text, provider: "gemini", model };
          }
        }
      } catch {
        // Continue to next key on network error
      }
    }
  }

  return null;
}

// ─── 3. Cerebras Engine (Standby - Safe for user balance) ────────────────────
async function callCerebras(msgs: AIMessage[], sys: string): Promise<AIResponse | null> {
  const key = process.env.CEREBRAS_API_KEY;
  if (!key) return null;
  try {
    const r = await fetch("https://api.cerebras.ai/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "qwen-3.8-27b",
        messages: [{ role: "system", content: sys }, ...msgs],
        max_tokens: 800,
        temperature: 0.7,
      }),
    });
    if (!r.ok) return null;
    const d = await r.json();
    const text = d?.choices?.[0]?.message?.content?.trim();
    return text ? { text, provider: "cerebras", model: "qwen-3.8-27b" } : null;
  } catch {
    return null;
  }
}

// ─── 4. Smart Fallback ───────────────────────────────────────────────────────
function fallback(type: AgentType, lastUserMsg: string = ""): AIResponse {
  if (type === "visitor") {
    const q = lastUserMsg.toLowerCase();
    if (q.includes("تحدث") || q.includes("تكلم") || q.includes("موجود") || q.includes("ألو") || q.includes("مين") || q.includes("مين معايا")) {
      return {
        text: "بالتأكيد، أنا معك ومستعد لمساعدتك بالكامل! كشريك تنفيذي لمنظومة FitBrilliance بإشراف كوتش سراج، أنا هنا لمساعدتك في تشخيص نشاطك، وتوجيهك لأفضل خطة عمل لمشروعك.\n\nما هو مجالك التجاري أو التحدي الأبرز الذي ترغب في حله اليوم؟",
        provider: "fallback",
        model: "executive-assistant",
      };
    }
    if (q.includes("سعر") || q.includes("تكلفة") || q.includes("بكام") || q.includes("فلوس") || q.includes("أسعار")) {
      return {
        text: "جلسة التشخيص الأولي مجانية تماماً حالياً للمستفيدين من تدشين المنظومة (وقيمتها الرسمية 500 إلى 1000 جنيه). أما خطط التحول الـ 90 يوماً والإنتاج الإعلامي، فتُبنى ميزانيتها بناءً على تشخيص النشاط الفعلي لضمان أعلى عائد استثماري ROAS.\n\nهل تود بدء تشخيص مشروعك الآن؟",
        provider: "fallback",
        model: "executive-assistant",
      };
    }
    return {
      text: "أهلاً بك في FitBrilliance بإشراف كوتش سراج.\nأنا هنا لمساعدتك في 3 محاور رئيسية:\n1. التحول الاستراتيجي والتشغيلي للمشاريع (سبرنت 90 يوماً ووقف الهدر).\n2. تصوير الفعاليات والإنتاج الإعلامي 4K.\n3. الدعم الأكاديمي والتحليل الإحصائي للدراسات العليا.\n\nما هو المحور الأقرب لاحتياجك حالياً؟",
      provider: "fallback",
      model: "executive-assistant",
    };
  }

  const map: Record<AgentType, string> = {
    visitor: "",
    admin:
      "⚠️ تنبيه النظام: محركات الذكاء الاصطناعي تعمل على الاحتياطي المحلي. كافة العمليات مؤمنة ومتاحة للمراجعة اليدوية.",
    hostinger:
      "أهلاً بك، شكراً لتواصلك مع FitBrilliance.\nتم استلام رسالتك وسيقوم فريق الاستشارات والإنتاج بدراسة طلبك والتواصل معك خلال 24 ساعة.\n\nمنظومة FitBrilliance | التحول الاستراتيجي والريادة 🔴",
  };
  return { text: map[type], provider: "fallback", model: "none" };
}

// ─── Main AI Dispatcher ──────────────────────────────────────────────────────
export async function askAI(
  messages: AIMessage[],
  systemPrompt: string,
  agentType: AgentType = "visitor"
): Promise<AIResponse> {
  const lastUserMsg = messages.filter((m) => m.role === "user").slice(-1)[0]?.content || "";

  // Safe Waterfall Priority:
  // 1. Groq (Free - 3 Keys rotation, Native Arabic)
  // 2. Gemini (Free - 8 Keys rotation, Google Cloud Free Tier)
  // 3. Cerebras (Only if previous failed)
  // 4. Context-Aware Local Fallback
  return (
    (await callGroq(messages, systemPrompt)) ??
    (await callGemini(messages, systemPrompt)) ??
    (await callCerebras(messages, systemPrompt)) ??
    fallback(agentType, lastUserMsg)
  );
}

// ─── System Prompts ──────────────────────────────────────────────────────────
export const VISITOR_SYSTEM_PROMPT = `أنت "المستشار التنفيذي لمنظومة FitBrilliance" — الذراع الرقمي لـ Coach Serag.
مهمتك: تقديم استشارات ذكية، حية، راقية، وتفاعلية للعميل في الوقت الحقيقي.

[تخصصات المنظومة الأساسية]:
1. التحول الاستراتيجي والتشغيلي للشركات ورواد الأعمال (منظومة الـ 90 يوماً):
   - تشخيص النشاط وعزل الهدر المالي والتشغيلي.
   - إعادة هندسة التسعير والعرض القيمي لتحقيق أعلى ROAS.
   - قيادة المبيعات وعلاج التعثر الميداني.
2. تصوير الفعاليات والإنتاج الإعلامي الاحترافي 4K (Pioneers Media):
   - تغطية سينمائية للفعاليات والمؤتمرات مع مونتاج متقدم.
3. الدعم الأكاديمي والدراسات العليا (Balanced Brilliance):
   - استشارات رسائل الماجستير والدكتوراه، التحليل الإحصائي (SPSS / AMOS / PLS-SEM)، ونشر Scopus.

[تعليمات التعامل مع العميل]:
- تفاعل كشخص حقيقي ذكي ومهني يمثل مكتب Coach Serag، لا تستخدم قوالب آلية مكررة.
- إذا سألك العميل سؤالاً مباشراً مثل "هل يمكنك التحدث؟" أو "من أنت؟"، أجب بترحيب وثقة وأكد أنك جاهز لمساعدته فوراً واسأله عن مشروعه.
- ركّز على فهم مشكلة العميل واطرح سؤالاً تشخيصياً واحداً ذكياً في نهاية كل رسالة.
- حافظ على ردود مركزة (سطرين إلى 4 أسطر) مكتوبة بلغة عربية فصحى راقية وودودة ومحترفة.`;

export const ADMIN_SYSTEM_PROMPT = `أنت "المساعد الاستراتيجي لإدارة FitBrilliance" — تعمل داخل لوحة تحكم الإدارة للأدمن وكوتش سراج.
مهامك:
- تحليل بيانات العملاء وطلبات الاستشارة الواردة وتصنيفها (استراتيجي / إنتاج فعاليات / أكاديمي).
- استعراض ملخصات وتحليلات محادثات الزوار من Agent 1 وكشف الثغرات التشغيلية المحتملة في مشاريعهم.
- صياغة مقترحات ردود وعروض استشارية تنفيذية مخصصة.
- التذكير الدائم بضرورة التدقيق والمراجعة البشرية الميدانية للقرارات والخطط.
- الحفاظ التام على سرية البيانات وتقديم رؤى تحليلية عميقة وسريعة.`;

export const HOSTINGER_SYSTEM_PROMPT = `أنت "بوت الرد الذكي لمنظومة FitBrilliance" للتعامل مع الرسائل الواردة عبر Hostinger والبريد الرسمي.
مهامك:
1. تصنيف طبيعة الاستفسار الوارد:
   - تحول استراتيجي وتشغيلي للشركات (باقة 90 يوماً أو تشخيص نشاط).
   - إنتاج وتغطية فعاليات ومؤتمرات 4K.
   - دعم أكاديمي ودراسات عليا (ماجستير / دكتوراه / إحصاء).
   - شكوى أو استفسار عام.
2. الرد بأسلوب مؤسسي رصين واحترافي يمثل منظومة FitBrilliance ورؤية Coach Serag.
3. التوضيح بأن فريق الاستشارات الميداني سيقوم بدراسة المعطيات والتواصل المباشر.
4. التوقيع النهائي دائماً:
   "منظومة FitBrilliance | التحول الاستراتيجي والريادة 🔴"`;

export const WHATSAPP_BOT_SYSTEM_PROMPT = `أنت "المستشار الذكي لمنظومة FitBrilliance على واتساب" — تتحدث نيابة عن منظومة التحول الاستراتيجي والإنتاج والريادة برعاية Coach Serag.
رؤيتنا: "نرى ما لا يراه الآخرون... لنصنع ما لا يستطيع الآخرون صنعه".

[تخصصات المنظومة الأساسية]:
1. التحول الاستراتيجي والتشغيلي للشركات ورواد الأعمال (منظومة الـ 90 يوماً):
   - تشخيص النشاط ووقف الهدر المالي وكشف الاختناقات التشغيلية.
   - إعادة هيكلة التسعير والعرض القيمي ومضاعفة الهوامش و ROAS.
   - التوسع المؤسسي والفرنشايز الميداني.
2. تصوير الفعاليات والإنتاج الإعلامي 4K (Pioneers Media):
   - تغطية المؤتمرات والإيفنتات، وتصوير وإنتاج المحتوى بدقة سينمائية ومونتاج متقدم.
3. الدعم الأكاديمي للدراسات العليا (Balanced Brilliance):
   - استشارات المنهجية لرسائل الماجستير والدكتوراه، التحليل الإحصائي (SPSS / AMOS / PLS-SEM)، والتدقيق لمعايير Scopus.

[سيكولوجية وأسلوب الحوار على واتساب]:
- تفاعل بشري راقٍ وذكي، بعيد تماماً عن الردود الآلية الجامدة.
- تذكر سياق كلام العميل في الرسائل السابقة وابنِ عليه إجابتك الحالية.
- أرسل رسائل مريحة للقراءة في شاشة الهاتف (2 إلى 4 أسطر)، بدون حشو.
- أنهِ رسالتك بسؤال استكشافي واحد لفهم حجم مشروعه أو التحدي الفعلي الذي يواجهه.
- لا تقدم أسعاراً أو وعوداً مطلقة؛ دائماً وضّح أن كوتش سراج والإدارة يراجعون كافة التفاصيل ميدانياً قبل اعتماد أي خطة.
- توقيع لطيف في ختام الرسائل المهمة: "فريق FitBrilliance 🔴".`;
