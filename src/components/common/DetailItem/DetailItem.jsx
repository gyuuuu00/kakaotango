import styles from './DetailItem.module.css';

function DetailItem({ data, label }) {
  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 1:
        return '#FFA73A';
      case 2:
        return '#FF4A4A';
      default:
        return '#bbbbbb';
    }
  };

  const getRiskWidth = (riskLevel) => {
    switch (riskLevel) {
      case 0:
        return '30.33%';
      case 1:
        return '66%';
      default:
        return '98%';
    }
  };

  return (
    <div className={styles.detailItem}>
      <div className={styles.topSection}>
        <div className={styles.leftInfo}>
          <div className={styles.headerRow}>
            <span className={styles.headerLabel}>{label}</span>
            {data.left_right !== undefined && (
              <span className={styles.sideBadge}>
                {data.left_right === 0 ? '좌측' : '우측'}
              </span>
            )}
          </div>
          <span className={styles.measureUnit}>{data.measure_unit}</span>
        </div>

        <div className={styles.centerInfo}>
          <div className={styles.dataValue}>
            {(Math.trunc(data.data * 10) / 10).toFixed(1)}
          </div>
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
                backgroundColor: getRiskColor(data.risk_level),
              }}
            >
              <span className={styles.rangeLevel}>{data.range_level}단계</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.bottomSection}>
        <p className={styles.ment}>{data.ment || data.ment_all}</p>
      </div>
    </div>
  );
}

export default DetailItem;
