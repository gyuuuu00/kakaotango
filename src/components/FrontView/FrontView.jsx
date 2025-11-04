import React from 'react';
import styles from './FrontView.module.css';

function FrontView({ data, shouldRotate }) {
  if (!data) {
    return <div className={styles.loading}>로딩 중...</div>;
  }

  const frontData = data;

  if (!frontData.static_front || !frontData.static_elbow) {
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
            className={`${styles.measureImage} ${shouldRotate ? styles.rotated : ''}`}
          />
          <p className={styles.imageLabel}>정면측정</p>
        </div>
        
        <div className={styles.imageWrapper}>
          <img 
            src={frontData.static_elbow.measure_server_file_name} 
            alt="정면_발끝측정" 
            className={`${styles.measureImage} ${shouldRotate ? styles.rotated : ''}`}
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

  const getRiskWidth = (riskLevel) => {
    switch(riskLevel) {
      case 0: return '30%';
      case 1: return '60%';
      default: return '95%';
    }
  };

  const getRangeText = (rangeLevel) => {
    return `${rangeLevel}단계`;
  };

  return (
    <div className={styles.detailItem}>
      <div className={styles.topSection}>
        <div className={styles.leftInfo}>
          <span className={styles.headerLabel}>정면측정</span>
          <span className={styles.measureUnit}>{data.measure_unit}</span>
        </div>
        
        <div className={styles.centerInfo}>
          <div className={styles.dataValue}>{Math.trunc(data.data)}</div>         
        </div>

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

      <div className={styles.bottomSection}>
        <p className={styles.ment}>
          {data.ment || data.ment_all}
        </p>
      </div>
    </div>
  );
}

export default FrontView;