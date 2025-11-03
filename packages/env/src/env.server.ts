import { z } from "zod";

/**
 * 서버 환경변수 스키마
 */
const serverEnvSchema = z.object({
  // NextAuth v4
  NEXTAUTH_URL: z.string().url().optional(),
  NEXTAUTH_SECRET: z.string().min(1),
  KAKAO_CLIENT_ID: z.string().min(1),
  KAKAO_CLIENT_SECRET: z.string().optional(),

  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),

  // Node
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

/**
 * 서버 환경변수 검증
 */
export function validateServerEnv() {
  try {
    return serverEnvSchema.parse(process.env);
  } catch (error) {
    console.error("❌ Invalid server environment variables:");
    console.error(error);
    throw new Error("Server environment validation failed");
  }
}

/**
 * 안전하게 서버 환경변수 가져오기
 */
export const serverEnv = validateServerEnv();
