import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

/**
 * 인증 미들웨어
 * 
 * matcher에 정의된 경로는 로그인이 필요합니다.
 * 미로그인 시 자동으로 /login으로 리다이렉트됩니다.
 */
export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/party/:path*",
  ],
};

