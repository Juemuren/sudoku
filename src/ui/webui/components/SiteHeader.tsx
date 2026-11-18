import type { CSSProperties } from "react";
import { colors } from "../../styles/colors.ts";
import { MOBILE_SCREEN_MAX_WIDTH, PAGE_MAX_WIDTH } from "../layout.ts";

export function SiteHeader({ width }: { width: number }) {
  return (
    <header style={headerStyle(width)}>
      <div style={brandStyle}>
        <img src="./favicon.svg" width={36} height={36} alt="" />
        <span>数独 · Sudoku</span>
      </div>
    </header>
  );
}

function headerStyle(width: number): CSSProperties {
  return {
    boxSizing: "border-box",
    maxWidth: PAGE_MAX_WIDTH,
    margin: "auto",
    padding: width <= MOBILE_SCREEN_MAX_WIDTH ? "16px 18px" : "26px 30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: `1px solid ${colors.headerBorder}`,
  };
}

const brandStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  fontSize: 22,
  fontWeight: 700,
  letterSpacing: ".06em",
};
