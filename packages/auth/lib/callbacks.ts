import type { CallbacksOptions } from "next-auth";
import { authLogger } from "./logger";

export const callbacks: Partial<CallbacksOptions> = {
  async jwt({ token, account, profile, user, trigger }) {
    authLogger.jwt({
      hasAccount: !!account,
      hasProfile: !!profile,
      provider: account?.provider,
      trigger,
    });

    if (account && profile && account.provider === "kakao") {
      const kakaoId = String((profile as any).id);

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
        token.supabaseId = supabaseUser.id;
        token.nickname = supabaseUser.nickname;
        token.email = supabaseUser.email;
        token.mbti = supabaseUser.mbti;
        token.baseLevel = supabaseUser.base_level;
        token.role = supabaseUser.role;
        token.provider = account.provider;

        authLogger.session("Supabase 사용자 정보 로드 완료");
      }
    }

    return token;
  },

  async session({ session, token }) {
    if (session.user && token) {
      (session.user as any).id = token.supabaseId || token.sub;
      (session.user as any).nickname = token.nickname;
      (session.user as any).mbti = token.mbti;
      (session.user as any).baseLevel = token.baseLevel;
      (session.user as any).role = token.role;
      (session.user as any).provider = token.provider;

      session.user.name = token.nickname as string;
      session.user.email = token.email as string;

      authLogger.session("세션 업데이트 완료");
    }
    return session;
  },

  async signIn({ user, account, profile }) {
    authLogger.signIn({
      provider: account?.provider,
      userId: user?.id,
      userName: user?.name,
    });

    if (account?.provider === "kakao") {
      const kakaoId = String((profile as any)?.id);

      if (!kakaoId) {
        authLogger.error("카카오 ID를 찾을 수 없습니다");
        return true;
      }

      const { syncUserToSupabase } = await import("./supabase-sync");
      const supabaseUserId = await syncUserToSupabase(kakaoId, {
        name: user?.name,
        email: user?.email,
        image: user?.image,
      });

      if (!supabaseUserId) {
        authLogger.error("Supabase 동기화 실패 (로그인은 계속 진행)");
      }
    }

    return true;
  },
};
