import React from "react";
import { css } from "otion";

const flexStyle = {
  display: "flex",
  alignItems: "flex-start",
  flexDirection: "column",
  justifyContent: "space-between",
};

const blockStyle = {
  display: "block",
};

export const Pancake = React.memo(function Pancake({
  className,
  children,
  onClick,
  padding,
  flex = true,
}: {
  children?: React.ReactNode;
  className?: string;
  padding?: string;
  flex?: boolean;
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
        ...(flex ? flexStyle : blockStyle),
        backgroundColor: "white",
        boxSizing: "border-box",
        borderRadius: ".25rem",
        minHeight: "6rem",
        padding: padding ?? "1rem",
        boxShadow: "0 10px 15px -3px rgba(0,0,0,.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
      })}${className ? ` ${className}` : ""}`}
    >
      {children}
    </div>
  );
});
