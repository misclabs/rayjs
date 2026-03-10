import { $world, addRenderEventListeners } from "./render-context";
import { createTfDemoScene } from "./raytracer/scenes";
import { defineElements } from "./components/components";

$world.set(createTfDemoScene());

defineElements();

addRenderEventListeners(document);
