import React from "react";

import { Header } from "./components/Header";
import { ViewsContext } from "./components/Views";
import { ViewAllFunctions } from "./ViewAllFunctions";
import { ViewManageFunction } from "./ViewManageFunction";

function mapCurrent(current: string) {
  switch (current) {
    case "view-all":
      return () => <ViewAllFunctions />;
    case "manage":
      return () => <ViewManageFunction />;
    default:
      return () => <div />;
  }
}

function App() {
  const [{ current }] = React.useContext(ViewsContext);
  const C = mapCurrent(current);
  return (
    <>
      <Header />
      <C />
    </>
  );
}

export default App;
