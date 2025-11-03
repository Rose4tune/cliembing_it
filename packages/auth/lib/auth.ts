import NextAuth from "next-auth";
import { authOptions } from "./options";

/**
 * NextAuth 핸들러 (v4)
 *
 * @example
 * // app/api/auth/[...nextauth]/route.ts
 * import { handlers } from "@pkg/auth";
 * export const { GET, POST } = handlers;
 */
export const handlers = NextAuth(authOptions);
