import { createContext, useContext, type RefObject } from "react";

export interface RenderParams {
  outputWidth: number;
  outputHeight: number;
}

export type RenderCanvasRef = RefObject<HTMLCanvasElement | null>;

export interface RenderStatus {
  state: "ready" | "rendering" | "paused" | "completed";
  progress: number;
}

export interface RenderTarget {
  canvasRef: RenderCanvasRef;
}

interface StartRenderAction {
  type: "start";
  params: RenderParams;
}
interface PauseRenderAction {
  type: "pause";
}
interface ResumeRenderAction {
  type: "resume";
}
interface ResetRenderAction {
  type: "reset";
}
export type RenderAction =
  | StartRenderAction
  | PauseRenderAction
  | ResumeRenderAction
  | ResetRenderAction;
type RenderDispatch = (action: RenderAction) => void;

export const RenderStatusContext = createContext<RenderStatus>({
  state: "ready",
  progress: 0,
});
export const RenderTargetContext = createContext<RenderTarget>({
  canvasRef: { current: null },
});
export const RenderDispatchContext = createContext<RenderDispatch>(() => {});

export const useRenderStatus = () => useContext(RenderStatusContext);
export const useRenderTarget = () => useContext(RenderTargetContext);
export const useRenderDispatch = () => useContext(RenderDispatchContext);
