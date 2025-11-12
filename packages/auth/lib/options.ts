import type { NextAuthOptions } from "next-auth";
import { getProviders } from "./providers";
import { callbacks } from "./callbacks";
import { AUTH_PAGES } from "./constants";
import { authLogger } from "./logger";

const isProd = process.env.NODE_ENV === "production";
const isHttps = process.env.NEXTAUTH_URL?.startsWith("https://");

authLogger.config({
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
  debug: !isProd,
  useSecureCookies: isHttps,
};
