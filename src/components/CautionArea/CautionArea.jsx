import styles from "./CautionArea.module.css";
import bodyImage from "../../assets/bodyImage.svg";
import warningDot from "../../assets/warningdot.svg";
import dangerDot from "../../assets/dangerdot.svg";
import linkIcon from "../../assets/link.svg";
import { useState, useEffect, useMemo } from "react";



/*  프록시 URL 변환 함수 */
const toProxied = (url, tag) => {
  if (!url) return null;

  // 백엔드에 CORS가 없으므로 항상 프록시 사용
  const addTag = tag ? `&tag=${encodeURIComponent(tag)}` : "";
  try {
    return `/api/img-proxy?url=${encodeURIComponent(decodeURIComponent(url))}${addTag}`;
  } catch {
    return `/api/img-proxy?url=${encodeURIComponent(url)}${addTag}`;
  }
};

/*  배경 투명처리 함수 */
const processToTransparent = (src, threshold = 80) =>
  new Promise((resolve, reject) => {
    if (!src) return resolve(null);
    const img = new Image();

    //  외부 리소스(CORS) 접근 허용
    img.crossOrigin = "anonymous";

    img.onload = () => {
      try {
        const c = document.createElement("canvas");
        const ctx = c.getContext("2d");
        c.width = img.naturalWidth || img.width;
        c.height = img.naturalHeight || img.height;
        ctx.drawImage(img, 0, 0);

        // ✅ 픽셀 접근 테스트
        const im = ctx.getImageData(0, 0, c.width, c.height);

        const d = im.data;
        for (let i = 0; i < d.length; i += 4) {
          const [r, g, b] = [d[i], d[i + 1], d[i + 2]];
          // ✅ 어두운 픽셀은 투명 처리
          if (r < threshold && g < threshold && b < threshold) d[i + 3] = 0;
        }

        ctx.putImageData(im, 0, 0);
        resolve(c.toDataURL());
      } catch (e) {
        reject(e);
      }
    };

    img.onerror = (err) => {
      reject(err);
    };

    img.src = src;
  });

/* ✅ 퍼센트 표기 함수 */
const pct = (v) => {
  const num = +v;
  if (!Number.isFinite(num)) return "-";
  const floored = Math.floor(num);
  return floored + "%";
};

export default function CautionArea({
  // --- 공통 데이터 ---
  cautionAreas = [],
  upperSummary,
  lowerSummary,

  // --- 이미지 URL ---
  footPressureStaticUrl,
  footPressureDynamicUrl,
  kneeTrajectoryUrl,
  kneeRightTrajectoryUrl,
  pelvisTrajectoryUrl,

  // --- 족압 데이터 ---
  matStatic = {},
  matStaticHorizontalMent,
  matStaticVerticalMent,
  matOhs = {},
  matOhsHorizontalMent,
  matOhsVerticalMent,
  matOhsKneeMent,

  // --- 기타 분석 문구 ---
  kneeTrajectoryDesc,
  pelvisTrajectoryDesc,

  // --- 위험도 요약 ---
  riskUpperRiskLevel,
  riskUpperRangeLevel,
  riskLowerRiskLevel,
  riskLowerRangeLevel,
  matStaticRiskLevel,
  matStaticRangeLevel,
}) {
  /* ✅ dot 이미지 선택 */
  const getDotImage = (status) => {
    if (status === "danger") return dangerDot;
    if (status === "warning") return warningDot;
    return null;
  };

  /* ✅ dot 스타일 클래스 */
  const dotClass = (s) =>
    s === "danger" ? styles.danger : s === "warning" ? styles.warning : styles.normal;

  /* ✅ 프록시 URL 메모이제이션 */
  const urls = useMemo(() => {
    return {
      footStatic: toProxied(footPressureStaticUrl, "static"),
      footDynamic: toProxied(footPressureDynamicUrl, "dynamic"),
      knee: toProxied(kneeTrajectoryUrl, "knee"),
      kneeRight: toProxied(kneeRightTrajectoryUrl, "knee-right"),
      pelvis: toProxied(pelvisTrajectoryUrl, "pelvis"),
    };
  }, [
    footPressureStaticUrl,
    footPressureDynamicUrl,
    kneeTrajectoryUrl,
    kneeRightTrajectoryUrl,
    pelvisTrajectoryUrl,
  ]);

  /* ✅ 투명처리 이미지 상태 관리 */
  const [processed, setProcessed] = useState({
    footStatic: null,
    footDynamic: null,
    knee: null,
    kneeRight: null,
    pelvis: null,
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [ps, pd, pk, pkr, pp] = await Promise.allSettled([
        processToTransparent(urls.footStatic, 200),
        processToTransparent(urls.footDynamic, 200),
        processToTransparent(urls.knee, 85),
        processToTransparent(urls.kneeRight, 85),
        processToTransparent(urls.pelvis, 80),         
      ]);
      if (cancelled) return;
      setProcessed({
        footStatic: ps.value || null,
        footDynamic: pd.value || null,
        knee: pk.value || null,
        kneeRight: pkr.value || null,
        pelvis: pp.value || null,
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [urls]);

  // ✅ 위험도 색상
  const getLevelClass = (riskLevel) => {
    if (riskLevel === 0) return styles.normal;
    if (riskLevel === 1) return styles.warn;
    if (riskLevel === 2) return styles.dang;
    return styles.normal;
  };

  const getLevelText = (riskLevel, rangeLevel) => {
    const riskText = riskLevel === 0 ? "정상" : riskLevel === 1 ? "주의" : "위험";
    return `${riskText} ${rangeLevel}단계`;
  };



  return (
    <div className={styles.caGrid}>
      {/* 주의 부위 */}
      <div className={`${styles.card} ${styles.cell1}`}>
        <div className={styles.body}>
          <div className={styles.sideLabel}>
            <span>좌측</span>
            <span>우측</span>
          </div>
          <div className={styles.human}>
            <img src={bodyImage} alt="신체" className={styles.bodyImg} />
            {cautionAreas.map((a, i) => {
              // 모바일/데스크톱 좌표를 각각 사용 (좌표는 그대로 적용)
              const mobileY = a.y !== undefined ? a.y : (22 + (i % 4) * 18);
              const mobileX = a.x !== undefined ? a.x : (a.side === "left" ? 34 : 66);
              const desktopY = a.desktopY !== undefined ? a.desktopY : mobileY;
              const desktopX = a.desktopX !== undefined ? a.desktopX : mobileX;

              return (
                <img
                  key={i}
                  src={getDotImage(a.status)}
                  alt={a.name}
                  className={`${styles.dot} ${dotClass(a.status)}`}
                  style={{
                    '--mobile-top': `${mobileY}%`,
                    '--mobile-left': `${mobileX}%`,
                    '--desktop-top': `${desktopY}%`,
                    '--desktop-left': `${desktopX}%`,
                  }}
                  title={`${a.name ?? "부위"}: ${a.status}`}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* 측정 결과 요약 */}
      <div className={`${styles.card} ${styles.cell2}`}>
        <div className={styles.body}>
          <div className={styles.textBox1}>
            <div className={styles.headRow}>
              <h4 className={styles.sub}>상지 결과요약</h4>
              <span className={`${styles.levelTag} ${getLevelClass(riskUpperRiskLevel)}`}>
                {getLevelText(riskUpperRiskLevel, riskUpperRangeLevel)}
              </span>
            </div>
            <p className={styles.txt}>{upperSummary}</p>
          </div>
          <div className={styles.textBox2}>
            <div className={styles.headRow}>
              <h4 className={styles.sub}>하지 결과요약</h4>
              <span className={`${styles.levelTag} ${getLevelClass(riskLowerRiskLevel)}`}>
                {getLevelText(riskLowerRiskLevel, riskLowerRangeLevel)}
              </span>
            </div>
            <p className={styles.txt}>{lowerSummary}</p>
          </div>
        </div>
      </div>

      {/* 왼쪽 컬럼 wrapper */}
      <div className={styles.leftColumn}>
        {/* Tang Body Tip */}
        <div className={`${styles.card} ${styles.cell3}`}>
          <div className={styles.body}>
            <div className={styles.bodyHeader}>
              <div className={styles.tipSmall}>*측정 기준 설명</div>
              <div className={styles.statusTable}>
                <div className={`${styles.status} ${styles.ok}`} style={{borderRadius:'10px 0 0 10px '}}>정상</div>
                <div className={`${styles.status} ${styles.warn}`} style={{borderRadius:'0'}}>주의</div>
                <div className={`${styles.status} ${styles.dang}`} style={{borderRadius:'0 10px 10px 0'}}>위험</div>
                <div className={styles.stateful}>상태 유지 강화 권장</div>
                <div className={styles.descStrong}>제공되는 맞춤 운동 권장</div>
                <div className={styles.desc}>전문가 상담 권장</div>
              </div>
            </div>
          </div>
        </div>

        {/* 족압 정적 측정 */}
        <div className={`${styles.card} ${styles.cell4}`}>
        <div className={styles.bodyHeader}>
          <div className={styles.headRow}>
            <h4 className={styles.subTitle}>정적 족압</h4>
            <span className={`${styles.levelTag} ${getLevelClass(matStaticRiskLevel)}`}>
              {getLevelText(matStaticRiskLevel, matStaticRangeLevel)}
            </span>
          </div>

          <div className={styles.body}>
            {/* 이미지 + 퍼센트 */}
            <div className={styles.pressureBox}>
              {processed.footStatic ? (
                <img
                  src={processed.footStatic}
                  alt="정적 족압"
                  className={styles.pressureImg}
                />
              ) : (
                <div className={styles.ph}>처리 중...</div>
              )}

              {/* 중앙 십자 + 퍼센트 */}
              <div className={styles.overlay}>
                <div className={styles.cross}>＋</div>
                <div className={`${styles.percent} ${styles.top}`}>
                  {pct(matStatic?.top)}
                </div>
                <div className={`${styles.percent} ${styles.bottom}`}>
                  {pct(matStatic?.bot)}
                </div>
                <div className={`${styles.percent} ${styles.left}`}>
                  {pct(matStatic?.midL)}
                </div>
                <div className={`${styles.percent} ${styles.right}`}>
                  {pct(matStatic?.midR)}
                </div>
              </div>
            </div>

            {/* 설명 */}
            <div className={styles.captionBox}>
              <p className={styles.captionTitle}>좌우 무게 분석</p>
              <p className={styles.captionText}>{matStaticHorizontalMent}</p>
              <p className={styles.captionTitle}>상하 무게 분석</p>
              <p className={styles.captionText}>{matStaticVerticalMent}</p>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* 족압 동적 측정 */}
      <div className={`${styles.card} ${styles.cell5}`}>
        <div className={styles.bodyHeader}>
          <div className={styles.headRow}>
            <h4 className={styles.subTitle}>동적 족압, 관절 이동</h4>
          </div>

          <div className={styles.body}>
            {/* 동적 족압 + 골반 */}
            <div className={styles.dynamicGrid}>
              {/* 동적 족압 분석 */}
              <div className={styles.gridItem}>
                <p className={styles.itemLabel}>동적 족압 분석</p>
                <div className={styles.pressureBox}>
                  {processed.footDynamic ? (
                    <img src={processed.footDynamic} alt="족압 동적" className={styles.pressureImg} />
                  ) : footPressureDynamicUrl ? (
                    <div className={styles.ph}>처리 중...</div>
                  ) : (
                    <div className={styles.ph}>족압 이미지</div>
                  )}
                  <div className={styles.overlay}>
                    <div className={styles.cross}>＋</div>
                    <div className={`${styles.percent} ${styles.top}`}>{pct(matOhs?.top)}</div>
                    <div className={`${styles.percent} ${styles.bottom}`}>{pct(matOhs?.bot)}</div>
                    <div className={`${styles.percent} ${styles.left}`}>{pct(matOhs?.midL)}</div>
                    <div className={`${styles.percent} ${styles.right}`}>{pct(matOhs?.midR)}</div>
                  </div>
                </div>
              </div>

              {/* 골반 이동 분석 */}
              <div className={styles.gridItem}>
                <p className={styles.itemLabel}>골반 이동 분석</p>
                <div className={styles.pressureBox}>
                  {processed.pelvis ? (
                    <img src={processed.pelvis} alt="골반 이동 궤적" />
                  ) : urls.pelvis ? (
                    <div className={styles.ph}>처리 중...</div>
                  ) : (
                    <div className={styles.ph}>골반 이동</div>
                  )}
                </div>
              </div>
            </div>

            {/* 족압 설명 */}
            <div className={styles.captionBox}>
              <p className={styles.captionTitle}>좌우 무게 분석</p>
              <p className={styles.captionText}>{matOhsHorizontalMent}</p>
              <p className={styles.captionTitle}>상하 무게 분석</p>
              <p className={styles.captionText}>{matOhsVerticalMent}</p>
            </div>

            {/* 무릎 섹션 */}
            <div className={styles.kneeSection}>
              
              <div className={styles.kneeGrid}>
                {/* 무릎 L */}
                <div className={styles.kneeItem}>
                  <p className={styles.kneeLabel}>무릎 이동 궤적(L)</p>
                  <div className={styles.pressureBox}>
                    {processed.knee ? (
                      <img src={processed.knee} alt="왼쪽 무릎 이동 궤적" />
                    ) : urls.knee ? (
                      <div className={styles.ph}>처리 중...</div>
                    ) : (
                      <div className={styles.ph}>무릎 이동</div>
                    )}
                  </div>
                </div>

                 <div className={styles.linkIconWrapper}>
                  <img src={linkIcon} alt="연결" className={styles.linkIcon} />
                </div>

                {/* 무릎 R */}
                <div className={styles.kneeItem}>
                  <p className={styles.kneeLabel}>무릎 이동 궤적(R)</p>
                  <div className={styles.pressureBox}>
                    {processed.kneeRight ? (
                      <img src={processed.kneeRight} alt="오른쪽 무릎 이동 궤적" />
                    ) : urls.kneeRight ? (
                      <div className={styles.ph}>처리 중...</div>
                    ) : (
                      <div className={styles.ph}>무릎 이동</div>
                    )}
                  </div>
                </div>
              </div>

              {/* 무릎 설명 */}
              <div className={styles.captionBox}>
                <p className={styles.captionTitle}>무릎 이동 분석</p>
                <p className={styles.captionText}>{matOhsKneeMent || kneeTrajectoryDesc}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> 
  );
}