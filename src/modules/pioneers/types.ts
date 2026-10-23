// Pioneers Media Hub — Type Definitions

export interface BookingSession {
  id: string;
  bookingCode: string; // PB-BOOK-XXXX
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  packageType: 'conference' | 'studio' | 'reels' | 'portrait';
  packageName: string;
  shootingDate: string;
  shootingLocation: string;
  duration: number; // in hours
  outputPreferences: string[];
  status: 'pending' | 'confirmed' | 'in_production' | 'delivered';
  notes: string;
  whatsappNotified: boolean;
  deliveredUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PhotographerProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  specialization: 'conference' | 'studio' | 'reels' | 'portrait' | 'multi';
  city: string;
  equipment: string[];
  portfolioUrl: string;
  yearsOfExperience: number;
  hourlyRate: number;
  available: boolean;
  status: 'pending' | 'approved' | 'rejected';
  approvalNotes?: string;
  createdAt: string;
  approvedAt?: string;
}

export interface MediaShowcase {
  id: string;
  title: string;
  description: string;
  category: 'conference' | 'studio' | 'reels' | 'portrait';
  videoUrl?: string;
  imageUrls: string[];
  duration?: number; // in seconds for videos
  resolution: '1080p' | '2k' | '4k';
  featured: boolean;
  createdAt: string;
}

export interface PioneersPackage {
  id: string;
  name: string;
  description: string;
  category: 'conference' | 'studio' | 'reels' | 'portrait';
  basePrice: number;
  deliveryDays: number;
  features: string[];
  active: boolean;
}
