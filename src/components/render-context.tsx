import { createContext, useContext, type RefObject } from "react";

export interface RenderParams {
  outputWidth: number;
  outputHeight: number;
}

export type RenderCanvasRef = RefObject<HTMLCanvasElement | null>;

export interface RenderStatus {
  started: boolean;
  progress: number;
}

export interface RenderTarget {
  canvasRef: RenderCanvasRef;
}

export const isRendering = (status: RenderStatus) =>
  status.started && status.progress !== 1;

interface StartRenderAction {
  type: "start";
  params: RenderParams;
}
interface CancelRenderAction {
  type: "cancel";
}
export type RenderAction = StartRenderAction | CancelRenderAction;
type RenderDispatch = (action: RenderAction) => void;

export const RenderStatusContext = createContext<RenderStatus>({
  started: false,
  progress: 0,
});
export const RenderTargetContext = createContext<RenderTarget>({
  canvasRef: { current: null },
});
export const RenderDispatchContext = createContext<RenderDispatch>(() => {});

export const useRenderStatus = () => useContext(RenderStatusContext);
export const useRenderTarget = () => useContext(RenderTargetContext);
export const useRenderDispatch = () => useContext(RenderDispatchContext);
