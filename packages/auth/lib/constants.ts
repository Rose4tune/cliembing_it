/**
 * NextAuth 관련 상수
 */

export const AUTH_COOKIE_NAME = "authjs.session-token";

export const AUTH_PAGES = {
  signIn: "/login",
  signOut: "/",
  error: "/error",
} as const;

export const PROTECTED_ROUTES = ["/dashboard", "/party"] as const;

