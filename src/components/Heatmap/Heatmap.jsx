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
  if (!heatmapData?.result_history_data?.history_data) {
    return <div className={styles.noData}>측정 이력이 없습니다.</div>;
  }

  const historyData = heatmapData.result_history_data.history_data;

  // 신체 부위 매핑
  const bodyParts = [
    { key: 'neck', label: '목' },
    { key: 'shoulder', label: '어깨' },
    { key: 'elbow', label: '팔꿈' },
    { key: 'wrist', label: '손목' },
    { key: 'hip', label: '골반' },
    { key: 'knee', label: '무릎' },
    { key: 'ankle', label: '발목' }
  ];

  // SVG 이미지 매핑
  const svgMap = {
    'normal-1': normal1,
    'normal-2': normal2,
    'normal-3': normal3,
    'warning-1': warning1,
    'warning-2': warning2,
    'warning-3': warning3,
    'danger-1': danger1,
    'danger-2': danger2,
    'danger-3': danger3,
  };

  // 날짜 포맷 (월/일만)
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  // SVG 이미지 가져오기
  const getCellImage = (record, bodyKey) => {
    const riskLevel = parseInt(record[`risk_level_${bodyKey}`] || 0);
    const rangeLevel = parseInt(record[`range_level_${bodyKey}`] || 1);

    let status = 'normal';
    if (riskLevel === 1) status = 'warning';
    else if (riskLevel === 2) status = 'danger';

    const level = rangeLevel > 0 ? rangeLevel : 1;
    const key = `${status}-${level}`;
    
    return svgMap[key] || normal1;
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>측정 이력</h2>

      {/* 범례 */}
      <img src={legendImage} alt="범례" className={styles.legend} />

      {/* 테이블 */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.headerCell}></th>
              {historyData.map((record, index) => (
                <th key={index} className={styles.dateCell}>
                  {formatDate(record.measure_date)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bodyParts.map((part) => (
              <tr key={part.key}>
                <td className={styles.labelCell}>{part.label}</td>
                {historyData.map((record, index) => {
                  const cellImage = getCellImage(record, part.key);
                  return (
                    <td key={index} className={styles.heatCell}>
                      <img 
                        src={cellImage} 
                        alt={`${part.label} 상태`}
                        className={styles.cellImage}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Heatmap;