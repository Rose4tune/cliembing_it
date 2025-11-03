import KakaoProvider from "next-auth/providers/kakao";

export const getProviders = () => [
  KakaoProvider({
    clientId: process.env.KAKAO_CLIENT_ID || "",
    clientSecret: process.env.KAKAO_CLIENT_SECRET || "",
  }),
];

/**
 * 카카오 OAuth Provider (NextAuth v4)
 *
 * 환경변수 필요:
 * - KAKAO_CLIENT_ID: 카카오 REST API 키
 * - KAKAO_CLIENT_SECRET: 카카오 Client Secret (선택)
 */
// export const kakaoProvider = {
//   id: "kakao",
//   name: "Kakao",
//   type: "oauth" as const,
//   clientId: process.env.KAKAO_CLIENT_ID,
//   clientSecret: process.env.KAKAO_CLIENT_SECRET ?? "",
//   authorization: {
//     url: "https://kauth.kakao.com/oauth/authorize",
//     params: {
//       scope: "profile_nickname profile_image account_email",
//     },
//   },
//   token: "https://kauth.kakao.com/oauth/token",
//   userinfo: "https://kapi.kakao.com/v2/user/me",
//   profile(profile: any) {
//     return {
//       id: String(profile.id),
//       name: profile.kakao_account?.profile?.nickname,
//       email: profile.kakao_account?.email,
//       image: profile.kakao_account?.profile?.profile_image_url,
//     };
//   },
// };
