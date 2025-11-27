import React, { useState, useEffect } from 'react';
import styles from './ExerciseRecommendation.module.css';
import ExerciseDetail from '../ExerciseDetail/ExerciseDetail';

function ExerciseRecommendation({ data, t_r }) {
  const [selectedPart, setSelectedPart] = useState('목');
  const [selectedExerciseId, setSelectedExerciseId] = useState(null);

  if (!data) {
    return <div className={styles.noData}>데이터를 불러올 수 없습니다.</div>;
  }

  // 신체 부위 매핑
  const bodyPartMap = {
    1: '목',
    2: '어깨',
    3: '팔꿉치',
    4: '손목',
    8: '골반',
    9: '무릎',
    10: '발목'
  };

  // risk_part를 신체 부위 이름으로 변환
  const riskParts = data.risk_part?.risk_part?.map(id => bodyPartMap[id]) || [];
  
  // 첫 번째 신체 부위로 초기 설정
  useEffect(() => {
    if (riskParts.length > 0 && selectedPart === '목') {
      setSelectedPart(riskParts[0]);
    }
  }, [riskParts]);

  // 필터링된 운동 프로그램
  const filteredPrograms = data.exercise_program?.filter(program => {
    const title = program.exercise_program_title;
    const regex = new RegExp(`(^|\\s)${selectedPart}($|\\s|[,\\.\\(\\)])`);
    return regex.test(title);
  });

  // 초를 분:초 형식으로 변환
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}분 ${secs}초`;
  };

  // 운동 카드 클릭 핸들러 - 간단하게 수정!
  const handleExerciseClick = (exerciseId) => {
    setSelectedExerciseId(exerciseId);
  };

  // 상세 페이지에서 돌아가기
  const handleBack = () => {
    setSelectedExerciseId(null);
  };

  // 상세 페이지 표시
  if (selectedExerciseId) {
    return <ExerciseDetail exerciseId={selectedExerciseId} t_r={t_r} onBack={handleBack} />;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>추천 운동 프로그램</h2>

      <div className={styles.filterTabs}>
        {riskParts.map((part) => (
          <button
            key={part}
            className={`${styles.filterTab} ${selectedPart === part ? styles.active : ''}`}
            onClick={() => setSelectedPart(part)}
          >
            {part}
          </button>
        ))}
      </div>

      {/* 운동 프로그램 리스트 */}
      <div className={styles.programList}>
        {filteredPrograms?.map((program, programIndex) => (
          <div key={programIndex} className={styles.programSection}>
            <div className={styles.programHeader}>
              <h3 className={styles.programTitle}>{program.exercise_program_title}</h3>
              <p className={styles.programDescription}>{program.exercise_program_description}</p>
            </div>

            <div className={styles.exerciseGrid}>
              {program.exercise_list?.map((exercise) => (
                <div 
                  key={exercise.exercise_id}
                  className={styles.exerciseCard}
                  onClick={() => handleExerciseClick(exercise.exercise_id)}
                >
                  <div className={styles.thumbnailWrapper}>
                    <img 
                      src={exercise.image_filepath} 
                      alt={exercise.exercise_name}
                      className={styles.thumbnail}
                    />
                    <div className={styles.playOverlay}>
                      <div className={styles.playButton}>▶</div>
                    </div>
                    <div className={styles.duration}>
                      ⏱ {formatDuration(exercise.duration)}
                    </div>
                  </div>

                  <div className={styles.exerciseInfo}>
                    <h4 className={styles.exerciseName}>{exercise.exercise_name}</h4>
                    <p className={styles.symptom}>{exercise.related_symptom}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExerciseRecommendation;