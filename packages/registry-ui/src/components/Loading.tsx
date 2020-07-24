import React from "react";
import { css } from "otion";

import { CenterAlign } from "./CenterAlign";
import { Spinner } from "./Spinner";

export function Loading() {
  return (
    <CenterAlign>
      <Spinner />
      <h3
        className={css({
          display: "inline-block",
          lineHeight: "2rem",
          margin: "0",
          marginLeft: ".5rem",
          alignSelf: "top",
        })}
      >
        Loading...
      </h3>
    </CenterAlign>
  );
}
