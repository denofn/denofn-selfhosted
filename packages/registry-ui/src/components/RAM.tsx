import React from "react";
import { css } from "otion";

export function RAM({ children }: React.PropsWithChildren<{}>) {
  return (
    <div
      className={css({
        width: "100%",
        display: "grid",
        gridGap: "1rem",
        gridTemplateColumns: "repeat(auto-fill, minmax(252px, 1fr))",
      })}
    >
      {children}
    </div>
  );
}
