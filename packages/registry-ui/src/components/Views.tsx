import React from "react";

import { ViewsState } from "../types";

export const ViewsContext = React.createContext<[ViewsState, React.Dispatch<ViewsState>]>([
  { current: "login" },
  () => {},
]);

export function ViewsProvider({ children }: React.PropsWithChildren<{}>) {
  const viewsState = React.useState<ViewsState>({ current: "view-all" });
  return <ViewsContext.Provider value={viewsState}>{children}</ViewsContext.Provider>;
}
