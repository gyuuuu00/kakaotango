//App.jsx
import { useEffect, useState } from 'react';
import MobileBodyReport from './components/MobileBodyReport/MobileBodyReport.jsx';
import { fetchBodyReport } from './api/mobileApi.js'; 

export default function App() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(true);
  const [mobile, setMobile] = useState('');
  const [needPhone, setNeedPhone] = useState(true);

  const sp = new URLSearchParams(window.location.search);
  // URL 디코딩 + 공백 제거
  const t_r = decodeURIComponent(sp.get('t_r') || '').replace(/\s+/g, '');

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    
    let formatted = value;
    if (value.length > 3 && value.length <= 7) {
      formatted = `${value.slice(0, 3)}-${value.slice(3)}`;
    } else if (value.length > 7) {
      formatted = `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7, 11)}`;
    }
    
    setMobile(formatted);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!mobile.trim()) {
      setErr('전화번호를 입력해주세요.');
      return;
    }

    const cleanMobile = mobile.replace(/[^0-9]/g, '');
    
    if (cleanMobile.length !== 11) {
      setErr('올바른 전화번호 형식이 아닙니다. (11자리)');
      return;
    }

    try {
      setErr('');
      setLoading(true);
      const json = await fetchBodyReport(t_r, cleanMobile);
      setData(json);
      setNeedPhone(false);
    } catch (e) {
      const errorMessage = e.response?.data?.message?.[0] 
        || e.response?.data?.message 
        || e.message 
        || String(e);
      setErr(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!t_r) {
      setErr('t_r 토큰이 없습니다. URL에 ?t_r=... 를 붙여주세요.');
      setLoading(false);
      setNeedPhone(false);
    } else {
      setLoading(false);
    }
  }, [t_r]);

  if (needPhone && !err && t_r) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '20px',
        backgroundColor: '#f9fafb'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '400px',
          backgroundColor: 'white',
          padding: '32px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ 
            textAlign: 'center', 
            marginBottom: '24px',
            fontSize: '20px',
            color: '#374151'
          }}>전화번호 입력</h2>
          
          <form onSubmit={handleSubmit}>
            <input
              type="tel"
              placeholder="010-0000-0000"
              value={mobile}
              onChange={handlePhoneChange}
              maxLength="13"
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '16px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                marginBottom: '12px',
                boxSizing: 'border-box'
              }}
            />
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '16px',
                backgroundColor: '#7e7e7e',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              조회하기
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) return <div style={{ textAlign: 'center', padding: '40px' }}>불러오는 중…</div>;
  if (err) return <div style={{color:'crimson', padding: '20px', textAlign: 'center'}}>에러: {err}</div>;
  if (!data) return <div style={{ textAlign: 'center', padding: '40px' }}>데이터가 없습니다.</div>;

  return <MobileBodyReport data={data} />;
}