import React from "react";
import { useVideoPlayer } from "../../hooks/useVideoPlayer";
import { PoseLandmarks, IMeasureJson } from "../../types/pose";
import { setupHiDPICanvas, drawSkeleton, drawTrailSegment, midPoint } from "../../utils/videoUtils";
import styles from "./VideoPlayer.module.css";

interface VideoPlayerProps {
  videoSrc: string | undefined;
  isRotated: boolean;
  measureJson: IMeasureJson[] | undefined;
  isLoading?: boolean;
  isError?: boolean;
  onFrameChange?: (frame: number) => void;
  customCanvasTransform?: string;
  children?: React.ReactNode;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoSrc,
  isRotated,
  measureJson,
  isLoading = false,
  isError = false,
  onFrameChange,
  customCanvasTransform,
  children,
}) => {
  const {
    stageRef,
    videoRef,
    canvasWhiteRef,
    canvasRedRef,
    canvasTrailRef,
    fit,
    canvasTransform,
    frame,
    duration,
    currentTime,
    setIsSeeking,
    setCurrentTime,
    isSeekingRef,
    trailPrevRef,
    toScreen,
  } = useVideoPlayer({
    videoSrc,
    isRotated,
    measureJson,
    onFrameChange,
  });

  // Update canvas size when fit changes
  React.useEffect(() => {
    const cw = canvasWhiteRef.current;
    const cr = canvasRedRef.current;
    const ct = canvasTrailRef.current;
    if (!cw || !cr || !ct || fit.stageW === 0 || fit.stageH === 0) return;

    setupHiDPICanvas(cw, fit.stageW, fit.stageH);
    setupHiDPICanvas(cr, fit.stageW, fit.stageH);
    setupHiDPICanvas(ct, fit.stageW, fit.stageH);
  }, [fit.stageW, fit.stageH, fit.dpr, canvasWhiteRef, canvasRedRef, canvasTrailRef]);

  // Draw skeleton and trail
  React.useEffect(() => {
    if (!measureJson) return;

    const item = measureJson[frame];
    if (!item || !item.pose_landmark) return;

    const lm: PoseLandmarks = item.pose_landmark;

    const cw = canvasWhiteRef.current;
    const cr = canvasRedRef.current;
    const ct = canvasTrailRef.current;
    if (!cw || !cr || !ct || fit.stageW === 0 || fit.stageH === 0) return;

    const ctxW = cw.getContext("2d");
    const ctxR = cr.getContext("2d");
    const ctxT = ct.getContext("2d");
    if (!ctxW || !ctxR || !ctxT) return;

    // Trail (현재 프레임만 표시, 누적 안 함)
    ctxT.clearRect(0, 0, fit.stageW, fit.stageH);
    ctxT.lineWidth = 2;
    ctxT.strokeStyle = "#00FF00";

    const p15 = toScreen(lm[15].sx, lm[15].sy);
    const p16 = toScreen(lm[16].sx, lm[16].sy);
    const mid = midPoint(lm[23], lm[24]);
    const pMid = toScreen(mid.sx, mid.sy);
    const p25 = toScreen(lm[25].sx, lm[25].sy);
    const p26 = toScreen(lm[26].sx, lm[26].sy);

    // 골반 라인 (23-24 연결)
    const p23 = toScreen(lm[23].sx, lm[23].sy);
    const p24 = toScreen(lm[24].sx, lm[24].sy);
    ctxT.beginPath();
    ctxT.moveTo(p23.x, p23.y);
    ctxT.lineTo(p24.x, p24.y);
    ctxT.stroke();

    // 무릎 라인 (25-26 연결)
    ctxT.beginPath();
    ctxT.moveTo(p25.x, p25.y);
    ctxT.lineTo(p26.x, p26.y);
    ctxT.stroke();

    // 손목 라인 (15-16 연결) - 선택사항
    ctxT.beginPath();
    ctxT.moveTo(p15.x, p15.y);
    ctxT.lineTo(p16.x, p16.y);
    ctxT.stroke();

    trailPrevRef.current = { p15, p16, pMid, p25, p26 };

    // Clear
    ctxW.clearRect(0, 0, fit.stageW, fit.stageH);
    ctxR.clearRect(0, 0, fit.stageW, fit.stageH);

    // Draw skeleton
    drawSkeleton(ctxW, ctxR, lm, toScreen);
  }, [measureJson, frame, fit, toScreen, canvasWhiteRef, canvasRedRef, canvasTrailRef, trailPrevRef]);

  const handlePlayPause = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play();
    else v.pause();
  };

  const handleSeekStart = () => {
    setIsSeeking(true);
    isSeekingRef.current = true;
  };

  const handleSeekEnd = (value: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = value;
    setIsSeeking(false);
    isSeekingRef.current = false;
  };

  const finalCanvasTransform = customCanvasTransform ?? canvasTransform;

  return (
    <div className={styles.container}>
      <div ref={stageRef} className={styles.stage}>
        <video
          ref={videoRef}
          muted
          playsInline
          src={videoSrc ? `/data/Results/${videoSrc.includes('/') ? videoSrc.split('/').pop() : videoSrc}` : undefined}
          className={`${styles.video} ${isRotated ? styles.rotated : ""}`}
        />

        <canvas
          ref={canvasTrailRef}
          className={styles.canvas}
          style={{ transform: finalCanvasTransform }}
        />
        <canvas
          ref={canvasWhiteRef}
          className={styles.canvas}
          style={{ transform: finalCanvasTransform }}
        />
        <canvas
          ref={canvasRedRef}
          className={styles.canvasRed}
          style={{ transform: finalCanvasTransform }}
        />

        {isLoading && (
          <div className={styles.overlay}>
            <p>로딩중...</p>
          </div>
        )}

        {isError && (
          <div className={styles.overlay}>
            <p>오류가 발생했습니다</p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <button type="button" className={styles.playButton} onClick={handlePlayPause}>
          ▶
        </button>

        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.01}
          value={Math.min(currentTime, duration || 0)}
          className={styles.progressBar}
          style={{
            background: `linear-gradient(to right, #7E7E7E 0%, #7E7E7E ${(currentTime / (duration || 1)) * 100}%, #F5F5F5 ${(currentTime / (duration || 1)) * 100}%, #F5F5F5 100%)`,
          }}
          onMouseDown={handleSeekStart}
          onTouchStart={handleSeekStart}
          onChange={(e) => setCurrentTime(Number(e.target.value))}
          onMouseUp={(e) => handleSeekEnd(Number(e.currentTarget.value))}
          onTouchEnd={(e) => handleSeekEnd(Number(e.currentTarget.value))}
        />
      </div>
      {children}
    </div>
  );
};

export default VideoPlayer;
