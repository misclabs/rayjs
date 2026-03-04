import { type ReactElement, useState } from "react";
import {
  type RenderParams,
  useRenderTarget,
} from "./raytracer-react/render-context";
import "./app.css";
import SideBar from "./side-bar";

export default function App(): ReactElement {
  const [renderJobParams, setRenderJobParams] = useState<RenderParams>({
    outputWidth: 480,
    outputHeight: 360,
  });

  const renderTarget = useRenderTarget();

  return (
    <>
      <SideBar
        renderParams={renderJobParams}
        setRenderParams={setRenderJobParams}
      />
      <div className="output">
        {/* TODO(jw): render canvas component */}
        <canvas
          ref={renderTarget.canvasRef /* eslint-disable-line */}
          width={renderJobParams.outputWidth}
          height={renderJobParams.outputHeight}
        />
      </div>
    </>
  );
}
