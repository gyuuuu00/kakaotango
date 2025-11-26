// src/components/DetailedAnalysis/DetailedAnalysis.jsx
import styles from './DetailedAnalysis.module.css';
import NormalArrow from '../../assets/state_arrow.svg';
import WarningArrow from '../../assets/state_arrow2.svg';
import DangerArrow from '../../assets/state_arrow3.svg';

function DetailedAnalysis({ detailedAnalysis, summaryData }) {
  console.log('📊 전체 detailedAnalysis 키:', Object.keys(detailedAnalysis || {}));
  console.log('📊 summaryData:', summaryData);

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
    ankle: '발목',
  };

  // 측정 기준 이름 매핑
  const measureNameMap = {
    // 목
    turtle_neck: '거북목',
    scoliosis: '경추 측만',
    side_neck_balance: '측면 목 근육',

    // 어깨
    shoulder_tilit: '어깨 기울기',
    frozen_shoulder: '오십견',
    shoulder_impingement: '어깨 충돌 증후군',

    // 팔꿈치
    bicep_tension: '이두근 긴장',
    elbow_disorder: '팔꿈치 질환',
    elbow_muscle_tension: '팔꿈치 아래팔 \n 근육 긴장',

    // 골반
    hip_tilit: '골반 기울기',
    hip_disorder: '골반 질환',
    hip_knee_tilit: '골반과 무릎 \n기울기(측면)',

    // 무릎
    knee_angle: '골반 무릎 각도 \n (정면)',
    knee_disorder: '무릎 질환\n(OHS)',
    hip_knee_ankle_tilit: '골반, 무릎, 발목 \n기울기(OHS)',

    // 발목
    ankle_angle: '발목 각도',
    ankle_disorder: '좌우 무게 균형',
    left_right_balance: '좌우 무게 균형',
    uppper_lower_balance: '상하 무게 균형',
  };

  // 상체/하체 분류
  const upperParts = ['neck', 'shoulder', 'elbow'];
  const lowerParts = ['hip', 'knee', 'ankle'];

  // 값에 따라 화살표 위치 계산
  const calculatePosition = (riskLevel) => {
    if (riskLevel === 0) return 16.5; // 정상
    if (riskLevel === 1) return 50; // 주의
    return 83.5; // 위험
  };

  // 레벨/상태에 따른 부위명 색상 (카테고리 배지)
  const getBadgeStyle = (level) => {
    if (!level) return {};
    if (level.includes('위험')) return { color: '#ff0000' };
    if (level.includes('주의')) return { color: '#FF8C00' };
    return { color: '#7e7e7e' };
  };

  // 레벨에 따른 스타일 (border + 색상)
  const getLevelStyle = (level) => {
    if (!level) {
      return {
        backgroundColor: '#7E7E7E',
        color: '#ffffff',
        border: '1px solid #7E7E7E',
        borderRadius: '8px',
        padding: '2px 8px',
      };
    }

    if (level.includes('위험')) {
      return {
        backgroundColor: '#ff5252',
        color: '#ffffff',
        border: '1px solid #ff5252',
        borderRadius: '8px',
        padding: '2px 8px',
      };
    }

    if (level.includes('주의')) {
      return {
        backgroundColor: '#FFA73A',
        color: '#ffffff',
        border: '1px solid #FFA73A',
        borderRadius: '8px',
        padding: '2px 8px',
      };
    }

    return {
      backgroundColor: '#7E7E7E',
      color: '#ffffff',
      border: '1px solid #7E7E7E',
      borderRadius: '8px',
      padding: '2px 8px',
    };
  };

  // 위험도 텍스트
  const getRiskText = (riskLevel) => {
    const risk = parseInt(riskLevel, 10);
    if (risk === 0) return '정상';
    if (risk === 1) return '주의';
    if (risk === 2) return '위험';
    return '정상';
  };

  // 부위별 렌더링
  const renderPart = (partKey, partData) => {
    if (!partData) return null;

    const items = Object.entries(partData);
    if (items.length === 0) return null;

    // ✅ summaryData에서 부위별 risk_level, range_level 가져오기
    const riskKey = `risk_level_${partKey}`;
    const rangeKey = `range_level_${partKey}`;

    const categoryRiskLevel = parseInt(summaryData?.[riskKey] || 0, 10);
    const categoryRangeLevel = parseInt(summaryData?.[rangeKey] || 1, 10);

    const levelText = `${getRiskText(categoryRiskLevel)} ${categoryRangeLevel}단계`;

    return (
      <div key={partKey} className={styles.categoryGroup}>
        <div
          className={`${styles.categoryCell} ${
            partKey === 'elbow' || partKey === 'ankle' ? styles.noBorderBottom : ''
          }`}
        >
          <div
            className={styles.categoryBadge}
            style={getBadgeStyle(levelText)}
          >
            {partNames[partKey]}
          </div>
          {levelText && (
            <div
              className={styles.categoryLevel}
              style={getLevelStyle(levelText)}
            >
              {levelText}
            </div>
          )}
        </div>

        <div className={styles.measureRows}>
          {items.map(([itemKey, item]) => {
            const riskLevel = parseInt(item.risk_level || 0, 10);
            const rangeLevel = parseInt(item.range_level || 1, 10);

            const arrowImage =
              riskLevel === 2
                ? DangerArrow
                : riskLevel === 1
                ? WarningArrow
                : NormalArrow;

            const position = calculatePosition(riskLevel);
            const textColor =
              riskLevel === 0
                ? '#CDCDCD'
                : riskLevel === 1
                ? '#FF8C00'
                : '#FF0000';

            return (
              <div key={itemKey} className={styles.measureRow}>
                <div className={styles.measureText}>
                  {measureNameMap[itemKey] || item.measure_unit}
                </div>
                <div className={styles.measureStatus}>
                  <div className={styles.statusBar}>
                    <div
                      className={`${styles.barSegment} ${
                        riskLevel === 0 ? styles.active : ''
                      }`}
                      data-status="normal"
                    ></div>
                    <div
                      className={`${styles.barSegment} ${
                        riskLevel === 1 ? styles.active : ''
                      }`}
                      data-status="warning"
                    ></div>
                    <div
                      className={`${styles.barSegment} ${
                        riskLevel === 2 ? styles.active : ''
                      }`}
                      data-status="danger"
                    ></div>

                    <img
                      src={arrowImage}
                      alt="status arrow"
                      className={styles.statusIndicator}
                      style={{ left: `${position}%` }}
                    />
                  </div>
                  <span
                    className={styles.statusValue}
                    style={{ left: `${position}%`, color: textColor }}
                  >
                    {rangeLevel}단계
                  </span>
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
              <span
                className={styles.statusLabel}
                style={{ left: '14%', color: '#d9d9d9' }}
              >
                정상
              </span>

              <span
                className={styles.statusLabel}
                style={{ left: '50%', color: '#ff8c00' }}
              >
                주의
              </span>

              <span
                className={styles.statusLabel}
                style={{ left: '83.5%', color: '#F11212' }}
              >
                위험
              </span>
            </div>
          </div>

          <div className={styles.tableBody}>
            {upperParts.map((part) =>
              renderPart(part, detailedAnalysis[part]),
            )}
          </div>
        </div>

        {/* 하체분석 */}
        <div className={styles.section}>
          <div className={styles.tableHeader}>
            <div className={styles.colCategory}>하체분석</div>
            <div className={styles.colMeasure}>측정 기준</div>
            <div className={styles.colStatus}>
              <span
                className={styles.statusLabel}
                style={{ left: '16.5%', color: '#d9d9d9' }}
              >
                정상
              </span>

              <span
                className={styles.statusLabel}
                style={{ left: '50%', color: '#ff8c00' }}
              >
                주의
              </span>

              <span
                className={styles.statusLabel}
                style={{ left: '83.5%', color: '#F11212' }}
              >
              위험
              </span>
            </div>
          </div>

          <div className={styles.tableBody}>
            {lowerParts.map((part) =>
              renderPart(part, detailedAnalysis[part]),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailedAnalysis;
