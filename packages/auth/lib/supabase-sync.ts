import { createClient } from "@supabase/supabase-js";

/**
 * 카카오 로그인 시 Supabase에 사용자 정보 동기화
 *
 * 로직:
 * 1. email로 기존 사용자 검색
 * 2. 없으면 카카오 ID로 새 사용자 생성 (회원가입)
 * 3. 있으면 정보 업데이트 (로그인)
 */
export async function syncUserToSupabase(
  kakaoId: string,
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
): Promise<string | null> {
  console.log("🔄 [Supabase Sync] Starting user sync:", {
    kakaoId,
    name: user.name,
    email: user.email,
  });

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.error("❌ [Supabase Sync] NEXT_PUBLIC_SUPABASE_URL not set");
    return null;
  }

  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseKey) {
    console.error("❌ [Supabase Sync] No Supabase key found");
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
    // 1. 카카오 ID로 기존 사용자 확인 (가장 정확)
    console.log("🔍 [Supabase Sync] Checking existing user by Kakao ID...");
    const { data: existingByKakaoId } = await supabase
      .from("users")
      .select("id, nickname, email, provider_id")
      .eq("provider_id", kakaoId)
      .eq("auth_provider", "kakao")
      .limit(1)
      .single();

    if (existingByKakaoId) {
      // 기존 사용자 - 정보 업데이트
      console.log(
        "✅ [Supabase Sync] Existing user found by Kakao ID:",
        existingByKakaoId.id
      );

      const { error: updateError } = await supabase
        .from("users")
        .update({
          nickname: user.name,
          email: user.email, // 이메일 변경 가능성 대응
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingByKakaoId.id);

      if (updateError) {
        console.error("❌ [Supabase Sync] Error updating user:", updateError);
      } else {
        console.log("✅ [Supabase Sync] User updated successfully");
      }

      return existingByKakaoId.id;
    }

    // 2. 이메일로도 확인 (provider_id가 없는 기존 데이터 대응)
    if (user.email) {
      console.log("🔍 [Supabase Sync] Checking existing user by email...");
      const { data: existingByEmail } = await supabase
        .from("users")
        .select("id, nickname, email, provider_id")
        .eq("email", user.email)
        .limit(1)
        .single();

      if (existingByEmail) {
        console.log(
          "✅ [Supabase Sync] Existing user found by email, updating provider_id"
        );

        // provider_id 업데이트
        const { error: updateError } = await supabase
          .from("users")
          .update({
            provider_id: kakaoId,
            nickname: user.name,
            auth_provider: "kakao",
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingByEmail.id);

        if (updateError) {
          console.error("❌ [Supabase Sync] Error updating user:", updateError);
        } else {
          console.log("✅ [Supabase Sync] User updated with provider_id");
        }

        return existingByEmail.id;
      }
    }

    // 2. 신규 사용자 - UUID 생성하고 카카오 ID는 별도 저장
    // users 테이블의 id는 auth.users의 uuid를 참조하므로
    // NextAuth에서 생성한 user.id를 그대로 사용하거나
    // 카카오 ID 기반 일관된 UUID 생성

    // 카카오 ID를 기반으로 UUID v5 생성 (일관성 보장)
    const { randomUUID } = await import("crypto");
    const userId = randomUUID(); // 새로운 UUID 생성

    console.log(
      "✨ [Supabase Sync] Creating new user with UUID:",
      userId,
      "Kakao ID:",
      kakaoId
    );
    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert({
        id: userId, // UUID 사용
        provider_id: kakaoId, // 카카오 ID 저장
        nickname: user.name || "카카오사용자",
        email: user.email,
        auth_provider: "kakao",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      console.error("❌ [Supabase Sync] Error creating user:", insertError);
      return null;
    }

    console.log("✅ [Supabase Sync] User created successfully:", newUser.id);

    // 4. profiles 테이블 생성
    console.log("📝 [Supabase Sync] Creating profile for user:", userId);
    const { error: profileError } = await supabase
      .from("profiles")
      .insert({ user_id: userId });

    if (profileError) {
      // 이미 존재하는 경우 무시
      if (profileError.code !== "23505") {
        console.error(
          "❌ [Supabase Sync] Error creating profile:",
          profileError
        );
      } else {
        console.log("✅ [Supabase Sync] Profile already exists");
      }
    } else {
      console.log("✅ [Supabase Sync] Profile created successfully");
    }

    console.log("🎉 [Supabase Sync] User sync completed successfully");
    return userId;
  } catch (error) {
    console.error("❌ [Supabase Sync] Error in syncUserToSupabase:", error);
    return null;
  }
}
