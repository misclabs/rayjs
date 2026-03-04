import {
  useState,
  useEffect,
  useRef,
  type ReactElement,
  type ReactNode,
  useCallback,
} from "react";
import {
  RenderStatusContext,
  RenderDispatchContext,
  RenderTargetContext,
  type RenderAction,
  type RenderStatus,
} from "./render-context";
import { RenderJob } from "../raytracer/renderer";
import { createTfDemoScene } from "../raytracer/scenes";

// TODO(jw): put this in start action
const tfWorld = createTfDemoScene();

interface ProviderJobData {
  job: RenderJob;
  canvasContext: CanvasRenderingContext2D;
}
interface RenderProviderProps {
  children: ReactNode;
}
export function RenderProvider({
  children,
}: RenderProviderProps): ReactElement {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestIdRef = useRef<number | null>(null);
  const [jobData, setJobData] = useState<ProviderJobData | null>(null);

  // TODO(jw): can useSyncExternalStore be used here instread of hacky forceUpdate?
  const forceUpdate = useCallback(
    () => setJobData((jd) => (jd ? { ...jd } : jd)),
    [],
  );

  const renderStatus: RenderStatus = (() => {
    if (jobData === null) {
      return { state: "ready", progress: 0 };
    }

    if (jobData.job.completed) {
      return {
        state: "completed",
        progress: 1,
      };
    }

    return {
      state: jobData.job.paused ? "paused" : "rendering",
      progress: jobData.job.progress,
    };
  })();

  useEffect(() => {
    if (jobData === null || requestIdRef.current !== null) return;

    const { job, canvasContext } = jobData;
    let lastUpdatedProgress = 0;
    requestIdRef.current = requestAnimationFrame(function updateRender() {
      requestIdRef.current = null;

      if (job.completed) {
        canvasContext.putImageData(job.renderTarget, 0, 0);
        forceUpdate();
        return;
      }
      if (job.progress !== lastUpdatedProgress) {
        canvasContext.putImageData(job.renderTarget, 0, 0);
        lastUpdatedProgress = job.progress;
        forceUpdate();
      }

      requestIdRef.current = requestAnimationFrame(updateRender);
    });

    return () => {
      if (requestIdRef.current !== null) {
        cancelAnimationFrame(requestIdRef.current);
        requestIdRef.current = null;
      }
    };
  }, [jobData, forceUpdate]);

  function renderDispatch(action: RenderAction): void {
    if (action.type === "start") {
      if (!canvasRef.current) throw new Error("Missing canvas element");
      const canvas = canvasRef.current;
      const canvasContext = canvas.getContext("2d")!;
      const imageData = canvasContext.createImageData(
        canvas.width,
        canvas.height,
      );

      const job = new RenderJob(imageData, tfWorld);
      job.execute();
      setJobData({
        job,
        canvasContext,
      });
    } else if (action.type === "reset") {
      if (jobData) {
        // TODO(jw): clear canvas
        jobData.job.cancel();
        setJobData(null);
      }
    } else if (action.type === "pause") {
      if (jobData) {
        jobData.job.pause();
        forceUpdate();
      }
    } else if (action.type === "resume") {
      if (jobData) {
        jobData.job.resume();
        forceUpdate();
      }
    }
  }

  return (
    <RenderStatusContext value={renderStatus}>
      <RenderDispatchContext value={renderDispatch}>
        <RenderTargetContext value={{ canvasRef }}>
          {children}
        </RenderTargetContext>
      </RenderDispatchContext>
    </RenderStatusContext>
  );
}
