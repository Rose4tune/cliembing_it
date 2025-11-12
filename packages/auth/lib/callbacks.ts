import type { CallbacksOptions } from "next-auth";
import { authLogger } from "./logger";
import { isKakaoProfile, extractKakaoUserInfo } from "../types/kakao";
import { userService } from "./services/user-service";

export const callbacks: Partial<CallbacksOptions> = {
  async jwt({ token, account, profile, user, trigger }) {
    authLogger.jwt({
      hasAccount: !!account,
      hasProfile: !!profile,
      provider: account?.provider,
      trigger,
    });

    // 최초 로그인 시 provider_id 저장
    if (account && profile && account.provider === "kakao") {
      if (isKakaoProfile(profile)) {
        const { id } = extractKakaoUserInfo(profile);
        token.providerId = id;
        token.provider = account.provider;

        authLogger.session(`카카오 ID 저장: ${id}`);
      }
    }

    // provider_id가 있으면 매번 Supabase에서 최신 데이터 조회
    if (token.providerId) {
      const supabaseUser = await userService.getUserByProviderId(
        token.providerId as string
      );

      if (supabaseUser) {
        token.supabaseId = supabaseUser.id;
        token.nickname = supabaseUser.nickname;
        token.email = supabaseUser.email;
        token.mbti = supabaseUser.mbti;
        token.baseLevel = supabaseUser.base_level;
        token.role = supabaseUser.role;

        authLogger.session("Supabase 최신 데이터 로드 완료");
      }
    }

    return token;
  },

  async session({ session, token }) {
    if (session.user && token) {
      // 타입 단언을 통해 확장된 사용자 속성 할당
      const user = session.user as any;
      user.id = token.supabaseId || token.sub || "";
      user.nickname = token.nickname || null;
      user.mbti = token.mbti || null;
      user.baseLevel = token.baseLevel || null;
      user.role = token.role || null;
      user.provider = token.provider || null;

      session.user.name =
        (token.nickname as string) || session.user.name || null;
      session.user.email =
        (token.email as string) || session.user.email || null;

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

    if (account?.provider === "kakao" && profile) {
      if (!isKakaoProfile(profile)) {
        authLogger.error("유효하지 않은 카카오 프로필");
        return true;
      }

      const { id, nickname, email, image } = extractKakaoUserInfo(profile);

      const supabaseUserId = await userService.syncUser(id, {
        name: nickname,
        email,
        image,
      });

      if (!supabaseUserId) {
        authLogger.error("Supabase 동기화 실패 (로그인은 계속 진행)");
      }
    }

    return true;
  },
};
