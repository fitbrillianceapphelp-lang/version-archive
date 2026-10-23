// Balanced Safe Space — Type Definitions

export interface SafeSpaceUser {
  id: string;
  sessionId: string; // For anonymous users
  displayName: string; // "Guest-#4821" or real name for registered
  email?: string;
  role: 'guest' | 'registered' | 'counselor';
  isAnonymous: boolean;
  createdAt: string;
}

export interface SupportCircle {
  id: string;
  title: string; // "إدارة احتراق العمل", "قلق الأطروحة", إلخ
  description: string;
  facilitator: string; // اسم المرشد
  schedule: {
    dayOfWeek: 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';
    time: string; // "18:00"
    duration: number; // in minutes
  };
  maxParticipants: number;
  currentParticipants: number;
  webrtcRoomHash: string; // فريد وعشوائي
  status: 'scheduled' | 'active' | 'completed';
  createdAt: string;
}

export interface WebRTCRoom {
  id: string;
  roomHash: string; // High entropy unique identifier
  circleId: string;
  participants: SafeSpaceUser[];
  isEncrypted: boolean;
  recordingEnabled: boolean;
  createdAt: string;
  startedAt?: string;
  endedAt?: string;
}

export interface ResourceGuide {
  id: string;
  title: string;
  category: 'stress-management' | 'thesis-anxiety' | 'family-balance' | 'mindfulness' | 'breathing';
  content: string; // Markdown format
  author: string;
  featured: boolean;
  readingTimeMinutes: number;
  createdAt: string;
}

export interface UserSession {
  id: string;
  user: SafeSpaceUser;
  sessionStarted: string;
  lastActivity: string;
  isActive: boolean;
  // Zero-logs policy: لا نحفظ تفاصيل المحادثات أو البيانات الشخصية الحساسة
}

export interface SupportSchedule {
  circleId: string;
  nextSession: string; // ISO 8601
  registeredParticipants: number;
  facilitatorName: string;
}
