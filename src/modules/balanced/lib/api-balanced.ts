// Balanced Safe Space API Client
import { SafeSpaceUser, SupportCircle, ResourceGuide, WebRTCRoom } from '../types';

const BASE_URL = '';

// ═══════════════════════════════════════════════════════════════
// ANONYMOUS SESSION CREATION (Zero-Logs Policy)
// ═══════════════════════════════════════════════════════════════

export async function createAnonymousSession(): Promise<SafeSpaceUser> {
  try {
    const response = await fetch(`${BASE_URL}/api/balanced/sessions/anonymous`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to create session');
    return response.json();
  } catch (error) {
    console.error('createAnonymousSession error:', error);
    // Fallback: Generate locally
    const sessionId = `GUEST-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    const displayName = `Guest-#${Math.floor(Math.random() * 10000)}`;
    return {
      id: `user-${Date.now()}`,
      sessionId,
      displayName,
      role: 'guest',
      isAnonymous: true,
      createdAt: new Date().toISOString(),
    };
  }
}

export async function registerUser(
  email: string,
  displayName: string,
  password?: string
): Promise<SafeSpaceUser> {
  try {
    const response = await fetch(`${BASE_URL}/api/balanced/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, displayName, password }),
    });
    if (!response.ok) throw new Error('Registration failed');
    return response.json();
  } catch (error) {
    console.error('registerUser error:', error);
    throw error;
  }
}

// ═══════════════════════════════════════════════════════════════
// SUPPORT CIRCLES API
// ═══════════════════════════════════════════════════════════════

export async function getSupportCircles(): Promise<SupportCircle[]> {
  try {
    const response = await fetch(`${BASE_URL}/api/balanced/circles`);
    if (!response.ok) throw new Error('Failed to fetch circles');
    return response.json();
  } catch (error) {
    console.error('getSupportCircles error:', error);
    return [
      {
        id: 'circle-1',
        title: 'إدارة احتراق العمل (Burnout Management)',
        description: 'دائرة دعم مفتوحة للعاملين تحت ضغط عالي وإرهاق مهني.',
        facilitator: 'أ.د نور الدين',
        schedule: { dayOfWeek: 'sunday', time: '18:00', duration: 60 },
        maxParticipants: 15,
        currentParticipants: 8,
        webrtcRoomHash: `jitsi-circle-${Math.random().toString(36).substring(7)}`,
        status: 'scheduled',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'circle-2',
        title: 'قلق الأطروحة والدراسات العليا (Thesis Anxiety Support)',
        description: 'مساحة آمنة لطلاب الدراسات العليا الذين يعانون من القلق والضغوط الأكاديمية.',
        facilitator: 'د. سارة الجاسر',
        schedule: { dayOfWeek: 'tuesday', time: '19:00', duration: 75 },
        maxParticipants: 20,
        currentParticipants: 12,
        webrtcRoomHash: `jitsi-circle-${Math.random().toString(36).substring(7)}`,
        status: 'scheduled',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'circle-3',
        title: 'التوازن الأسري والعلاقات (Family Balance & Relationships)',
        description: 'دائرة تركز على التوازن بين العمل والحياة الشخصية والعائلية.',
        facilitator: 'أ.د محمود السيد',
        schedule: { dayOfWeek: 'thursday', time: '20:00', duration: 90 },
        maxParticipants: 18,
        currentParticipants: 10,
        webrtcRoomHash: `jitsi-circle-${Math.random().toString(36).substring(7)}`,
        status: 'scheduled',
        createdAt: new Date().toISOString(),
      },
    ];
  }
}

export async function joinSupportCircle(
  circleId: string,
  user: SafeSpaceUser
): Promise<WebRTCRoom> {
  try {
    const response = await fetch(`${BASE_URL}/api/balanced/circles/${circleId}/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, displayName: user.displayName }),
    });
    if (!response.ok) throw new Error('Failed to join circle');
    return response.json();
  } catch (error) {
    console.error('joinSupportCircle error:', error);
    return {
      id: `room-${Date.now()}`,
      roomHash: `jitsi-${Math.random().toString(36).substring(7)}`,
      circleId,
      participants: [user],
      isEncrypted: true,
      recordingEnabled: false,
      createdAt: new Date().toISOString(),
    };
  }
}

// ═══════════════════════════════════���═══════════════════════════
// RESOURCE GUIDES API
// ═══════════════════════════════════════════════════════════════

export async function getResourceGuides(): Promise<ResourceGuide[]> {
  try {
    const response = await fetch(`${BASE_URL}/api/balanced/resources`);
    if (!response.ok) throw new Error('Failed to fetch resources');
    return response.json();
  } catch (error) {
    console.error('getResourceGuides error:', error);
    return [
      {
        id: 'res-1',
        title: 'تقنيات التنفس العميق لتهدئة الأعصاب',
        category: 'breathing',
        content: '# تمارين التنفس المتقدمة\n\n1. **التنفس البطني**: شهيق 4 عدات، زفير 6 عدات\n2. **تنفس الصندوق**: 4-4-4-4\n3. **تنفس 7-4-8**: شهيق 7، كتم 4، زفير 8',
        author: 'أ.د نور الدين',
        featured: true,
        readingTimeMinutes: 5,
        createdAt: new Date().toISOString(),
      },
    ];
  }
}

export function destroySessionData(sessionId: string): void {
  fetch(`${BASE_URL}/api/balanced/sessions/${sessionId}`, {
    method: 'DELETE',
  }).catch((e) => console.error('Failed to destroy session:', e));
  localStorage.removeItem(`balanced_session_${sessionId}`);
}

export function getJitsiIframeUrl(roomHash: string, displayName: string, isAnonymous: boolean): string {
  return `https://meet.jit.si/${roomHash}#config.startWithAudioMuted=false&config.startWithVideoMuted=false`;
}
