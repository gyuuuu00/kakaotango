import React, { useState, useEffect } from 'react';
import styles from './ExerciseDetail.module.css';

const API_BASE = import.meta.env.DEV
  ? '/admin_api'
  : (import.meta.env.VITE_API_BASE_URL ?? 'https://gym.tangoplus.co.kr/admin_api');

function ExerciseDetail({ exerciseId, t_r, onBack }) { 
  console.log('🔍 ExerciseDetail 받은 exerciseId:', exerciseId);
  console.log('🔍 ExerciseDetail 받은 t_r:', t_r);
  console.log('🔍 t_r 길이:', t_r?.length);
  console.log('🔍 t_r 타입:', typeof t_r);
   
  const [exerciseData, setExerciseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExerciseDetail = async () => {
      try {
        setLoading(true);
        console.log('🔍 Fetching exercise:', exerciseId);
        console.log('🔑 t_r:', t_r);
        
        // t_r을 포함한 API 호출
        const apiUrl = `${API_BASE}/exercise-recommendation/${exerciseId}?t_r=${encodeURIComponent(t_r)}`;

        console.log('🌐 API URL:', apiUrl);
        
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: { Accept: "application/json" },
        });
        
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

    if (exerciseId && t_r) {  // ← t_r 체크 추가!
      fetchExerciseDetail();
    }
  }, [exerciseId, t_r]);

  // 초를 분:초 형식으로 변환
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}분 ${secs}초`;
  };

  if (loading) {
    return <div className={styles.loading}>로딩 중...</div>;
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>에러: {error}</p>
        <button onClick={onBack} className={styles.backButton}>돌아가기</button>
      </div>
    );
  }

  if (!exerciseData) {
    return <div className={styles.noData}>데이터를 불러올 수 없습니다.</div>;
  }

  return (
    <div className={styles.container}>
      {/* 뒤로가기 버튼 추가 */}
      <button onClick={onBack} className={styles.backButton}>
        ← 돌아가기
      </button>

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