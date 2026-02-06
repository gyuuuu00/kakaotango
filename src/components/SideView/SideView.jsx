import React from 'react';
import styles from './SideView.module.css';
import DetailItem from '../common/DetailItem/DetailItem';
import MeasurementImage from '../MeasurementImage/MeasurementImage';

function SideView({ data, cameraOrientation }) {
  if (!data) {
    return <div className={styles.noData}>데이터를 불러올 수 없습니다.</div>;
  }

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
            <MeasurementImage
              imageUrl={`/data/Results/${leftSide.measure_server_file_name}`}
              measureJson={{ pose_landmark: leftSide.pose_landmark }}
              step="third"
              cameraOrientation={cameraOrientation}
              label="왼쪽측면"
            />
          </div>
        )}

        {rightSide.measure_server_file_name && (
          <div className={styles.imageItem}>
            <MeasurementImage
              imageUrl={`/data/Results/${rightSide.measure_server_file_name}`}
              measureJson={{ pose_landmark: rightSide.pose_landmark }}
              step="fourth"
              cameraOrientation={cameraOrientation}
              label="오른쪽측면"
            />
          </div>
        )}
      </div>

      {/* 측정 데이터 리스트 */}
      <div className={styles.detailList}>
        <div className={styles.leftColumn}>
          {Array.isArray(leftSide.detail_data) && leftSide.detail_data
            .filter(item => item.left_right === 0)
            .map((item, index) => (
              <DetailItem key={`left-left-${index}`} data={item} label="왼쪽측면" />
            ))}
          {Array.isArray(rightSide.detail_data) && rightSide.detail_data
            .filter(item => item.left_right === 0)
            .map((item, index) => (
              <DetailItem key={`right-left-${index}`} data={item} label="오른쪽측면" />
            ))}
        </div>
        <div className={styles.rightColumn}>
          {Array.isArray(leftSide.detail_data) && leftSide.detail_data
            .filter(item => item.left_right === 1)
            .map((item, index) => (
              <DetailItem key={`left-right-${index}`} data={item} label="왼쪽측면" />
            ))}
          {Array.isArray(rightSide.detail_data) && rightSide.detail_data
            .filter(item => item.left_right === 1)
            .map((item, index) => (
              <DetailItem key={`right-right-${index}`} data={item} label="오른쪽측면" />
            ))}
        </div>
      </div>
    </div>
  );
}

export default SideView;
