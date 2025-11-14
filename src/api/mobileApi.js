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

  const result = await response.json();
  console.log("✅ 정면측정 API 응답:", result);

  // pose_landmark 데이터가 없으면 JSON 파일에서 가져오기
  const data = result.data || result;

  // 개발 환경에서는 프록시를 통해 fetch하도록 URL 변환
  const getProxiedUrl = (url) => {
    if (import.meta.env.DEV && url) {
      return url.replace('https://gym.tangoplus.co.kr', '');
    }
    return url;
  };

  if (data.static_front && !data.static_front.pose_landmark && data.static_front.measure_server_json_name) {
    try {
      const jsonUrl = getProxiedUrl(data.static_front.measure_server_json_name);
      const jsonResponse = await fetch(jsonUrl);
      const jsonData = await jsonResponse.json();
      data.static_front.pose_landmark = jsonData.pose_landmark || [];
      console.log("✅ static_front pose_landmark 추가:", data.static_front.pose_landmark.length);
    } catch (err) {
      console.error("❌ static_front JSON 로드 실패:", err);
      data.static_front.pose_landmark = [];
    }
  }

  if (data.static_elbow && !data.static_elbow.pose_landmark && data.static_elbow.measure_server_json_name) {
    try {
      const jsonUrl = getProxiedUrl(data.static_elbow.measure_server_json_name);
      const jsonResponse = await fetch(jsonUrl);
      const jsonData = await jsonResponse.json();
      data.static_elbow.pose_landmark = jsonData.pose_landmark || [];
      console.log("✅ static_elbow pose_landmark 추가:", data.static_elbow.pose_landmark.length);
    } catch (err) {
      console.error("❌ static_elbow JSON 로드 실패:", err);
      data.static_elbow.pose_landmark = [];
    }
  }

  return result;
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

  // pose_landmark 데이터가 없으면 JSON 파일에서 가져오기
  const data = result.data || result;

  // 개발 환경에서는 프록시를 통해 fetch하도록 URL 변환
  const getProxiedUrl = (url) => {
    if (import.meta.env.DEV && url) {
      return url.replace('https://gym.tangoplus.co.kr', '');
    }
    return url;
  };

  if (data.left_side && !data.left_side.pose_landmark && data.left_side.measure_server_json_name) {
    try {
      const jsonUrl = getProxiedUrl(data.left_side.measure_server_json_name);
      const jsonResponse = await fetch(jsonUrl);
      const jsonData = await jsonResponse.json();
      data.left_side.pose_landmark = jsonData.pose_landmark || [];
      console.log("✅ left_side pose_landmark 추가:", data.left_side.pose_landmark.length);
    } catch (err) {
      console.error("❌ left_side JSON 로드 실패:", err);
      data.left_side.pose_landmark = [];
    }
  }

  if (data.right_side && !data.right_side.pose_landmark && data.right_side.measure_server_json_name) {
    try {
      const jsonUrl = getProxiedUrl(data.right_side.measure_server_json_name);
      const jsonResponse = await fetch(jsonUrl);
      const jsonData = await jsonResponse.json();
      data.right_side.pose_landmark = jsonData.pose_landmark || [];
      console.log("✅ right_side pose_landmark 추가:", data.right_side.pose_landmark.length);
    } catch (err) {
      console.error("❌ right_side JSON 로드 실패:", err);
      data.right_side.pose_landmark = [];
    }
  }

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

  const result = await response.json();
  console.log("✅ 후면측정 API 응답:", result);

  // pose_landmark 데이터가 없으면 JSON 파일에서 가져오기
  const data = result.data || result;

  // 개발 환경에서는 프록시를 통해 fetch하도록 URL 변환
  const getProxiedUrl = (url) => {
    if (import.meta.env.DEV && url) {
      return url.replace('https://gym.tangoplus.co.kr', '');
    }
    return url;
  };

  if (data.back && !data.back.pose_landmark && data.back.measure_server_json_name) {
    try {
      const jsonUrl = getProxiedUrl(data.back.measure_server_json_name);
      const jsonResponse = await fetch(jsonUrl);
      const jsonData = await jsonResponse.json();
      data.back.pose_landmark = jsonData.pose_landmark || [];
      console.log("✅ back pose_landmark 추가:", data.back.pose_landmark.length);
    } catch (err) {
      console.error("❌ back JSON 로드 실패:", err);
      data.back.pose_landmark = [];
    }
  }

  if (data.back_sit && !data.back_sit.pose_landmark && data.back_sit.measure_server_json_name) {
    try {
      const jsonUrl = getProxiedUrl(data.back_sit.measure_server_json_name);
      const jsonResponse = await fetch(jsonUrl);
      const jsonData = await jsonResponse.json();
      data.back_sit.pose_landmark = jsonData.pose_landmark || [];
      console.log("✅ back_sit pose_landmark 추가:", data.back_sit.pose_landmark.length);
    } catch (err) {
      console.error("❌ back_sit JSON 로드 실패:", err);
      data.back_sit.pose_landmark = [];
    }
  }

  return result;
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

  // Use the public exercise API path. In dev this will hit the vite proxy (/api/exercises -> gym.tangoplus).
  const exerciseUrl = import.meta.env.DEV
    ? `/api/exercises/${exerciseId}?t_r=${encodeURIComponent(t_r)}`
    : `https://gym.tangoplus.co.kr/api/exercises/${exerciseId}?t_r=${encodeURIComponent(t_r)}`;

  const response = await fetch(exerciseUrl, {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) throw new Error("운동 상세 정보 로드 실패");
  return await response.json();
};