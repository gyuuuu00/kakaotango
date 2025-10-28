//측정이력
import styles from './Heatmap.module.css';
import normal1 from '../../assets/heatmap/normal1.svg';
import normal2 from '../../assets/heatmap/normal2.svg';
import normal3 from '../../assets/heatmap/normal3.svg';
import warning1 from '../../assets/heatmap/warning1.svg';
import warning2 from '../../assets/heatmap/warning2.svg';
import warning3 from '../../assets/heatmap/warning3.svg';
import danger1 from '../../assets/heatmap/danger1.svg';
import danger2 from '../../assets/heatmap/danger2.svg';
import danger3 from '../../assets/heatmap/danger3.svg';
import legendImage from '../../assets/heatmap/legend.svg';

function Heatmap({ heatmapData }) {
  // 위험도(risk)와 단계(range)에 따른 이미지 선택
  const getCellImage = (status, level) => {
    // status: 'normal', 'warning', 'danger'
    // level: 1, 2, 3
    
    if (status === 'normal') {
      if (level === 1) return normal1;
      if (level === 2) return normal2;
      if (level === 3) return normal3;
    } else if (status === 'warning') {
      if (level === 1) return warning1;
      if (level === 2) return warning2;
      if (level === 3) return warning3;
    } else if (status === 'danger') {
      if (level === 1) return danger1;
      if (level === 2) return danger2;
      if (level === 3) return danger3;
    }
    
    return normal1; // 기본값
  };

  return (
    <div className={styles.container}>
      <div>
        {/* 범례 이미지 */}
        <img src={legendImage} alt="범례" className={styles.legend} />
        
        {/* 히트맵 테이블 */}
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.headerCell}>측정 이력</th>
              {heatmapData?.dates?.map((date, i) => (
                <th key={i} className={styles.dateCell}>{date}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {heatmapData?.parts?.map((row, i) => (
              <tr key={i}>
                <td className={styles.labelCell}>{row.part}</td>
                {row.records.map((record, j) => (
                  <td key={j} className={styles.heatCell}>
                    <div className={styles.cellContent}>
                      <img 
                        src={getCellImage(record.status, record.level)} 
                        alt={`${record.status} ${record.level}단계`}
                        className={styles.cellImage}
                      />
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Heatmap;