import React, { useState, useEffect } from 'react';
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
        <div className={styles.imageItem}>
          <PoseImageOverlay
            src={frontData.static_front.measure_server_file_name}
            alt="정면측정"
            shouldRotate={shouldRotate} 
            poseLandmarks={frontData.static_front.pose_landmark}
          />
          <p className={styles.imageLabel}>정면측정</p>
        </div>

        <div className={styles.imageItem}>
          <PoseImageOverlay
            src={frontData.static_elbow.measure_server_file_name}
            alt="정면_발끝측정"
            shouldRotate={shouldRotate}
            poseLandmarks={frontData.static_elbow.pose_landmark}
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
function PoseImageOverlay({ src, alt, shouldRotate, poseLandmarks = [] }) {
  const [imgSize, setImgSize] = useState(null);

  // 1) 이미지 원본 크기 가져오기 (1194 x 671 이런 값)
  useEffect(() => {
    if (!src) return;
    const img = new Image();
    img.onload = () => {
      setImgSize({ width: img.naturalWidth, height: img.naturalHeight });
      console.log('🖼 원본 크기:', img.naturalWidth, img.naturalHeight);
    };
    img.src = src;
  }, [src]);

  // 랜드마크 없거나, 아직 이미지 크기 못 읽었으면 그냥 이미지만
  if (!Array.isArray(poseLandmarks) || poseLandmarks.length === 0 || !imgSize) {
    return (
      <div className={styles.imageWrapper}>
        <img src={src} alt={alt} className={styles.fallbackImage} />
      </div>
    );
  }

  const { width: imgW, height: imgH } = imgSize;

  // index → point 맵
  const pointMap = new Map();
  poseLandmarks.forEach((p) => {
    pointMap.set(p.index, p);
  });

  const getPoint = (idx) => {
    const p = pointMap.get(idx);
    return p && p.isActive ? p : null;
  };

  const activePoints = poseLandmarks.filter((p) => p.isActive);

  // 1) 가운데 전신 라인 (index 0 기준)
  const centerPoint = getPoint(0);
  let centerLine = null;
  if (centerPoint && activePoints.length > 0) {
    const minY = Math.min(...activePoints.map((p) => p.sy));
    const maxY = Math.max(...activePoints.map((p) => p.sy));
    centerLine = (
      <line
        x1={centerPoint.sx}
        y1={minY}
        x2={centerPoint.sx}
        y2={maxY}
        className={styles.centerLine}
      />
    );
  }

  // 2) 가로 라인들
  const horizontalPairs = [
    [7, 8],
    [11, 12],
    [13, 14],
    [15, 16],
    [23, 24],
    [25, 26],
    [27, 28],
    [31, 32],
  ];

  const horizontalLines = horizontalPairs.map(([a, b], i) => {
    const p1 = getPoint(a);
    const p2 = getPoint(b);
    if (!p1 || !p2) return null;
    return (
      <line
        key={`h-${i}`}
        x1={p1.sx}
        y1={p1.sy}
        x2={p2.sx}
        y2={p2.sy}
        className={styles.horizontalLine}
      />
    );
  });

  // 3) 세로 라인들
  const verticalTriples = [
    [12, 14, 16],
    [11, 13, 15],
    [23, 25, 27],
    [24, 26, 28],
  ];

  const verticalLines = verticalTriples.flatMap((triple, tIndex) => {
    const [a, b, c] = triple;
    const pA = getPoint(a);
    const pB = getPoint(b);
    const pC = getPoint(c);
    const segs = [];

    if (pA && pB) {
      segs.push(
        <line
          key={`v-${tIndex}-0`}
          x1={pA.sx}
          y1={pA.sy}
          x2={pB.sx}
          y2={pB.sy}
          className={styles.verticalLine}
        />,
      );
    }
    if (pB && pC) {
      segs.push(
        <line
          key={`v-${tIndex}-1`}
          x1={pB.sx}
          y1={pB.sy}
          x2={pC.sx}
          y2={pC.sy}
          className={styles.verticalLine}
        />,
      );
    }
    return segs;
  });

  // 이미지+선 전체 회전 (필요할 때만)
  const cx = imgW / 2;
  const cy = imgH / 2;
  const groupTransform = shouldRotate ? `rotate(-90 ${cx} ${cy})` : undefined;

  return (
    <div className={styles.imageWrapper}>
      <svg
        className={styles.poseSvg}
        viewBox={`0 0 ${imgW} ${imgH}`}   // 🔥 원본 크기 기준 좌표계
        preserveAspectRatio="xMidYMid meet"
      >
        <g transform={groupTransform}>
          {/* 원본 이미지 */}
          <image
            href={src}
            x="0"
            y="0"
            width={imgW}
            height={imgH}
            preserveAspectRatio="none"   // 좌표와 1:1로 맞추기
          />

          {/* 그 위에 선 */}
          {centerLine}
          {horizontalLines}
          {verticalLines}
        </g>
      </svg>
    </div>
  );
}


function DetailItem({ data }) {
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
        return '30%';
      case 1:
        return '60%';
      default:
        return '95%';
    }
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
                backgroundColor: getRiskColor(data.risk_level),
              }}
            />
          </div>
        </div>
      </div>

      <div className={styles.bottomSection}>
        <p className={styles.ment}>{data.ment || data.ment_all}</p>
      </div>
    </div>
  );
}

export default FrontView;
