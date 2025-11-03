import { z } from "zod";

/**
 * 클라이언트 환경변수 스키마
 * NEXT_PUBLIC_ 접두사가 있는 것만 노출 가능
 */
const clientEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
});

export type ClientEnv = z.infer<typeof clientEnvSchema>;

/**
 * 클라이언트 환경변수 검증
 */
export function validateClientEnv() {
  try {
    return clientEnvSchema.parse({
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    });
  } catch (error) {
    console.error("❌ Invalid client environment variables:");
    console.error(error);
    throw new Error("Client environment validation failed");
  }
}

/**
 * 안전하게 클라이언트 환경변수 가져오기
 */
export const clientEnv = validateClientEnv();

