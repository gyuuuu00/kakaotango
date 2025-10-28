// // data/sampleData.js
// export const mockBodyData = {
//   user: {
//     name: '홍길동',
//     id: 'OOO',
//     gender: '남',
//     age: '25',
//     date: '2024.10.15',
//     bodyType: '5'
//   },
//   analysisMessage: 'API로 받은 내용이 들어옵니다. 분석결과 측정 기록 분석 결과 ~님은 피사의 사탑체형입니다.\n측정 기록이 무릎-발목등 하체 부위에 위험도가 집중 되어있습니다. 피라미드 체형의 경우 골반 비틀림, X자 다리 등 구조적인 위험도가 있습니다.',
  
//   images: {
//     leftBody: null,
//     rightBody: null,
//     footPressure: null,
//     kneeTrajectory: null,
//     pelvisTrajectory: null,
//   },
  
//   cautionAreas: [
//     { id: 'neck', name: '목', status: 'warning', value: 55, side: 'center' },
//     { id: 'shoulder_left', name: '어깨', status: 'danger', value: 75, side: 'left' },
//     { id: 'shoulder_right', name: '어깨', status: 'warning', value: 60, side: 'right' },
//     { id: 'elbow_left', name: '팔꿈치', status: 'normal', value: 30, side: 'left' },
//     { id: 'elbow_right', name: '팔꿈치', status: 'warning', value: 55, side: 'right' },
//     { id: 'pelvis_left', name: '골반', status: 'danger', value: 80, side: 'left' },
//     { id: 'pelvis_right', name: '골반', status: 'warning', value: 65, side: 'right' },
//     { id: 'knee_left', name: '무릎', status: 'warning', value: 58, side: 'left' },
//     { id: 'knee_right', name: '무릎', status: 'danger', value: 72, side: 'right' },
//     { id: 'ankle_left', name: '발목', status: 'normal', value: 35, side: 'left' },
//     { id: 'ankle_right', name: '발목', status: 'warning', value: 52, side: 'right' }
//   ],
  
//   // 상세 분석 데이터
//   detailedAnalysis: {
//     upper: [
//       { part: '목', status: 'warning', value: 1.5, normal: 0, description: '귀와 어깨 사이 기울기' },
//       { part: '목', status: 'warning', value: 1.5, normal: 0, description: '장면에서 좌/우 기울기' },
//       { part: '목', status: 'warning', value: 1.5, normal: 0, description: '좌/우 귀높이' },
//       { part: '어깨', status: 'danger', value: 2.5, normal: 0, description: '좌/우 어깨 높이 차이' },
//       { part: '어깨', status: 'warning', value: 1.8, normal: 0, description: '좌/우 어깨 수직 기울기' },
//       { part: '어깨', status: 'warning', value: 1.5, normal: 0, description: '어깨 전방 돌출' },
//       { part: '팔꿈치', status: 'normal', value: 1.5, normal: 1.5, description: '팔꿈치 수평차이 (좌우 높이)' },
//       { part: '팔꿈치', status: 'normal', value: 1.5, normal: 1.5, description: '측면 측정 팔꿈치 거리차이' },
//       { part: '팔꿈치', status: 'normal', value: 1.5, normal: 1.5, description: '좌/우 팔꿈치 굽힘 각도 차이' }
//     ],
//     lower: [
//       { part: '골반', status: 'danger', value: 2.5, normal: 0, description: '좌/우 골반 높이 차이 각도' },
//       { part: '골반', status: 'danger', value: 2.3, normal: 0, description: '전/후 경사' },
//       { part: '골반', status: 'danger', value: 2.5, normal: 0, description: '고관절 중심 수직 높이 차이' },
//       { part: '무릎', status: 'normal', value: 0.5, normal: 0, description: '대퇴골 슬개골,경골 정렬 각도' },
//       { part: '무릎', status: 'normal', value: 0.2, normal: 0, description: '좌/우 무릎 높이 차' },
//       { part: '무릎', status: 'normal', value: 0.2, normal: 0, description: '외반슬/내반슬 거리' },
//       { part: '발목', status: 'warning', value: 4.3, normal: 3, description: '발목 내반/외반 휘어짐 각도' },
//       { part: '발목', status: 'warning', value: 1.8, normal: 0, description: '발목 좌/우 높이 차' },
//       { part: '발목', status: 'normal', value: 1.0, normal: 0, description: '발목 정렬 각도' }
//     ]
//   },
  
//   measurementHistory: [
//     { date: '10.15', overall: 62, neck: 55, shoulder: 68, pelvis: 73, knee: 65, ankle: 44 },
//     { date: '09.15', overall: 58, neck: 52, shoulder: 62, pelvis: 70, knee: 60, ankle: 40 },
//     { date: '08.15', overall: 55, neck: 48, shoulder: 58, pelvis: 68, knee: 55, ankle: 38 },
//     { date: '07.15', overall: 52, neck: 45, shoulder: 55, pelvis: 65, knee: 52, ankle: 35 },
//     { date: '06.15', overall: 50, neck: 42, shoulder: 52, pelvis: 62, knee: 50, ankle: 32 }
//   ],
  
//   heatmapData: {
//     dates: ['1월 17일', '2월 05일', '3월 29일', '4월 05일', '5월 17일', '5월 27일', '6월 12일', '7월 12일', '7월 30일', '10월 15일'],
//     parts: [
//       {
//         part: '목',
//         records: [
//           { status: 'danger', level: 2 },
//           { status: 'normal', level: 1 },
//           { status: 'normal', level: 1 },
//           { status: 'danger', level: 2 },
//           { status: 'danger', level: 3 },
//           { status: 'danger', level: 2 },
//           { status: 'danger', level: 2 },
//           { status: 'normal', level: 1 },
//           { status: 'danger', level: 1 },
//           { status: 'normal', level: 2 }
//         ]
//       },
//       {
//         part: '어깨',
//         records: [
//           { status: 'normal', level: 1 },
//           { status: 'danger', level: 2 },
//           { status: 'danger', level: 1 },
//           { status: 'danger', level: 2 },
//           { status: 'normal', level: 1 },
//           { status: 'danger', level: 2 },
//           { status: 'danger', level: 2 },
//           { status: 'danger', level: 2 },
//           { status: 'danger', level: 2 },
//           { status: 'normal', level: 1 }
//         ]
//       },
//       {
//         part: '팔꿉',
//         records: [
//           { status: 'danger', level: 2 },
//           { status: 'warning', level: 2 },
//           { status: 'warning', level: 3 },
//           { status: 'warning', level: 2 },
//           { status: 'warning', level: 2 },
//           { status: 'warning', level: 2 },
//           { status: 'normal', level: 1 },
//           { status: 'danger', level: 2 },
//           { status: 'danger', level: 3 },
//           { status: 'normal', level: 1 }
//         ]
//       },
//       {
//         part: '골반',
//         records: [
//           { status: 'danger', level: 2 },
//           { status: 'warning', level: 3 },
//           { status: 'warning', level: 3 },
//           { status: 'danger', level: 2 },
//           { status: 'warning', level: 3 },
//           { status: 'danger', level: 2 },
//           { status: 'warning', level: 3 },
//           { status: 'danger', level: 2 },
//           { status: 'warning', level: 1 },
//           { status: 'warning', level: 1 }
//         ]
//       },
//       {
//         part: '무릎',
//         records: [
//           { status: 'warning', level: 2 },
//           { status: 'warning', level: 2 },
//           { status: 'warning', level: 3 },
//           { status: 'danger', level: 2 },
//           { status: 'warning', level: 3 },
//           { status: 'danger', level: 2 },
//           { status: 'danger', level: 1 },
//           { status: 'warning', level: 3 },
//           { status: 'danger', level: 2 },
//           { status: 'warning', level: 2 }
//         ]
//       },
//       {
//         part: '발목',
//         records: [
//           { status: 'warning', level: 3 },
//           { status: 'warning', level: 3 },
//           { status: 'danger', level: 2 },
//           { status: 'danger', level: 1 },
//           { status: 'danger', level: 2 },
//           { status: 'danger', level: 1 },
//           { status: 'danger', level: 1 },
//           { status: 'normal', level: 1 },
//           { status: 'warning', level: 3 },
//           { status: 'warning', level: 3 }
//         ]
//       }
//     ]
//   }
  
// };