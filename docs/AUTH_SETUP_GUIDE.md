# 카카오 로그인 설정 가이드

## 1️⃣ Kakao Developers 설정

### 1. 애플리케이션 생성

1. https://developers.kakao.com 접속
2. "내 애플리케이션" → "애플리케이션 추가하기"
3. 앱 이름, 회사명 입력 후 생성

### 2. 플랫폼 추가

1. 앱 선택 → "플랫폼" 메뉴
2. "Web 플랫폼 등록" 클릭
3. 사이트 도메인 입력:
   - 개발: `http://localhost:3000`
   - 운영: `https://yourdomain.com`

### 3. Redirect URI 설정

1. "제품 설정" → "카카오 로그인" 활성화
2. "Redirect URI" 등록:
   ```
   http://localhost:3000/api/auth/callback/kakao
   ```
3. 저장

### 4. 동의항목 설정

1. "제품 설정" → "카카오 로그인" → "동의항목"
2. 필수 항목 설정:
   - ✅ 닉네임
   - ✅ 프로필 사진
   - ✅ 카카오계정(이메일)

### 5. REST API 키 복사

1. "앱 설정" → "요약 정보"
2. **REST API 키** 복사 → 환경변수로 사용

---

## 2️⃣ Supabase 설정

### 1. 프로젝트 생성

1. https://supabase.com 접속
2. "New project" 클릭
3. 프로젝트 이름, 데이터베이스 비밀번호 설정

### 2. API 키 복사

1. Settings → API
2. **Project URL** 복사
3. **anon public** 키 복사
4. **service_role** 키 복사 (선택)

### 3. 이메일 인증 비활성화

1. Authentication → Providers → Email
2. **"Confirm email"을 OFF**로 설정
3. Save 클릭

### 4. SQL 마이그레이션 실행

Supabase Dashboard → SQL Editor에서 순서대로 실행:

```sql
-- 1. 00_extensions.sql
-- 2. 01_enums.sql
-- 3. 02_helpers.sql
-- 4. 03_tables.sql
-- 5. 04_rls_enable.sql
-- 6. 05_policies_core.sql
-- 7. 06_storage.sql
```

---

## 3️⃣ 환경변수 설정

**파일 생성:** `apps/web/.env.local`

```bash
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-random-secret-here

# Kakao OAuth
KAKAO_CLIENT_ID=your-kakao-rest-api-key-here
KAKAO_CLIENT_SECRET=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### NEXTAUTH_SECRET 생성 방법

```bash
# 터미널에서 실행
openssl rand -base64 32
```

---

## 4️⃣ 테스트

### 개발 서버 실행

```bash
pnpm dev:web
```

### 테스트 순서

1. https://localhost:3000 접속
2. "로그인하기" 버튼 클릭
3. 카카오 로그인 버튼 클릭
4. 카카오 로그인 진행
5. 홈으로 리다이렉트 후 로그인 상태 확인

### 확인 사항

- ✅ 홈 화면에 "✅ 로그인됨" 표시
- ✅ Supabase Dashboard → Authentication → Users에 사용자 추가됨
- ✅ Supabase Dashboard → Table Editor → users에 레코드 생성됨
- ✅ profiles 테이블에도 레코드 생성됨

---

## 🐛 문제 해결

### "Callback URL mismatch" 에러

**원인:** Kakao Developers의 Redirect URI가 잘못됨  
**해결:** `http://localhost:3000/api/auth/callback/kakao` 정확히 입력

### "Invalid client" 에러

**원인:** KAKAO_CLIENT_ID가 잘못됨  
**해결:** Kakao Developers → 앱 설정 → REST API 키 재확인

### "NEXTAUTH_SECRET must be provided" 에러

**원인:** NEXTAUTH_SECRET 환경변수 없음  
**해결:** `openssl rand -base64 32`로 생성 후 .env.local에 추가

### 로그인 후 홈으로 안 돌아옴

**원인:** callbackUrl 설정 문제  
**해결:** login/page.tsx의 `callbackUrl: "/"` 확인

### Supabase에 사용자 정보가 안 들어감

**원인:** SQL 마이그레이션 미실행 또는 트리거 미설정  
**해결:** 03_tables.sql 실행 확인

---

## 📁 파일 구조

```
apps/web/
  ├── app/
  │   ├── api/
  │   │   └── auth/
  │   │       └── [...nextauth]/
  │   │           └── route.ts        # NextAuth API
  │   ├── login/
  │   │   └── page.tsx                # 로그인 페이지
  │   ├── page.tsx                    # 홈 (로그인 버튼)
  │   ├── layout.tsx                  # SessionProvider 래핑
  │   └── providers.tsx               # Client Component Provider
  └── .env.local                      # 환경변수 (gitignore)

packages/
  ├── auth/
  │   ├── lib/
  │   │   ├── auth.ts                 # NextAuth 인스턴스
  │   │   ├── callbacks.ts            # 로그인 콜백
  │   │   ├── constants.ts            # 상수
  │   │   ├── options.ts              # NextAuth 옵션
  │   │   ├── providers.ts            # 카카오 Provider
  │   │   └── supabase-sync.ts        # Supabase 동기화
  │   └── index.ts
  ├── env/
  │   └── src/
  │       ├── env.server.ts           # 서버 환경변수 검증
  │       └── env.client.ts           # 클라이언트 환경변수
  └── supabase/
      └── src/
          ├── client.ts               # 브라우저 클라이언트
          └── server.ts               # 서버 클라이언트
```
