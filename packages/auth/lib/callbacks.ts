import type { CallbacksOptions } from "next-auth";

/**
 * NextAuth callbacks (v4)
 */
export const callbacks: Partial<CallbacksOptions> = {
  async jwt({ token, account, profile, user, trigger }) {
    // 개발 모드에서만 로그 출력
    if (process.env.NODE_ENV === "development") {
      console.log("🔐 [NextAuth] jwt callback", {
        hasAccount: !!account,
        hasProfile: !!profile,
        hasUser: !!user,
        provider: account?.provider,
        trigger,
      });
    }

    // 첫 로그인 시 Supabase에서 사용자 정보 가져오기
    if (account && profile && account.provider === "kakao") {
      const kakaoId = String((profile as any).id);

      // Supabase에서 사용자 정보 조회
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY ||
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const { data: supabaseUser } = await supabase
        .from("users")
        .select("id, nickname, email, auth_provider, mbti, base_level, role")
        .eq("provider_id", kakaoId)
        .single();

      if (supabaseUser) {
        // Supabase 정보를 토큰에 저장
        token.supabaseId = supabaseUser.id;
        token.nickname = supabaseUser.nickname;
        token.email = supabaseUser.email;
        token.mbti = supabaseUser.mbti;
        token.baseLevel = supabaseUser.base_level;
        token.role = supabaseUser.role;
        token.provider = account.provider;

        if (process.env.NODE_ENV === "development") {
          console.log("✅ [NextAuth] Loaded Supabase user info to token");
        }
      }
    }

    return token;
  },

  async session({ session, token }) {
    // Supabase 사용자 정보를 세션에 포함
    if (session.user && token) {
      (session.user as any).id = token.supabaseId || token.sub;
      (session.user as any).nickname = token.nickname;
      (session.user as any).mbti = token.mbti;
      (session.user as any).baseLevel = token.baseLevel;
      (session.user as any).role = token.role;
      (session.user as any).provider = token.provider;

      // 이름과 이메일도 Supabase 정보로 덮어쓰기
      session.user.name = token.nickname as string;
      session.user.email = token.email as string;

      if (process.env.NODE_ENV === "development") {
        console.log("✅ [NextAuth] Session updated with Supabase user info");
      }
    }
    return session;
  },

  async signIn({ user, account, profile }) {
    if (process.env.NODE_ENV === "development") {
      console.log("🔐 [NextAuth] signIn callback triggered", {
        provider: account?.provider,
        userId: user?.id,
        userName: user?.name,
        userEmail: user?.email,
        profileId: (profile as any)?.id,
      });
    }

    // 카카오 로그인 시 Supabase에 사용자 정보 동기화
    if (account?.provider === "kakao") {
      if (process.env.NODE_ENV === "development") {
        console.log("🔄 [NextAuth] Starting Supabase sync for Kakao user...");
      }

      // 카카오 고유 ID 사용
      const kakaoId = String((profile as any)?.id);

      if (!kakaoId) {
        console.error("❌ [NextAuth] No Kakao ID found in profile");
        return true; // 로그인은 계속 진행
      }

      const { syncUserToSupabase } = await import("./supabase-sync");
      const supabaseUserId = await syncUserToSupabase(kakaoId, {
        name: user?.name,
        email: user?.email,
        image: user?.image,
      });

      if (supabaseUserId) {
        if (process.env.NODE_ENV === "development") {
          console.log(
            "✅ [NextAuth] Supabase sync completed, user ID:",
            supabaseUserId
          );
        }
      } else {
        console.error("❌ [NextAuth] Supabase sync failed");
        // 로그인은 계속 진행 (NextAuth 세션은 유지)
      }
    }

    return true;
  },
};
