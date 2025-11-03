import { getServerSession, authOptions } from "@pkg/auth";

export async function getSession() {
  return getServerSession(authOptions);
}