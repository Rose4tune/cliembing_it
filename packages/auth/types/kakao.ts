/**
 * 카카오 OAuth 프로필 타입 정의
 * @see https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#req-user-info
 */
export interface KakaoProfile {
  id: number;
  connected_at: string;
  properties?: {
    nickname?: string;
    profile_image?: string;
    thumbnail_image?: string;
  };
  kakao_account?: {
    profile_needs_agreement?: boolean;
    profile_nickname_needs_agreement?: boolean;
    profile_image_needs_agreement?: boolean;
    profile?: {
      nickname?: string;
      thumbnail_image_url?: string;
      profile_image_url?: string;
      is_default_image?: boolean;
    };
    name_needs_agreement?: boolean;
    name?: string;
    email_needs_agreement?: boolean;
    is_email_valid?: boolean;
    is_email_verified?: boolean;
    email?: string;
    age_range_needs_agreement?: boolean;
    age_range?: string;
    birthyear_needs_agreement?: boolean;
    birthyear?: string;
    birthday_needs_agreement?: boolean;
    birthday?: string;
    birthday_type?: string;
    gender_needs_agreement?: boolean;
    gender?: string;
    phone_number_needs_agreement?: boolean;
    phone_number?: string;
    ci_needs_agreement?: boolean;
    ci?: string;
    ci_authenticated_at?: string;
  };
}

/**
 * 카카오 프로필에서 기본 정보 추출
 */
export function extractKakaoUserInfo(profile: KakaoProfile) {
  const nickname =
    profile.kakao_account?.profile?.nickname ||
    profile.properties?.nickname ||
    "카카오사용자";

  const email = profile.kakao_account?.email || null;

  const image =
    profile.kakao_account?.profile?.profile_image_url ||
    profile.properties?.profile_image ||
    null;

  return {
    id: String(profile.id),
    nickname,
    email,
    image,
  };
}

/**
 * 타입 가드: 카카오 프로필 여부 확인
 */
export function isKakaoProfile(profile: unknown): profile is KakaoProfile {
  return (
    typeof profile === "object" &&
    profile !== null &&
    "id" in profile &&
    typeof (profile as any).id === "number"
  );
}
