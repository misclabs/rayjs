import {
  useState,
  useEffect,
  useRef,
  type ReactElement,
  type ReactNode,
} from "react";
import {
  RenderStatusContext,
  RenderDispatchContext,
  RenderTargetContext,
  type RenderAction,
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
  const [renderProgress, setRenderProgress] = useState(0);

  useEffect(() => {
    if (jobData === null || requestIdRef.current !== null) return;

    const { job, canvasContext } = jobData;
    let lastUpdatedProgress = 0;
    requestIdRef.current = requestAnimationFrame(function updateRender() {
      requestIdRef.current = null;

      if (job.completed) {
        canvasContext.putImageData(job.renderTarget, 0, 0);
        setRenderProgress(1);
        return;
      }
      if (job.progress !== lastUpdatedProgress) {
        canvasContext.putImageData(job.renderTarget, 0, 0);
        lastUpdatedProgress = job.progress;
        setRenderProgress(lastUpdatedProgress);
      }

      requestIdRef.current = requestAnimationFrame(updateRender);
    });

    return () => {
      if (requestIdRef.current !== null) {
        cancelAnimationFrame(requestIdRef.current);
        requestIdRef.current = null;
      }
    };
  }, [jobData]);

  function renderDispatch(action: RenderAction): void {
    console.log(action);
    switch (action.type) {
      case "start": {
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
        setRenderProgress(0);
      }
    }
  }

  return (
    <RenderStatusContext
      value={{ started: jobData !== null, progress: renderProgress }}
    >
      <RenderDispatchContext value={renderDispatch}>
        <RenderTargetContext value={{ canvasRef }}>
          {children}
        </RenderTargetContext>
      </RenderDispatchContext>
    </RenderStatusContext>
  );
}
