import React, { useState, useEffect, useRef } from 'react';
import styles from './SideView.module.css';
import DetailItem from '../common/DetailItem/DetailItem';
import PoseImage from '../common/PoseImage/PoseImage';

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
            <PoseImage
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
            <PoseImage
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
          <DetailItem key={`left-${index}`} data={item} label="왼쪽측면" />
        ))}
        {Array.isArray(rightSide.detail_data) && rightSide.detail_data.map((item, index) => (
          <DetailItem key={`right-${index}`} data={item} label="오른쪽측면" />
        ))}
      </div>
    </div>
  );
}

export default SideView;