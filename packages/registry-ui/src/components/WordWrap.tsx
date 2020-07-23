import React from "react";
import { css } from "otion";

export function WordWrap({ children }: React.PropsWithChildren<{}>) {
  return (
    <span
      className={css({
        wordBreak: "break-all",
      })}
    >
      {children}
    </span>
  );
}
