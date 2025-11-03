import type { NextAuthOptions } from "next-auth";
import { getProviders } from "./providers";
import { callbacks } from "./callbacks";
import { AUTH_PAGES } from "./constants";

export const isProd = process.env.NODE_ENV === "production";

export const secureCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  secure: isProd,
};

export const authOptions: NextAuthOptions = {
  providers: getProviders(),
  pages: AUTH_PAGES,
  callbacks,
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  useSecureCookies: isProd,
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: secureCookieOptions,
    },
    callbackUrl: {
      name: "next-auth.callback-url",
      options: secureCookieOptions,
    },
    csrfToken: { name: "next-auth.csrf-token", options: secureCookieOptions },
  },
};
