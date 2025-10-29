import styles from './DetailedAnalysis.module.css';
import NormalArrow from '../../assets/state_arrow.svg';
import WarningArrow from '../../assets/state_arrow2.svg';
import DangerArrow from '../../assets/state_arrow3.svg';

function DetailedAnalysis({ detailedAnalysis }) {
  console.log('📊 DetailedAnalysis 받은 데이터:', detailedAnalysis);

  if (!detailedAnalysis) {
    return <div className={styles.noData}>상세 분석 데이터가 없습니다.</div>;
  }

  // 부위명 매핑
  const partNames = {
    neck: '목',
    shoulder: '어깨',
    elbow: '팔꿈치',
    hip: '골반',
    knee: '무릎',
    ankle: '발목'
  };

  // 상체/하체 분류
  const upperParts = ['neck', 'shoulder', 'elbow'];
  const lowerParts = ['hip', 'knee', 'ankle'];

  // 위험도 텍스트
  const getRiskText = (riskLevel, rangeLevel) => {
    const risk = parseInt(riskLevel);
    const range = parseInt(rangeLevel);
    
    if (risk === 0) return '정상';
    if (risk === 1) return '주의';
    if (risk === 2) return '위험';
    return '정상';
  };

  // 배지 스타일
  const getBadgeStyle = (riskLevel) => {
    const risk = parseInt(riskLevel);
    if (risk === 2) return { color: '#dc2626' };
    if (risk === 1) return {  color: '#d97706' };
    return { backgroundColor: '#f3f4f6', color: '#6b7280' };
  };

  // 화살표 위치 계산 (risk_level 기반)
  const calculatePosition = (riskLevel) => {
    const risk = parseInt(riskLevel);
    if (risk === 0) return 16.5;  // 정상 - 왼쪽
    if (risk === 1) return 50;    // 주의 - 중앙
    if (risk === 2) return 83.5;  // 위험 - 오른쪽
    return 16.5;
  };

  // 화살표 이미지 선택 (risk_level 기반)
  const getArrowImage = (riskLevel) => {
    const risk = parseInt(riskLevel);
    if (risk === 2) return DangerArrow;
    if (risk === 1) return WarningArrow;
    return NormalArrow;
  };

  // 활성 세그먼트 (risk_level 기반)
  const getActiveSegment = (riskLevel) => {
    const risk = parseInt(riskLevel);
    if (risk === 0) return 'normal';
    if (risk === 1) return 'warning';
    if (risk === 2) return 'danger';
    return 'normal';
  };

  // 텍스트 색상
  const getTextColor = (rangeLevel) => {
    const level = parseInt(rangeLevel);
    if (level === 3) return '#dc2626';
    if (level === 2) return '#d97706';
    return '#9ca3af';
  };

  // 부위별 렌더링
  const renderPart = (partKey, partData) => {
    if (!partData) return null;

    const items = Object.entries(partData);
    if (items.length === 0) return null;

    // 가장 높은 위험도 찾기
    const maxRiskLevel = Math.max(...items.map(([_, item]) => parseInt(item.risk_level || 0)));

    return (
      <div key={partKey} className={styles.categoryGroup}>
        <div className={styles.categoryCell}>
          <div className={styles.categoryBadge} style={getBadgeStyle(maxRiskLevel)}>
            {partNames[partKey]}
          </div>
          <div className={styles.categoryLevel} style={{ color: getTextColor(maxRiskLevel) }}>
            {getRiskText(maxRiskLevel)} {Math.max(...items.map(([_, item]) => parseInt(item.range_level || 1)))}단계
          </div>
        </div>

        <div className={styles.measureRows}>
          {items.map(([itemKey, item]) => {
            const activeSegment = getActiveSegment(item.risk_level);
            const arrowImage = getArrowImage(item.risk_level);
            const position = calculatePosition(item.risk_level);

            return (
              <div key={itemKey} className={styles.measureRow}>
                <div className={styles.measureText}>{item.measure_unit}</div>
                <div className={styles.measureStatus}>
                  <div className={styles.statusBar}>
                    <div className={`${styles.barSegment} ${activeSegment === 'normal' ? styles.active : ''}`} data-status="normal"></div>
                    <div className={`${styles.barSegment} ${activeSegment === 'warning' ? styles.active : ''}`} data-status="warning"></div>
                    <div className={`${styles.barSegment} ${activeSegment === 'danger' ? styles.active : ''}`} data-status="danger"></div>

                    <img 
                      src={arrowImage}
                      alt="status arrow"
                      className={styles.statusIndicator}
                      style={{ left: `${position}%` }}
                    />
                  </div>
                  <div className={styles.stageLabels}>
                    <span className={styles.stageLabel} style={{ 
                      position: 'absolute',
                      left: `${position}%`,
                      transform: 'translateX(-50%)',
                      transition: 'left 0.3s ease'
                    }}>{item.range_level || 1}단계</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {/* 상체분석 */}
        <div className={styles.section}>
          <div className={styles.tableHeader}>
            <div className={styles.colCategory}>상체분석</div>
            <div className={styles.colMeasure}>측정 기준</div>
            <div className={styles.colStatus}>
              <span className={styles.statusLabel} style={{color:'#9ca3af'}}>정상</span>
              <span className={styles.arrowIcon}>▶</span>
              <span className={styles.statusLabel} style={{color:'#d97706'}}>주의</span>
              <span className={styles.arrowIcon}>▶</span>
              <span className={styles.statusLabel} style={{color:'#dc2626'}}>위험</span>
            </div>
          </div>

          <div className={styles.tableBody}>
            {upperParts.map(part => renderPart(part, detailedAnalysis[part]))}
          </div>
        </div>

        {/* 하체분석 */}
        <div className={styles.section}>
          <div className={styles.tableHeader}>
            <div className={styles.colCategory}>하체분석</div>
            <div className={styles.colMeasure}>측정 기준</div>
            <div className={styles.colStatus}>
              <span className={styles.statusLabel} style={{color:'#9ca3af'}}>정상</span>
              <span className={styles.arrowIcon}>▶</span>
              <span className={styles.statusLabel} style={{color:'#d97706'}}>주의</span>
              <span className={styles.arrowIcon}>▶</span>
              <span className={styles.statusLabel} style={{color:'#dc2626'}}>위험</span>
            </div>
          </div>

          <div className={styles.tableBody}>
            {lowerParts.map(part => renderPart(part, detailedAnalysis[part]))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailedAnalysis;