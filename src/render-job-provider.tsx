export interface RenderJobParams {
  outputWidth: number;
  outputHeight: number;
}

export type RenderJobState = "ready" | "rendering" | "complete";

export interface RenderJobStatus {
  isRendering: boolean;
  progress: number;
  state: RenderJobState;
}

export function jobStatusFromProgress(progress: number): RenderJobStatus {
  return {
    isRendering: true,
    progress,
    state: "rendering",
  };
}

export function jobStatusReady(): RenderJobStatus {
  return {
    isRendering: false,
    progress: 0,
    state: "ready",
  };
}

export function jobStatusComplete(): RenderJobStatus {
  return {
    isRendering: false,
    progress: 1,
    state: "complete",
  };
}
