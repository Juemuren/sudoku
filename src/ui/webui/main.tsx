import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";
import { colors } from "../styles/colors.ts";

document.body.style.margin = "0";
document.body.style.minWidth = "320px";
document.querySelector('meta[name="theme-color"]')?.setAttribute(
  "content",
  colors.canvas,
);

const root = document.getElementById("root");
if (!root) throw new Error("找不到应用根节点。");
createRoot(root).render(<App />);
