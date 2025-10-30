// src/api/mobileApi.js
const API_BASE = import.meta.env.DEV
  ? '/admin_api'
  : (import.meta.env.VITE_API_BASE_URL ?? 'https://gym.tangoplus.co.kr/admin_api');

  /** ✅ 종합보기 (Body Report) */
  export const fetchBodyReport = async (t_r, mobile) => {
    if (!t_r) throw new Error("t_r 토큰이 없습니다.");
    if (!mobile) throw new Error("전화번호가 필요합니다.");

    console.log("📞 요청 t_r (원본):", t_r);
    console.log("📞 요청 mobile:", mobile);
    
    // t_r을 다시 디코딩 (혹시 이중 인코딩 방지)
    const decodedTr = decodeURIComponent(t_r);
    console.log("📞 디코딩된 t_r:", decodedTr);

    const RESULTS_URL = `${API_BASE.replace(/\/$/, "")}/kakao-results`;

    const response = await fetch(RESULTS_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        t_r: decodedTr,  // ← 디코딩된 값 사용
        mobile 
      }),
    });

  console.log("📡 응답 상태:", response.status);

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    console.error("❌ 에러 내용:", errorText);
    throw new Error("데이터를 불러올 수 없습니다.");
  }

  const result = await response.json();
  console.log("✅ 전체 API 응답:", result);

  return result;
};

/** ✅ 정면측정 */
export const fetchFrontView = async (t_r) => {
  if (!t_r) throw new Error("t_r 토큰이 없습니다.");

  const response = await fetch(`${API_BASE}/kakao-results/front?t_r=${encodeURIComponent(t_r)}`, {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) throw new Error("정면측정 데이터 로드 실패");
  return await response.json();
};

/** ✅ 측면측정 */
export const fetchSideView = async (t_r) => {
  if (!t_r) throw new Error("t_r 토큰이 없습니다.");

  const response = await fetch(`${API_BASE}/kakao-results/side?t_r=${encodeURIComponent(t_r)}`, {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) throw new Error("측면측정 데이터 로드 실패");

  const result = await response.json();
  console.log("✅ 측면측정 API 응답:", result);

  return result;
};

/** ✅ 후면측정 */
export const fetchBackView = async (t_r) => {
  if (!t_r) throw new Error("t_r 토큰이 없습니다.");

  const response = await fetch(`${API_BASE}/kakao-results/back?t_r=${encodeURIComponent(t_r)}`, {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) throw new Error("후면측정 데이터 로드 실패");
  return await response.json();
};

/** ✅ 동적측정 */
export const fetchSquatView = async (t_r) => {
  if (!t_r) throw new Error("t_r 토큰이 없습니다.");

  const response = await fetch(`${API_BASE}/kakao-results/squat?t_r=${encodeURIComponent(t_r)}`, {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) throw new Error("동적측정 데이터 로드 실패");
  return await response.json();
};

/** ✅ 추천운동 */
export const fetchExerciseRecommendation = async (t_r) => {
  if (!t_r) throw new Error("t_r 토큰이 없습니다.");

  const response = await fetch(`${API_BASE}/exercise-recommendation?t_r=${encodeURIComponent(t_r)}`, {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) throw new Error("추천운동 데이터 로드 실패");
  return await response.json();
};

/** ✅ 운동 상세 정보 */
export const fetchExerciseDetail = async (t_r, exerciseId) => {
  if (!t_r) throw new Error("t_r 토큰이 없습니다.");
  if (!exerciseId) throw new Error("운동 ID가 필요합니다.");

  const response = await fetch(
    `${API_BASE}/exercise-recommendation/${exerciseId}?t_r=${encodeURIComponent(t_r)}`,
    {
      method: "GET",
      headers: { Accept: "application/json" },
    }
  );

  if (!response.ok) throw new Error("운동 상세 정보 로드 실패");
  return await response.json();
};