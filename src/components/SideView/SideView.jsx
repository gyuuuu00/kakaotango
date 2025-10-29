import React from 'react';
import styles from './SideView.module.css';

function SideView({ data }) {
  console.log('📊 SideView 받은 데이터:', data);
  console.log('📊 data 타입:', typeof data);
  console.log('📊 data.left_side:', data?.left_side);
  console.log('📊 data.right_side:', data?.right_side);
  console.log('📊 Object.keys(data):', data ? Object.keys(data) : 'data is null/undefined');

  if (!data) {
    return <div className={styles.noData}>데이터를 불러올 수 없습니다.</div>;
  }

  // data 구조 확인 및 안전하게 접근
  const leftSide = data.left_side;
  const rightSide = data.right_side;
  
  if (!leftSide || !rightSide) {
    console.error('❌ left_side 또는 right_side 데이터 없음:', data);
    console.error('❌ leftSide:', leftSide);
    console.error('❌ rightSide:', rightSide);
    return <div className={styles.noData}>측면 데이터가 없습니다.</div>;
  }

  return (
    <div className={styles.container}>
      {/* 상단 이미지 영역 */}
      <div className={styles.imageSection}>
        {leftSide.measure_server_file_name && (
          <div className={styles.imageWrapper}>
            <img 
              src={leftSide.measure_server_file_name} 
              alt="왼쪽측면" 
              className={styles.measureImage}
            />
            <p className={styles.imageLabel}>왼쪽측면</p>
          </div>
        )}
        
        {rightSide.measure_server_file_name && (
          <div className={styles.imageWrapper}>
            <img 
              src={rightSide.measure_server_file_name} 
              alt="오른쪽측면" 
              className={styles.measureImage}
            />
            <p className={styles.imageLabel}>오른쪽측면</p>
          </div>
        )}
      </div>

      {/* 측정 데이터 리스트 */}
      <div className={styles.detailList}>
        {Array.isArray(leftSide.detail_data) && leftSide.detail_data.map((item, index) => (
          <DetailItem key={`left-${index}`} data={item} side="왼쪽측면" />
        ))}
        {Array.isArray(rightSide.detail_data) && rightSide.detail_data.map((item, index) => (
          <DetailItem key={`right-${index}`} data={item} side="오른쪽측면" />
        ))}
      </div>
    </div>
  );
}

function DetailItem({ data, side }) {
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
          <span className={styles.headerLabel}>{side}</span>
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
        <p className={styles.mentAll}>{data.ment_all}</p>
      </div>
    </div>
  );
}

export default SideView;