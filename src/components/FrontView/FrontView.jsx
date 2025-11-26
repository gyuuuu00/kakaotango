import React, { useState, useEffect } from 'react';
import styles from './FrontView.module.css';
import DetailItem from '../common/DetailItem/DetailItem';
import PoseImage from '../common/PoseImage/PoseImage';

function FrontView({ data, cameraOrientation }) {
  if (!data) {
    return <div className={styles.loading}>로딩 중...</div>;
  }

  const frontData = data;

  if (!frontData.static_front || !frontData.static_elbow) {
    return <div className={styles.noData}>데이터를 불러올 수 없습니다.</div>;
  }

  const shouldRotate = cameraOrientation === 1;

  return (
    <div className={styles.container}>
      {/* 상단 이미지 영역 */}
      <div className={styles.imageSection}>
        <div className={styles.imageItem}>
          <PoseImage
            src={frontData.static_front.measure_server_file_name}
            alt="정면측정"
            shouldRotate={shouldRotate}
            poseLandmarks={frontData.static_front.pose_landmark}
          />
          <p className={styles.imageLabel}>정면측정</p>
        </div>

        <div className={styles.imageItem}>
          <PoseImage
            src={frontData.static_elbow.measure_server_file_name}
            alt="정면_발끝측정"
            shouldRotate={shouldRotate}
            poseLandmarks={frontData.static_elbow.pose_landmark}
          />
          <p className={styles.imageLabel}>정면_팔꿉측정</p>
        </div>
      </div>

      {/* 측정 데이터 리스트 */}
      <div className={styles.detailList}>
        {frontData.static_front.detail_data.map((item, index) => (
          <DetailItem key={`front-${index}`} data={item} label="정면측정" />
        ))}
        {frontData.static_elbow.detail_data.map((item, index) => (
          <DetailItem key={`elbow-${index}`} data={item} label="정면측정" />
        ))}
      </div>
    </div>
  );
}

export default FrontView;
