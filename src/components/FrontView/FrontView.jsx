import React from 'react';
import styles from './FrontView.module.css';
import DetailItem from '../common/DetailItem/DetailItem';
import MeasurementImage from '../MeasurementImage/MeasurementImage';

function FrontView({ data, cameraOrientation }) {
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
          <MeasurementImage
            imageUrl={`https://gym.tangoplus.co.kr/data/Results/${frontData.static_front.measure_server_file_name}`}
            measureJson={{ pose_landmark: frontData.static_front.pose_landmark }}
            step="first"
            cameraOrientation={cameraOrientation}
            label="정면측정"
          />
        </div>

        <div className={styles.imageItem}>
          <MeasurementImage
            imageUrl={`https://gym.tangoplus.co.kr/data/Results/${frontData.static_elbow.measure_server_file_name}`}
            measureJson={{ pose_landmark: frontData.static_elbow.pose_landmark }}
            step="second"
            cameraOrientation={cameraOrientation}
            label="정면_팔꿉측정"
          />
        </div>
      </div>

      {/* 측정 데이터 리스트 */}
      <div className={styles.detailList}>
        <div className={styles.leftColumn}>
          {frontData.static_front.detail_data
            .filter(item => item.left_right === 0)
            .map((item, index) => (
              <DetailItem key={`front-left-${index}`} data={item} label="정면측정" />
            ))}
          {frontData.static_elbow.detail_data
            .filter(item => item.left_right === 0)
            .map((item, index) => (
              <DetailItem key={`elbow-left-${index}`} data={item} label="정면측정" />
            ))}
        </div>
        <div className={styles.rightColumn}>
          {frontData.static_front.detail_data
            .filter(item => item.left_right === 1)
            .map((item, index) => (
              <DetailItem key={`front-right-${index}`} data={item} label="정면측정" />
            ))}
          {frontData.static_elbow.detail_data
            .filter(item => item.left_right === 1)
            .map((item, index) => (
              <DetailItem key={`elbow-right-${index}`} data={item} label="정면측정" />
            ))}
        </div>
      </div>
    </div>
  );
}

export default FrontView;
