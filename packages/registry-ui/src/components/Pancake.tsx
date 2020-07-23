import React from "react";
import { css } from "otion";

export const Pancake = React.memo(function Pancake({
  className,
  children,
  onClick,
  padding,
}: {
  children?: React.ReactNode;
  className?: string;
  padding?: string;
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}) {
  const clickHandler = onClick ?? function () {};
  const clickCss = onClick
    ? {
        cursor: "pointer",
      }
    : {};
  return (
    <div
      onClick={clickHandler}
      className={`${css({
        ...clickCss,
        backgroundColor: "white",
        boxSizing: "border-box",
        borderRadius: ".25rem",
        minHeight: "5rem",
        display: "flex",
        alignItems: "flex-start",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: padding ?? ".75rem",
        boxShadow: "0 10px 15px -3px rgba(0,0,0,.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
      })}${className ? ` ${className}` : ""}`}
    >
      {children}
    </div>
  );
});
