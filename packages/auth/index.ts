export { handlers } from "./lib/auth";
export { authOptions } from "./lib/options";
export { getProviders } from "./lib/providers";
export { callbacks } from "./lib/callbacks";
export { syncUserToSupabase } from "./lib/supabase-sync";
export { deleteUserFromSupabase } from "./lib/delete-user";
export {
  AUTH_PAGES,
  AUTH_COOKIE_NAME,
  PROTECTED_ROUTES,
} from "./lib/constants";
export { authLogger, supabaseLogger } from "./lib/logger";

// v4 API
export { getServerSession } from "next-auth";

// 디버깅 도구 (개발 환경에서만 사용)
export { testSupabaseConnection } from "./lib/supabase-test";
