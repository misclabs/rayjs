import { type ReactElement, useState } from "react";
import {
  type RenderParams,
  useRenderDispatch,
  useRenderTarget,
} from "./components/render-context";
import "./app.css";
import SideBar from "./side-bar";

export default function App(): ReactElement {
  const [renderJobParams, setRenderJobParams] = useState<RenderParams>({
    outputWidth: 480,
    outputHeight: 360,
  });

  const renderDispatch = useRenderDispatch();
  const renderTarget = useRenderTarget();

  function onStartJob() {
    renderDispatch({
      type: "start",
      params: renderJobParams,
    });
  }

  return (
    <>
      <SideBar
        renderParams={renderJobParams}
        setRenderParams={setRenderJobParams}
        onStartJob={onStartJob}
      />
      <div className="output">
        <canvas
          ref={renderTarget.canvasRef}
          width={renderJobParams.outputWidth}
          height={renderJobParams.outputHeight}
        />
      </div>
    </>
  );
}
