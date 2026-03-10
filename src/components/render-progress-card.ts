import { loadTemplate } from "./components";
import { $renderStatus, newCancelRenderEvent } from "../render-context";

export class RenderProgressCard extends HTMLDivElement {
  private static readonly elementName = "render-progress-card";

  static defineElement() {
    customElements.define(RenderProgressCard.elementName, RenderProgressCard, {
      extends: "div",
    });
  }

  constructor() {
    super();

    const template = loadTemplate(
      `${RenderProgressCard.elementName}-template`,
    )!;
    const fragment = document.importNode(template.content, true);

    const cancelButton = fragment.querySelector(
      ".cancel-button",
    ) as HTMLButtonElement;
    cancelButton.addEventListener("click", () => {
      const status = $renderStatus.get();
      if (status.state === "rendering") {
        status.cancel();
      }
      this.dispatchEvent(newCancelRenderEvent());
    });

    const progressBar = fragment.querySelector(".progress-bar") as HTMLElement;
    const progressLabel = fragment.querySelector(".label")!;
    $renderStatus.subscribe((renderStatus) => {
      if (renderStatus.state === "rendering") {
        const progressPercent = `${(renderStatus.progress * 100).toFixed(1)}%`;
        progressBar.style.setProperty("--progress-percent", progressPercent);
        progressLabel.textContent = progressPercent;
      }
    });

    this.appendChild(fragment);
  }
}
