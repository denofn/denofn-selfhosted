import React from "react";

import { Button } from "./Button";
import { ViewsContext } from "./Views";

export const CreateFunctionButton = React.memo(function CreateFunctionButton() {
  const [, dispatch] = React.useContext(ViewsContext);
  return <Button title="Create Function" onClick={() => dispatch({ current: "create" })} />;
});
