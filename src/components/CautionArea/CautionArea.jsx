//Caution.jsx
import styles from "./CautionArea.module.css";
import bodyImage from "../../assets/bodyImage.svg";
import tip from "../../assets/tip.svg";
import graph from "../../assets/graph.svg";

export default function CautionArea({
  cautionAreas = [],
  footPressureImageUrl,
  kneeTrajectoryUrl,
  pelvisTrajectoryUrl,
  upperSummary,
  lowerSummary,
  footPressureStaticDesc,
  footPressureDynamicDesc,
  kneeTrajectoryDesc,
  pelvisTrajectoryDesc,
  riskUpperRiskLevel,
  riskUpperRangeLevel,
  riskLowerRiskLevel,
  riskLowerRangeLevel,
}) {
  const dotClass = (s) =>
    s === "danger" ? styles.danger : s === "warning" ? styles.warning : styles.normal;

  // 배경 제거 프록시 URL 생성 함수
  const getProxyImageUrl = (originalUrl) => {
    if (!originalUrl) return null;
    // API 이미지 URL을 프록시 경로로 변환
    // 예: https://api.example.com/image.jpg -> /api/proxy/remove-bg?url=https://api.example.com/image.jpg
    return `/api/proxy/remove-bg?url=${encodeURIComponent(originalUrl)}`;
  };

  // 위험도 레이블 반환 함수
  const getLevelText = (riskLevel, rangeLevel) => {
    const riskText =
      riskLevel === 0 ? "정상" : riskLevel === 1 ? "주의" : "위험";
    return `${riskText} ${rangeLevel}단계`;
  };

  const getLevelClass = (riskLevel) => {
    return riskLevel === 0
      ? styles.normal
      : riskLevel === 1
      ? styles.warn
      : styles.dang;
  };

  return (
    <div className={styles.caGrid}>
      {/* 1행-1열 : 주의 부위 */}
      <div className={`${styles.card} ${styles.cell1}`}>
        <div className={styles.body}>
          <div className={styles.sideLabel}>
            <span>좌측</span>
            <span>우측</span>
          </div>
          <div className={styles.human}>
            <img src={bodyImage} alt="신체" />
            {cautionAreas.map((a, i) => (
              <div
                key={i}
                className={`${styles.dot} ${dotClass(a.status)}`}
                style={{
                  top: typeof a.y === "number" ? `${a.y}%` : `${22 + (i % 4) * 18}%`,
                  left: typeof a.x === "number" ? `${a.x}%` : a.side === "left" ? "34%" : "66%",
                }}
                title={`${a.name ?? "부위"}: ${a.status}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 1행-2열 : 측정 결과 요약 */}
      <div className={`${styles.card} ${styles.cell2}`}>
        <div className={styles.body}>
          <div className={styles.textBox1}>
            <div className={styles.subHeader}>
              <h4 className={styles.sub}>상지 결과요약</h4>
              <span
                className={`${styles.levelTag} ${getLevelClass(riskUpperRiskLevel)}`}
              >
                {getLevelText(riskUpperRiskLevel, riskUpperRangeLevel)}
              </span>
            </div>
            <p className={styles.txt}>{upperSummary}</p>
          </div>
          <div className={styles.textBox2}>
            <div className={styles.subHeader}>
              <h4 className={styles.sub}>하지 결과요약</h4>
              <span
                className={`${styles.levelTag} ${getLevelClass(riskLowerRiskLevel)}`}
              >
                {getLevelText(riskLowerRiskLevel, riskLowerRangeLevel)}
              </span>
            </div>
            <p className={styles.txt}>{lowerSummary}</p>
          </div>
        </div>
      </div>

      {/* 1행-3열 : Tang Body Tip */}
      <div className={`${styles.card} ${styles.cell3}`}>
        <div className={styles.body}>
          <div className={styles.tipSmall}>*측정 기준 설명</div>
          <div className={styles.statusTable}>
            <div className={`${styles.status} ${styles.ok}`}>정상</div>
            <div className={`${styles.status} ${styles.warn}`}>주의</div>
            <div className={`${styles.status} ${styles.dang}`}>위험</div>
            <div className={styles.stateful}>상태 유지<br/>강화 권장</div>
            <div className={styles.descStrong}>제공되는<br/>맞춤 운동 권장</div>
            <div className={styles.desc}>전문가 상담<br/>권장</div>
          </div>
        </div>
      </div>

      {/* 2행-1열 : 족압 정적 측정 */}
      <div className={`${styles.card} ${styles.cell4}`}>
        <div className={styles.body}>
          <div className={styles.tabHeader}>족압 정적 측정</div>
          <div className={styles.imgBox}>
            {footPressureImageUrl ? (
              <img src={getProxyImageUrl(footPressureImageUrl)} alt="족압 정적" />
            ) : (
              <div className={styles.ph}>족압 이미지</div>
            )}
          </div>
          <p className={styles.imageCaption}>
            {footPressureStaticDesc || '좌우 체중 분포에 비율이 불균형이 있으며 앞쪽으로 쏠려있 집중 되어있습니다.'}
          </p>
        </div>
      </div>

      {/* 2행-2,3열 : 족압 동적 측정 */}
      <div className={`${styles.card} ${styles.cell5}`}>
        <div className={styles.body}>
          <div className={styles.rowLayout}>
            {/* 족압 동적 */}
            <div className={styles.imageGroup}>
              <div className={styles.tabHeader}>족압 동적 측정</div>
              <div className={styles.imgBox}>
                {footPressureImageUrl ? (
                  <img src={getProxyImageUrl(footPressureImageUrl)} alt="족압 동적" />
                ) : (
                  <div className={styles.ph}>족압 이미지</div>
                )}
              </div>
              <p className={styles.imageCaption}>
                {footPressureDynamicDesc || '우측 척추쪽만이나 배긴 원쪽 보성 기능성이 예상됩니다.'}
              </p>
            </div>

            {/* 무릎 이동 분석 */}
            <div className={styles.imageGroup}>
              <div className={styles.tabHeader}>무릎 이동 분석</div>
              <div className={styles.imgBox}>
                {kneeTrajectoryUrl ? (
                  <img src={getProxyImageUrl(kneeTrajectoryUrl)} alt="무릎 이동 궤적" />
                ) : (
                  <div className={styles.ph}>무릎 이동</div>
                )}
              </div>
              <p className={styles.imageCaption}>
                {kneeTrajectoryDesc || '우측 척추쪽만이나 배긴 원쪽 보성 기능성이 예상됩니다.'}
              </p>
            </div>

            {/* 골반 이동 분석 */}
            <div className={styles.imageGroup}>
              <div className={styles.tabHeader}>골반 이동 분석</div>
              <div className={styles.imgBox}>
                {pelvisTrajectoryUrl ? (
                  <img src={getProxyImageUrl(pelvisTrajectoryUrl)} alt="골반 이동 궤적" />
                ) : (
                  <div className={styles.ph}>골반 이동</div>
                )}
              </div>
              <p className={styles.imageCaption}>
                {pelvisTrajectoryDesc || '우측 척추쪽만이나 배긴 원쪽 보성 기능성이 예상됩니다.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}