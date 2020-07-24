import React from "react";
import { css } from "otion";

export type AlertProps = {
  title: string;
  message: string;
};

export function Alert({ title, message }: AlertProps) {
  return (
    <div
      className={css({
        paddingLeft: "1rem",
        paddingRight: "1rem",
        color: "rgb(197,48,48)",
        borderStyle: "solid",
        borderColor: "rgb(252,129,129)",
        borderRadius: ".25rem",
        borderWidth: "1px",
        paddingTop: ".75rem",
        paddingBottom: ".75rem",
        position: "relative",
        backgroundColor: "rgb(255,245,245)",
      })}
      role="alert"
    >
      <strong
        className={css({
          fontFamily: "'Rubik', sans-serif",
          fontWeight: "bold",
          display: "block",
          lineHeight: "1.5rem",
        })}
      >
        {title}
      </strong>
      <span>{message}</span>
    </div>
  );
}
