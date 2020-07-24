import React from "react";

import { Alert, AlertProps } from "./Alert";
import { CenterAlign } from "./CenterAlign";

export function Error(props: AlertProps) {
  return (
    <CenterAlign>
      <Alert {...props} />
    </CenterAlign>
  );
}
