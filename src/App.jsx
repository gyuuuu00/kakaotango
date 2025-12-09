//App.jsx
import { useEffect, useState } from 'react';
import MobileBodyReport from './components/MobileBodyReport/MobileBodyReport.jsx';
import { fetchBodyReport } from './api/mobileApi.js';
import logo from './assets/logo.svg'; 

export default function App() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(true);
  const [mobile, setMobile] = useState('');
  const [needPhone, setNeedPhone] = useState(true);

  const sp = new URLSearchParams(window.location.search);
  const t_r = sp.get('t_r') || '';

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

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
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

  // 전화번호 입력 화면
  if (needPhone && !err && t_r) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '20px',
      }}>
        <div style={{
          border: '1px solid #e5e7eb',
          width: '100%',
          maxWidth: '320px',
          backgroundColor: 'white',
          padding: '16px',
          borderRadius: '20px'
        }}>
          <img
            src={logo}
            alt="Tango Life Design"
            style={{
              display: 'block',
              margin: '20px auto 24px',
              width: '200px',
              height: 'auto'
            }}
          />
          <h2 style={{
            marginBottom: '10px',
            fontSize: '20px',
            color: '#444444',
          }}>탱고바디 결과 조회 </h2>

          <p style={{ 
            marginBottom: '24px',
            fontSize: '16px',
            color: '#444444'
          }}>탱고바디 측정 후 등록하셨던 전화번호를 입력하세요.</p>

          
          <form onSubmit={handleSubmit}>
            <input
              type="tel"
              placeholder="- 를 제외하고 010부터 전화번호를 입력해 주세요"
              value={mobile}
              onChange={handlePhoneChange}
              onKeyDown={handleKeyDown}
              maxLength="13"
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '14px',
                border: '1px solid #eeeeee',
                borderRadius: '8px',
                marginBottom: '12px',
                boxSizing: 'border-box'
              }}
            />
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '12px',
                background: 'linear-gradient(169.16deg, #A6A6A6 7.2%, #747474 49.16%, #5E5E5E 91.13%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '500',
                boxShadow: '-1px -1px 2px 0px #2D2D2D73 inset, 1px 1px 2px 0px #FFFFFF40 inset'
              }}
            >
            로그인
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) return <div style={{ textAlign: 'center', padding: '40px' }}>불러오는 중…</div>;
  if (err) return <div style={{color:'crimson', padding: '20px', textAlign: 'center'}}>에러: {err}</div>;
  if (!data) return <div style={{ textAlign: 'center', padding: '40px' }}>데이터가 없습니다.</div>;

  return <MobileBodyReport data={data} t_r={t_r} />;
}