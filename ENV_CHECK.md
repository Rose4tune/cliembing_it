# 환경변수 체크

HTTPS 개발 서버를 사용 중이므로 다음 환경변수가 정확해야 합니다.

## apps/web/.env.local

```bash
# NextAuth - HTTPS 사용!
NEXTAUTH_URL=https://localhost:3000
NEXTAUTH_SECRET=실제-생성한-시크릿-키

# Kakao
KAKAO_CLIENT_ID=0cb4c1ddf9e4bdad65844dad21c40a6b
KAKAO_CLIENT_SECRET=muAAYv2dSERGpJWdFbSzheoBHlkMNnpT

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://프로젝트.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=anon-키
SUPABASE_SERVICE_ROLE_KEY=service-role-키
```

## 카카오 Developers Redirect URI

```
https://localhost:3000/api/auth/callback/kakao
```

⚠️ **주의:** http가 아닌 **https**!

## 서버 재시작 후 로그 확인

터미널에서 다음 로그가 나와야 합니다:

```
🔧 [NextAuth Config] {
  NEXTAUTH_URL: 'https://localhost:3000',
  isHttps: true,
  useSecureCookies: true,
  secret: '✅ 설정됨'
}
```
