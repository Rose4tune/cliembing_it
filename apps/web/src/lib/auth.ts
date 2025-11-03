import { getServerSession, authOptions } from "@pkg/auth";

/**
 * 서버에서 현재 세션 가져오기
 */
export async function getSession() {
  return getServerSession(authOptions);
}