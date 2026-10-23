import { db } from './index.ts';
import { users } from './schema.ts';
import { eq } from 'drizzle-orm';

export interface UserProfileInput {
  uid: string;
  email: string;
  name?: string | null;
  photoUrl?: string | null;
  role?: string | null;
}

const inMemoryUsers = new Map<string, any>();

export async function getOrCreateUser(profile: UserProfileInput) {
  try {
    if (process.env.SQL_HOST) {
      const result = await db
        .insert(users)
        .values({
          uid: profile.uid,
          email: profile.email,
          name: profile.name || null,
          photoUrl: profile.photoUrl || null,
          role: profile.role || 'client',
        })
        .onConflictDoUpdate({
          target: users.uid,
          set: {
            email: profile.email,
            name: profile.name || null,
            photoUrl: profile.photoUrl || null,
          },
        })
        .returning();

      if (result && result[0]) {
        return result[0];
      }
    }
  } catch (error) {
    console.warn('Postgres getOrCreateUser failed, falling back to in-memory store:', error);
  }

  const existing = inMemoryUsers.get(profile.uid) || {};
  const user = {
    uid: profile.uid,
    email: profile.email,
    name: profile.name || existing.name || null,
    photoUrl: profile.photoUrl || existing.photoUrl || null,
    role: profile.role || existing.role || 'client',
    createdAt: existing.createdAt || new Date(),
    updatedAt: new Date(),
  };
  inMemoryUsers.set(profile.uid, user);
  return user;
}

export async function getUserByUid(uid: string) {
  try {
    if (process.env.SQL_HOST) {
      const results = await db.select().from(users).where(eq(users.uid, uid)).limit(1);
      if (results && results[0]) return results[0];
    }
  } catch (error) {
    console.warn('Postgres getUserByUid failed, falling back to in-memory store:', error);
  }

  return inMemoryUsers.get(uid) || null;
}
