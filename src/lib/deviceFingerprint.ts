/**
 * Fit Brilliance Device Fingerprint Engine (Hardware & Environment Signature)
 * --------------------------------------------------------------------------
 * Proprietary multi-factor client hardware signature generator.
 * Combines Canvas 2D, WebGL GPU Renderer, AudioContext, Screen Geometry,
 * Hardware Concurrency, and Timezone parameters to generate a persistent
 * 64-character SHA-256 fingerprint hash for duplicate evasion detection.
 *
 * Copyright (c) Serag Onda (c) 2024. All Rights Reserved.
 */

// Simple SHA-256 implementation using Web Crypto API
async function sha256(str: string): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  // Fallback hash
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(16, '0');
}

/**
 * Renders an offscreen canvas to extract GPU/OS font rendering differences.
 */
function getCanvasFingerprint(): string {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 240;
    canvas.height = 60;
    const ctx = canvas.getContext('2d');
    if (!ctx) return 'no-canvas-2d';

    ctx.textBaseline = 'top';
    ctx.font = "14px 'Arial', 'Times New Roman', sans-serif";
    ctx.fillStyle = '#f60';
    ctx.fillRect(125, 1, 62, 20);

    ctx.fillStyle = '#069';
    ctx.fillText('FitBrilliance.Hardware.ID_2024', 2, 15);
    ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
    ctx.fillText('FitBrilliance.Hardware.ID_2024', 4, 17);

    return canvas.toDataURL();
  } catch {
    return 'canvas-unsupported';
  }
}

/**
 * Extracts WebGL unmasked GPU vendor and renderer info.
 */
function getWebGLFingerprint(): { vendor: string; renderer: string } {
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl') ||
      (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null);
    if (!gl) return { vendor: 'no-webgl', renderer: 'no-webgl' };

    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    if (!ext) return { vendor: 'webgl-no-ext', renderer: 'webgl-no-ext' };

    const vendor = gl.getParameter(ext.UNMASKED_VENDOR_WEBGL) || 'unknown-vendor';
    const renderer =
      gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) || 'unknown-renderer';

    return { vendor: String(vendor), renderer: String(renderer) };
  } catch {
    return { vendor: 'err-vendor', renderer: 'err-renderer' };
  }
}

/**
 * Extracts AudioContext hardware processing traits.
 */
async function getAudioFingerprint(): Promise<string> {
  try {
    const AudioContextClass =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return 'no-audio-context';

    const context = new AudioContextClass();
    const oscillator = context.createOscillator();
    const analyser = context.createAnalyser();
    const gain = context.createGain();
    const scriptProcessor = context.createScriptProcessor(4096, 1, 1);

    gain.gain.value = 0; // mute
    oscillator.type = 'triangle';
    oscillator.connect(analyser);
    analyser.connect(scriptProcessor);
    scriptProcessor.connect(gain);
    gain.connect(context.destination);

    return new Promise((resolve) => {
      let resolved = false;
      scriptProcessor.onaudioprocess = function (event) {
        if (resolved) return;
        resolved = true;
        const array = new Float32Array(analyser.frequencyBinCount);
        analyser.getFloatFrequencyData(array);
        let sum = 0;
        for (let i = 0; i < array.length; i++) {
          sum += Math.abs(array[i]);
        }
        oscillator.stop();
        context.close().catch(() => {});
        resolve(sum.toFixed(4));
      };

      oscillator.start(0);

      // Fallback timeout
      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          try {
            oscillator.stop();
            context.close().catch(() => {});
          } catch {}
          resolve('audio-timeout');
        }
      }, 500);
    });
  } catch {
    return 'audio-unsupported';
  }
}

/**
 * Generates or retrieves a persistent device identifier stored across storage layers.
 */
function getPersistentDeviceToken(): string {
  const STORAGE_KEY = 'fb_device_signature_uuid';
  try {
    let token = localStorage.getItem(STORAGE_KEY);
    if (!token) {
      token = 'dev_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
      localStorage.setItem(STORAGE_KEY, token);
    }
    return token;
  } catch {
    return 'ephemeral_token_' + Date.now();
  }
}

export interface DeviceFingerprintResult {
  fingerprintHash: string;
  persistentToken: string;
  components: {
    screenResolution: string;
    colorDepth: number;
    devicePixelRatio: number;
    hardwareConcurrency: number;
    deviceMemory?: number;
    timezone: string;
    languages: string;
    gpuVendor: string;
    gpuRenderer: string;
    canvasHash: string;
    audioSig: string;
  };
}

/**
 * Main function: computes the complete multi-layer device fingerprint.
 */
export async function getDeviceFingerprint(): Promise<DeviceFingerprintResult> {
  const persistentToken = getPersistentDeviceToken();
  const canvasHash = await sha256(getCanvasFingerprint());
  const webgl = getWebGLFingerprint();
  const audioSig = await getAudioFingerprint();

  const nav = navigator as unknown as {
    hardwareConcurrency?: number;
    deviceMemory?: number;
    languages?: string[];
    language?: string;
  };

  const components = {
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    colorDepth: window.screen.colorDepth,
    devicePixelRatio: window.devicePixelRatio || 1,
    hardwareConcurrency: nav.hardwareConcurrency || 2,
    deviceMemory: nav.deviceMemory || 4,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    languages: (nav.languages || [nav.language || 'ar']).join(','),
    gpuVendor: webgl.vendor,
    gpuRenderer: webgl.renderer,
    canvasHash,
    audioSig,
  };

  const rawSignatureString = [
    persistentToken,
    components.screenResolution,
    components.colorDepth,
    components.devicePixelRatio,
    components.hardwareConcurrency,
    components.deviceMemory,
    components.timezone,
    components.languages,
    components.gpuVendor,
    components.gpuRenderer,
    components.canvasHash,
    components.audioSig,
  ].join('|||');

  const fingerprintHash = await sha256(rawSignatureString);

  return {
    fingerprintHash,
    persistentToken,
    components,
  };
}

/**
 * Tracks and checks device application frequency to prevent bot / multi-account spam.
 */
export function checkDeviceSubmissionQuota(formType: string): {
  allowed: boolean;
  message?: string;
} {
  const STORAGE_KEY = `fb_sub_lock_${formType}`;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      const now = Date.now();
      const elapsedHours = (now - data.timestamp) / (1000 * 60 * 60);

      // Lock client assessment & team applications to 1 submission per 48 hours per physical device
      if (elapsedHours < 48) {
        const remainingHours = Math.ceil(48 - elapsedHours);
        return {
          allowed: false,
          message: `تم تسجيل طلب مسبق من هذا الجهاز بالفعل. لحماية البيانات ومنع التكرار، يُسمح بطلب واحد كل 48 ساعة (المتبقي: ${remainingHours} ساعة تقريباً).`,
        };
      }
    }
  } catch {
    // If parsing fails, allow
  }
  return { allowed: true };
}

/**
 * Locks the device upon successful submission.
 */
export function recordDeviceSubmission(
  formType: string,
  fingerprintHash: string
): void {
  const STORAGE_KEY = `fb_sub_lock_${formType}`;
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        timestamp: Date.now(),
        fingerprintHash,
      })
    );
  } catch {}
}
