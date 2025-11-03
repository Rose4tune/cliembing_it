"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { ThemeToggle } from "./components/ThemeToggle";

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-background text-foreground">
      <ThemeToggle />
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          Just clIEmbing it 🧗
        </h1>
        <p className="text-center text-lg text-muted-foreground">
          climb together regardless of I or E
        </p>
        <p className="text-center mt-4 text-muted-foreground">
          신나는 클IE밍 볼더링 파티!!
          <br />
          우린 함께라면 정상에 오를수 있다!
          <br />
          @ㅁ@!!!
        </p>

        {/* 로그인 상태 표시 및 버튼 */}
        <div className="mt-12 text-center space-y-4">
          {status === "loading" ? (
            <p className="text-muted-foreground">로딩 중...</p>
          ) : session ? (
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-lg p-6">
                <p className="text-card-foreground font-semibold mb-2">
                  ✅ 로그인됨
                </p>
                <p className="text-sm text-muted-foreground">
                  환영합니다, {(session.user as any)?.nickname || session.user?.name || session.user?.email}님!
                </p>
                {(session.user as any)?.mbti && (
                  <p className="text-xs text-muted-foreground mt-1">
                    MBTI: {(session.user as any).mbti}
                  </p>
                )}
              </div>
              <Link
                href="/dashboard"
                className="inline-block bg-primary text-primary-foreground font-semibold py-3 px-8 rounded-lg hover:opacity-90 transition-opacity"
              >
                대시보드 가기
              </Link>
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-block bg-primary text-primary-foreground font-semibold py-3 px-8 rounded-lg hover:opacity-90 transition-opacity"
            >
              로그인하기
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}

