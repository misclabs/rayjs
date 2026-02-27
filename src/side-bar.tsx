import type { ChangeEvent, ReactElement } from "react";
import Button from "./components/button";
import NumberField from "./components/number-field";
import type { RenderJobParams, RenderJobStatus } from "./render-job-provider";
import "./side-bar.css";

const maxOutputWidth = 1920;
const minOutputWidth = 8;
const maxOutputHeight = 1080;
const minOutputHeight = 8;

interface SideBarProps {
  jobParams: RenderJobParams;
  setJobParams: (value: RenderJobParams) => void;
  jobStatus: RenderJobStatus;
  onStartJob: () => void;
}
export default function SideBar({
  jobParams,
  setJobParams,
  jobStatus,
  onStartJob,
}: SideBarProps): ReactElement {
  const statusMessage = jobStatus.isRendering
    ? `Progress: ${(jobStatus.progress * 100).toFixed(1)}%`
    : jobStatus.state;

  function onOutputWidthChange(e: ChangeEvent<HTMLInputElement>) {
    setJobParams({
      ...jobParams,
      outputWidth: parseInt(e.target.value, 10),
    });
  }
  function onOutputHeightChange(e: ChangeEvent<HTMLInputElement>) {
    setJobParams({
      ...jobParams,
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
          value={jobParams.outputWidth}
          min={minOutputWidth}
          max={maxOutputWidth}
          disabled={jobStatus.isRendering}
          onChange={onOutputWidthChange}
        />
      </div>
      <div className="stacked-label">
        <label className="label" htmlFor="output-height">
          Output height
        </label>
        <NumberField
          id="output-height"
          value={jobParams.outputHeight}
          min={minOutputHeight}
          max={maxOutputHeight}
          disabled={jobStatus.isRendering}
          onChange={onOutputHeightChange}
        />
      </div>
      <div>
        <Button onClick={onStartJob} disabled={jobStatus.isRendering}>
          Start
        </Button>
      </div>
      <p>{statusMessage}</p>
    </div>
  );
}
