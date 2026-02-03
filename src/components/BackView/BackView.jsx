import React from 'react';
import styles from './BackView.module.css';
import DetailItem from '../common/DetailItem/DetailItem';
import MeasurementImage from '../MeasurementImage/MeasurementImage';

function BackView({ data, cameraOrientation }) {
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
          <MeasurementImage
            imageUrl={`https://gym.tangoplus.co.kr/data/Results/${data.back.measure_server_file_name}`}
            measureJson={{ pose_landmark: data.back.pose_landmark }}
            step="fifth"
            cameraOrientation={cameraOrientation}
            label="후면측정"
          />
        </div>

        <div className={styles.imageItem}>
          <MeasurementImage
            imageUrl={`https://gym.tangoplus.co.kr/data/Results/${data.back_sit.measure_server_file_name}`}
            measureJson={{ pose_landmark: data.back_sit.pose_landmark }}
            step="sixth"
            cameraOrientation={cameraOrientation}
            label="후면_앉은측정"
          />
        </div>
      </div>

      {/* 측정 데이터 리스트 */}
      <div className={styles.detailList}>
        <div className={styles.leftColumn}>
          {data.back.detail_data
            ?.filter(item => item.left_right === 0)
            .map((item, index) => (
              <DetailItem key={`back-left-${index}`} data={item} label="후면측정" />
            ))}
          {data.back_sit.detail_data
            ?.filter(item => item.left_right === 0)
            .map((item, index) => (
              <DetailItem key={`sit-left-${index}`} data={item} label="후면측정" />
            ))}
        </div>
        <div className={styles.rightColumn}>
          {data.back.detail_data
            ?.filter(item => item.left_right === 1)
            .map((item, index) => (
              <DetailItem key={`back-right-${index}`} data={item} label="후면측정" />
            ))}
          {data.back_sit.detail_data
            ?.filter(item => item.left_right === 1)
            .map((item, index) => (
              <DetailItem key={`sit-right-${index}`} data={item} label="후면측정" />
            ))}
        </div>
      </div>
    </div>
  );
}

export default BackView;
