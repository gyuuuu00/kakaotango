// src/api/mobileApi.js
import axios from "axios";

const API_URL = "https://gym.tangoplus.co.kr/admin_api";

/** ✅ 종합보기 (Body Report) */
export const fetchBodyReport = async (t_r, mobile) => {
  try {
    const payload = { t_r, mobile };
    const response = await axios.post(`${API_URL}/kakao-results`, payload, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    handleApiError("fetchBodyReport", error);
  }
};

/** ✅ 정면측정 */
export const fetchFrontView = async (t_r) => {
  try {
    const response = await axios.get(`${API_URL}/kakao-results/front`, {
      params: { t_r },
    });
    return response.data;
  } catch (error) {
    handleApiError("fetchFrontView", error);
  }
};

/** ✅ 측면측정 */
export const fetchSideView = async (t_r) => {
  try {
    const response = await axios.get(`${API_URL}/kakao-results/side`, {
      params: { t_r },
    });
    return response.data;
  } catch (error) {
    handleApiError("fetchSideView", error);
  }
};

/** ✅ 후면측정 */
export const fetchBackView = async (t_r) => {
  try {
    const response = await axios.get(`${API_URL}/kakao-results/back`, {
      params: { t_r },
    });
    return response.data;
  } catch (error) {
    handleApiError("fetchBackView", error);
  }
};

/** ✅ 동적측정 */
export const fetchSquatView = async (t_r) => {
  try {
    const response = await axios.get(`${API_URL}/kakao-results/squat`, {
      params: { t_r },
    });
    return response.data;
  } catch (error) {
    handleApiError("fetchSquatView", error);
  }
};

/** ✅ 추천운동 */
export const fetchExerciseRecommendation = async (t_r) => {
  try {
    const response = await axios.get(`${API_URL}/exercise-recommendation`, {
      params: { t_r },
    });
    return response.data;
  } catch (error) {
    handleApiError("fetchExerciseRecommendation", error);
  }
};

/** 🔧 공통 에러 핸들링 */
function handleApiError(apiName, error) {
  console.error(`❌ [${apiName}] API 호출 실패:`, error.message);
  if (error.response) {
    console.error("응답 코드:", error.response.status);
    console.error("에러 내용:", error.response.data);
  }
  throw error;
}