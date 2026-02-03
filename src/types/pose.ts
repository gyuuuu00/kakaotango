export interface IPoseLandmark {
  index: number;
  isActive: boolean;
  sx: number;
  sy: number;
  wx: number;
  wy: number;
  wz: number;
}

export type PoseLandmarks = IPoseLandmark[];

export type Fit = {
  stageW: number;
  stageH: number;
  scale: number;
  offsetX: number;
  offsetY: number;
  dpr: number;
};

export interface IMeasureJson {
  pose_landmark: IPoseLandmark[];
}
