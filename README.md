# Just clIEmbing it (aka 클IE밍)

### = climb together regardless of I or E

### Together, we climb it.

<br/>
신나는 클IE밍 볼더링 파티!!<br/>
우린 함께라면 정상에 오를수 있다!<br/>
@ㅁ@!!!

<br/>

### 🏗️ 프로젝트 구조

pnpm + Turborepo 기반 모노레포

```
cliembing-it/
├── apps/
│   ├── web/                 # Next.js 16 웹앱 (App Router)
│   └── app/                 # (추가 예정)
├── packages/
│   ├── config/              # 공용 설정 패키지
│   └── style/               # 디자인 시스템
├── package.json             # 루트 의존성 통합 관리
├── pnpm-workspace.yaml      # pnpm workspace 설정
└── turbo.json               # Turborepo 캐싱 전략
```

### 🛠️ 기술 스택

- **Framework**: Next.js 15 (App Router) + React 19
- **Styling**: Tailwind CSS v4
- **TypeScript**: v5.9 (strict mode)
- **Linting**: ESLint v9 (Flat Config) + Prettier
- **Build Tool**: Turborepo v2
- **Package Manager**: pnpm v8

### 📝 주요 명령어

```bash
pnpm dev          # 개발 서버
pnpm build        # 프로덕션 빌드
pnpm lint         # 린트 검사
pnpm typecheck    # 타입 체크
pnpm clean        # 빌드 파일 정리
```
