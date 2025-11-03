import type { CallbacksOptions } from "next-auth";

/**
 * NextAuth callbacks (v4)
 */
export const callbacks: Partial<CallbacksOptions> = {
  async jwt({ token, account, profile, user }) {
    // // 첫 로그인 시 사용자 정보 저장
    // if (account && profile) {
    //   token.accessToken = account.access_token;
    //   token.provider = account.provider;
    //   token.providerId = profile.id;
    // }

    // // user 정보가 있으면 저장
    // if (user) {
    //   token.id = user.id;
    // }

    if (account?.provider === "kakao") {
      token.provider = "kakao";
    }
    return token;
  },

  async session({ session, token }) {
    // 세션에 추가 정보 포함
    // if (session.user && token) {
    //   (session.user as any).id = token.sub;
    // }
    return session;
  },

  async signIn({ user, account, profile }) {
    // 카카오 로그인 시 Supabase에 사용자 정보 동기화
    if (account?.provider === "kakao" && user) {
      const { syncUserToSupabase } = await import("./supabase-sync");
      await syncUserToSupabase({
        id: user.id!,
        name: user.name,
        email: user.email,
        image: user.image,
      });
    }
    return true;
  },
};
