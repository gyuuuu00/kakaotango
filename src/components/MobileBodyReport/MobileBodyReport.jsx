import React, { useState, useEffect } from "react";
import Header from "../Header/Header";
import TabMenu from "../TabMenu/TabMenu";
import CautionArea from "../CautionArea/CautionArea";
import DetailedAnalysis from "../DetailedAnalysis/DetailedAnalysis";
import Heatmap from "../Heatmap/Heatmap";
import Record from "../Record/Record";
import FrontView from "../FrontView/FrontView";
import SideView from "../SideView/SideView";
import styles from "./MobileBodyReport.module.css";

import {
  fetchBodyReport,
  fetchFrontView,
  fetchSideView,
  fetchBackView,
  fetchSquatView,
  fetchExerciseRecommendation,
} from "../../api/mobileApi";

function MobileBodyReport() {
  const [activeTab, setActiveTab] = useState("종합보기");
  const [data, setData] = useState(null);
  const [headerData, setHeaderData] = useState(null); // ✅ 헤더용 별도 데이터
  const [loading, setLoading] = useState(false);

  const sp = new URLSearchParams(window.location.search);
  const t_r = decodeURIComponent(sp.get("t_r") || "").replace(/\s+/g, "");
  const mobile = "01083700106"; // 임시

  useEffect(() => {
    const loadData = async () => {
      if (!t_r) return;
      setLoading(true);

      try {
        let result;
        switch (activeTab) {
          case "종합보기":
            result = await fetchBodyReport(t_r, mobile);
            // ✅ 헤더용 데이터 저장
            if (result?.data?.result_summary_data) {
              setHeaderData(result.data.result_summary_data);
            }
            break;
          case "정면측정":
            result = await fetchFrontView(t_r);
            break;
          case "측면측정":
            result = await fetchSideView(t_r);
            break;
          case "후면측정":
            result = await fetchBackView(t_r);
            break;
          case "동적측정":
            result = await fetchSquatView(t_r);
            break;
          case "추천운동":
            result = await fetchExerciseRecommendation(t_r);
            break;
          default:
            return;
        }

        console.log("📦 받은 데이터:", result);
        setData(result.data || result); 
      } catch (err) {
        console.error(`${activeTab} 데이터 로드 실패:`, err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [activeTab, t_r]);

  if (loading) return <div className={styles.loading}>데이터 로딩 중...</div>;

  return (
    <div className={styles.page}>
      {/* ✅ Header는 headerData 기반 */}
      <Header userData={headerData || { user_name: "-", test_date: "-" }} />

      <TabMenu activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 탭별 콘텐츠 표시 */}
      {activeTab === "종합보기" && data && (
        <>
          <CautionArea
            cautionAreas={data.cautionAreas}
            upperSummary={data.result_summary_data?.risk_upper_ment}
            lowerSummary={data.result_summary_data?.risk_lower_ment}
            riskUpperRiskLevel={data.result_summary_data?.risk_upper_risk_level}
            riskUpperRangeLevel={data.result_summary_data?.risk_upper_range_level}
            riskLowerRiskLevel={data.result_summary_data?.risk_lower_risk_level}
            riskLowerRangeLevel={data.result_summary_data?.risk_lower_range_level}
            footPressureImageUrl={data.static_mat_data?.measure_server_mat_image_name}
            kneeTrajectoryUrl={data.dynamic_mat_data?.mat_left_knee_trajectory_image_name}
            pelvisTrajectoryUrl={data.dynamic_mat_data?.mat_hip_trajectory_image_name}
            footPressureStaticDesc={data.static_mat_data?.mat_static_horizontal_ment}
            footPressureDynamicDesc={data.dynamic_mat_data?.mat_ohs_horizontal_ment}
            kneeTrajectoryDesc={data.dynamic_mat_data?.mat_ohs_knee_ment}
            pelvisTrajectoryDesc={data.dynamic_mat_data?.mat_ohs_vertical_ment}
          />
          <DetailedAnalysis detailedAnalysis={data.detail_data} />
          <Heatmap heatmapData={data.static_mat_data} />
          <Record recordData={data.result_history_data} />
        </>
      )}

      {activeTab === "정면측정" && <FrontView data={data} />}
      {activeTab === "측면측정" && <SideView data={data} />}
      {activeTab === "후면측정" && <div>후면 데이터: {JSON.stringify(data)}</div>}
      {activeTab === "동적측정" && <div>동적 데이터: {JSON.stringify(data)}</div>}
      {activeTab === "추천운동" && <div>추천 운동 데이터: {JSON.stringify(data)}</div>}
    </div>
  );
}

export default MobileBodyReport;