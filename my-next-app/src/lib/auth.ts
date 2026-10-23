import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const AUTH_SECRET =
  process.env.AUTH_SECRET ||
  process.env.SESSION_SECRET ||
  "fallback_secret_change_me_in_env_32_chars_min";
const encodedKey = new TextEncoder().encode(AUTH_SECRET);
const COOKIE_NAME = "portfolio_admin_token";
const SESSION_MAX_AGE = Number(process.env.SESSION_MAX_AGE) || 86400; // 24 hours

export interface AdminSessionPayload {
  email: string;
  role: "admin";
  iat?: number;
  exp?: number;
}

/**
 * Hashes a plain password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

/**
 * Compares a plain password against a bcrypt hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Signs a JWT token for the admin session
 */
export async function createSessionToken(payload: Omit<AdminSessionPayload, "iat" | "exp">): Promise<string> {
  return new SignJWT({ ...payload, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(encodedKey);
}

/**
 * Verifies a JWT token and returns the payload, or null if invalid/expired
 */
export async function verifySessionToken(token: string): Promise<AdminSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload as unknown as AdminSessionPayload;
  } catch {
    return null;
  }
}

/**
 * Retrieves the current admin session from request cookies (Server Components & Actions)
 */
export async function getAdminSession(): Promise<AdminSessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) return null;

  return verifySessionToken(token);
}

/**
 * Ensures user is authenticated as admin, throws error if unauthorized
 */
export async function requireAdmin(): Promise<AdminSessionPayload> {
  const session = await getAdminSession();
  if (!session || session.role !== "admin") {
    throw new Error("Unauthorized: Admin access required");
  }
  return session;
}

/**
 * Sets the admin authentication cookie
 */
export async function setAdminSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

/**
 * Deletes the admin authentication cookie (Logout)
 */
export async function removeAdminSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
