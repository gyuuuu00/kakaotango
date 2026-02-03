import React, { useState } from "react";
import { IPoseLandmark } from "../../types/pose";
import { useStaticLandmark } from "../../hooks/useStaticLandmark";
import styles from "./MeasurementImage.module.css";

interface MeasurementImageProps {
  imageUrl: string;
  measureJson: { pose_landmark: IPoseLandmark[] } | null;
  step: "first" | "second" | "third" | "fourth" | "fifth" | "sixth";
  cameraOrientation: 0 | 1;
  label?: string;
}

export const MeasurementImage: React.FC<MeasurementImageProps> = ({
  imageUrl,
  measureJson,
  step,
  cameraOrientation,
  label,
}) => {
  const [showGrid, setShowGrid] = useState(false);
  const [showLine, setShowLine] = useState(true);

  const { resultUrl, loading } = useStaticLandmark(
    imageUrl,
    measureJson,
    step,
    cameraOrientation,
    showLine
  );

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>로딩중...</div>
      </div>
    );
  }

  if (!resultUrl) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>이미지를 불러올 수 없습니다</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.imageWrapper}>
        <img src={resultUrl} alt={label || "측정 이미지"} className={styles.image} />

        {showGrid && <div className={styles.gridOverlay} />}

        {/* 측면 라벨 */}
        {step === "third" && (
          <div className={styles.sideLabel}>왼쪽</div>
        )}
        {step === "fourth" && (
          <div className={styles.sideLabel}>오른쪽</div>
        )}

        {/* 버튼들 */}
        <div className={styles.buttonGroup}>
          <button
            className={styles.toggleButton}
            onClick={() => setShowGrid(!showGrid)}
          >
            {showGrid ? "그리드 끄기" : "그리드 켜기"}
          </button>
          <button
            className={styles.toggleButton}
            onClick={() => setShowLine(!showLine)}
          >
            {showLine ? "랜드마크 끄기" : "랜드마크 켜기"}
          </button>
        </div>
      </div>

      {label && <p className={styles.label}>{label}</p>}
    </div>
  );
};

export default MeasurementImage;
