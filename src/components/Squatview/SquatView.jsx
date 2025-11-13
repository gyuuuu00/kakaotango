import React, { useRef, useState, useEffect } from 'react';
import styles from './SquatView.module.css';

function SquatView({ data, shouldRotate }) {
  console.log('📊 SquatView 받은 데이터:', data);
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  if (!data) {
    return <div className={styles.noData}>데이터를 불러올 수 없습니다.</div>;
  }

  // data 구조 확인 및 안전하게 접근
  if (!data.squat) {
    return <div className={styles.noData}>동적측정 데이터 로딩 중...</div>;
  }

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => setDuration(video.duration);
    const handleEnded = () => setIsPlaying(false);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e) => {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newTime = pos * duration;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={styles.container}>
      {/* 상단 영상 영역 */}
      <div className={styles.videoSection}>
        <div className={styles.videoWrapper}>
          <video
            ref={videoRef}
            src={data.squat.measure_server_file_name}
            className={`${styles.measureVideo} ${!shouldRotate ? styles.rotated : ''}`}
            playsInline
            onClick={handlePlayPause}
          >
            동영상을 재생할 수 없습니다.
          </video>

          {/* 영상 위 재생 버튼 오버레이 */}
          {!isPlaying && (
            <div className={styles.videoOverlay} onClick={handlePlayPause}>
              <div className={styles.playButtonOverlay}>
                ▶
              </div>
            </div>
          )}
        </div>

        {/* 비디오 컨트롤 */}
        <div className={styles.videoControls}>
          <button onClick={handlePlayPause} className={styles.playButton}>
            {isPlaying ? '⏸' : '▶'}
          </button>

          {/* 재생바 */}
          <div className={styles.progressBarWrapper} onClick={handleSeek}>
            <div className={styles.progressBarContainer}>
              <div
                className={styles.progressBarFill}
                style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
              />
            </div>
          </div>

          {/* 시간 표시 */}
          <div className={styles.timeDisplay}>
            <span>{formatTime(currentTime)}</span>
            <span>/</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <p className={styles.videoLabel}>스쿼트 측정</p>
      </div>

      {/* 측정 데이터 리스트 */}
      <div className={styles.detailList}>
        {data.squat.detail_data?.map((item, index) => (
          <DetailItem key={`squat-${index}`} data={item} />
        ))}
      </div>
    </div>
  );
}

function DetailItem({ data }) {
  const getRiskColor = (riskLevel) => {
    switch(riskLevel) {
      case 1: return '#FFA73A';
      case 2: return '#FF4A4A';
      default: return '#bbbbbb';
    }
  };

  const getRiskWidth = (riskLevel) => {
    switch(riskLevel) {
      case 0: return '30%';  // 정상
      case 1: return '60%';  // 주의
      default: return '95%'; // 위험
    }
  };

  return (
    <div className={styles.detailItem}>
      {/* 상단 헤더 영역 */}
      <div className={styles.topSection}>
        <div className={styles.leftInfo}>
          <span className={styles.headerLabel}>동적측정</span>
          <span className={styles.measureUnit}>{data.measure_unit}</span>
        </div>
        
        <div className={styles.centerInfo}>
          <div className={styles.dataValue}>{Math.trunc(data.data)}</div>         
        </div>

        {/* 프로그레스바 */}
        <div className={styles.rightProgressSection}>
          <div className={styles.levelLabels}>
            <span>정상</span>
            <span>주의</span>
            <span>위험</span>
          </div>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill}
              style={{ 
                width: getRiskWidth(data.risk_level),
                backgroundColor: getRiskColor(data.risk_level)
              }}
            />
          </div>
        </div>
      </div>

      {/* 하단 설명 영역 */}
      <div className={styles.bottomSection}>
        <p className={styles.ment}>{data.ment || data.ment_all}</p>
      </div>
    </div>
  );
}

export default SquatView;