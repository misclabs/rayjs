import type { ChangeEvent, ReactElement } from "react";
import NumberField from "./components/number-field";
import {
  type RenderParams,
  useRenderStatus,
} from "./raytracer-react/render-context";
import { RenderJobCommandBar } from "./components/render-job-command-bar";
import "./side-bar.css";

const maxOutputWidth = 1920;
const minOutputWidth = 8;
const maxOutputHeight = 1080;
const minOutputHeight = 8;

interface SideBarProps {
  renderParams: RenderParams;
  setRenderParams: (value: RenderParams) => void;
}
export default function SideBar({
  renderParams,
  setRenderParams,
}: SideBarProps): ReactElement {
  const renderStatus = useRenderStatus();

  console.log(`renderStatus=${JSON.stringify(renderStatus)}`);

  let statusMessage = "";
  if (renderStatus.state !== "ready")
    statusMessage = `Progress: ${(renderStatus.progress * 100).toFixed(1)}%`;

  function onOutputWidthChange(e: ChangeEvent<HTMLInputElement>) {
    setRenderParams({
      ...renderParams,
      outputWidth: parseInt(e.target.value, 10),
    });
  }
  function onOutputHeightChange(e: ChangeEvent<HTMLInputElement>) {
    setRenderParams({
      ...renderParams,
      outputHeight: parseInt(e.target.value, 10),
    });
  }

  const canStartJob = renderStatus.state === "ready";
  return (
    <div className="side-bar">
      <div className="stacked-label">
        <label className="label" htmlFor="output-width">
          Output width
        </label>
        <NumberField
          id="output-width"
          value={renderParams.outputWidth}
          min={minOutputWidth}
          max={maxOutputWidth}
          disabled={!canStartJob}
          onChange={onOutputWidthChange}
        />
      </div>
      <div className="stacked-label">
        <label className="label" htmlFor="output-height">
          Output height
        </label>
        <NumberField
          id="output-height"
          value={renderParams.outputHeight}
          min={minOutputHeight}
          max={maxOutputHeight}
          disabled={!canStartJob}
          onChange={onOutputHeightChange}
        />
      </div>
      <RenderJobCommandBar
        renderParams={renderParams}
        renderStatus={renderStatus}
      />
      <p>{statusMessage}</p>
    </div>
  );
}
