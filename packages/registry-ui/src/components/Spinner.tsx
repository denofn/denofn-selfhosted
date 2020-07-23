import React from "react";
import { css, keyframes } from "otion";

type SpinnerProps = {
  dim?: string;
};

const spin = keyframes({
  from: {
    transform: "rotate(0deg)",
  },
  to: {
    transform: "rotate(360deg)",
  },
});

export function Spinner({ dim }: SpinnerProps) {
  return (
    <div
      className={css({
        display: "inline-block",
        transitionTimingFunction: "linear",
        width: dim || "1.5rem",
        height: dim || "1.5rem",
        borderWidth: ".25rem",
        borderColor: "#edf2f7",
        borderStyle: "solid",
        borderTopWidth: ".25rem",
        borderTopColor: "black",
        borderRadius: "9999px",
        animation: `${spin} 1.5s linear infinite`,
      })}
    />
  );
}
