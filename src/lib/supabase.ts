/// <reference types="vite/client" />
import { createClient } from "@supabase/supabase-js";

// Helper to ensure a strictly valid http/https URL for Supabase
function getValidSupabaseUrl(): string {
  const rawUrl = (import.meta as any).env?.VITE_SUPABASE_URL;
  if (typeof rawUrl === "string" && rawUrl.trim() && !rawUrl.includes("your-project")) {
    try {
      const parsed = new URL(rawUrl.trim());
      if (parsed.protocol === "http:" || parsed.protocol === "https:") {
        return parsed.toString().replace(/\/+$/, "");
      }
    } catch (_) {
      // Ignore invalid URL format like "Secret value" or malformed strings
    }
  }
  return "https://ihxljggswcmwiagbnphu.supabase.co";
}

// Helper to ensure valid anon key format
function getValidSupabaseAnonKey(): string {
  const rawKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;
  if (typeof rawKey === "string" && rawKey.trim() && rawKey !== "Secret value" && !rawKey.includes("your-anon-key")) {
    return rawKey.trim();
  }
  return "sb_publishable_WtiK8ASB6gS80CUdkLBA9A_bDFq--6A";
}

const supabaseUrl = getValidSupabaseUrl();
const supabaseAnonKey = getValidSupabaseAnonKey();

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ==============================================================================
// Core Database Interfaces (from main active version)
// ==============================================================================
export interface CustomerSchema {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  created_at: string;
}

export interface MembershipSchema {
  id: string;
  customer_email: string;
  member_code: string;
  promo_code: string;
  discount_percent: number;
  is_founding_member: boolean;
  monthly_consultations: number;
  created_at: string;
}

export interface ConsultationSchema {
  id: string;
  customer_name: string;
  email: string;
  phone: string;
  business_name: string;
  business_type: string;
  location?: string;
  website_or_social?: string;
  rating: number;
  dissatisfaction: string;
  improvement_goal: string;
  image_url?: string;
  requested_option: "improvement_plan" | "activity_analysis";
  status: "new" | "analyzing" | "response_drafted" | "sent" | "closed";
  response?: Record<string, any>;
  created_at: string;
}

/**
 * Send Supabase Magic Link for Passwordless Email Authentication
 */
export async function sendMagicLink(email: string) {
  const redirectUrl = window.location.origin;
  
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: redirectUrl,
    },
  });

  if (error) {
    throw new Error(error.message || "فشل إرسال رابط الدخول السريع (Magic Link)");
  }

  return data;
}

/**
 * Upload evaluation image to private Supabase Storage bucket ('evaluation-images')
 * Ensures restricted access for authorized users & admins via signed URLs / RLS.
 */
export async function uploadEvaluationImage(
  fileOrBase64: File | Blob | string,
  userIdentifier: string
): Promise<string> {
  const bucketName = "evaluation-images";
  let fileBody: File | Blob;
  const timestamp = Date.now();
  const randomHash = Math.random().toString(36).substring(2, 7);
  let fileName = `eval_${timestamp}_${randomHash}`;

  if (typeof fileOrBase64 === "string") {
    // If input is base64 Data URL, convert to Blob
    if (fileOrBase64.startsWith("data:")) {
      const response = await fetch(fileOrBase64);
      fileBody = await response.blob();
      const mime = fileBody.type || "image/jpeg";
      const ext = mime.split("/")[1] || "jpg";
      fileName = `${fileName}.${ext}`;
    } else {
      // Direct URL already
      return fileOrBase64;
    }
  } else {
    fileBody = fileOrBase64;
    const fileExt = (fileOrBase64 as File).name?.split(".").pop() || "jpg";
    fileName = `${fileName}.${fileExt}`;
  }

  const cleanUser = userIdentifier.replace(/[^a-zA-Z0-9_-]/g, "_");
  const filePath = `private_evaluations/${cleanUser}/${fileName}`;

  // Upload to Supabase Storage private bucket
  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(filePath, fileBody, {
      cacheControl: "3600",
      upsert: true,
    });

  if (error) {
    console.warn("Supabase Storage upload warning (falling back to local storage if unconfigured):", error.message);
    if (typeof fileOrBase64 === "string") return fileOrBase64;
    return URL.createObjectURL(fileOrBase64);
  }

  // Create a private signed URL valid for 7 days for authorized users & admins
  const { data: signedData, error: signedError } = await supabase.storage
    .from(bucketName)
    .createSignedUrl(data.path, 60 * 60 * 24 * 7);

  if (signedError || !signedData?.signedUrl) {
    const { data: publicData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(data.path);
    return publicData.publicUrl;
  }

  return signedData.signedUrl;
}

// ==============================================================================
// Admin Content Types & APIs (for Admin Dashboard / Admin Panel)
// ==============================================================================
export interface AdminImage {
  id: string;
  title: string;
  url: string;
  alt: string;
  created_at: string;
}

export interface AdminFile {
  id: string;
  title: string;
  file_url: string;
  file_name: string;
  file_size: number;
  created_at: string;
}

export interface AdminContent {
  id: string;
  title: string;
  text: string;
  created_at: string;
}

export interface AdminPrice {
  id: string;
  name: string;
  price: number;
  currency: string;
  features: string[];
  created_at: string;
}

// Images API
export const imagesAPI = {
  async getAll() {
    const { data, error } = await supabase
      .from('admin_images')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as AdminImage[];
  },

  async create(image: Omit<AdminImage, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('admin_images')
      .insert([{ ...image, created_at: new Date().toISOString() }])
      .select();
    if (error) throw error;
    return data[0] as AdminImage;
  },

  async delete(id: string) {
    const { error } = await supabase.from('admin_images').delete().eq('id', id);
    if (error) throw error;
  },
};

// Files API
export const filesAPI = {
  async getAll() {
    const { data, error } = await supabase
      .from('admin_files')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as AdminFile[];
  },

  async create(file: Omit<AdminFile, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('admin_files')
      .insert([{ ...file, created_at: new Date().toISOString() }])
      .select();
    if (error) throw error;
    return data[0] as AdminFile;
  },

  async delete(id: string) {
    const { error } = await supabase.from('admin_files').delete().eq('id', id);
    if (error) throw error;
  },
};

// Content API
export const contentAPI = {
  async getAll() {
    const { data, error } = await supabase
      .from('admin_contents')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as AdminContent[];
  },

  async create(content: Omit<AdminContent, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('admin_contents')
      .insert([{ ...content, created_at: new Date().toISOString() }])
      .select();
    if (error) throw error;
    return data[0] as AdminContent;
  },

  async delete(id: string) {
    const { error } = await supabase.from('admin_contents').delete().eq('id', id);
    if (error) throw error;
  },
};

// Prices API
export const pricesAPI = {
  async getAll() {
    const { data, error } = await supabase
      .from('admin_prices')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as AdminPrice[];
  },

  async create(price: Omit<AdminPrice, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('admin_prices')
      .insert([{ ...price, created_at: new Date().toISOString() }])
      .select();
    if (error) throw error;
    return data[0] as AdminPrice;
  },

  async delete(id: string) {
    const { error } = await supabase.from('admin_prices').delete().eq('id', id);
    if (error) throw error;
  },
};

// File Upload to Storage
export const storageAPI = {
  async uploadFile(file: File, bucket: string = 'admin-files') {
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(`public/${fileName}`, file, { cacheControl: '3600', upsert: false });

    if (error) throw error;

    const { data: publicUrl } = supabase.storage
      .from(bucket)
      .getPublicUrl(`public/${fileName}`);

    return publicUrl.publicUrl;
  },

  async uploadImage(file: File, bucket: string = 'admin-images') {
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(`public/${fileName}`, file, { cacheControl: '3600', upsert: false });

    if (error) throw error;

    const { data: publicUrl } = supabase.storage
      .from(bucket)
      .getPublicUrl(`public/${fileName}`);

    return publicUrl.publicUrl;
  },
};
