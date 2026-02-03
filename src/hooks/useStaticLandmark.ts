import { IPoseLandmark } from '../types/pose';
import { useState, useEffect } from 'react';
import {
  drawLineStepFirst,
  drawLineStepSecond,
  drawLineStepThird,
  drawLineStepFourth,
  drawLineStepFifth,
  drawLineStepSixth,
} from '../utils/drawLineStep';

const drawMap: Record<
  "first" | "second" | "third" | "fourth" | "fifth" | "sixth",
  (ctx: CanvasRenderingContext2D, measureJson: { pose_landmark: IPoseLandmark[] }) => void
> = {
  first: drawLineStepFirst,
  second: drawLineStepSecond,
  third: drawLineStepThird,
  fourth: drawLineStepFourth,
  fifth: drawLineStepFifth,
  sixth: drawLineStepSixth,
};

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    // 프록시 사용 시 crossOrigin 불필요 (같은 origin)
    img.onload = () => resolve(img);
    img.onerror = (err) => {
      console.error("이미지 로딩 실패", err);
      reject(err);
    };
    img.src = src;
  });
}

export function useStaticLandmark(
  imageUrl: string,
  measureJson: { pose_landmark: IPoseLandmark[] } | null,
  step: "first" | "second" | "third" | "fourth" | "fifth" | "sixth",
  cameraOrientation: 0 | 1,
  showLine: boolean = true
): {
  resultUrl: string | null;
  loading: boolean;
} {
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!imageUrl || !measureJson) return;

    const draw = async () => {
      setLoading(true);

      try {
        // 이미지 URL 정규화: 파일명만 추출하여 /data/Results/ 경로로 요청
        let proxiedUrl = imageUrl;

        // 전체 URL에서 파일명만 추출
        if (imageUrl.includes('/')) {
          const filename = imageUrl.split('/').pop(); // 마지막 부분(파일명)만 추출
          proxiedUrl = `/data/Results/${filename}`;
        } else {
          // 이미 파일명만 있는 경우
          proxiedUrl = `/data/Results/${imageUrl}`;
        }

        const image = await loadImage(proxiedUrl);

        const srcW = image.width;
        const srcH = image.height;

        const dstW = cameraOrientation === 1 ? srcH : srcW;
        const dstH = cameraOrientation === 1 ? srcW : srcH;

        const canvas = document.createElement("canvas");
        canvas.width = dstW;
        canvas.height = dstH;
        const ctx = canvas.getContext("2d")!;

        ctx.save();
        if (cameraOrientation === 1) {
          ctx.translate(0, dstH);
          ctx.rotate(-Math.PI / 2);
        }
        ctx.drawImage(image, 0, 0, srcW, srcH);
        ctx.restore();

        if (showLine) {
          ctx.save();
          // 미러
          ctx.translate(dstW, 0);
          ctx.scale(-1, 1);
          drawMap[step](ctx, measureJson);
          ctx.restore();
        }

        // crop to 3:4
        let cropX = 0;
        let cropY = 0;
        let cropWidth = dstW;
        let cropHeight = dstH;
        const targetAspect = 3 / 4;

        if (cameraOrientation === 0) {
          cropHeight = dstH;
          cropWidth = cropHeight * targetAspect;
          cropX = (dstW - cropWidth) / 2;
          cropY = 0;
        } else {
          cropWidth = dstW;
          cropHeight = cropWidth / targetAspect;
          cropX = 0;
          cropY = (dstH - cropHeight) / 2;
        }

        const croppedCanvas = document.createElement("canvas");
        croppedCanvas.width = cropWidth;
        croppedCanvas.height = cropHeight;
        const croppedCtx = croppedCanvas.getContext("2d")!;
        croppedCtx.drawImage(
          canvas,
          cropX,
          cropY,
          cropWidth,
          cropHeight,
          0,
          0,
          cropWidth,
          cropHeight,
        );

        const result = croppedCanvas.toDataURL("image/png");
        setResultUrl(result);
      } catch (err) {
        console.error("Image processing failed", err);
        setResultUrl(null);
      }

      setLoading(false);
    };

    draw();
  }, [imageUrl, step, measureJson, cameraOrientation, showLine]);

  return { resultUrl, loading };
}
