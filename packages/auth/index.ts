/**
 * @pkg/auth
 * NextAuth v4 설정 및 인증 관련 유틸리티
 */

export { handlers } from "./lib/auth";
export { authOptions } from "./lib/options";
export { getProviders } from "./lib/providers";
export { callbacks } from "./lib/callbacks";
export { syncUserToSupabase } from "./lib/supabase-sync";
export {
  AUTH_PAGES,
  AUTH_COOKIE_NAME,
  PROTECTED_ROUTES,
} from "./lib/constants";

// v4에서 getServerSession 사용
export { getServerSession } from "next-auth";
