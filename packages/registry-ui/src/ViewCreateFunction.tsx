import React from "react";

import { Container } from "./components/Container";
import { CreateFunction } from "./components/CreateFunction";
import { ViewsContext } from "./components/Views";

export function ViewCreateFunction() {
  const [, dispatch] = React.useContext(ViewsContext);

  const loadFn = React.useCallback(() => {
    dispatch({ current: "view-all" });
  }, [dispatch]);

  return (
    <Container>
      <CreateFunction reload={loadFn} />
    </Container>
  );
}
