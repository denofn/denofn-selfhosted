import React from "react";
import { css } from "otion";

type StatusBadgeProps = {
  className?: string;
  status: boolean;
  statusText: [string, string];
};

export const StatusBadge = React.memo(function StatusBadge({ className, status, statusText }: StatusBadgeProps) {
  const [positive, negative] = statusText;

  return (
    <div
      className={`${className ? `${className} ` : ""}${css({
        display: "inline-block",
        borderRadius: "9999px",
        fontWeight: "bold",
        fontSize: ".75rem",
        padding: ".25rem .5rem",
        lineHeight: "1rem",
        textTransform: "uppercase",
        backgroundColor: status ? "rgb(56,178,172)" : "rgb(245,101,101)",
        color: "white",
      })}`}
    >
      {status ? positive : negative}
    </div>
  );
});
