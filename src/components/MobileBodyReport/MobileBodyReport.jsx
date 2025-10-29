import Header from '../Header/Header';
import TabMenu from '../TabMenu/TabMenu';
import CautionArea from '../CautionArea/CautionArea';
import DetailedAnalysis from '../DetailedAnalysis/DetailedAnalysis';
import Heatmap from '../Heatmap/Heatmap';
import Record from '../Record/Record'
import styles from './MobileBodyReport.module.css'; // 파일명 변경!
import React, { useState } from 'react';

function MobileBodyReport({ data }) {
  const [activeTab, setActiveTab] = useState("종합보기");

  return (
    <div className={styles.page}>
      <Header userData={data} />  

      {/* 탭 메뉴 추가 */}
      <TabMenu activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* 탭별 콘텐츠 표시 */}
      {activeTab === "종합보기" && (
        <>
          <CautionArea
            cautionAreas={data.cautionAreas}
            footPressureImageUrl={data.footPressureImageUrl}
            kneeTrajectoryUrl={data.kneeTrajectoryUrl}
            pelvisTrajectoryUrl={data.pelvisTrajectoryUrl}
            upperSummary={data.upperSummary}
            lowerSummary={data.lowerSummary}
            riskUpperRiskLevel={data.risk_upper_risk_level}
            riskUpperRangeLevel={data.risk_upper_range_level}
            riskLowerRiskLevel={data.risk_lower_risk_level}
            riskLowerRangeLevel={data.risk_lower_range_level}
          />
          <DetailedAnalysis detailedAnalysis={data.detailedAnalysis} />
          <Heatmap heatmapData={data.heatmapData} />
          <Record />
        </>
      )}

      {activeTab === "정면측정" && (
        <>

        </>
      )}
      {activeTab === "측면측정" && (
        <>

        </>
      )}
      {activeTab === "후면측정" && (
        <>

        </>
      )}
      {activeTab === "동적측정" && (
        <>

        </>
      )}
      {activeTab === "추천운동" && (
        <>

        </>
      )}
    </div>
  );
}

export default MobileBodyReport;