import React, { useState, useEffect } from 'react';
import styles from './ExerciseDetail.module.css';

function ExerciseDetail({ exerciseId, onBack }) {
  const [exerciseData, setExerciseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExerciseDetail = async () => {
      try {
        setLoading(true);
        console.log('🔍 Fetching exercise:', exerciseId);
        
        // 개발/배포 환경 모두 프록시 사용
        const apiUrl = `/api/exercises/${exerciseId}`;

        console.log('🌐 API URL:', apiUrl);
        
        const response = await fetch(apiUrl);
        
        console.log('📡 Response status:', response.status);
        console.log('📡 Response ok:', response.ok);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ Error response:', errorText);
          throw new Error(`운동 정보를 불러올 수 없습니다. (${response.status})`);
        }
        
        const data = await response.json();
        console.log('✅ Exercise data:', data);
        setExerciseData(data);
      } catch (err) {
        console.error('운동 상세 데이터 로드 실패:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (exerciseId) {
      fetchExerciseDetail();
    }
  }, [exerciseId]);

  // 초를 분:초 형식으로 변환
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}분 ${secs}초`;
  };

  if (loading) {
    return <div className={styles.loading}>로딩 중...</div>;
  }


  if (!exerciseData) {
    return <div className={styles.noData}>데이터를 불러올 수 없습니다.</div>;
  }

  return (
    <div className={styles.container}>
      {/* 영상 플레이어 */}
      <div className={styles.videoSection}>
        <video
          src={exerciseData.video_filepath}
          controls
          className={styles.video}
          poster={exerciseData.image_filepath}
          playsInline
        >
          동영상을 재생할 수 없습니다.
        </video>
      </div>

      {/* 운동 정보 */}
      <div className={styles.content}>
        <h1 className={styles.title}>{exerciseData.exercise_name}</h1>
        
        {/* 메타 정보 */}
        <div className={styles.metaInfo}>
          <span className={styles.badge}>{exerciseData.exercise_stage}</span>
          <span className={styles.meta}>{exerciseData.exercise_frequency} - {exerciseData.exercise_intensity}</span>
          <span className={styles.meta}>⏱ {formatDuration(exerciseData.duration)}</span>
        </div>

        {/* 운동 소개 */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>운동 소개</h2>
          <p className={styles.text}>{exerciseData.related_symptom}</p>
        </section>

        {/* 운동 순서 */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>운동 순서</h2>
          <p className={styles.preLineText}>{exerciseData.exercise_method}</p>
        </section>

        {/* 관련 근육 */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>관련 근육</h2>
          <p className={styles.text}>{exerciseData.related_muscle}</p>
        </section>

        {/* 관련 관절 */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>관련 관절</h2>
          <p className={styles.text}>{exerciseData.related_joint}</p>
        </section>

        {/* 주의 사항 */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>주의 사항</h2>
          <p className={styles.cautionText}>{exerciseData.exercise_caution}</p>
        </section>
      </div>
    </div>
  );
}

export default ExerciseDetail;