# RayJS

RayJS is a ray tracer written in Javascript following [Ray Tracing in One Weekend](https://raytracing.github.io/books/RayTracingInOneWeekend.html) by Peter Shirley, Trevor David Black, Steve Hollasch

[![Deploy to GitHub Pages](https://github.com/misclabs/rayjs/actions/workflows/deploy-to-github-pages.yml/badge.svg)](https://github.com/misclabs/rayjs/actions/workflows/deploy-to-github-pages.yml)

## Style

The primary styles are in [`main.css`](./src/main.css). Cascade layers used and their purpose are (listed lowest to highest priority):
- [`theme`](./src/styles/style-theme.css) - Configuration and design tokens (sizes, typography, colors, etc.)
- [`base`](./src/styles/style-base.css) - Reset and base elements setup
- [`components`](./src/styles/style-components.css) - Reusable style components, layout, and utilities

Currently specific/one-off styling is kept in `main.css`, but this will probably be moved as it grows.