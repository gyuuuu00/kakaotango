import styles from './DetailedAnalysis.module.css';
import NormalArrow from '../../assets/state_arrow.svg';
import WarningArrow from '../../assets/state_arrow2.svg';
import DangerArrow from '../../assets/state_arrow3.svg';
import { useState } from 'react';

function DetailedAnalysis({ detailedAnalysis }) {
  // 값에 따라 화살표 위치 계산 (0-100%)
  const calculatePosition = (diff) => {
    if (diff <= 1) {
    return 16.5;
  } else if (diff <= 2) {
    return 50;
  } else {
    return 83.5;
  }
};

  

  // 레벨/상태에 따른 배지 스타일 결정
  const getBadgeStyle = (level) => {
    if (!level) return {};
    
    if (level.includes('위험')) {
      return { backgroundColor: '#fee2e2', color: '#ff0000' };
    } else if (level.includes('주의')) {
      return { backgroundColor: '#fef3c7', color: '#FF8C00' };
    } else {
      return { backgroundColor: '#e5e7eb', color: '#6b7280' };
    }
  };

  // 레벨에 따른 텍스트 색상
  const getLevelColor = (level) => {
    if (!level) return '#6b7280';
    
    if (level.includes('위험')) return '#dc2626';
    if (level.includes('주의')) return '#d97706';
    return '#6b7280';
  };

  // flat array를 category grouped 구조로 변환
  const transformData = (data) => {
    if (!data || !Array.isArray(data)) return [];
    
    const categoryMap = {
      '목': '목',
      '어깨(좌)': '어깨',
      '어깨(우)': '어깨',
      '팔꿈치(좌)': '팔꿈치',
      '팔꿈치(우)': '팔꿈치',
      '골반(좌)': '골반',
      '골반(우)': '골반',
      '무릎(좌)': '무릎',
      '무릎(우)': '무릎',
      '발목(좌)': '발목',
      '발목(우)': '발목'
    };
    
    const grouped = {};
    
    data.forEach(item => {
      if (!item || !item.part) return;
      
      const category = categoryMap[item.part] || item.part;
      
      if (!grouped[category]) {
        grouped[category] = {
          category: category,
          level: '정상 1단계',
          items: []
        };
      }
      
      // 가장 높은 위험도를 카테고리 레벨로 설정
      if (item.status === 'danger') {
        grouped[category].level = '위험 2단계';
      } else if (item.status === 'warning' && grouped[category].level !== '위험 2단계') {
        grouped[category].level = '주의 1단계';
      }
      
      grouped[category].items.push({
        measure: item.description || item.part,
        value: item.value || 0,
        normal: item.normal || 0,
        status: item.status,
        direction: item.value > item.normal ? '우측' : item.value < item.normal ? '좌측' : '정상',
        diff: Math.abs(item.value - item.normal)
      });
    });
    
    return Object.values(grouped);
  };

  const renderCategoryRows = (categoryData) => {
    if (!categoryData || !Array.isArray(categoryData)) return null;
    
    const data = transformData(categoryData);
    
    return data.map((category, catIdx) => {
      if (!category || !category.items || !Array.isArray(category.items)) return null;
      
      return (
        <div key={catIdx} className={styles.categoryGroup}>
          <div className={styles.categoryCell}>
            <div className={styles.categoryBadge} style={getBadgeStyle(category.level)}>
              {category.category}
            </div>
            {category.level && (
              <div className={styles.categoryLevel} style={{ color: getLevelColor(category.level) }}>
                {category.level}
              </div>
            )}
          </div>
          <div className={styles.measureRows}>
            {category.items.map((item, itemIdx) => {
              const statusClass = item.status === 'danger' ? styles.danger : 
                                 item.status === 'warning' ? styles.warning : styles.normal;
               
              const arrowImage = item.status === 'danger' ? DangerArrow :
                                 item.status === 'warning' ? WarningArrow :
                                 NormalArrow;
              const activeSegment = item.diff < 1 ? 'normal' : 
                                    item.diff < 2 ? 'warning' : 'danger';
              const textColor = item.diff < 1 ? '#CDCDCD' :   
                                item.diff < 2 ? '#FF8C00' :    
                                '#FF0000';                      
              
              return (
                <div key={itemIdx} className={styles.measureRow}>
                  <div className={styles.measureText}>{item.measure}</div>
                  <div className={styles.measureStatus}>
                    <div className={styles.statusBar}>
                      {/* 3등분 고정 배경 */}
                      <div className={`${styles.barSegment} ${activeSegment === 'normal' ? styles.active : ''}`}data-status="normal"></div>
                      <div className={`${styles.barSegment} ${activeSegment === 'warning' ? styles.active : ''}`} data-status="warning"></div>
                      <div className={`${styles.barSegment} ${activeSegment === 'danger' ? styles.active : ''}`} data-status="danger"></div>
                      

                      {/* SVG 화살표 */}
                      <img 
                        src={arrowImage}
                        alt="status arrow"
                        className={styles.statusIndicator}
                        style={{ 
                          left: `${calculatePosition(item.diff)}%`
                        }}
                      />
                    </div>
                    <span className={styles.statusValue} style={{left: `${calculatePosition(item.diff)}%`, color: textColor}}>
                      {item.direction} +{item.diff?.toFixed(1)}cm
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {/* 상체분석 */}
        <div className={styles.section}>
          {/* 헤더 */}
          <div className={styles.tableHeader}>
            <div className={styles.colCategory}>상체분석</div>
            <div className={styles.colMeasure}>측정 기준</div>
            <div className={styles.colStatus}>
              <span className={styles.statusLabel} style={{color:'#d9d9d9'}}>정상</span>
              <span className={styles.arrowIcon}>▶</span>
              <span className={styles.statusLabel} style={{color:'#ff8c00'}}>주의</span>
              <span className={styles.arrowIcon}>▶</span>
              <span className={styles.statusLabel} style={{color:'#F11212'}}>위험</span>
            </div>
          </div>

          {/* 테이블 바디 */}
          <div className={styles.tableBody}>
            {renderCategoryRows(detailedAnalysis?.upper)}
          </div>
        </div>

        {/* 하체분석 */}
        <div className={styles.section}>
          {/* 헤더 */}
          <div className={styles.tableHeader}>
            <div className={styles.colCategory}>하체분석</div>
            <div className={styles.colMeasure}>측정 기준</div>
            <div className={styles.colStatus}>
              <span className={styles.statusLabel} style={{color:'#d9d9d9'}}>정상</span>
              <span className={styles.arrowIcon}>▶</span>
              <span className={styles.statusLabel} style={{color:'#ff8c00'}}>주의</span>
              <span className={styles.arrowIcon}>▶</span>
              <span className={styles.statusLabel} style={{color:'#F11212'}}>위험</span>
            </div>
          </div>

          {/* 테이블 바디 */}
          <div className={styles.tableBody}>
            {renderCategoryRows(detailedAnalysis?.lower)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailedAnalysis;