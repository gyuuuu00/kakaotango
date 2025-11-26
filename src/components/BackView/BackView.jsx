import styles from './BackView.module.css';
import DetailItem from '../common/DetailItem/DetailItem';
import PoseImage from '../common/PoseImage/PoseImage';

function BackView({ data, cameraOrientation }) {
  console.log('📊 BackView 받은 데이터:', data);

  if (!data) {
    return <div className={styles.noData}>데이터를 불러올 수 없습니다.</div>;
  }


  if (!data.back || !data.back_sit) {
    return <div className={styles.noData}>후면 데이터 로딩 중...</div>;
  }

  const shouldRotate = cameraOrientation === 1;

  return (
    <div className={styles.container}>
      {/* 상단 이미지 영역 */}
      <div className={styles.imageSection}>
        <div className={styles.imageItem}>
          <PoseImage
            src={data.back.measure_server_file_name}
            alt="후면측정"
            shouldRotate={shouldRotate}
            poseLandmarks={data.back.pose_landmark}
          />
          <p className={styles.imageLabel}>후면측정</p>
        </div>

        <div className={styles.imageItem}>
          <PoseImage
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
          <DetailItem key={`back-${index}`} data={item} label="후면측정" />
        ))}
        {data.back_sit.detail_data?.map((item, index) => (
          <DetailItem key={`sit-${index}`} data={item} label="후면측정" />
        ))}
      </div>
    </div>
  );
}

export default BackView;