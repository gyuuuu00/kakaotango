import React, { useState, useEffect, useRef } from 'react';
import styles from './SideView.module.css';

function SideView({ data, cameraOrientation }) {

  if (!data) {
    return <div className={styles.noData}>데이터를 불러올 수 없습니다.</div>;
  }

  // data 구조 확인 및 안전하게 접근
  const leftSide = data.left_side;
  const rightSide = data.right_side;


  if (!leftSide || !rightSide) {
    return <div className={styles.noData}>데이터 로딩 중...</div>;
  }

  const shouldRotate = cameraOrientation === 1;

  return (
    <div className={styles.container}>
      {/* 상단 이미지 영역 */}
      <div className={styles.imageSection}>
        {leftSide.measure_server_file_name && (
          <div className={styles.imageItem}>
            <PoseImageOverlay
              src={leftSide.measure_server_file_name}
              alt="왼쪽측면"
              shouldRotate={shouldRotate}
              poseLandmarks={leftSide.pose_landmark}
            />
            <p className={styles.imageLabel}>왼쪽측면</p>
          </div>
        )}

        {rightSide.measure_server_file_name && (
          <div className={styles.imageItem}>
            <PoseImageOverlay
              src={rightSide.measure_server_file_name}
              alt="오른쪽측면"
              shouldRotate={shouldRotate}
              poseLandmarks={rightSide.pose_landmark}
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

  /* ===== 포즈 랜드마크 작업 주석처리 =====

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

    const transformedSx = p.sx;
    const transformedSy = p.sy;
    const currentMaxSx = maxSx;
    const currentMaxSy = maxSy;

    const scale = Math.max(
      imageWidth / currentMaxSx,
      imageHeight / currentMaxSy
    );

    const displayW = currentMaxSx * scale;
    const displayH = currentMaxSy * scale;

    const croppedOffsetX = (displayW - imageWidth) / 2;
    const croppedOffsetY = (displayH - imageHeight) / 2;

    const x = offsetX + transformedSx * scale - croppedOffsetX;
    const y = offsetY + transformedSy * scale - croppedOffsetY;

    return { x, y };
  };

  const getLandmark = (index) => poseLandmarks.find(p => p.index === index);

  const landmarks = {
    0: getLandmark(0), 7: getLandmark(7), 8: getLandmark(8),
    11: getLandmark(11), 12: getLandmark(12), 13: getLandmark(13),
    14: getLandmark(14), 15: getLandmark(15), 16: getLandmark(16),
    23: getLandmark(23), 24: getLandmark(24), 25: getLandmark(25),
    26: getLandmark(26), 27: getLandmark(27), 28: getLandmark(28),
    31: getLandmark(31), 32: getLandmark(32),
  };

  const horizontalLines = [
    [7, 8], [11, 12], [13, 14], [15, 16],
    [23, 24], [25, 26], [27, 28], [31, 32],
  ];

  const verticalLines = [
    [11, 13, 15], [12, 14, 16],
    [23, 25, 27], [24, 26, 28],
  ];

  return (
    <div className={styles.imageWrapper} ref={wrapperRef}>
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className={`${styles.measureImage} ${shouldRotate ? styles.rotated : ''}`}
      />

      {layout && (
        <svg className={styles.landmarkOverlay}>
          {landmarks[0] && (
            <line
              x1={getPos(landmarks[0]).x}
              y1={0}
              x2={getPos(landmarks[0]).x}
              y2={layout.wrapperHeight}
              stroke="#FF0000"
              strokeWidth="1"
            />
          )}

          {horizontalLines.map(([idx1, idx2], i) => {
            const p1 = landmarks[idx1];
            const p2 = landmarks[idx2];
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

          {verticalLines.map((indices, i) => {
            const points = indices.map(idx => landmarks[idx]).filter(Boolean);
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

  ===== 포즈 랜드마크 작업 주석처리 끝 ===== */
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
        <p className={styles.ment}>{data.ment || data.ment_all}</p>
      </div>
    </div>
  );
}

export default SideView;