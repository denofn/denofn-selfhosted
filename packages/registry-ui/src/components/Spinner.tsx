import React from "react";
import { css, keyframes } from "otion";

type SpinnerProps = {
  dim?: string;
  thickness?: string;
};

const spin = keyframes({
  from: {
    transform: "rotate(0deg)",
  },
  to: {
    transform: "rotate(360deg)",
  },
});

export function Spinner({ dim, thickness }: SpinnerProps) {
  return (
    <div
      className={css({
        display: "inline-block",
        transitionTimingFunction: "linear",
        width: dim || "1.5rem",
        height: dim || "1.5rem",
        borderWidth: thickness ?? ".25rem",
        borderColor: "#edf2f7",
        borderStyle: "solid",
        borderTopWidth: thickness ?? ".25rem",
        borderTopColor: "rgb(26, 32, 44)",
        borderRadius: "9999px",
        animation: `${spin} 1.5s linear infinite`,
      })}
    />
  );
}
