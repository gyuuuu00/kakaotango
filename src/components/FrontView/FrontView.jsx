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
            shouldRotate={true} 
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
  // 랜드마크 없으면 그냥 이미지
  if (!Array.isArray(poseLandmarks) || poseLandmarks.length === 0) {
    return (
      <div className={styles.imageWrapper}>
        <img src={src} alt={alt} className={styles.fallbackImage} />
      </div>
    );
  }

  // 🔹 좌표계 크기 (세로 기준)
  const maxX = Math.max(...poseLandmarks.map((p) => p.sx));
  const maxY = Math.max(...poseLandmarks.map((p) => p.sy));

  const viewW = maxX;
  const viewH = maxY;

  // index → point 맵
  const pointMap = new Map();
  poseLandmarks.forEach((p) => {
    pointMap.set(p.index, p);
  });

  const getPoint = (idx) => {
    const p = pointMap.get(idx);
    return p && p.isActive ? p : null;
  };

  // 1) index 0 기준 전신 세로 라인 (#FF0000)
  const activePoints = poseLandmarks.filter((p) => p.isActive);
  const centerPoint = getPoint(0);
  let centerLine = null;
  if (centerPoint && activePoints.length > 0) {
    const minY = Math.min(...activePoints.map((p) => p.sy));
    const maxY2 = Math.max(...activePoints.map((p) => p.sy));
    centerLine = (
      <line
        x1={centerPoint.sx}
        y1={minY}
        x2={centerPoint.sx}
        y2={maxY2}
        className={styles.centerLine}
      />
    );
  }

  // 2) 가로 라인 (#01D5E5)
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

  // 3) 세로 라인 (#24AD6E) – 3개씩 연결
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

  // 🔹 이미지만 세로 좌표계에 맞게 -90도 회전
  // viewBox는 세로 기준 (viewW x viewH)
  // 가로로 누워 있는 비트맵을 세로 좌표계에 맞춰서 돌리려면
  // width/height를 바꾸고, (0, viewH) 기준으로 -90도 회전
  const imageWidth = shouldRotate ? viewH : viewW;
  const imageHeight = shouldRotate ? viewW : viewH;
  const imageTransform = shouldRotate
    ? `translate(0 ${viewH}) rotate(-90)` // 왼쪽으로 90도
    : undefined;

  return (
    <div className={styles.imageWrapper}>
      <svg
        className={styles.poseSvg}
        viewBox={`0 0 ${viewW} ${viewH}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* 🖼 비트맵만 회전 */}
        <image
          href={src}
          x="0"
          y="0"
          width={imageWidth}
          height={imageHeight}
          transform={imageTransform}
          preserveAspectRatio="xMidYMid meet"
        />

        {/* 🎯 좌표는 세로 기준 그대로 */}
        {centerLine}
        {horizontalLines}
        {verticalLines}
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
