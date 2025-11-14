import React, { useState, useEffect, useRef } from 'react';
import styles from './SideView.module.css';

function SideView({ data, shouldRotate }) {

  if (!data) {
    return <div className={styles.noData}>데이터를 불러올 수 없습니다.</div>;
  }

  // data 구조 확인 및 안전하게 접근
  const leftSide = data.left_side;
  const rightSide = data.right_side;


  if (!leftSide || !rightSide) {
    return <div className={styles.noData}>데이터 로딩 중...</div>;
  }

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

  // MediaPipe Pose 랜드마크 가져오기
  const getLandmark = (index) => poseLandmarks.find(p => p.index === index);

  // 랜드마크 포인트들
  const landmarks = {
    0: getLandmark(0),   // 코
    7: getLandmark(7),   // 왼쪽 귀
    8: getLandmark(8),   // 오른쪽 귀
    11: getLandmark(11), // 왼쪽 어깨
    12: getLandmark(12), // 오른쪽 어깨
    13: getLandmark(13), // 왼쪽 팔꿈치
    14: getLandmark(14), // 오른쪽 팔꿈치
    15: getLandmark(15), // 왼쪽 손목
    16: getLandmark(16), // 오른쪽 손목
    23: getLandmark(23), // 왼쪽 골반
    24: getLandmark(24), // 오른쪽 골반
    25: getLandmark(25), // 왼쪽 무릎
    26: getLandmark(26), // 오른쪽 무릎
    27: getLandmark(27), // 왼쪽 발목
    28: getLandmark(28), // 오른쪽 발목
    31: getLandmark(31), // 왼쪽 발끝
    32: getLandmark(32), // 오른쪽 발끝
  };

  // #01D5E5 가로선들 (청록색)
  const horizontalLines = [
    [7, 8],   // 귀
    [11, 12], // 어깨
    [13, 14], // 팔꿈치
    [15, 16], // 손목
    [23, 24], // 골반
    [25, 26], // 무릎
    [27, 28], // 발목
    [31, 32], // 발끝
  ];

  // #24AD6E 세로선들 (녹색)
  const verticalLines = [
    [11, 13, 15], // 왼쪽 팔 (어깨-팔꿈치-손목)
    [12, 14, 16], // 오른쪽 팔 (어깨-팔꿈치-손목)
    [23, 25, 27], // 왼쪽 다리 (골반-무릎-발목)
    [24, 26, 28], // 오른쪽 다리 (골반-무릎-발목)
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
        <svg
          className={styles.landmarkOverlay}
        >
          {/* 빨간 중앙 세로선 (코 중심, index 0) */}
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

          {/* 청록색 가로선들 (landmark 쌍 연결) */}
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

          {/* 녹색 세로선들 (landmark 시퀀스 연결) */}
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