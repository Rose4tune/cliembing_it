import type { NextAuthOptions } from "next-auth";
import { getProviders } from "./providers";
import { callbacks } from "./callbacks";
import { AUTH_PAGES } from "./constants";

export const isProd = process.env.NODE_ENV === "production";
// HTTPS 개발 서버 사용 여부 체크
const isHttps = process.env.NEXTAUTH_URL?.startsWith("https://");

console.log("🔧 [NextAuth Config]", {
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  isHttps,
  useSecureCookies: isHttps,
  secret: process.env.NEXTAUTH_SECRET ? "✅ 설정됨" : "❌ 없음",
});

export const authOptions: NextAuthOptions = {
  providers: getProviders(),
  pages: AUTH_PAGES,
  callbacks,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30일
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  // HTTPS 사용 시 자동으로 secure cookie 사용
  useSecureCookies: isHttps,
};
