import React, { useState, useEffect } from 'react';
import styles from './FrontView.module.css';

function FrontView() {
  const [frontData, setFrontData] = useState(null);
  const [loading, setLoading] = useState(true);

  // URL에서 t_r 가져오기
  const sp = new URLSearchParams(window.location.search);
  const t_r = decodeURIComponent(sp.get('t_r') || '').replace(/\s+/g, '');

  useEffect(() => {
    const fetchFrontData = async () => {
      try {
        const response = await fetch(
          `https://gym.tangoplus.co.kr/admin_api/kakao-results/front?t_r=${encodeURIComponent(t_r)}`
        );
        const result = await response.json();
        setFrontData(result.data);
      } catch (error) {
        console.error('정면측정 데이터 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    if (t_r) {
      fetchFrontData();
    }
  }, [t_r]);

  if (loading) {
    return <div className={styles.loading}>로딩 중...</div>;
  }

  if (!frontData) {
    return <div className={styles.noData}>데이터를 불러올 수 없습니다.</div>;
  }

  return (
    <div className={styles.container}>
      {/* 상단 이미지 영역 */}
      <div className={styles.imageSection}>
        <div className={styles.imageWrapper}>
          <img 
            src={frontData.static_front.measure_server_file_name} 
            alt="정면측정" 
            className={styles.measureImage}
          />
          <p className={styles.imageLabel}>정면측정</p>
        </div>
        
        <div className={styles.imageWrapper}>
          <img 
            src={frontData.static_elbow.measure_server_file_name} 
            alt="정면_발끝측정" 
            className={styles.measureImage}
          />
          <p className={styles.imageLabel}>정면_발끝측정</p>
        </div>
      </div>

      {/* 측정 데이터 리스트 */}
      <div className={styles.detailList}>
        {frontData.static_front.detail_data.map((item, index) => (
          <DetailItem key={`front-${index}`} data={item} />
        ))}
        {frontData.static_elbow.detail_data.map((item, index) => (
          <DetailItem key={`elbow-${index}`} data={item} />
        ))}
      </div>
    </div>
  );
}

function DetailItem({ data }) {
  const getRiskColor = (riskLevel) => {
    switch(riskLevel) {
      case 1: return '#FFA73A';
      case 2: return '#FF4A4A';
      default: return '#bbbbbb';
    }
  };

//   const getRiskLabel = (riskLevel) => {
//     switch(riskLevel) {
//       case 1: return '주의';
//       case 2: return '위험';
//       default: return '정상';
//     }
//   };

  const getRiskWidth = (riskLevel) => {
    switch(riskLevel) {
      case 0: return '30%';  // 정상
      case 1: return '60%';  // 주의
      default: return '95%'; //위험
    }
  };

    const getRangeText = (rangeLevel) => {
    return `${rangeLevel}단계`;
  };

  return (
    <div className={styles.detailItem}>
      {/* 상단 헤더 영역 */}
      <div className={styles.topSection}>
        <div className={styles.leftInfo}>
          <span className={styles.headerLabel}>정면측정</span>
          <span className={styles.measureUnit}>{data.measure_unit}</span>
        </div>
        
        <div className={styles.centerInfo}>
          <div className={styles.dataValue}>{Math.trunc(data.data)}</div>         
        </div>

        {/* 프로그레스바 */}
        <div className={styles.rightProgressSection}>
          <div className={styles.levelLabels}>
            <span>정상</span>
            <span>주의</span>
            <span>위험</span>
          </div>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill}
              style={{ 
                width: getRiskWidth(data.risk_level),
                backgroundColor: getRiskColor(data.risk_level)
              }}
            />
          </div>
        </div>
      </div>

      {/* 하단 설명 영역 */}
      <div className={styles.bottomSection}>
        <p className={styles.ment}>
          {data.ment || data.ment_all}
        </p>
      </div>
    </div>
  );
}
export default FrontView;