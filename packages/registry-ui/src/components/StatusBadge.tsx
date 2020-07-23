import React from "react";
import { css } from "otion";

type StatusBadgeProps = {
  status: boolean;
  statusText: [string, string];
};

export function StatusBadge({ status, statusText }: StatusBadgeProps) {
  const [positive, negative] = statusText;

  return (
    <div
      className={css({
        display: "inline-block",
        borderRadius: "9999px",
        fontWeight: "bold",
        fontSize: ".75rem",
        marginTop: ".75rem",
        padding: ".25rem .5rem",
        textTransform: "uppercase",
        backgroundColor: status ? "rgb(56,178,172)" : "rgb(245,101,101)",
        color: status ? "rgb(35,78,82)" : "white",
      })}
    >
      {status ? positive : negative}
    </div>
  );
}
