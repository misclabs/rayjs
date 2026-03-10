import { SideBar } from "./side-bar";
import { RenderSetupCard } from "./render-setup-card";
import { RenderProgressCard } from "./render-progress-card";

export function loadTemplate(templateId: string): HTMLTemplateElement | null {
  const template = document.getElementById(templateId) as HTMLTemplateElement;
  if (!template || template.nodeName !== "TEMPLATE") return null;
  return template as HTMLTemplateElement;
}

export function defineElements() {
  SideBar.defineElement();
  RenderSetupCard.defineElement();
  RenderProgressCard.defineElement();
}
