import React, { useState, useEffect, useRef } from 'react';
import styles from './BackView.module.css';

function BackView({ data, shouldRotate }) {
  console.log('📊 BackView 받은 데이터:', data);

  if (!data) {
    return <div className={styles.noData}>데이터를 불러올 수 없습니다.</div>;
  }


  if (!data.back || !data.back_sit) {
    return <div className={styles.noData}>후면 데이터 로딩 중...</div>;
  }

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
  const wrapperRef = useRef(null);
  const imgRef = useRef(null);
  const [layout, setLayout] = useState(null);

  // wrapper / img 실제 위치·크기 측정
  useEffect(() => {
    const update = () => {
      if (!wrapperRef.current || !imgRef.current) return;

      const wRect = wrapperRef.current.getBoundingClientRect();
      const iRect = imgRef.current.getBoundingClientRect();

      setLayout({
        wrapperWidth: wRect.width,
        wrapperHeight: wRect.height,
        imageWidth: iRect.width,
        imageHeight: iRect.height,
        // 이미지가 wrapper 안에서 어디에 놓였는지 (여백 포함)
        offsetX: iRect.left - wRect.left,
        offsetY: iRect.top - wRect.top,
      });
    };

    update();

    window.addEventListener('resize', update);

    const imgEl = imgRef.current;
    if (imgEl && !imgEl.complete) {
      imgEl.addEventListener('load', update);
    }

    return () => {
      window.removeEventListener('resize', update);
      if (imgEl && !imgEl.complete) {
        imgEl.removeEventListener('load', update);
      }
    };
  }, []);

  // 랜드마크 없으면 그냥 이미지만
  if (!Array.isArray(poseLandmarks) || poseLandmarks.length === 0) {
    return (
      <div className={styles.imageWrapper} ref={wrapperRef}>
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          className={`${styles.measureImage} ${shouldRotate ? styles.rotated : ''}`}
        />
      </div>
    );
  }

  const maxSx = Math.max(...poseLandmarks.map((p) => p.sx));
  const maxSy = Math.max(...poseLandmarks.map((p) => p.sy));

  const getPos = (p) => {
    if (!layout || !maxSx || !maxSy) return { x: 0, y: 0 };

    const {
      imageWidth,
      imageHeight,
      offsetX,
      offsetY,
    } = layout;

    // 좌표는 회전 안 함 (원본 그대로)
    const transformedSx = p.sx;
    const transformedSy = p.sy;
    const currentMaxSx = maxSx;
    const currentMaxSy = maxSy;

    // object-fit: cover 와 동일한 스케일 계산 (이미지 영역 기준)
    const scale = Math.max(
      imageWidth / currentMaxSx,
      imageHeight / currentMaxSy
    );

    const displayW = currentMaxSx * scale;
    const displayH = currentMaxSy * scale;

    // cover 때문에 잘려나간 부분 (양쪽 / 위아래)
    const croppedOffsetX = (displayW - imageWidth) / 2;
    const croppedOffsetY = (displayH - imageHeight) / 2;

    // 원본(sx, sy) → 스케일 → 잘린 만큼 보정 → wrapper 좌표로 이동
    const x = offsetX + transformedSx * scale - croppedOffsetX;
    const y = offsetY + transformedSy * scale - croppedOffsetY;

    return { x, y };
  };

  // index → point 맵
  const pointMap = new Map();
  poseLandmarks.forEach((p) => {
    pointMap.set(p.index, p);
  });

  const getPoint = (idx) => {
    const p = pointMap.get(idx);
    return p && p.isActive ? p : null;
  };

  // 이미지 타입에 따라 다른 라인 구성
  const isSit = alt === "후면_앉은측정";

  // 1) index 0 기준 중앙 세로선 (#FF0000) - 모든 타입에 표시
  const centerPoint = getPoint(0);

  // 2) 앉은 측정: 흰색 사각형 + 골반선
  // 전신 측정: 기존 가로선 + 세로선
  const horizontalPairs = !isSit ? [
    [7, 8],
    [11, 12],
    [13, 14],
    [15, 16],
    [23, 24],
    [25, 26],
    [27, 28],
    [31, 32],
  ] : [
    [23, 24],  // 골반 가로선
  ];

  // 3) 세로선들
  const verticalTriples = !isSit ? [
    [12, 14, 16],
    [11, 13, 15],
    [23, 25, 27],
    [24, 26, 28],
  ] : [];

  // 4) 앉은 측정 전용: 흰색 사각형 라인
  const sitRectangleLines = isSit ? [
    [11, 12],  // 어깨 가로
    [12, 14],  // 오른쪽 어깨-팔꿈치
    [14, 24],  // 오른쪽 팔꿈치-골반
    [24, 23],  // 골반 가로
    [23, 13],  // 왼쪽 골반-팔꿈치
    [13, 11],  // 왼쪽 팔꿈치-어깨
  ] : [];

  return (
    <div className={styles.imageWrapper} ref={wrapperRef}>
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className={`${styles.measureImage} ${shouldRotate ? styles.rotated : ''}`}
      />

      {layout && (
        <svg
          className={styles.landmarkOverlay}
        >
          {/* 빨간 중앙 세로선 (코 중심, index 0) */}
          {centerPoint && (
            <line
              x1={getPos(centerPoint).x}
              y1={0}
              x2={getPos(centerPoint).x}
              y2={layout.wrapperHeight}
              stroke="#FF0000"
              strokeWidth="1"
            />
          )}

          {/* 앉은 측정: 초록색 사각형 */}
          {sitRectangleLines.map(([idx1, idx2], i) => {
            const p1 = getPoint(idx1);
            const p2 = getPoint(idx2);
            if (!p1 || !p2) return null;

            const pos1 = getPos(p1);
            const pos2 = getPos(p2);

            return (
              <line
                key={`sit-rect-${i}`}
                x1={pos1.x}
                y1={pos1.y}
                x2={pos2.x}
                y2={pos2.y}
                stroke="#24AD6E"
                strokeWidth="1"
              />
            );
          })}

          {/* 전신 측정: 청록색 가로선들 */}
          {!isSit && horizontalPairs.map(([idx1, idx2], i) => {
            const p1 = getPoint(idx1);
            const p2 = getPoint(idx2);
            if (!p1 || !p2) return null;

            const pos1 = getPos(p1);
            const pos2 = getPos(p2);

            return (
              <line
                key={`h-line-${i}`}
                x1={pos1.x}
                y1={pos1.y}
                x2={pos2.x}
                y2={pos2.y}
                stroke="#01D5E5"
                strokeWidth="1"
              />
            );
          })}

          {/* 전신 측정: 녹색 세로선들 (3개씩 연결) */}
          {verticalTriples.map((indices, i) => {
            const points = indices.map(idx => getPoint(idx)).filter(Boolean);
            if (points.length < 2) return null;

            return (
              <g key={`v-line-${i}`}>
                {points.slice(0, -1).map((p, j) => {
                  const pos1 = getPos(p);
                  const pos2 = getPos(points[j + 1]);

                  return (
                    <line
                      key={`v-segment-${i}-${j}`}
                      x1={pos1.x}
                      y1={pos1.y}
                      x2={pos2.x}
                      y2={pos2.y}
                      stroke="#24AD6E"
                      strokeWidth="1"
                    />
                  );
                })}
              </g>
            );
          })}
        </svg>
      )}
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