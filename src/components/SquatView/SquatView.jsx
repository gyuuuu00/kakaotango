import React, { useRef, useState, useEffect } from 'react';
import styles from './SquatView.module.css';
import DetailItem from '../common/DetailItem/DetailItem';

function SquatView({ data, cameraOrientation }) {
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

  // 동영상은 1일 때 회전
  const shouldRotateVideo = cameraOrientation === 1;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      // 첫 프레임 로드를 위해 영상을 0.01초까지 재생 후 멈춤
      video.currentTime = 0.01;
    };
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
            className={`${styles.measureVideo} ${shouldRotateVideo ? styles.rotated : ''}`}
            playsInline
            preload="metadata"
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
            {isPlaying ? '▶' : '▶'}
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
          <DetailItem key={`squat-${index}`} data={item} label="동적측정" />
        ))}
      </div>
    </div>
  );
}

export default SquatView;