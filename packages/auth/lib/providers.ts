import KakaoProvider from "next-auth/providers/kakao";
import { authLogger } from "./logger";

export const getProviders = () => {
  const kakaoClientId = process.env.KAKAO_CLIENT_ID;
  const kakaoClientSecret = process.env.KAKAO_CLIENT_SECRET;

  if (!kakaoClientId) {
    authLogger.error("KAKAO_CLIENT_ID가 설정되지 않음");
    throw new Error("KAKAO_CLIENT_ID is required for Kakao OAuth");
  }

  authLogger.provider(
    `카카오 Provider 초기화: ${kakaoClientId.substring(0, 10)}...`
  );

  return [
    KakaoProvider({
      clientId: kakaoClientId,
      clientSecret: kakaoClientSecret || "",
    }),
  ];
};
