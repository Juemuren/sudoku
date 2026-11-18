import type { CSSProperties } from "react";
import { colors } from "../../styles/colors.ts";

export function SiteHeader({ width }: { width: number }) {
  return (
    <header style={headerStyle(width)}>
      <div style={brandStyle}>
        <span style={markStyle}>九</span>
        <span>
          数独{width > 420 && <span style={brandEnglishStyle}>/ SUDOKU</span>}
        </span>
      </div>
      {width > 650 && <span style={noteStyle}>一格一格，慢慢解开。</span>}
    </header>
  );
}

function headerStyle(width: number): CSSProperties {
  return {
    boxSizing: "border-box",
    maxWidth: 1220,
    margin: "auto",
    padding: width <= 650 ? "16px 18px" : "26px 30px",
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
const markStyle: CSSProperties = {
  display: "grid",
  placeItems: "center",
  width: 36,
  height: 36,
  borderRadius: 8,
  color: colors.surface,
  background: colors.brand,
  fontSize: 20,
};
const brandEnglishStyle: CSSProperties = {
  color: colors.brandSecondary,
  fontSize: 13,
  letterSpacing: ".17em",
  fontWeight: 600,
};
const noteStyle: CSSProperties = {
  color: colors.headerNote,
  fontSize: 13,
  letterSpacing: ".08em",
};
