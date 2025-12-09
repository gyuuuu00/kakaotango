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
  const [cameraOrientation, setCameraOrientation] = useState(0);


      useEffect(() => {
      const loadData = async () => {
        if (!t_r) return;

        // 종합보기는 App.jsx에서 이미 받은 데이터 사용
        if (activeTab === "종합보기") {
          const bodyReportData = initialData?.data ? initialData.data : initialData;
          setData(bodyReportData);          
          
          if (bodyReportData?.result_summary_data) {

            // summary_data에서 카메라 방향 여부 확인 후 다른 컴포넌트들한테 전달
            const orientation = bodyReportData.result_summary_data.camera_orientation || 0;
            setCameraOrientation(orientation);


            // 헤더 날짜 설정(시간 제거)
            setHeaderData({
              ...bodyReportData.result_summary_data,
              measure_date: bodyReportData.result_summary_data.measure_date?.split(' ')[0]  
            });
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

        setData(result.data || result);
      } catch (err) {
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
  const addIfRisk = (cond, name, status, mobileY, mobileX, desktopY, desktopX, side) => {
    if (cond) cautionAreas.push({ name, status, y: mobileY, x: mobileX, desktopY, desktopX, side });
  };
  addIfRisk(summary.risk_neck !== "0" && summary.risk_neck != null, "목", getRiskStatus(summary.risk_neck), 13, 47, 13, 49, "center");
  addIfRisk(summary.risk_shoulder_left !== "0" && summary.risk_shoulder_left != null, "어깨(좌)", getRiskStatus(summary.risk_shoulder_left), 20, 36.55, 20, 45, "left");
  addIfRisk(summary.risk_shoulder_right !== "0" && summary.risk_shoulder_right != null, "어깨(우)", getRiskStatus(summary.risk_shoulder_right), 20, 56.55, 20, 52.5, "right");
  addIfRisk(summary.risk_elbow_left !== "0" && summary.risk_elbow_left != null, "팔꿈치(좌)", getRiskStatus(summary.risk_elbow_left), 32, 34.55, 32, 44.5, "left");
  addIfRisk(summary.risk_elbow_right !== "0" && summary.risk_elbow_right != null, "팔꿈치(우)", getRiskStatus(summary.risk_elbow_right), 32, 59.55, 32, 53.5, "right");
  addIfRisk(summary.risk_hip_left !== "0" && summary.risk_hip_left != null, "골반(좌)", getRiskStatus(summary.risk_hip_left), 46, 40.5, 47, 46.5, "left");
  addIfRisk(summary.risk_hip_right !== "0" && summary.risk_hip_right != null, "골반(우)", getRiskStatus(summary.risk_hip_right), 46, 53.5, 48, 51.5, "right");
  addIfRisk(summary.risk_knee_left !== "0" && summary.risk_knee_left != null, "무릎(좌)", getRiskStatus(summary.risk_knee_left), 68, 41.5, 68, 47, "left");
  addIfRisk(summary.risk_knee_right !== "0" && summary.risk_knee_right != null, "무릎(우)", getRiskStatus(summary.risk_knee_right), 68, 52.5, 68, 51, "right");
  addIfRisk(summary.risk_ankle_left !== "0" && summary.risk_ankle_left != null, "발목(좌)", getRiskStatus(summary.risk_ankle_left), 85, 41, 85, 46.7, "left");
  addIfRisk(summary.risk_ankle_right !== "0" && summary.risk_ankle_right != null, "발목(우)", getRiskStatus(summary.risk_ankle_right), 85, 53, 85, 51, "right");

  return (
    <div className={styles.page}>
      <Header userData={headerData || { user_name: "-", measure_date: "-" }} />
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
            matStaticRiskLevel={Number(summary.mat_static_risk_level)}
            matStaticRangeLevel={Number(summary.mat_static_range_level)}

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

            kneeTrajectoryUrl={dynamicMat?.mat_left_knee_trajectory_image_name}
            kneeRightTrajectoryUrl={dynamicMat?.mat_right_knee_trajectory_image_name}
            pelvisTrajectoryUrl={dynamicMat?.mat_hip_trajectory_image_name}
          />

          <div>
            <DetailedAnalysis
              detailedAnalysis={data.detail_data}
              summaryData={data.result_summary_data}
            />
            <div className={styles.bottomRow}>
              <Heatmap heatmapData={data} />
              <Record recordData={data.result_history_data} />
            </div>
          </div>
        </>
      )}

      {activeTab === "정면측정" && <FrontView data={data} cameraOrientation={cameraOrientation} />}
      {activeTab === "측면측정" && <SideView data={data} cameraOrientation={cameraOrientation} />}
      {activeTab === "후면측정" && <BackView data={data} cameraOrientation={cameraOrientation} />}
      {activeTab === "동적측정" && <SquatView data={data} cameraOrientation={cameraOrientation} />}
      {activeTab === "추천운동" && <ExerciseRecommendation data={data} t_r={t_r} />}
    </div>
  );
}

export default MobileBodyReport;