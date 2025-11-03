import { signIn } from "next-auth/react";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function LoginContent() {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const handleKakaoLogin = async () => {
    setIsLoading(true);
    try {
      await signIn("kakao", { callbackUrl: "/" });
    } catch (error) {
      console.error("Kakao login error:", error);
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">
            Just clIEmbing it 🧗
          </h1>
          <p className="text-gray-600">
            climb together regardless of I or E
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-8 space-y-6">
          <h2 className="text-2xl font-bold text-center text-gray-800">
            로그인
          </h2>

          {/* 카카오 로그인 버튼 */}
          <button
            onClick={handleKakaoLogin}
            disabled={isLoading}
            className="w-full bg-[#FEE500] text-[#000000] font-semibold py-3 px-4 rounded-lg hover:bg-[#FDD835] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span>로그인 중...</span>
            ) : (
              <>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 0C4.029 0 0 3.402 0 7.602C0 10.446 1.917 12.924 4.734 14.175L3.78 17.55C3.753 17.649 3.831 17.748 3.93 17.721L7.956 16.038C8.304 16.083 8.652 16.11 9 16.11C13.971 16.11 18 12.708 18 8.508C18 4.308 13.971 0.906 9 0.906V0Z"
                    fill="#000000"
                  />
                </svg>
                <span>카카오 로그인</span>
              </>
            )}
          </button>

          {/* 에러 메시지 */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-800">
              <p className="font-semibold mb-2">❌ 로그인 실패</p>
              <p className="text-xs">
                에러 코드: {error}
                {error === "OAuthSignin" && (
                  <>
                    <br />
                    <br />
                    해결 방법:
                    <br />
                    1. .env.local에 KAKAO_CLIENT_ID 확인
                    <br />
                    2. 카카오 Developers Redirect URI 확인:
                    <br />
                    &nbsp;&nbsp;&nbsp;http://localhost:3000/api/auth/callback/kakao
                    <br />
                    3. 개발 서버 재시작
                  </>
                )}
              </p>
            </div>
          )}

          {/* 안내 메시지 */}
          <div className="text-center text-sm text-gray-500 space-y-2">
            <p>카카오 계정으로 간편하게 로그인하세요</p>
            <p className="text-xs">
              로그인 시 서비스 이용약관에 동의한 것으로 간주됩니다
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
