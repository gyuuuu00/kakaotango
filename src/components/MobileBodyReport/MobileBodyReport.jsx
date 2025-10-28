import Header from '../Header/Header';
import CautionArea from '../CautionArea/CautionArea';
import DetailedAnalysis from '../DetailedAnalysis/DetailedAnalysis';
import Heatmap from '../Heatmap/Heatmap';
import Record from '../Record/Record'
import styles from './MobileBodyReport.module.css'; // 파일명 변경!

function MobileBodyReport({ data }) {
  return (
    <div className={styles.page}>
      <Header userData={data} />  
      
      <CautionArea
        cautionAreas={data.cautionAreas}
        footPressureImageUrl={data.footPressureImageUrl}  
        kneeTrajectoryUrl={data.kneeTrajectoryUrl}        
        pelvisTrajectoryUrl={data.pelvisTrajectoryUrl}    
        upperSummary={data.upperSummary}  
        lowerSummary={data.lowerSummary}  
      />
      
      <DetailedAnalysis detailedAnalysis={data.detailedAnalysis} />
      <Heatmap heatmapData={data.heatmapData} />
      <Record  />
    </div>
  );
}

export default MobileBodyReport;