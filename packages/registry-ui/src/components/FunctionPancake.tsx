import React from "react";

import { Pancake } from "./Pancake";
import { StatusBadge } from "./StatusBadge";
import { ViewsContext } from "./Views";
import { WordWrap } from "./WordWrap";

type FunctionPancakeProps = {
  f: string;
  status: boolean;
};

export function FunctionPancake({ f, status }: FunctionPancakeProps) {
  const [, dispatch] = React.useContext(ViewsContext);

  return (
    <Pancake
      onClick={() =>
        dispatch({
          current: "manage",
          manage: f,
        })
      }
      key={f}
    >
      <WordWrap>{f}</WordWrap>
      <StatusBadge status={status} statusText={["warm", "cold"]} />
    </Pancake>
  );
}
