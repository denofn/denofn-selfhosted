import React from "react";
import { css } from "otion";

export function Pancake({
  children,
  onClick,
}: React.PropsWithChildren<{ onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void }>) {
  return (
    <div
      onClick={onClick}
      className={css({
        boxSizing: "border-box",
        borderStyle: "solid",
        borderWidth: ".1px",
        borderColor: "transparent",
        borderRadius: ".25rem",
        minHeight: "5rem",
        display: "flex",
        alignItems: "flex-start",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: ".75rem",
        cursor: "pointer",
        boxShadow: "0 10px 15px -3px rgba(0,0,0,.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
      })}
    >
      {children}
    </div>
  );
}
