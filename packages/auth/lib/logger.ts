/**
 * 인증 관련 로거
 * NODE_ENV=development 일 때만 로그 출력
 */

const isDev = process.env.NODE_ENV === "development";

export const authLogger = {
  jwt: (data: any) => {
    if (isDev) console.log("🔐 [NextAuth JWT]", data);
  },
  session: (message: string) => {
    if (isDev) console.log("📱 [NextAuth Session]", message);
  },
  signIn: (data: any) => {
    if (isDev) console.log("🔑 [NextAuth SignIn]", data);
  },
  provider: (message: string) => {
    if (isDev) console.log("🔌 [Provider]", message);
  },
  config: (data: any) => {
    if (isDev) console.log("⚙️ [Config]", data);
  },
  error: (message: string, error?: any) => {
    console.error("❌ [Auth Error]", message, error || "");
  },
};

export const supabaseLogger = {
  sync: (message: string, data?: any) => {
    if (isDev) console.log("🔄 [Supabase Sync]", message, data || "");
  },
  success: (message: string) => {
    if (isDev) console.log("✅ [Supabase]", message);
  },
  error: (message: string, error?: any) => {
    console.error("❌ [Supabase Error]", message, error || "");
  },
};

