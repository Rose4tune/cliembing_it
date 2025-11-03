import { createClient } from "@supabase/supabase-js";

/**
 * Supabase 연결 및 테이블 테스트
 */
export async function testSupabaseConnection() {
  console.log("\n========================================");
  console.log("🧪 Supabase 연결 테스트 시작");
  console.log("========================================\n");

  // 1. 환경변수 체크
  console.log("1️⃣ 환경변수 체크:");
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  console.log("  - NEXT_PUBLIC_SUPABASE_URL:", url ? "✅ 설정됨" : "❌ 없음");
  console.log(
    "  - NEXT_PUBLIC_SUPABASE_ANON_KEY:",
    anonKey ? "✅ 설정됨" : "❌ 없음"
  );
  console.log(
    "  - SUPABASE_SERVICE_ROLE_KEY:",
    serviceKey ? "✅ 설정됨" : "❌ 없음"
  );

  if (!url || !anonKey) {
    console.error("❌ 필수 환경변수가 없습니다!");
    return false;
  }

  // 2. Supabase 클라이언트 생성
  console.log("\n2️⃣ Supabase 클라이언트 생성:");
  const supabase = createClient(url, serviceKey || anonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
  console.log("  ✅ 클라이언트 생성 완료");

  // 3. users 테이블 구조 확인
  console.log("\n3️⃣ users 테이블 구조 확인:");
  try {
    const { data: columns, error: columnError } = await supabase.rpc(
      "exec_sql",
      {
        query: `
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'users'
        ORDER BY ordinal_position;
      `,
      }
    );

    if (columnError) {
      console.log("  ⚠️  테이블 구조 조회 실패 (권한 문제일 수 있음)");
    }
  } catch (e) {
    console.log("  ⚠️  RPC 호출 실패");
  }

  // 4. 테스트 쿼리 실행
  console.log("\n4️⃣ users 테이블 읽기 테스트:");
  const { data: users, error: selectError } = await supabase
    .from("users")
    .select("id, email, nickname, auth_provider, provider_id")
    .limit(1);

  if (selectError) {
    console.error("  ❌ SELECT 실패:", selectError);
    return false;
  } else {
    console.log("  ✅ SELECT 성공 (레코드 수:", users?.length || 0, ")");
    if (users && users.length > 0) {
      console.log("  샘플 데이터:", users[0]);
    }
  }

  // 5. 테스트 INSERT 시도 (즉시 삭제)
  console.log("\n5️⃣ INSERT 권한 테스트:");
  const testId = "00000000-0000-0000-0000-000000000000";
  const { data: insertTest, error: insertError } = await supabase
    .from("users")
    .insert({
      id: testId,
      provider_id: "test-kakao-id",
      nickname: "테스트",
      email: "test@test.com",
      auth_provider: "kakao",
    })
    .select();

  if (insertError) {
    console.error("  ❌ INSERT 실패:", insertError);
    console.error("  에러 코드:", insertError.code);
    console.error("  에러 메시지:", insertError.message);
    console.error("  에러 상세:", insertError.details);

    // RLS 정책 문제일 가능성
    if (
      insertError.code === "42501" ||
      insertError.message.includes("policy")
    ) {
      console.error("\n  ⚠️  RLS 정책 문제로 추정됩니다!");
      console.error("  해결방법:");
      console.error("  1. Supabase Dashboard → Table Editor → users");
      console.error("  2. RLS 정책 확인");
      console.error("  3. service_role_key 사용 확인");
    }

    return false;
  } else {
    console.log("  ✅ INSERT 성공");

    // 테스트 데이터 삭제
    await supabase.from("users").delete().eq("id", testId);
    console.log("  ✅ 테스트 데이터 삭제 완료");
  }

  console.log("\n========================================");
  console.log("✅ 모든 테스트 통과!");
  console.log("========================================\n");
  return true;
}
