import styles from './PoseImage.module.css';

function PoseImage({ src, alt, shouldRotate, poseLandmarks = [] }) {
  // 🔹 랜드마크 작업 모두 주석처리 - 이미지만 표시
  // camera_orientation: 0이면 그대로, 1이면 왼쪽으로 90도 회전 (9:16)

  const wrapperStyle = shouldRotate
    ? { aspectRatio: '16 / 9' }
    : {};

  const imageStyle = shouldRotate
    ? { transform: 'rotate(-90deg)', maxHeight: '100%' }  // 왼쪽으로 90도
    : {};

  return (
    <div className={styles.imageWrapper} style={wrapperStyle}>
      <img
        src={src}
        alt={alt}
        className={styles.measureImage}
        style={imageStyle}
      />
    </div>
  );
}

export default PoseImage;
