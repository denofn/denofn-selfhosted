import React from "react";
import { css } from "otion";

export function Container({ children }: React.PropsWithChildren<{}>) {
  return (
    <div
      className={css({
        padding: "1.5rem",
      })}
    >
      {children}
    </div>
  );
}
