import { createClient } from "@supabase/supabase-js";
import { supabaseLogger } from "./logger";

/**
 * Supabase에서 사용자 삭제
 * profiles는 CASCADE로 자동 삭제됨
 */
export async function deleteUserFromSupabase(userId: string): Promise<boolean> {
  supabaseLogger.sync("사용자 삭제 시작", { userId });

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    supabaseLogger.error("NEXT_PUBLIC_SUPABASE_URL이 설정되지 않음");
    return false;
  }

  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseKey) {
    supabaseLogger.error("회원 탈퇴는 SUPABASE_SERVICE_ROLE_KEY가 필요합니다");
    return false;
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  try {
    // users 테이블에서 삭제 (profiles는 CASCADE로 자동 삭제)
    const { error: deleteError } = await supabase
      .from("users")
      .delete()
      .eq("id", userId);

    if (deleteError) {
      supabaseLogger.error("사용자 삭제 실패", deleteError);
      return false;
    }

    supabaseLogger.success("사용자 삭제 완료");
    return true;
  } catch (error) {
    supabaseLogger.error("사용자 삭제 중 예외 발생", error);
    return false;
  }
}
