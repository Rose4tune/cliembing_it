import "next-auth";
import "next-auth/jwt";

/**
 * NextAuth 타입 확장
 * Supabase 사용자 정보를 세션에 포함
 */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      nickname?: string | null;
      mbti?: string | null;
      baseLevel?: number | null;
      role?: string | null;
      provider?: string | null;
    };
  }

  interface User {
    id: string;
    nickname?: string | null;
    mbti?: string | null;
    baseLevel?: number | null;
    role?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    supabaseId?: string;
    nickname?: string | null;
    mbti?: string | null;
    baseLevel?: number | null;
    role?: string | null;
    provider?: string;
    providerId?: string;
    accessToken?: string;
  }
}
