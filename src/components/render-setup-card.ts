import { loadTemplate } from "./components";
import {
  $outputSettings,
  newStartRenderEvent,
  type OutputSettings,
} from "../render-context";

export class RenderSetupCard extends HTMLDivElement {
  private static readonly elementName = "render-setup-card";

  static defineElement() {
    customElements.define(RenderSetupCard.elementName, RenderSetupCard, {
      extends: "div",
    });
  }

  shadowRoot: ShadowRoot;

  constructor() {
    super();

    this.shadowRoot = this.attachShadow({ mode: "open" });

    const template = loadTemplate(`${RenderSetupCard.elementName}-template`)!;
    const fragment = document.importNode(template.content, true);

    const outputWidthInput = fragment.getElementById(
      "output-width",
    ) as HTMLInputElement;
    outputWidthInput.addEventListener("change", () => {
      const parsedValue = parseInt(outputWidthInput.value, 10);
      if (!isNaN(parsedValue)) $outputSettings.setKey("width", parsedValue);
    });
    const outputHeightInput = fragment.getElementById(
      "output-height",
    ) as HTMLInputElement;
    outputHeightInput.addEventListener("change", () => {
      const parsedValue = parseInt(outputHeightInput.value, 10);
      if (!isNaN(parsedValue)) $outputSettings.setKey("height", parsedValue);
    });

    const startButton = fragment.getElementById(
      "start-button",
    ) as HTMLButtonElement;
    startButton.addEventListener("click", () => {
      this.dispatchEvent(newStartRenderEvent());
    });

    $outputSettings.subscribe((settings: OutputSettings) => {
      outputWidthInput.value = settings.width.toString();
      outputHeightInput.value = settings.height.toString();
    });

    this.shadowRoot.appendChild(fragment);
  }
}
