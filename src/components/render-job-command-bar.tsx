import type { ReactElement } from "react";
import Button from "./button";
import {
  type RenderParams,
  type RenderStatus,
  useRenderDispatch,
} from "../raytracer-react/render-context";

interface RenderJobCommandBarProps {
  renderParams: RenderParams;
  renderStatus: RenderStatus;
}
export function RenderJobCommandBar({
  renderParams,
  renderStatus,
}: RenderJobCommandBarProps): ReactElement {
  const renderDispatch = useRenderDispatch();

  function onStartJob() {
    renderDispatch({
      type: "start",
      params: renderParams,
    });
  }

  function onPauseJob() {
    renderDispatch({
      type: "pause",
    });
  }

  function onResumeJob() {
    renderDispatch({
      type: "resume",
    });
  }

  function onResetJob() {
    renderDispatch({
      type: "reset",
    });
  }

  switch (renderStatus.state) {
    case "ready":
      return (
        <div>
          <Button onClick={onStartJob}>Start</Button>
        </div>
      );

    case "rendering":
      return (
        <div>
          <Button onClick={onPauseJob}>Pause</Button>
          <Button onClick={onResetJob}>Cancel</Button>
        </div>
      );

    case "paused":
      return (
        <div>
          <Button onClick={onResumeJob}>Resume</Button>
          <Button onClick={onResetJob}>Cancel</Button>
        </div>
      );

    case "completed":
      return (
        <div>
          <Button onClick={onResetJob}>Reset</Button>
        </div>
      );
  }
}
