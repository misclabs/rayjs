import type { ChangeEvent, ReactElement } from "react";
import Button from "./components/button";
import NumberField from "./components/number-field";
import {
  type RenderParams,
  useRenderStatus,
} from "./components/render-context";
import "./side-bar.css";

const maxOutputWidth = 1920;
const minOutputWidth = 8;
const maxOutputHeight = 1080;
const minOutputHeight = 8;

interface SideBarProps {
  renderParams: RenderParams;
  setRenderParams: (value: RenderParams) => void;
  onStartJob: () => void;
}
export default function SideBar({
  renderParams,
  setRenderParams,
  onStartJob,
}: SideBarProps): ReactElement {
  const renderStatus = useRenderStatus();

  let statusMessage = "";
  if (renderStatus.started)
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
          disabled={renderStatus.started}
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
          disabled={renderStatus.started}
          onChange={onOutputHeightChange}
        />
      </div>
      <div>
        <Button onClick={onStartJob} disabled={renderStatus.started}>
          Start
        </Button>
      </div>
      <p>{statusMessage}</p>
    </div>
  );
}
