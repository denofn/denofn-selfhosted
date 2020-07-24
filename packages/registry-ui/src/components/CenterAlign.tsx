import React from "react";
import { css } from "otion";

export function CenterAlign({ children }: React.PropsWithChildren<{}>) {
  return (
    <div
      className={css({
        width: "100%",
        marginLeft: "auto",
        marginRight: "auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      })}
    >
      {children}
    </div>
  );
}
