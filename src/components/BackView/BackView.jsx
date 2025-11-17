import styles from './BackView.module.css';

function BackView({ data, cameraOrientation }) {
  console.log('📊 BackView 받은 데이터:', data);

  if (!data) {
    return <div className={styles.noData}>데이터를 불러올 수 없습니다.</div>;
  }


  if (!data.back || !data.back_sit) {
    return <div className={styles.noData}>후면 데이터 로딩 중...</div>;
  }

  const shouldRotate = cameraOrientation === 1;

  return (
    <div className={styles.container}>
      {/* 상단 이미지 영역 */}
      <div className={styles.imageSection}>
        <div className={styles.imageItem}>
          <PoseImageOverlay
            src={data.back.measure_server_file_name}
            alt="후면측정"
            shouldRotate={shouldRotate}
            poseLandmarks={data.back.pose_landmark}
          />
          <p className={styles.imageLabel}>후면측정</p>
        </div>

        <div className={styles.imageItem}>
          <PoseImageOverlay
            src={data.back_sit.measure_server_file_name}
            alt="후면_앉은측정"
            shouldRotate={shouldRotate}
            poseLandmarks={data.back_sit.pose_landmark}
          />
          <p className={styles.imageLabel}>후면_앉은측정</p>
        </div>
      </div>

      {/* 측정 데이터 리스트 */}
      <div className={styles.detailList}>
        {data.back.detail_data?.map((item, index) => (
          <DetailItem key={`back-${index}`} data={item} />
        ))}
        {data.back_sit.detail_data?.map((item, index) => (
          <DetailItem key={`sit-${index}`} data={item} />
        ))}
      </div>
    </div>
  );
}

function PoseImageOverlay({ src, alt, shouldRotate, poseLandmarks = [] }) {
  // 🔹 랜드마크 작업 모두 주석처리 - 이미지만 표시
  // camera_orientation: 0이면 그대로, 1이면 왼쪽으로 90도 회전 (9:16)

  const wrapperStyle = shouldRotate
    ? { aspectRatio: '16 / 9' }
    : {};

  const imageStyle = shouldRotate
    ? { transform: 'rotate(-90deg)', maxHeight: '100%' }  // 왼쪽으로 90도
    : {};

  return (
    <div className={styles.imageWrapper} style={wrapperStyle}>
      <img
        src={src}
        alt={alt}
        className={styles.measureImage}
        style={imageStyle}
      />
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
          <span className={styles.headerLabel}>후면측정</span>
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

export default BackView;