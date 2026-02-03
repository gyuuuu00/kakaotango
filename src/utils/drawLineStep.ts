import { IPoseLandmark } from '../types/pose';

export function drawLineStepFirst(
  ctx: CanvasRenderingContext2D,
  measureJson: { pose_landmark: IPoseLandmark[] },
) {
  ctx.strokeStyle = "#FFF";
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.moveTo(measureJson.pose_landmark[11].sx, measureJson.pose_landmark[11].sy);
  ctx.lineTo(measureJson.pose_landmark[23].sx, measureJson.pose_landmark[23].sy);
  ctx.lineTo(measureJson.pose_landmark[24].sx, measureJson.pose_landmark[24].sy);
  ctx.lineTo(measureJson.pose_landmark[12].sx, measureJson.pose_landmark[12].sy);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(measureJson.pose_landmark[11].sx, measureJson.pose_landmark[11].sy);
  ctx.lineTo(measureJson.pose_landmark[13].sx, measureJson.pose_landmark[13].sy);
  ctx.lineTo(measureJson.pose_landmark[15].sx, measureJson.pose_landmark[15].sy);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(measureJson.pose_landmark[12].sx, measureJson.pose_landmark[12].sy);
  ctx.lineTo(measureJson.pose_landmark[14].sx, measureJson.pose_landmark[14].sy);
  ctx.lineTo(measureJson.pose_landmark[16].sx, measureJson.pose_landmark[16].sy);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(measureJson.pose_landmark[23].sx, measureJson.pose_landmark[23].sy);
  ctx.lineTo(measureJson.pose_landmark[25].sx, measureJson.pose_landmark[25].sy);
  ctx.lineTo(measureJson.pose_landmark[27].sx, measureJson.pose_landmark[27].sy);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(measureJson.pose_landmark[24].sx, measureJson.pose_landmark[24].sy);
  ctx.lineTo(measureJson.pose_landmark[26].sx, measureJson.pose_landmark[26].sy);
  ctx.lineTo(measureJson.pose_landmark[28].sx, measureJson.pose_landmark[28].sy);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(measureJson.pose_landmark[28].sx, measureJson.pose_landmark[28].sy);
  ctx.lineTo(measureJson.pose_landmark[32].sx, measureJson.pose_landmark[32].sy);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(measureJson.pose_landmark[27].sx, measureJson.pose_landmark[27].sy);
  ctx.lineTo(measureJson.pose_landmark[31].sx, measureJson.pose_landmark[31].sy);
  ctx.stroke();

  ctx.strokeStyle = "#00FF00";
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.moveTo(measureJson.pose_landmark[7].sx, measureJson.pose_landmark[7].sy);
  ctx.lineTo(measureJson.pose_landmark[8].sx, measureJson.pose_landmark[8].sy);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(measureJson.pose_landmark[11].sx, measureJson.pose_landmark[11].sy);
  ctx.lineTo(measureJson.pose_landmark[12].sx, measureJson.pose_landmark[12].sy);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(measureJson.pose_landmark[13].sx, measureJson.pose_landmark[13].sy);
  ctx.lineTo(measureJson.pose_landmark[14].sx, measureJson.pose_landmark[14].sy);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(measureJson.pose_landmark[15].sx, measureJson.pose_landmark[15].sy);
  ctx.lineTo(measureJson.pose_landmark[16].sx, measureJson.pose_landmark[16].sy);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(measureJson.pose_landmark[23].sx, measureJson.pose_landmark[23].sy);
  ctx.lineTo(measureJson.pose_landmark[24].sx, measureJson.pose_landmark[24].sy);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(measureJson.pose_landmark[25].sx, measureJson.pose_landmark[25].sy);
  ctx.lineTo(measureJson.pose_landmark[26].sx, measureJson.pose_landmark[26].sy);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(measureJson.pose_landmark[27].sx, measureJson.pose_landmark[27].sy);
  ctx.lineTo(measureJson.pose_landmark[28].sx, measureJson.pose_landmark[28].sy);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(measureJson.pose_landmark[31].sx, measureJson.pose_landmark[31].sy);
  ctx.lineTo(measureJson.pose_landmark[32].sx, measureJson.pose_landmark[32].sy);
  ctx.stroke();

  ctx.strokeStyle = "#FF0000";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(
    Math.round((measureJson.pose_landmark[11].sx + measureJson.pose_landmark[12].sx) / 2),
    measureJson.pose_landmark[27].sy / 11,
  );
  ctx.lineTo(
    Math.round((measureJson.pose_landmark[23].sx + measureJson.pose_landmark[24].sx) / 2),
    measureJson.pose_landmark[7].sy * 4,
  );
  ctx.stroke();
}

export function drawLineStepSecond(
  ctx: CanvasRenderingContext2D,
  measureJson: { pose_landmark: IPoseLandmark[] },
) {
  ctx.strokeStyle = "#FFF";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(measureJson.pose_landmark[7].sx, measureJson.pose_landmark[7].sy);
  ctx.lineTo(measureJson.pose_landmark[8].sx, measureJson.pose_landmark[8].sy);
  ctx.stroke();

  ctx.strokeStyle = "#00FF00";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(measureJson.pose_landmark[11].sx, measureJson.pose_landmark[11].sy);
  ctx.lineTo(measureJson.pose_landmark[13].sx, measureJson.pose_landmark[13].sy);
  ctx.lineTo(measureJson.pose_landmark[15].sx, measureJson.pose_landmark[15].sy);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(measureJson.pose_landmark[12].sx, measureJson.pose_landmark[12].sy);
  ctx.lineTo(measureJson.pose_landmark[14].sx, measureJson.pose_landmark[14].sy);
  ctx.lineTo(measureJson.pose_landmark[16].sx, measureJson.pose_landmark[16].sy);
  ctx.stroke();
}

export function drawLineStepThird(
  ctx: CanvasRenderingContext2D,
  measureJson: { pose_landmark: IPoseLandmark[] },
) {
  ctx.strokeStyle = "#FFFFFF";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(measureJson.pose_landmark[11].sx, measureJson.pose_landmark[11].sy);
  ctx.lineTo(measureJson.pose_landmark[13].sx, measureJson.pose_landmark[13].sy);
  ctx.lineTo(measureJson.pose_landmark[15].sx, measureJson.pose_landmark[15].sy);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(measureJson.pose_landmark[11].sx, measureJson.pose_landmark[11].sy);
  ctx.lineTo(measureJson.pose_landmark[23].sx, measureJson.pose_landmark[23].sy);
  ctx.lineTo(measureJson.pose_landmark[25].sx, measureJson.pose_landmark[25].sy);
  ctx.lineTo(measureJson.pose_landmark[27].sx, measureJson.pose_landmark[27].sy);
  ctx.stroke();

  ctx.strokeStyle = "#00FF00";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(measureJson.pose_landmark[0].sx, measureJson.pose_landmark[0].sy);
  ctx.lineTo(measureJson.pose_landmark[11].sx, measureJson.pose_landmark[11].sy);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(measureJson.pose_landmark[11].sx, measureJson.pose_landmark[11].sy);
  ctx.lineTo(measureJson.pose_landmark[27].sx, measureJson.pose_landmark[11].sy);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(measureJson.pose_landmark[13].sx, measureJson.pose_landmark[13].sy);
  ctx.lineTo(measureJson.pose_landmark[27].sx, measureJson.pose_landmark[13].sy);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(measureJson.pose_landmark[15].sx, measureJson.pose_landmark[15].sy);
  ctx.lineTo(measureJson.pose_landmark[27].sx, measureJson.pose_landmark[15].sy);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(measureJson.pose_landmark[23].sx, measureJson.pose_landmark[23].sy);
  ctx.lineTo(measureJson.pose_landmark[27].sx, measureJson.pose_landmark[23].sy);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(measureJson.pose_landmark[25].sx, measureJson.pose_landmark[25].sy);
  ctx.lineTo(measureJson.pose_landmark[27].sx, measureJson.pose_landmark[25].sy);
  ctx.stroke();

  ctx.strokeStyle = "#FF0000";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(measureJson.pose_landmark[27].sx, measureJson.pose_landmark[27].sy + 100);
  ctx.lineTo(measureJson.pose_landmark[27].sx, measureJson.pose_landmark[0].sy - 100);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(measureJson.pose_landmark[0].sx - 100, measureJson.pose_landmark[0].sy);
  ctx.lineTo(measureJson.pose_landmark[0].sx + 100, measureJson.pose_landmark[0].sy);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(measureJson.pose_landmark[7].sx - 100, measureJson.pose_landmark[7].sy);
  ctx.lineTo(measureJson.pose_landmark[7].sx + 100, measureJson.pose_landmark[7].sy);
  ctx.stroke();
}

export function drawLineStepFourth(
  ctx: CanvasRenderingContext2D,
  measureJson: { pose_landmark: IPoseLandmark[] },
) {
  ctx.strokeStyle = "#FFF";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(measureJson.pose_landmark[12].sx, measureJson.pose_landmark[12].sy);
  ctx.lineTo(measureJson.pose_landmark[14].sx, measureJson.pose_landmark[14].sy);
  ctx.lineTo(measureJson.pose_landmark[16].sx, measureJson.pose_landmark[16].sy);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(measureJson.pose_landmark[12].sx, measureJson.pose_landmark[11].sy);
  ctx.lineTo(measureJson.pose_landmark[24].sx, measureJson.pose_landmark[24].sy);
  ctx.lineTo(measureJson.pose_landmark[26].sx, measureJson.pose_landmark[26].sy);
  ctx.lineTo(measureJson.pose_landmark[28].sx, measureJson.pose_landmark[28].sy);
  ctx.stroke();

  ctx.strokeStyle = "#00FF00";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(measureJson.pose_landmark[0].sx, measureJson.pose_landmark[0].sy);
  ctx.lineTo(measureJson.pose_landmark[12].sx, measureJson.pose_landmark[12].sy);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(measureJson.pose_landmark[12].sx, measureJson.pose_landmark[12].sy);
  ctx.lineTo(measureJson.pose_landmark[28].sx, measureJson.pose_landmark[12].sy);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(measureJson.pose_landmark[14].sx, measureJson.pose_landmark[14].sy);
  ctx.lineTo(measureJson.pose_landmark[28].sx, measureJson.pose_landmark[14].sy);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(measureJson.pose_landmark[16].sx, measureJson.pose_landmark[16].sy);
  ctx.lineTo(measureJson.pose_landmark[28].sx, measureJson.pose_landmark[16].sy);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(measureJson.pose_landmark[24].sx, measureJson.pose_landmark[24].sy);
  ctx.lineTo(measureJson.pose_landmark[28].sx, measureJson.pose_landmark[24].sy);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(measureJson.pose_landmark[26].sx, measureJson.pose_landmark[26].sy);
  ctx.lineTo(measureJson.pose_landmark[28].sx, measureJson.pose_landmark[26].sy);
  ctx.stroke();

  ctx.strokeStyle = "#FF0000";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(measureJson.pose_landmark[28].sx, measureJson.pose_landmark[28].sy + 100);
  ctx.lineTo(measureJson.pose_landmark[28].sx, measureJson.pose_landmark[0].sy - 100);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(measureJson.pose_landmark[8].sx - 100, measureJson.pose_landmark[8].sy);
  ctx.lineTo(measureJson.pose_landmark[8].sx + 100, measureJson.pose_landmark[8].sy);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(measureJson.pose_landmark[0].sx - 100, measureJson.pose_landmark[0].sy);
  ctx.lineTo(measureJson.pose_landmark[0].sx + 100, measureJson.pose_landmark[0].sy);
  ctx.stroke();
}

export function drawLineStepFifth(
  ctx: CanvasRenderingContext2D,
  measureJson: { pose_landmark: IPoseLandmark[] },
) {
  ctx.strokeStyle = "#FFF";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(measureJson.pose_landmark[7].sx, measureJson.pose_landmark[7].sy);
  ctx.lineTo(measureJson.pose_landmark[8].sx, measureJson.pose_landmark[8].sy);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(measureJson.pose_landmark[11].sx, measureJson.pose_landmark[11].sy);
  ctx.lineTo(measureJson.pose_landmark[23].sx, measureJson.pose_landmark[23].sy);
  ctx.lineTo(measureJson.pose_landmark[24].sx, measureJson.pose_landmark[24].sy);
  ctx.lineTo(measureJson.pose_landmark[12].sx, measureJson.pose_landmark[12].sy);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(measureJson.pose_landmark[11].sx, measureJson.pose_landmark[11].sy);
  ctx.lineTo(measureJson.pose_landmark[13].sx, measureJson.pose_landmark[13].sy);
  ctx.lineTo(measureJson.pose_landmark[15].sx, measureJson.pose_landmark[15].sy);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(measureJson.pose_landmark[12].sx, measureJson.pose_landmark[12].sy);
  ctx.lineTo(measureJson.pose_landmark[14].sx, measureJson.pose_landmark[14].sy);
  ctx.lineTo(measureJson.pose_landmark[16].sx, measureJson.pose_landmark[16].sy);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(measureJson.pose_landmark[23].sx, measureJson.pose_landmark[23].sy);
  ctx.lineTo(measureJson.pose_landmark[25].sx, measureJson.pose_landmark[25].sy);
  ctx.lineTo(measureJson.pose_landmark[27].sx, measureJson.pose_landmark[27].sy);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(measureJson.pose_landmark[24].sx, measureJson.pose_landmark[24].sy);
  ctx.lineTo(measureJson.pose_landmark[26].sx, measureJson.pose_landmark[26].sy);
  ctx.lineTo(measureJson.pose_landmark[28].sx, measureJson.pose_landmark[28].sy);
  ctx.stroke();

  ctx.strokeStyle = "#00FF00";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(measureJson.pose_landmark[11].sx, measureJson.pose_landmark[11].sy);
  ctx.lineTo(measureJson.pose_landmark[12].sx, measureJson.pose_landmark[12].sy);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(measureJson.pose_landmark[15].sx, measureJson.pose_landmark[15].sy);
  ctx.lineTo(measureJson.pose_landmark[16].sx, measureJson.pose_landmark[16].sy);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(measureJson.pose_landmark[0].sx, measureJson.pose_landmark[0].sy);
  ctx.lineTo(
    Math.round((measureJson.pose_landmark[11].sx + measureJson.pose_landmark[12].sx) / 2),
    Math.round((measureJson.pose_landmark[11].sy + measureJson.pose_landmark[12].sy) / 2),
  );
  ctx.stroke();

  ctx.strokeStyle = "#ff8c00";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(measureJson.pose_landmark[25].sx, measureJson.pose_landmark[25].sy);
  ctx.lineTo(
    Math.round((measureJson.pose_landmark[27].sx + measureJson.pose_landmark[28].sx) / 2),
    measureJson.pose_landmark[25].sy,
  );
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(measureJson.pose_landmark[26].sx, measureJson.pose_landmark[26].sy);
  ctx.lineTo(
    Math.round((measureJson.pose_landmark[27].sx + measureJson.pose_landmark[28].sx) / 2),
    measureJson.pose_landmark[26].sy,
  );
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(measureJson.pose_landmark[29].sx, measureJson.pose_landmark[29].sy);
  ctx.lineTo(
    Math.round((measureJson.pose_landmark[27].sx + measureJson.pose_landmark[28].sx) / 2),
    measureJson.pose_landmark[29].sy,
  );
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(measureJson.pose_landmark[30].sx, measureJson.pose_landmark[30].sy);
  ctx.lineTo(
    Math.round((measureJson.pose_landmark[27].sx + measureJson.pose_landmark[28].sx) / 2),
    measureJson.pose_landmark[30].sy,
  );
  ctx.stroke();

  ctx.strokeStyle = "#FF0000";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(
    Math.round((measureJson.pose_landmark[27].sx + measureJson.pose_landmark[28].sx) / 2),
    measureJson.pose_landmark[30].sy + 100,
  );
  ctx.lineTo(
    Math.round((measureJson.pose_landmark[27].sx + measureJson.pose_landmark[28].sx) / 2),
    measureJson.pose_landmark[0].sy - 100,
  );
  ctx.stroke();
}

export function drawLineStepSixth(
  ctx: CanvasRenderingContext2D,
  measureJson: { pose_landmark: IPoseLandmark[] },
) {
  ctx.strokeStyle = "#FFF";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(measureJson.pose_landmark[7].sx, measureJson.pose_landmark[7].sy);
  ctx.lineTo(measureJson.pose_landmark[8].sx, measureJson.pose_landmark[8].sy);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(measureJson.pose_landmark[11].sx, measureJson.pose_landmark[11].sy);
  ctx.lineTo(measureJson.pose_landmark[12].sx, measureJson.pose_landmark[12].sy);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(measureJson.pose_landmark[23].sx, measureJson.pose_landmark[23].sy);
  ctx.lineTo(measureJson.pose_landmark[24].sx, measureJson.pose_landmark[24].sy);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(
    Math.round((measureJson.pose_landmark[7].sx + measureJson.pose_landmark[8].sx) / 2),
    Math.round((measureJson.pose_landmark[7].sy + measureJson.pose_landmark[8].sy) / 2),
  );
  ctx.lineTo(measureJson.pose_landmark[11].sx, measureJson.pose_landmark[11].sy);
  ctx.lineTo(measureJson.pose_landmark[12].sx, measureJson.pose_landmark[12].sy);
  ctx.lineTo(
    Math.round((measureJson.pose_landmark[7].sx + measureJson.pose_landmark[8].sx) / 2),
    Math.round((measureJson.pose_landmark[7].sy + measureJson.pose_landmark[8].sy) / 2),
  );
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(measureJson.pose_landmark[11].sx, measureJson.pose_landmark[11].sy);
  ctx.lineTo(measureJson.pose_landmark[12].sx, measureJson.pose_landmark[12].sy);
  ctx.lineTo(
    Math.round((measureJson.pose_landmark[23].sx + measureJson.pose_landmark[24].sx) / 2),
    Math.round((measureJson.pose_landmark[23].sy + measureJson.pose_landmark[24].sy) / 2),
  );
  ctx.lineTo(measureJson.pose_landmark[11].sx, measureJson.pose_landmark[11].sy);
  ctx.stroke();

  ctx.strokeStyle = "#00FF00";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(
    Math.round((measureJson.pose_landmark[23].sx + measureJson.pose_landmark[24].sx) / 2),
    Math.round((measureJson.pose_landmark[23].sy + measureJson.pose_landmark[24].sy) / 2),
  );
  ctx.lineTo(
    Math.round((measureJson.pose_landmark[11].sx + measureJson.pose_landmark[12].sx) / 2),
    Math.round((measureJson.pose_landmark[11].sy + measureJson.pose_landmark[12].sy) / 2),
  );
  ctx.stroke();

  ctx.strokeStyle = "#FF0000";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(
    Math.round((measureJson.pose_landmark[23].sx + measureJson.pose_landmark[24].sx) / 2),
    Math.round((measureJson.pose_landmark[23].sy + measureJson.pose_landmark[24].sy) / 2) + 100
  );
  ctx.lineTo(
    Math.round((measureJson.pose_landmark[23].sx + measureJson.pose_landmark[24].sx) / 2),
    Math.round((measureJson.pose_landmark[23].sy + measureJson.pose_landmark[24].sy) / 2) - 700
  );
  ctx.stroke();
}
