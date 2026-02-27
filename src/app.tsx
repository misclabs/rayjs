import { type ReactElement, useState, useRef, useEffect } from "react";
import {
  jobStatusReady,
  jobStatusFromProgress,
  jobStatusComplete,
  type RenderJobStatus,
  type RenderJobParams,
} from "./render-job-provider";
import { RenderJob } from "./raytracer/renderer";
import { createTfDemoScene } from "./scenes";
import "./app.css";
import SideBar from "./side-bar";

const tfWorld = createTfDemoScene();

export default function App(): ReactElement {
  const [renderJobParams, setRenderJobParams] = useState<RenderJobParams>({
    outputWidth: 480,
    outputHeight: 360,
  });

  const [jobStatus, setJobStatus] = useState<RenderJobStatus>(jobStatusReady());
  // const [renderJob, setRenderJob] = useState<RenderJob | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!jobStatus.isRendering) return;

    const renderCanvas = canvasRef.current!;

    // TODO(JW): does canvasContext need to be cleaned up?
    const canvasContext = renderCanvas.getContext("2d")!;
    // TODO(JW): does renderData need to be cleaned up?
    const renderData = canvasContext.createImageData(
      renderCanvas.width,
      renderCanvas.height,
    );

    // TODO(JW): cleanup render job
    const job = new RenderJob(renderData, tfWorld);
    job.execute();
    let lastProgressRendered = 0;
    requestAnimationFrame(function updateRender() {
      if (job.completed) {
        canvasContext.putImageData(job.renderTarget, 0, 0);
        setJobStatus(jobStatusComplete());
        return;
      }
      if (job.progress > lastProgressRendered) {
        canvasContext.putImageData(job.renderTarget, 0, 0);
        setJobStatus(jobStatusFromProgress(job.progress));
        lastProgressRendered = job.progress;
      }

      requestAnimationFrame(updateRender);
    });
  }, [jobStatus.isRendering]);

  function onStartJob() {
    setJobStatus(jobStatusFromProgress(0));
  }

  return (
    <>
      <SideBar
        jobParams={renderJobParams}
        setJobParams={setRenderJobParams}
        jobStatus={jobStatus}
        onStartJob={onStartJob}
      />
      <div className="output">
        <canvas
          ref={canvasRef}
          width={renderJobParams.outputWidth}
          height={renderJobParams.outputHeight}
        />
      </div>
    </>
  );
}
