import { atom, map } from "nanostores";
import { RenderJob } from "./raytracer/renderer";
import type { TfWorld } from "./raytracer/transmission-format";

// TODO(JW): These are things that should be injected somehow (perhaps Lit style with events)

export interface OutputSettings {
  width: number;
  height: number;
}
export const $outputSettings = map<OutputSettings>({
  width: 240,
  height: 135,
});

export const $world = atom<TfWorld | null>(null);

interface RenderIdleStatus {
  state: "ready" | "completed";
}
interface RenderRenderingStatus {
  state: "rendering";
  progress: number;
  cancel: () => void;
}
type RenderStatus = RenderIdleStatus | RenderRenderingStatus;
export const $renderStatus = atom<RenderStatus>({ state: "ready" });

export const newStartRenderEvent = () =>
  new CustomEvent("start-render", {
    bubbles: true,
    cancelable: true,
    composed: true,
  });
export const newCancelRenderEvent = () =>
  new CustomEvent("cancel-render", {
    bubbles: true,
    cancelable: true,
    composed: true,
  });

export function addRenderEventListeners(target: EventTarget) {
  target.addEventListener("start-render", () => {
    startRenderJob();
  });
  target.addEventListener("cancel-render", () => {
    const status = $renderStatus.get();
    if (status.state === "rendering") {
      status.cancel();
    }
  });
}

function startRenderJob() {
  if ($renderStatus.get().state === "rendering") {
    console.warn(
      "Tried to start render job while another render job was active",
    );
    return;
  }

  const canvas = document.getElementById("render-canvas") as HTMLCanvasElement;
  if (canvas === null) {
    console.warn(`Tried to start render job with no render canvas`);
    return;
  }
  const world = $world.get();
  if (world === null) {
    console.warn(`Tried to start render job with no world set`);
    return;
  }

  const outputSettings = $outputSettings.get();
  canvas.width = outputSettings.width;
  canvas.height = outputSettings.height;

  const canvasContext = canvas.getContext("2d")!;
  const renderData = canvasContext.createImageData(
    outputSettings.width,
    outputSettings.height,
  );

  const job = new RenderJob(renderData, world);

  job.execute();

  let lastProgressReported = 0;
  const renderingStatusTmpl = {
    state: "rendering",
    progress: 0,
    cancel: () => job.cancel(),
  } as RenderRenderingStatus;
  $renderStatus.set({ ...renderingStatusTmpl });
  requestAnimationFrame(function updateRender() {
    if (job.completed) {
      canvasContext.putImageData(job.renderTarget, 0, 0);
      $renderStatus.set({ state: "completed" });

      return;
    }

    if (job.cancelled) {
      $renderStatus.set({ state: "ready" });
      return;
    }

    if (job.progress > lastProgressReported) {
      canvasContext.putImageData(job.renderTarget, 0, 0);
      $renderStatus.set({
        ...renderingStatusTmpl,
        progress: job.progress,
      });
      lastProgressReported = job.progress;
    }

    requestAnimationFrame(updateRender);
  });
}
