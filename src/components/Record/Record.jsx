//Record.jsx
import defaultImage from '../../assets/bodyTypes/default.svg';
import styles from './Record.module.css';

function Record() {  
  return (
    <div className={styles.bodyAnalysis}> 
      <div className={styles.analysisHeader}>  
        <h2>체형 유형 분석</h2>
      </div>
      
      <div className={styles.bodyTypeResult}>  
        <div className={styles.bodyTypeImage}> 
          <img src={defaultImage} alt="기본 이미지" />
        </div>
        
        <div className={styles.analysisDetails}>  
          *측정 기록이 부족합니다.
          <br />
          체형에 대한 결과는 최소 5회 이상이 필요합니다.
          <br />
          꾸준히 내 건강을 관리하여 나의 체형 유형을 파악해보세요.
        </div>
      </div>
    </div>
  );
}

export default Record;