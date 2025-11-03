import { createClient } from "@supabase/supabase-js";

/**
 * 카카오 로그인 시 Supabase에 사용자 정보 동기화
 */
export async function syncUserToSupabase(user: {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  try {
    // 1. users 테이블에 upsert
    const { error: userError } = await supabase.from("users").upsert(
      {
        id: user.id,
        nickname: user.name,
        email: user.email,
        auth_provider: "kakao",
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "id",
      }
    );

    if (userError) {
      console.error("Error syncing user to Supabase:", userError);
      return false;
    }

    // 2. profiles 테이블 확인 및 생성 (없으면)
    const { data: profile } = await supabase
      .from("profiles")
      .select("user_id")
      .eq("user_id", user.id)
      .single();

    if (!profile) {
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({ user_id: user.id });

      if (profileError) {
        console.error("Error creating profile:", profileError);
      }
    }

    return true;
  } catch (error) {
    console.error("Error in syncUserToSupabase:", error);
    return false;
  }
}
