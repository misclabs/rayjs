import { type ReactElement, useState, useRef, useEffect } from "react";
import Button from "./components/button";
import NumberField from "./components/number-field";
import { RenderJob } from "./raytracer/renderer";
import { createTfDemoScene } from "./scenes";
import { type Vec2 } from "./raytracer/vec";
import "./app.css";

const tfWorld = createTfDemoScene();

const maxOutputWidth = 1920;
const minOutputWidth = 8;
const maxOutputHeight = 1080;
const minOutputHeight = 8;

export default function App(): ReactElement {
  const [status, setStatus] = useState<"" | "rendering" | "complete">("");
  const isRendering = status === "rendering";
  const [progress, setProgress] = useState(0);

  const [outputSize, setOutputSize] = useState<Vec2>([480, 360]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // const [renderJob, setRenderJob] = useState<RenderJob | null>(null);

  useEffect(() => {
    if (!isRendering) return;

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
        setStatus("complete");
        return;
      }
      if (job.progress > lastProgressRendered) {
        canvasContext.putImageData(job.renderTarget, 0, 0);
        setProgress(job.progress);
        lastProgressRendered = job.progress;
      }

      requestAnimationFrame(updateRender);
    });
  }, [status, isRendering]);

  function onStartJob() {
    setStatus("rendering");
  }

  const statusMessage = isRendering
    ? `Progress: ${(progress * 100).toFixed(1)}%`
    : status;

  return (
    <>
      <div className="properties">
        <label>
          Output width:
          <NumberField
            value={outputSize[0]}
            min={minOutputWidth}
            max={maxOutputWidth}
            disabled={isRendering}
            onChange={(e) => {
              setOutputSize([parseInt(e.target.value, 10), outputSize[1]]);
            }}
          />
        </label>
        <label>
          Output heigth:
          <NumberField
            value={outputSize[1]}
            min={minOutputHeight}
            max={maxOutputHeight}
            disabled={isRendering}
            onChange={(e) => {
              setOutputSize([outputSize[0], parseInt(e.target.value, 10)]);
            }}
          />
        </label>
        <Button onClick={onStartJob} disabled={isRendering}>
          Start
        </Button>
        <p>{statusMessage}</p>
      </div>
      <div className="output">
        <canvas ref={canvasRef} width={outputSize[0]} height={outputSize[1]} />
      </div>
    </>
  );
}
