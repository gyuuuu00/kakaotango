import React from 'react';
import styles from './SquatView.module.css';

function SquatView({ data, shouldRotate }) {
  console.log('📊 SquatView 받은 데이터:', data);

  if (!data) {
    return <div className={styles.noData}>데이터를 불러올 수 없습니다.</div>;
  }

  // data 구조 확인 및 안전하게 접근
  if (!data.squat) {
    return <div className={styles.noData}>동적측정 데이터 로딩 중...</div>;
  }

  return (
    <div className={styles.container}>
      {/* 상단 영상 영역 */}
      <div className={styles.videoSection}>
        <div className={styles.videoWrapper}>
          <video 
            src={data.squat.measure_server_file_name}
            controls
            // 화면 전환 안할땐 ShouldRotate false로 설정
            className={`${styles.measureVideo} ${shouldRotate ? styles.rotated : ''}`}
            playsInline
          >
            동영상을 재생할 수 없습니다.
          </video>
          <p className={styles.videoLabel}>스쿼트 측정</p>
        </div>
      </div>

      {/* 측정 데이터 리스트 */}
      <div className={styles.detailList}>
        {data.squat.detail_data?.map((item, index) => (
          <DetailItem key={`squat-${index}`} data={item} />
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

  const getRiskWidth = (riskLevel) => {
    switch(riskLevel) {
      case 0: return '30%';  // 정상
      case 1: return '60%';  // 주의
      default: return '95%'; // 위험
    }
  };

  return (
    <div className={styles.detailItem}>
      {/* 상단 헤더 영역 */}
      <div className={styles.topSection}>
        <div className={styles.leftInfo}>
          <span className={styles.headerLabel}>동적측정</span>
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
        <p className={styles.ment}>{data.ment || data.ment_all}</p>
      </div>
    </div>
  );
}

export default SquatView;