"use client";

import { useSession, signOut } from "next-auth/react";

export default function DashboardPage() {
  const { data: session } = useSession();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="max-w-2xl w-full space-y-8">
        <h1 className="text-4xl font-bold text-center">대시보드</h1>

        {session ? (
          <div className="bg-white shadow-lg rounded-lg p-8 space-y-6">
            <div className="text-center">
              <p className="text-xl font-semibold mb-2">
                환영합니다, {session.user?.name}님!
              </p>
              <p className="text-gray-600 text-sm">
                {session.user?.email}
              </p>
            </div>

            <div className="border-t pt-6">
              <h2 className="font-semibold mb-3">사용자 정보 (Supabase)</h2>
              <div className="space-y-2 text-sm">
                <p>닉네임: {(session.user as any)?.nickname || session.user?.name || "-"}</p>
                <p>이메일: {session.user?.email || "-"}</p>
                <p>MBTI: {(session.user as any)?.mbti || "-"}</p>
                <p>레벨: {(session.user as any)?.baseLevel || "-"}</p>
                <p>역할: {(session.user as any)?.role || "user"}</p>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              로그아웃
            </button>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <p className="text-yellow-800">
              ⚠️ 세션 정보를 불러오는 중...
            </p>
            <p className="text-sm text-yellow-700 mt-2">
              로그인되지 않았다면 /login으로 리다이렉트됩니다
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

