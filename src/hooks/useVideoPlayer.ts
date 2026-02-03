import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Fit, IMeasureJson } from "../types/pose";
import { computeContain, setupHiDPICanvas, isNearEnd, isNearStart } from "../utils/videoUtils";

const DATA_W = 720;
const DATA_H = 1280;
const VIDEO_SCALE = 1.75;

export interface UseVideoPlayerProps {
  videoSrc: string | undefined;
  isRotated: boolean;
  measureJson: IMeasureJson[] | undefined;
  onFrameChange?: (frame: number) => void;
}

export interface UseVideoPlayerReturn {
  stageRef: React.RefObject<HTMLDivElement | null>;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasWhiteRef: React.RefObject<HTMLCanvasElement | null>;
  canvasRedRef: React.RefObject<HTMLCanvasElement | null>;
  canvasTrailRef: React.RefObject<HTMLCanvasElement | null>;
  fit: Fit;
  canvasTransform: string;
  frame: number;
  duration: number;
  currentTime: number;
  clearTrail: () => void;
  toScreen: (sx: number, sy: number) => { x: number; y: number };
  setIsSeeking: (value: boolean) => void;
  setCurrentTime: (time: number) => void;
  isSeekingRef: React.MutableRefObject<boolean>;
  trailPrevRef: React.MutableRefObject<{
    p15?: { x: number; y: number };
    p16?: { x: number; y: number };
    pMid?: { x: number; y: number };
    p25?: { x: number; y: number };
    p26?: { x: number; y: number };
  }>;
}

export const useVideoPlayer = ({
  videoSrc,
  isRotated,
  measureJson: _measureJson,
  onFrameChange,
}: UseVideoPlayerProps): UseVideoPlayerReturn => {
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasWhiteRef = useRef<HTMLCanvasElement | null>(null);
  const canvasRedRef = useRef<HTMLCanvasElement | null>(null);
  const canvasTrailRef = useRef<HTMLCanvasElement | null>(null);

  const [canvasTransform, setCanvasTransform] = useState<string>(
    `scaleX(${-VIDEO_SCALE}) scaleY(${VIDEO_SCALE})`
  );
  const [fit, setFit] = useState<Fit>({
    stageW: 0,
    stageH: 0,
    scale: 1,
    offsetX: 0,
    offsetY: 0,
    dpr: 1,
  });

  const [frame, setFrame] = useState(0);
  const frameLoopActive = useRef(false);

  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [, setIsSeeking] = useState(false);
  const isSeekingRef = useRef(false);

  const trailPrevRef = useRef<{
    p15?: { x: number; y: number };
    p16?: { x: number; y: number };
    pMid?: { x: number; y: number };
    p25?: { x: number; y: number };
    p26?: { x: number; y: number };
  }>({});

  const clearTrail = useCallback(() => {
    const ct = canvasTrailRef.current;
    if (!ct) return;
    const ctxT = ct.getContext("2d");
    if (!ctxT) return;

    ctxT.clearRect(0, 0, fit.stageW, fit.stageH);
    trailPrevRef.current = {};
  }, [fit.stageW, fit.stageH]);

  // Stage resize observer
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const update = () => {
      const rect = stage.getBoundingClientRect();
      const base = computeContain(rect.width, rect.height, DATA_W, DATA_H);

      const cw = canvasWhiteRef.current;
      const cr = canvasRedRef.current;
      const ct = canvasTrailRef.current;
      let dpr = 1;
      if (cw) dpr = setupHiDPICanvas(cw, rect.width, rect.height).dpr;
      if (cr) setupHiDPICanvas(cr, rect.width, rect.height);
      if (ct) setupHiDPICanvas(ct, rect.width, rect.height);
      setFit({ ...base, dpr });
    };

    const ro = new ResizeObserver(() => update());
    ro.observe(stage);
    update();
    return () => ro.disconnect();
  }, []);

  // Video frame sync
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const sync = () => {
      const newFrame = Math.floor(v.currentTime * 30);
      setFrame(newFrame);
      onFrameChange?.(newFrame);
    };

    const start = () => {
      if (isNearStart(v) || isNearEnd(v)) {
        clearTrail();
      }
      if (isNearEnd(v)) v.currentTime = 0;
      if (!("requestVideoFrameCallback" in v)) return;
      sync();
      frameLoopActive.current = true;

      const loop = () => {
        if (!frameLoopActive.current) return;
        const newFrame = Math.floor(v.currentTime * 30);
        setFrame(newFrame);
        onFrameChange?.(newFrame);
        (v as any).requestVideoFrameCallback(loop);
      };
      (v as any).requestVideoFrameCallback(loop);
    };

    const pause = () => {
      frameLoopActive.current = false;
      sync();
    };

    const ended = () => {
      frameLoopActive.current = false;
      sync();
    };

    const seeked = () => {
      frameLoopActive.current = false;
      sync();
      if (!v.paused) start();
    };

    v.addEventListener("play", start);
    v.addEventListener("pause", pause);
    v.addEventListener("ended", ended);
    v.addEventListener("seeked", seeked);
    v.addEventListener("loadedmetadata", seeked);

    return () => {
      v.removeEventListener("play", start);
      v.removeEventListener("pause", pause);
      v.removeEventListener("ended", ended);
      v.removeEventListener("seeked", seeked);
      v.removeEventListener("loadedmetadata", seeked);
    };
  }, [clearTrail, onFrameChange]);

  // Video metadata
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !videoSrc) return;

    const onLoadedMetadata = () => {
      setDuration(v.duration || 0);
      setCurrentTime(v.currentTime || 0);
    };

    const onTimeUpdate = () => {
      if (!isSeekingRef.current) {
        setCurrentTime(v.currentTime || 0);
      }
    };

    v.addEventListener("loadedmetadata", onLoadedMetadata);
    v.addEventListener("timeupdate", onTimeUpdate);

    if (v.readyState >= 1) onLoadedMetadata();

    return () => {
      v.removeEventListener("loadedmetadata", onLoadedMetadata);
      v.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, [videoSrc]);

  // Layout effect for canvas transform
  useLayoutEffect(() => {
    const stage = stageRef.current;
    const video = videoRef.current;

    if (!stage) return;

    const update = () => {
      const rect = stage.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const base = computeContain(rect.width, rect.height, DATA_W, DATA_H);

      const cw = canvasWhiteRef.current;
      const cr = canvasRedRef.current;
      const ct = canvasTrailRef.current;

      let dpr = 1;
      if (cw) dpr = setupHiDPICanvas(cw, rect.width, rect.height).dpr;
      if (cr) setupHiDPICanvas(cr, rect.width, rect.height);
      if (ct) setupHiDPICanvas(ct, rect.width, rect.height);

      setFit({ ...base, dpr });

      if (!video || !isRotated) {
        setCanvasTransform(`scaleX(-1) scaleY(1)`);
        return;
      }

      const vRect = video.getBoundingClientRect();
      if (vRect.width === 0 || vRect.height === 0) return;

      const videoAspect = vRect.height / vRect.width;
      const sx = -VIDEO_SCALE * videoAspect;
      const sy = VIDEO_SCALE * videoAspect;
      setCanvasTransform(`scaleX(${sx}) scaleY(${sy})`);
    };

    const ro = new ResizeObserver(update);
    ro.observe(stage);
    if (video) {
      ro.observe(video);
      video.addEventListener("loadedmetadata", update);
    }
    requestAnimationFrame(update);

    return () => {
      ro.disconnect();
      video?.removeEventListener("loadedmetadata", update);
    };
  }, [isRotated, videoSrc]);

  const toScreen = useMemo(() => {
    return (sx: number, sy: number) => ({
      x: sx * fit.scale + fit.offsetX,
      y: sy * fit.scale + fit.offsetY,
    });
  }, [fit]);

  return {
    stageRef,
    videoRef,
    canvasWhiteRef,
    canvasRedRef,
    canvasTrailRef,
    fit,
    canvasTransform,
    frame,
    duration,
    currentTime,
    clearTrail,
    toScreen,
    setIsSeeking,
    setCurrentTime,
    isSeekingRef,
    trailPrevRef,
  };
};
