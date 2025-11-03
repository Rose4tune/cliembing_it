/**
 * Supabase users 테이블 사용자 데이터 타입
 */
export interface SupabaseUser {
  id: string;
  provider_id: string;
  nickname: string;
  email: string | null;
  auth_provider: string;
  mbti: string | null;
  base_level: number | null;
  role: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * 사용자 생성/업데이트 시 입력 데이터
 */
export interface UserData {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

/**
 * 사용자 생성 입력 데이터 (Supabase insert용)
 */
export interface CreateUserInput {
  id: string;
  provider_id: string;
  nickname: string;
  email: string | null;
  auth_provider: string;
  created_at: string;
  updated_at: string;
}

/**
 * 사용자 업데이트 입력 데이터 (Supabase update용)
 */
export interface UpdateUserInput {
  nickname?: string;
  email?: string | null;
  mbti?: string | null;
  base_level?: number | null;
  updated_at: string;
}
