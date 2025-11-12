"use client";

import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Button } from "@pkg/ui-web";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const handleDeleteAccount = async () => {
    if (!confirm("정말로 회원 탈퇴하시겠습니까?\n모든 데이터가 삭제되며 복구할 수 없습니다.")) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch("/api/auth/delete-account", {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("회원 탈퇴 실패");
      }

      alert("회원 탈퇴가 완료되었습니다.");
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("회원 탈퇴 에러:", error);
      alert("회원 탈퇴 중 오류가 발생했습니다. 다시 시도해주세요.");
      setIsDeleting(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="max-w-2xl w-full space-y-8">
        <h1 className="text-4xl font-bold text-center">대시보드</h1>

        {session ? (
          <div className="bg-background shadow-lg rounded-lg p-8 space-y-6">
          <div className="text-center">
            <p className="text-xl font-semibold mb-2">
              환영합니다, {session.user?.name}님!
            </p>
            <p className="text-gray-600 text-sm">
              {session.user?.email}
            </p>
          </div>

          <div className="border-t pt-6">
            <h2 className="font-semibold mb-3">프로필</h2>
              <div className="space-y-2 text-sm">
                <p>닉네임: {(session.user as any)?.nickname || session.user?.name || "-"}</p>
                <p>이메일: {session.user?.email || "-"}</p>
                <p>MBTI: {(session.user as any)?.mbti || "-"}</p>
                <p>레벨: {(session.user as any)?.baseLevel || "-"}</p>
                <p>역할: {(session.user as any)?.role || "user"}</p>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleSignOut}
                variant="secondary"
                className="w-full"
              >
                로그아웃
              </Button>

              <Button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                variant="destructive"
                className="w-full"
              >
                {isDeleting ? "탈퇴 처리 중..." : "회원 탈퇴"}
              </Button>
            </div>
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

