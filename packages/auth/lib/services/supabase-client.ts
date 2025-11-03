import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { supabaseLogger } from "../logger";

/**
 * 통합 Supabase 클라이언트 팩토리
 * 환경변수 체크 및 클라이언트 생성 로직 중앙화
 */
export function createSupabaseClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url) {
    supabaseLogger.error("NEXT_PUBLIC_SUPABASE_URL이 설정되지 않음");
    return null;
  }

  const key = serviceKey || anonKey;
  if (!key) {
    supabaseLogger.error("Supabase 키가 설정되지 않음");
    return null;
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Service Role 키가 필요한 작업용 클라이언트
 * (회원 탈퇴 등 관리자 권한 필요)
 */
export function createSupabaseAdminClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) {
    supabaseLogger.error("NEXT_PUBLIC_SUPABASE_URL이 설정되지 않음");
    return null;
  }

  if (!serviceKey) {
    supabaseLogger.error("SUPABASE_SERVICE_ROLE_KEY가 설정되지 않음 (관리자 권한 필요)");
    return null;
  }

  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

