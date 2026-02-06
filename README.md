# TangoBody (탱고바디)

신체 자세 분석 및 운동 추천 웹 애플리케이션

## 프로젝트 소개

TangoBody는 사용자의 신체 측정 데이터를 시각화하고 맞춤 운동을 추천하는 플랫폼입니다.

### 주요 기능

- **신체 자세 분석**: 정면, 측면, 후면, 동적(스쿼트) 측정 데이터 시각화
- **위험도 평가**: 10개 신체 부위별 위험도 표시 (정상/경고/위험)
- **족압 분석**: 정적/동적 족압 분포 및 좌우 균형 평가
- **운동 추천**: 위험 부위별 맞춤 운동 프로그램 추천
- **측정 이력**: 히트맵을 통한 시간별 변화 추적
- **반응형 디자인**: 모바일/데스크탑 최적화

---

## 기술 스택

| 분류 | 기술 |
|------|------|
| Framework | React 19 |
| Language | TypeScript 5.9 |
| Build Tool | Vite 7 |
| Routing | React Router DOM 7 |
| HTTP Client | Axios |
| Deployment | Vercel |

---

## 프로젝트 구조

```
src/
├── main.jsx                    # React 진입점
├── App.jsx                     # 루트 컴포넌트 (로그인 화면)
├── api/
│   └── mobileApi.js            # 백엔드 API 호출 함수
├── components/
│   ├── MobileBodyReport/       # 메인 대시보드 레이아웃
│   ├── Header/                 # 헤더 (사용자명, 측정일)
│   ├── TabMenu/                # 탭 네비게이션
│   ├── CautionArea/            # 신체 부위 위험도 시각화
│   ├── DetailedAnalysis/       # 상세 분석 데이터
│   ├── Heatmap/                # 측정 이력 히트맵
│   ├── Record/                 # 측정 기록
│   ├── FrontView/              # 정면 측정 결과
│   ├── SideView/               # 측면 측정 결과
│   ├── BackView/               # 후면 측정 결과
│   ├── SquatView/              # 동적 측정 결과
│   ├── ExerciseRecommendation/ # 추천 운동 목록
│   ├── ExerciseDetail/         # 운동 상세 정보
│   └── common/                 # 공통 컴포넌트
├── data/
│   ├── bodyTypes.js            # 신체 타입 데이터 (8가지 체형)
│   └── sampleData.js           # 샘플 데이터
├── types/
│   └── pose.ts                 # 포즈 관련 타입 정의
├── utils/
│   ├── drawLineStep.ts         # 랜드마크 라인 그리기 유틸
│   └── videoUtils.ts           # 비디오 관련 유틸
├── hooks/
│   ├── useStaticLandmark.ts    # 이미지 랜드마크 훅
│   └── useVideoPlayer.ts       # 비디오 플레이어 훅
└── assets/                     # 이미지, 아이콘 리소스
```

---

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 **http://localhost:5073** 으로 접속하면 개발 페이지를 볼 수 있습니다.

### 3. 프로덕션 빌드

```bash
npm run build
```

### 4. 빌드 결과물 미리보기

```bash
npm run preview
```

---

## 스크립트 명령어

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | 개발 서버 실행 (localhost:5073) |
| `npm run build` | 프로덕션 빌드 |
| `npm run preview` | 빌드 결과물 미리보기 |
| `npm run lint` | ESLint 코드 검사 |

---

## 화면 구성

| 탭 | 설명 |
|----|------|
| 종합보기 | 전체 신체 상태 요약 및 위험도 표시 |
| 정면측정 | 정면 자세 분석 결과 |
| 측면측정 | 좌/우 측면 자세 분석 결과 |
| 후면측정 | 후면 자세 분석 결과 |
| 동적측정 | 스쿼트 동작 분석 결과 |
| 추천운동 | 부위별 맞춤 운동 프로그램 |

---

## Landmark 적용 관련 파일

### Video

| 경로 | 파일 | 설명 |
|------|------|------|
| components/ | VideoPlayer.tsx | 비디오 플레이어 컴포넌트 |
| hooks/ | useVideoPlayer.ts | 비디오 플레이어 훅 |

### Image

| 경로 | 파일 | 설명 |
|------|------|------|
| components/ | MeasurementImage.tsx | 이미지 회전 + 랜드마크 그리기 컴포넌트 |
| utils/ | drawLineStep.ts | 랜드마크 라인 그리기 유틸 |
| hooks/ | useStaticLandmark.ts | 이미지 랜드마크 훅 |

### Common

| 경로 | 파일 | 설명 |
|------|------|------|
| types/ | pose.ts | 포즈 관련 타입 정의 |

### 사용 가이드

1. **VideoPlayer**: props 및 useVideoPlayer는 변경하지 않고 사용하는 걸 권장
2. **MeasurementImage**: 이미지를 회전한 후 해당 이미지에 랜드마크를 그리는 컴포넌트. 본 컴포넌트를 컨테이너에 담아서 사용
   - grid on/off 버튼, landmark on/off 버튼: 해당 버튼만 모바일 버전에 맞게 UI 변경 후 사용
3. **utils 파일들**: type만 추가한 후 사용
4. 그 외 파일 (type, interface, hook)은 프로젝트에 맞게 수정

> **참고**: "image 회전+랜드마크" 및 "video 회전 및 scale 적용+영상 프레임당 랜드마크" 코드는 그대로 적용하는 걸 권장

---

## 배포

Vercel을 통해 자동 배포됩니다.

### 배포 URL

```
https://kakotango.vercel.app
```

### 테스트 접속 (전달받은 데이터로 확인)

```
https://kakotango.vercel.app?t_r=YeVTF2wGZ/jTgQ9nPys0443juDibdo+mPQsL+A4jldcolkvtPhm+xUO67UiMfX1oVADHbtlec0NZ4GkKMW2FSxTORBX9ePyosHotnpf5UirwuKVxk6emDZjAlECVNJKbyERnhJIsWqdLXU6hTTBsSQ7chtAJalqZMheQpm88pabUy1DMcyWviF9JmowdhUC0qfVmhc6NhVRib8wf22iAU3jSa3SVNq+QMo68bOI1syHnQL/F+XUwm+RM6YHu8EaYpjRFROYaW9x2WNx5T5txZuk7tQa+extmCkZpLdLvbv4=
```

> **참고**: 로컬 개발 서버(`localhost:5073`)에서는 API 인증 토큰이 없어 데이터가 표시되지 않습니다. 실제 데이터 확인은 배포된 URL에서 해주세요.

---

## 버전 이력

| 버전 | 날짜 | 작성자 | 내용 |
|------|------|--------|------|
| v0.1 | 2025.01.26 | 개발2팀 이강휘 | Landmark 적용 코드 추가 |
