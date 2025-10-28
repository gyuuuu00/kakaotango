// src/api/mobileApi.js
import axios from 'axios';

const API_URL = 'https://gym.tangoplus.co.kr/admin_api';

export const fetchBodyReport = async (t_r, mobile) => {
  console.log('=== API 호출 정보 ===');
  console.log('t_r:', t_r);
  console.log('mobile:', mobile);
  console.log('mobile 타입:', typeof mobile);
  console.log('mobile 길이:', mobile?.length);
  
  try {
    const payload = {
      t_r: t_r,
      mobile: mobile
    };
    
    console.log('전송 데이터:', JSON.stringify(payload, null, 2));
    
    const response = await axios.post(`${API_URL}/kakao-results`, payload, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    console.log('✅ 응답 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ API 호출 실패:', error.message);
    console.error('❌ 에러 응답 전체:', error.response?.data);
    
    // message 배열 내용 확인
    if (error.response?.data?.message) {
      console.error('❌ 에러 메시지 상세:', error.response.data.message);
      error.response.data.message.forEach((msg, idx) => {
        console.error(`  ${idx + 1}. ${msg}`);
      });
    }
    
    console.error('❌ 에러 상태 코드:', error.response?.status);
    throw error;
  }
};