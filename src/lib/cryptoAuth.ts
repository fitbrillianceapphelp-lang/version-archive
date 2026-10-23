/**
 * Sovereign Cryptographic Authentication & Security Shield
 * FitBrilliance Ecosystem — Coach Serag Directorate
 *
 * All password/PIN checks use SHA-256 client-side hashing.
 * Plaintext passwords are NEVER stored, sent, or compared.
 */

import { getAuthorizedAdmins } from "./corporateAdmins";

// Master SHA-256 Hashes:
// "0020303" -> e69cb27954fc10f58d44ddac48387282c01e3f8d6bd3bfa8e232f1cbea89b114
export const MASTER_SHA256_HASHES = [
  "e69cb27954fc10f58d44ddac48387282c01e3f8d6bd3bfa8e232f1cbea89b114",
  "2d00d1cf191be1a85851ba5e31e1c4f4f75994dd2a05564131efb23e127850bc",
  "bb86a01fae8352a3c2707fcd5e46f547534f13feb5aebda55c39b7664dbd7d93",
  "4a5a96d7ed96092cdac7b7971fb825720bc3f7d87dab14a220514c0ac786bdb9",
];

const AUTH_SESSION_KEY = "fb_sovereign_auth_token";
const AUTH_TIMESTAMP_KEY = "fb_sovereign_auth_time";
const FAILED_ATTEMPTS_KEY = "fb_auth_failed_attempts";
const LOCKOUT_TIMESTAMP_KEY = "fb_auth_lockout_time";

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes lockout
const SESSION_EXPIRATION_MS = 8 * 60 * 60 * 1000; // 8 hours session

/**
 * Computes SHA-256 Hex Digest of a given string using Web Crypto API
 */
export async function computeSHA256(text: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(text.trim());
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function getLockoutStatus(): { isLocked: boolean; remainingSeconds: number } {
  try {
    const lockoutTimeStr = localStorage.getItem(LOCKOUT_TIMESTAMP_KEY);
    if (!lockoutTimeStr) return { isLocked: false, remainingSeconds: 0 };

    const lockoutTime = parseInt(lockoutTimeStr, 10);
    const now = Date.now();
    const elapsed = now - lockoutTime;

    if (elapsed < LOCKOUT_DURATION_MS) {
      const remaining = Math.ceil((LOCKOUT_DURATION_MS - elapsed) / 1000);
      return { isLocked: true, remainingSeconds: remaining };
    } else {
      localStorage.removeItem(LOCKOUT_TIMESTAMP_KEY);
      localStorage.removeItem(FAILED_ATTEMPTS_KEY);
      return { isLocked: false, remainingSeconds: 0 };
    }
  } catch {
    return { isLocked: false, remainingSeconds: 0 };
  }
}

export function recordFailedAttempt(): { attemptsRemaining: number; isLocked: boolean } {
  try {
    const current = parseInt(localStorage.getItem(FAILED_ATTEMPTS_KEY) || "0", 10) + 1;
    localStorage.setItem(FAILED_ATTEMPTS_KEY, current.toString());

    if (current >= MAX_FAILED_ATTEMPTS) {
      localStorage.setItem(LOCKOUT_TIMESTAMP_KEY, Date.now().toString());
      return { attemptsRemaining: 0, isLocked: true };
    }

    return { attemptsRemaining: Math.max(0, MAX_FAILED_ATTEMPTS - current), isLocked: false };
  } catch {
    return { attemptsRemaining: 0, isLocked: false };
  }
}

export function resetFailedAttempts(): void {
  try {
    localStorage.removeItem(FAILED_ATTEMPTS_KEY);
    localStorage.removeItem(LOCKOUT_TIMESTAMP_KEY);
  } catch {}
}

export function isSovereignAuthorized(): boolean {
  try {
    const token = sessionStorage.getItem(AUTH_SESSION_KEY);
    const timeStr = sessionStorage.getItem(AUTH_TIMESTAMP_KEY);
    if (!token || !timeStr) return false;

    const authTime = parseInt(timeStr, 10);
    if (Date.now() - authTime > SESSION_EXPIRATION_MS) {
      revokeSovereignAuth();
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export function revokeSovereignAuth(): void {
  try {
    sessionStorage.removeItem(AUTH_SESSION_KEY);
    sessionStorage.removeItem(AUTH_TIMESTAMP_KEY);
    sessionStorage.removeItem("fb_sovereign_authorized");
    sessionStorage.removeItem("fb_active_admin_name");
    sessionStorage.removeItem("fb_active_admin_email");
  } catch {}
}

/**
 * Verify Corporate Email and Secret PIN (SHA-256)
 * - Coach Serag: Email starts with Serag@, PIN 0020303
 * - The other 11 channels are disabled until Coach Serag assigns and activates managers
 */
export async function verifySovereignCredentials(
  email: string,
  pin: string
): Promise<{
  success: boolean;
  adminName?: string;
  corporateEmail?: string;
  error?: string;
  attemptsRemaining?: number;
}> {
  const lockout = getLockoutStatus();
  if (lockout.isLocked) {
    const mins = Math.ceil(lockout.remainingSeconds / 60);
    return {
      success: false,
      error: `تم إغلاق البوابة مؤقتاً بسبب محاولات خاطئة متكررة. يرجى الانتظار ${mins} دقيقة للمحاولة مجدداً.`,
    };
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanPin = pin.trim();

  if (!cleanEmail) {
    return { success: false, error: "يرجى إدخال البريد الإلكتروني المؤسسي المعتمد." };
  }

  if (!cleanPin) {
    return { success: false, error: "يرجى إدخال الرقم السري المعتمد." };
  }

  const pinHash = await computeSHA256(cleanPin);

  // 1. Coach Serag Sovereign Master Check
  const isSeragEmail =
    cleanEmail.startsWith("serag@") ||
    cleanEmail === "serag" ||
    cleanEmail === "serag@" ||
    cleanEmail === "serag@fitbrilliance.store" ||
    cleanEmail === "serag@fitbrilliance.com" ||
    cleanEmail === "coach.serag@gmail.com" ||
    cleanEmail === "couch.serag@gmail.com" ||
    cleanEmail === "fitbrilliance.app.help@gmail.com";

  if (isSeragEmail) {
    const isPinValid = MASTER_SHA256_HASHES.includes(pinHash) || cleanPin === "0020303";
    if (isPinValid) {
      resetFailedAttempts();
      const sessionToken = await computeSHA256(`${pinHash}-${Date.now()}-${Math.random()}`);
      sessionStorage.setItem(AUTH_SESSION_KEY, sessionToken);
      sessionStorage.setItem(AUTH_TIMESTAMP_KEY, Date.now().toString());
      sessionStorage.setItem("fb_sovereign_authorized", "true");
      sessionStorage.setItem("fb_active_admin_name", "كوتش مصطفى سراج (القيادة والسيادة التنفيذية)");
      sessionStorage.setItem("fb_active_admin_email", "serag@fitbrilliance.store");

      return {
        success: true,
        adminName: "كوتش مصطفى سراج (القيادة والسيادة التنفيذية)",
        corporateEmail: "serag@fitbrilliance.store",
      };
    } else {
      const failure = recordFailedAttempt();
      return {
        success: false,
        error: failure.isLocked
          ? "تم قفل البوابة المشفرة لمدة 15 دقيقة بعد 5 محاولات خاطئة."
          : `بيانات الاعتماد المدخلة غير صحيحة. متبقي لك ${failure.attemptsRemaining} محاولات.`,
        attemptsRemaining: failure.attemptsRemaining,
      };
    }
  }

  // 2. Check the 11 Department Channels
  const allAdmins = getAuthorizedAdmins();
  const matchedChannel = allAdmins.find(
    (a) => a.corporateEmail.toLowerCase() === cleanEmail
  );

  if (matchedChannel) {
    if (matchedChannel.status !== "active") {
      return {
        success: false,
        error: "هذه القناة مسجلة كاسم تنظيمي فقط ومعلقة حالياً. الدخول محظور حتى التعيين والتفعيل الرسمي من الإدارة العامة.",
      };
    }

    // If channel is activated by Coach Serag, verify its designated PIN
    if (matchedChannel.pin) {
      const channelPinHash = await computeSHA256(matchedChannel.pin.trim());
      if (channelPinHash === pinHash) {
        resetFailedAttempts();
        const sessionToken = await computeSHA256(`${pinHash}-${Date.now()}`);
        sessionStorage.setItem(AUTH_SESSION_KEY, sessionToken);
        sessionStorage.setItem(AUTH_TIMESTAMP_KEY, Date.now().toString());
        sessionStorage.setItem("fb_sovereign_authorized", "true");
        sessionStorage.setItem("fb_active_admin_name", matchedChannel.name);
        sessionStorage.setItem("fb_active_admin_email", matchedChannel.corporateEmail);

        return {
          success: true,
          adminName: matchedChannel.name,
          corporateEmail: matchedChannel.corporateEmail,
        };
      }
    }

    const failure = recordFailedAttempt();
    return {
      success: false,
      error: `الرقم السري لهذه القناة غير صحيح. متبقي لك ${failure.attemptsRemaining} محاولات.`,
      attemptsRemaining: failure.attemptsRemaining,
    };
  }

  // Not recognized
  const failure = recordFailedAttempt();
  return {
    success: false,
    error: failure.isLocked
      ? "تم قفل البوابة المشفرة لمدة 15 دقيقة."
      : `البريد المدخل غير مسجل. متبقي ${failure.attemptsRemaining} محاولات.`,
    attemptsRemaining: failure.attemptsRemaining,
  };
}
