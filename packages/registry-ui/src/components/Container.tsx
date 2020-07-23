import React from "react";
import { css } from "otion";

export function Container({ children }: React.PropsWithChildren<{}>) {
  return (
    <div
      className={css({
        display: "flex",
        padding: "1.5rem",
      })}
    >
      {children}
    </div>
  );
}
