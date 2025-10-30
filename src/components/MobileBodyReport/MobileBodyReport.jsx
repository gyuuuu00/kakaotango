// MobileBodyReport.jsx
import React, { useState, useEffect } from "react";
import Header from "../Header/Header";
import TabMenu from "../TabMenu/TabMenu";
import CautionArea from "../CautionArea/CautionArea";
import DetailedAnalysis from "../DetailedAnalysis/DetailedAnalysis";
import Heatmap from "../Heatmap/Heatmap";
import Record from "../Record/Record";
import FrontView from "../FrontView/FrontView";
import SideView from "../SideView/SideView";
import BackView from "../BackView/BackView";
import SquatView from "../SquatView/SquatView";
import ExerciseRecommendation from "../ExerciseRecommendation/ExerciseRecommendation";
import styles from "./MobileBodyReport.module.css";

import {
  fetchBodyReport,
  fetchFrontView,
  fetchSideView,
  fetchBackView,
  fetchSquatView,
  fetchExerciseRecommendation,
} from "../../api/mobileApi";

function MobileBodyReport({ data: initialData, t_r}) {
  const [activeTab, setActiveTab] = useState("종합보기");
  const [data, setData] = useState(null);
  const [headerData, setHeaderData] = useState(null);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const loadData = async () => {
      if (!t_r) return;

      // 종합보기는 App.jsx에서 이미 받은 데이터 사용
      if (activeTab === "종합보기") {
        setData(initialData);
        if (initialData?.result_summary_data) {
          setHeaderData(initialData.result_summary_data);
        }
        return;
      }

      setLoading(true);

      try {
        let result;
        switch (activeTab) {
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
  }, [activeTab, t_r, initialData]);

  if (loading) return <div className={styles.loading}>데이터 로딩 중...</div>;

  const summary = data?.result_summary_data || {};
  const staticMat = data?.static_mat_data || {};
  const dynamicMat = data?.dynamic_mat_data || {};

  // === 위험도 변환 ===
  const getRiskStatus = (riskLevel) => {
    const level = String(riskLevel);
    if (level === "2") return "danger";
    if (level === "1") return "warning";
    return "normal";
  };

  // === cautionAreas 생성 ===
  const cautionAreas = [];
  const addIfRisk = (cond, name, status, y, x, side) => {
    if (cond) cautionAreas.push({ name, status, y, x, side });
  };
  addIfRisk(summary.risk_neck !== "0" && summary.risk_neck != null, "목", getRiskStatus(summary.risk_neck), 22, 47, "center");
  addIfRisk(summary.risk_shoulder_left !== "0" && summary.risk_shoulder_left != null, "어깨(좌)", getRiskStatus(summary.risk_shoulder_left), 28, 40, "left");
  addIfRisk(summary.risk_shoulder_right !== "0" && summary.risk_shoulder_right != null, "어깨(우)", getRiskStatus(summary.risk_shoulder_right), 28, 54, "right");
  addIfRisk(summary.risk_elbow_left !== "0" && summary.risk_elbow_left != null, "팔꿈치(좌)", getRiskStatus(summary.risk_elbow_left), 37, 38, "left");
  addIfRisk(summary.risk_elbow_right !== "0" && summary.risk_elbow_right != null, "팔꿈치(우)", getRiskStatus(summary.risk_elbow_right), 37, 55, "right");
  addIfRisk(summary.risk_hip_left !== "0" && summary.risk_hip_left != null, "골반(좌)", getRiskStatus(summary.risk_hip_left), 48, 42, "left");
  addIfRisk(summary.risk_hip_right !== "0" && summary.risk_hip_right != null, "골반(우)", getRiskStatus(summary.risk_hip_right), 48, 52, "right");
  addIfRisk(summary.risk_knee_left !== "0" && summary.risk_knee_left != null, "무릎(좌)", getRiskStatus(summary.risk_knee_left), 64, 44, "left");
  addIfRisk(summary.risk_knee_right !== "0" && summary.risk_knee_right != null, "무릎(우)", getRiskStatus(summary.risk_knee_right), 64, 50, "right");
  addIfRisk(summary.risk_ankle_left !== "0" && summary.risk_ankle_left != null, "발목(좌)", getRiskStatus(summary.risk_ankle_left), 75, 43, "left");
  addIfRisk(summary.risk_ankle_right !== "0" && summary.risk_ankle_right != null, "발목(우)", getRiskStatus(summary.risk_ankle_right), 75, 51, "right");

  return (
    <div className={styles.page}>
      <Header userData={headerData || { user_name: "-", test_date: "-" }} />
      <TabMenu activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* 탭별 콘텐츠 표시 */}
      {activeTab === "종합보기" && data && (
        <>
          <CautionArea
            cautionAreas={cautionAreas}
            upperSummary={summary.risk_upper_ment}
            lowerSummary={summary.risk_lower_ment}
            riskUpperRiskLevel={Number(summary.risk_upper_risk_level)}
            riskUpperRangeLevel={Number(summary.risk_upper_range_level)}
            riskLowerRiskLevel={Number(summary.risk_lower_risk_level)}
            riskLowerRangeLevel={Number(summary.risk_lower_range_level)}

            /* ✅ 정적 족압 데이터 */
            footPressureStaticUrl={staticMat?.measure_server_mat_image_name}
            matStatic={{
              top: summary?.mat_static_top_pressure,
              midL: summary?.mat_static_left_pressure,
              midR: summary?.mat_static_right_pressure,
              bot: summary?.mat_static_bottom_pressure,
            }}
            matStaticHorizontalMent={staticMat?.mat_static_horizontal_ment}
            matStaticVerticalMent={staticMat?.mat_static_vertical_ment}

            /* ✅ 동적 족압 데이터 */
            footPressureDynamicUrl={dynamicMat?.mat_hip_down_image_name}
            matOhs={{
              top: summary?.mat_ohs_top_pressure,
              midL: summary?.mat_ohs_left_pressure,
              midR: summary?.mat_ohs_right_pressure,
              bot: summary?.mat_ohs_bottom_pressure,
            }}
            matOhsHorizontalMent={dynamicMat?.mat_ohs_horizontal_ment}
            matOhsVerticalMent={dynamicMat?.mat_ohs_vertical_ment}
            matOhsKneeMent={dynamicMat?.mat_ohs_knee_ment}

            /* ✅ 궤적 이미지 */
            kneeTrajectoryUrl={dynamicMat?.mat_left_knee_trajectory_image_name}
            kneeRightTrajectoryUrl={dynamicMat?.mat_right_knee_trajectory_image_name}
            pelvisTrajectoryUrl={dynamicMat?.mat_hip_trajectory_image_name}
          />

          <DetailedAnalysis detailedAnalysis={data.detail_data} />
          <Heatmap heatmapData={data} />
          <Record recordData={data.result_history_data} />
        </>
      )}

      {activeTab === "정면측정" && <FrontView data={data} />}
      {activeTab === "측면측정" && <SideView data={data} />}
      {activeTab === "후면측정" && <BackView data={data} />}
      {activeTab === "동적측정" && <SquatView data={data} />}
      {activeTab === "추천운동" && <ExerciseRecommendation data={data} t_r={t_r} />}
    </div>
  );
}

export default MobileBodyReport;