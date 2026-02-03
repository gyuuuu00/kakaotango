import React, { useState, useEffect } from 'react';
import styles from './SquatView.module.css';
import DetailItem from '../common/DetailItem/DetailItem';
import VideoPlayer from '../VideoPlayer/VideoPlayer';
import axios from 'axios';

function SquatView({ data, cameraOrientation }) {
  const [measureJson, setMeasureJson] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!data) {
    return <div className={styles.noData}>데이터를 불러올 수 없습니다.</div>;
  }

  if (!data.squat) {
    return <div className={styles.noData}>동적측정 데이터 로딩 중...</div>;
  }

  const isRotated = cameraOrientation === 1;

  // pose_landmark JSON 파일 가져오기
  useEffect(() => {
    const fetchMeasureJson = async () => {
      if (!data.squat.measure_server_json_name) return;

      setIsLoading(true);
      try {
        // 파일명만 추출
        const jsonName = data.squat.measure_server_json_name;
        const filename = jsonName.includes('/') ? jsonName.split('/').pop() : jsonName;

        const response = await axios.get(`/data/Results/${filename}`);
        setMeasureJson(response.data);
      } catch (error) {
        console.error('Failed to fetch measure json:', error);
      }
      setIsLoading(false);
    };

    fetchMeasureJson();
  }, [data.squat.measure_server_json_name]);

  return (
    <div className={styles.container}>
      {/* 상단 영상 영역 */}
      <div className={styles.videoSection}>
        <VideoPlayer
          videoSrc={data.squat.measure_server_file_name}
          isRotated={isRotated}
          measureJson={measureJson}
          isLoading={isLoading}
          isError={false}
        />
        <p className={styles.videoLabel}>스쿼트 측정</p>
      </div>

      {/* 측정 데이터 리스트 */}
      <div className={styles.detailList}>
        <div className={styles.leftColumn}>
          {data.squat.detail_data
            ?.filter(item => item.left_right === 0)
            .map((item, index) => (
              <DetailItem key={`squat-left-${index}`} data={item} label="동적측정" />
            ))}
        </div>
        <div className={styles.rightColumn}>
          {data.squat.detail_data
            ?.filter(item => item.left_right === 1)
            .map((item, index) => (
              <DetailItem key={`squat-right-${index}`} data={item} label="동적측정" />
            ))}
        </div>
      </div>
    </div>
  );
}

export default SquatView;
