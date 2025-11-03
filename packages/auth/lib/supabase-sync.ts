import { createClient } from "@supabase/supabase-js";
import { supabaseLogger } from "./logger";

export async function syncUserToSupabase(
  kakaoId: string,
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
): Promise<string | null> {
  supabaseLogger.sync("사용자 동기화 시작", { kakaoId, email: user.email });

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    supabaseLogger.error("NEXT_PUBLIC_SUPABASE_URL이 설정되지 않음");
    return null;
  }

  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseKey) {
    supabaseLogger.error("Supabase 키가 설정되지 않음");
    return null;
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
    // 1. 카카오 ID로 기존 사용자 확인
    const { data: existingByKakaoId } = await supabase
      .from("users")
      .select("id, nickname, email, provider_id")
      .eq("provider_id", kakaoId)
      .eq("auth_provider", "kakao")
      .limit(1)
      .single();

    if (existingByKakaoId) {
      supabaseLogger.success(
        `기존 사용자 발견 - 정보 유지: ${existingByKakaoId.id}`
      );

      // 기존 사용자는 Supabase 데이터를 유지 (덮어쓰지 않음)
      // 사용자가 직접 수정한 닉네임, MBTI 등을 보존
      return existingByKakaoId.id;
    }

    // 2. 이메일로 확인 (provider_id 없는 기존 데이터 대응)
    if (user.email) {
      const { data: existingByEmail } = await supabase
        .from("users")
        .select("id, nickname, email, provider_id")
        .eq("email", user.email)
        .limit(1)
        .single();

      if (existingByEmail) {
        supabaseLogger.sync(
          "이메일로 기존 사용자 발견, provider_id만 업데이트"
        );

        // provider_id만 업데이트 (닉네임 등 기존 데이터 유지)
        const { error: updateError } = await supabase
          .from("users")
          .update({
            provider_id: kakaoId,
            auth_provider: "kakao",
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingByEmail.id);

        if (updateError) {
          supabaseLogger.error("provider_id 업데이트 실패", updateError);
        } else {
          supabaseLogger.success("provider_id 업데이트 완료");
        }

        return existingByEmail.id;
      }
    }

    // 3. 신규 사용자 생성
    const { randomUUID } = await import("crypto");
    const userId = randomUUID();

    supabaseLogger.sync("신규 사용자 생성", { userId, kakaoId });

    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert({
        id: userId,
        provider_id: kakaoId,
        nickname: user.name || "카카오사용자",
        email: user.email,
        auth_provider: "kakao",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      supabaseLogger.error("사용자 생성 실패", insertError);
      return null;
    }

    supabaseLogger.success(`사용자 생성 완료: ${newUser.id}`);

    // 4. profiles 테이블 생성
    const { error: profileError } = await supabase
      .from("profiles")
      .insert({ user_id: userId });

    if (profileError && profileError.code !== "23505") {
      supabaseLogger.error("프로필 생성 실패", profileError);
    } else {
      supabaseLogger.success("프로필 생성 완료");
    }

    return userId;
  } catch (error) {
    supabaseLogger.error("동기화 중 예외 발생", error);
    return null;
  }
}
