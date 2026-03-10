import { $renderStatus } from "../render-context";
import { loadTemplate } from "./components";

export class SideBar extends HTMLDivElement {
  static readonly elementName = "side-bar";

  static defineElement() {
    customElements.define(SideBar.elementName, SideBar, { extends: "div" });
  }

  constructor() {
    super();
    const template = loadTemplate(`${SideBar.elementName}-template`)!;
    const fragment = document.importNode(template.content, true);

    const renderSetupCard = fragment.querySelector(
      "[is='render-setup-card']",
    ) as HTMLElement;
    const renderProgressCard = fragment.querySelector(
      "[is='render-progress-card']",
    ) as HTMLElement;

    $renderStatus.subscribe((renderStatus) => {
      if (renderStatus.state === "rendering") {
        renderSetupCard.style.setProperty("display", "none");
        renderProgressCard.style.removeProperty("display");
      } else {
        renderSetupCard.style.removeProperty("display");
        renderProgressCard.style.setProperty("display", "none");
      }
    });

    this.appendChild(fragment);
  }
}
