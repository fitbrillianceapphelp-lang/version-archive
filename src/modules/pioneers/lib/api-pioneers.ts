// Pioneers Media Hub API Client
import { BookingSession, PhotographerProfile, MediaShowcase, PioneersPackage } from '../types';

const BASE_URL = '';

// ═══════════════════════════════════════════════════════════════
// BOOKINGS API
// ══════════════���════════════════════════════════════════════════

export async function createBooking(data: Partial<BookingSession>): Promise<BookingSession> {
  try {
    const response = await fetch(`${BASE_URL}/api/pioneers/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`Booking creation failed: ${response.statusText}`);
    return response.json();
  } catch (error) {
    console.error('createBooking error:', error);
    // Fallback: store in localStorage
    const bookings = JSON.parse(localStorage.getItem('pioneer_bookings') || '[]');
    const newBooking: BookingSession = {
      ...(data as BookingSession),
      id: data.id || `PB-${Date.now()}`,
      bookingCode: data.bookingCode || `PB-BOOK-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      status: data.status || 'pending',
      whatsappNotified: data.whatsappNotified || false,
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    bookings.unshift(newBooking);
    localStorage.setItem('pioneer_bookings', JSON.stringify(bookings));
    return newBooking;
  }
}

export async function getBookings(): Promise<BookingSession[]> {
  try {
    const response = await fetch(`${BASE_URL}/api/pioneers/bookings`);
    if (!response.ok) throw new Error('Failed to fetch bookings');
    return response.json();
  } catch (error) {
    console.error('getBookings error:', error);
    return JSON.parse(localStorage.getItem('pioneer_bookings') || '[]');
  }
}

export async function updateBookingStatus(
  bookingId: string,
  status: BookingSession['status'],
  notes?: string
): Promise<BookingSession | null> {
  try {
    const response = await fetch(`${BASE_URL}/api/pioneers/bookings/${bookingId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, notes }),
    });
    if (!response.ok) throw new Error('Failed to update booking');
    return response.json();
  } catch (error) {
    console.error('updateBookingStatus error:', error);
    // Fallback: update localStorage
    const bookings: BookingSession[] = JSON.parse(localStorage.getItem('pioneer_bookings') || '[]');
    const booking = bookings.find((b) => b.id === bookingId);
    if (booking) {
      booking.status = status;
      booking.updatedAt = new Date().toISOString();
      localStorage.setItem('pioneer_bookings', JSON.stringify(bookings));
      return booking;
    }
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════
// PHOTOGRAPHERS API
// ═══════════════════════════════════════════════════════════════

export async function submitPhotographerApplication(
  data: Partial<PhotographerProfile>
): Promise<PhotographerProfile> {
  try {
    const response = await fetch(`${BASE_URL}/api/pioneers/photographers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Photographer submission failed');
    return response.json();
  } catch (error) {
    console.error('submitPhotographerApplication error:', error);
    const photographers = JSON.parse(localStorage.getItem('pioneer_photographers') || '[]');
    const newProfile: PhotographerProfile = {
      ...(data as PhotographerProfile),
      id: data.id || `PHOT-${Date.now()}`,
      status: data.status || 'pending',
      createdAt: data.createdAt || new Date().toISOString(),
    };
    photographers.unshift(newProfile);
    localStorage.setItem('pioneer_photographers', JSON.stringify(photographers));
    return newProfile;
  }
}

export async function getPhotographers(): Promise<PhotographerProfile[]> {
  try {
    const response = await fetch(`${BASE_URL}/api/pioneers/photographers`);
    if (!response.ok) throw new Error('Failed to fetch photographers');
    return response.json();
  } catch (error) {
    console.error('getPhotographers error:', error);
    return JSON.parse(localStorage.getItem('pioneer_photographers') || '[]');
  }
}

export async function approvePhotographer(
  photographerId: string,
  approved: boolean,
  notes?: string
): Promise<PhotographerProfile | null> {
  try {
    const response = await fetch(`${BASE_URL}/api/pioneers/photographers/${photographerId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: approved ? 'approved' : 'rejected', approvalNotes: notes }),
    });
    if (!response.ok) throw new Error('Failed to approve photographer');
    return response.json();
  } catch (error) {
    console.error('approvePhotographer error:', error);
    const photographers: PhotographerProfile[] = JSON.parse(
      localStorage.getItem('pioneer_photographers') || '[]'
    );
    const photographer = photographers.find((p) => p.id === photographerId);
    if (photographer) {
      photographer.status = approved ? 'approved' : 'rejected';
      photographer.approvalNotes = notes;
      photographer.approvedAt = new Date().toISOString();
      localStorage.setItem('pioneer_photographers', JSON.stringify(photographers));
      return photographer;
    }
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════
// MEDIA SHOWCASE API
// ═══════════════════════════════════════════════════════════════

export async function getShowcase(): Promise<MediaShowcase[]> {
  try {
    const response = await fetch(`${BASE_URL}/api/pioneers/showcase`);
    if (!response.ok) throw new Error('Failed to fetch showcase');
    return response.json();
  } catch (error) {
    console.error('getShowcase error:', error);
    return JSON.parse(localStorage.getItem('pioneer_showcase') || '[]');
  }
}

export async function uploadShowcaseItem(data: Partial<MediaShowcase>): Promise<MediaShowcase> {
  try {
    const response = await fetch(`${BASE_URL}/api/pioneers/showcase`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Upload failed');
    return response.json();
  } catch (error) {
    console.error('uploadShowcaseItem error:', error);
    const showcase: MediaShowcase[] = JSON.parse(localStorage.getItem('pioneer_showcase') || '[]');
    const newItem: MediaShowcase = {
      id: data.id || `SHOW-${Date.now()}`,
      title: data.title || '',
      description: data.description || '',
      category: data.category || 'conference',
      imageUrls: data.imageUrls || [],
      videoUrl: data.videoUrl,
      duration: data.duration,
      resolution: data.resolution || '1080p',
      featured: data.featured ?? false,
      createdAt: data.createdAt || new Date().toISOString(),
    };
    showcase.unshift(newItem);
    localStorage.setItem('pioneer_showcase', JSON.stringify(showcase));
    return newItem;
  }
}

export async function deleteShowcaseItem(itemId: string): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_URL}/api/pioneers/showcase/${itemId}`, {
      method: 'DELETE',
    });
    return response.ok;
  } catch (error) {
    console.error('deleteShowcaseItem error:', error);
    const showcase: MediaShowcase[] = JSON.parse(localStorage.getItem('pioneer_showcase') || '[]');
    const filtered = showcase.filter((item) => item.id !== itemId);
    localStorage.setItem('pioneer_showcase', JSON.stringify(filtered));
    return true;
  }
}
